/* Amplify Params - DO NOT EDIT
	API_RNTTT_GRAPHQLAPIENDPOINTOUTPUT
	API_RNTTT_GRAPHQLAPIIDOUTPUT
	API_RNTTT_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const appsync = require("aws-appsync");
const gql = require("graphql-tag");
require("cross-fetch/polyfill");
const isTerminal = require("./isTerminal");

const getGame = gql`
  query getGame($id: ID!) {
    getGame(id: $id) {
      id
      turn
      state
      status
      winner
      owners
      initiator
    }
  }
`;

const updateGame = gql`
  mutation updateGame(
    $id: ID!
    $turn: String!
    $winner: String
    $status: GameStatus!
    $state: [Symbol]!
    $player: String!
  ) {
    updateGame(
      input: { id: $id, turn: $turn, winner: $winner, status: $status, state: $state }
      condition: { turn: { eq: $player } }
    ) {
      id
      turn
      state
      status
      winner
    }
  }
`;

exports.handler = async (event) => {
  const graphqlClient = new appsync.AWSAppSyncClient({
    url: process.env.API_RNTTT_GRAPHQLAPIENDPOINTOUTPUT,
    region: process.env.REGION,
    auth: {
      type: "AWS_IAM",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    },
    disableOffline: true,
  });

  const player = event.identity.username;
  const gameID = event.arguments.game;
  const index = event.arguments.index;

  //1. Get game object from the id and make sure it exists.
  const gameResponse = await graphqlClient.query({
    query: getGame,
    variables: {
      id: gameID,
    },
  });
  const game = gameResponse.data.getGame;
  if (!game) {
    throw new Error("Game not found!");
  }

  //2. Make sure the game is active
  if (game.status !== "REQUESTED" && game.status !== "ACTIVE") {
    throw new Error("Game is not active!");
  }

  //3. Check that current use is a participant in the game and that it's his turn
  if (!game.owners.includes(player)) {
    throw new Error("Logged in player is not participating in this game!");
  }
  if (game.turn !== player) {
    throw new Error("It's not your turn!");
  }

  //4. Make sure that the index is valid (not > 8 and not occupied)
  if (index > 8 || game.state[index]) {
    throw new Error("Invalid index or cell is already occupied");
  }

  //5. update hte state, check if the move is a terminal one & update the winner, status, turn & update the state
  const symbol = player === game.initiator ? "x" : "o";
  const nextTurn = game.owners.find((p) => p !== game.turn);
  const invitee = game.owners.find((p) => p !== game.initiator);
  const newState = [...game.state];
  newState[index] = symbol;
  let newStatus = "ACTIVE";
  let newWinner = null;

  const terminalState = isTerminal(newState);
  console.log(`terminalState`, terminalState);
  if (terminalState) {
    newStatus = "FINISHED";
    if (terminalState.winner === "x") {
      newWinner = game.initiator;
    } else if (terminalState.winner === "o") {
      newWinner = invitee;
    }
  }

  const updateGameResponse = await graphqlClient.mutate({
    mutation: updateGame,
    variables: {
      id: gameID,
      turn: nextTurn,
      winner: newWinner,
      status: newStatus,
      state: newState,
      player: player,
    },
  });

  console.log(`updateGameResponse`, updateGameResponse);

  //6. return the updated game
  return updateGameResponse.data.updateGame;
};
