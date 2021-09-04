import React, { ReactElement, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import Observable from "zen-observable";

import styles from "./multiplayer-game.styles";
import { getGame, startGame, playMove } from "./multiplayer-game.graphql";
import { GetGameQuery, playMoveMutation, startGameMutation } from "@api";
import { RootNavParams } from "@config/navigator";
import { Board, Button, Loading, Text, Wrapper } from "@components";
import { BoardState, Moves, getErrorMessage, onUpdateGameById, isTerminal, useSounds } from "@utils";
import { useAuth } from "@contexts/auth-context";

const SCREEN_WIDTH = Math.min(600, Dimensions.get("window").width);

type ScrProps = {
  navigation: NativeStackNavigationProp<RootNavParams, "MultiplayerGame">;
  route: RouteProp<RootNavParams, "MultiplayerGame">;
};

type GameType = GetGameQuery["getGame"];

export default function MultiplayerGame({ navigation, route }: ScrProps): ReactElement {
  const { gameID: existingGameID, invitee } = route.params;
  const [gameID, setGameID] = useState<string | null>(null);
  const [game, setGame] = useState<GameType>(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [playingTurn, setPlayingTurn] = useState<Moves | false>(false);
  const { user } = useAuth();
  const gameResult = game ? isTerminal(game.state as BoardState) : false;
  const playSound = useSounds();
  const opponentUsername = user && game && game.owners.find((p) => p !== user.username);
  const isActive = game && (game.status === "ACTIVE" || game.status === "REQUESTED");
  const player1 = (game?.players?.items && game?.players?.items[0]?.player) || ({} as { [key: string]: any });
  const player2 = (game?.players?.items && game?.players?.items[1]?.player) || ({} as { [key: string]: any });

  const initGame = async () => {
    console.log("called initGame()");
    setLoading(true);
    let gameID = existingGameID;
    try {
      if (!gameID) {
        const startGameRes = (await API.graphql(
          graphqlOperation(startGame, {
            invitee: invitee,
          })
        )) as GraphQLResult<startGameMutation>;
        if (startGameRes.data?.startGame) {
          gameID = startGameRes.data.startGame.id;
        }
      }
      if (gameID) {
        const getGameRes = (await API.graphql(
          graphqlOperation(getGame, {
            id: gameID,
          })
        )) as GraphQLResult<GetGameQuery>;
        if (getGameRes.data?.getGame) {
          if (getGameRes.data.getGame.status === "FINISHED") {
            setFinished(true);
          }
          setGame(getGameRes.data.getGame);
          setGameID(gameID);
        }
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
    setLoading(false);
  };

  const playTurn = async (index: Moves) => {
    console.log("called playTurn()");
    setPlayingTurn(index);
    try {
      const playMoveRes = (await API.graphql(
        graphqlOperation(playMove, {
          index,
          game: gameID,
        })
      )) as GraphQLResult<playMoveMutation>;
      if (game && playMoveRes.data?.playMove) {
        const { state, status, turn, winner } = playMoveRes.data.playMove;
        setGame({ ...game, status, state, winner, turn });
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
    setPlayingTurn(false);
  };

  useEffect(() => {
    console.log("called useEffect() gameID =>", gameID);
    if (game && (game.status === "REQUESTED" || game.status === "ACTIVE")) {
      const gameUpdate = API.graphql(
        graphqlOperation(onUpdateGameById, {
          id: gameID,
        })
      ) as unknown as Observable<{ [key: string]: any }>;

      const subscription = gameUpdate.subscribe({
        next: (v) => {
          const newGame = v?.value?.data?.onUpdateGameById;
          if (game && newGame) {
            const { state, status, turn, winner } = newGame;
            if (status === "FINISHED") {
              subscription.unsubscribe();
              console.log("unsub game =>", gameID);
            }
            setGame({ ...game, status, state, winner, turn });
            if (user) {
              user.username === turn ? playSound("pop1") : playSound("pop2");
            }
          }
        },
      });
      console.log("sub game =>", gameID);

      return () => {
        subscription.unsubscribe();
        console.log("unsub game =>", gameID);
      };
    }
  }, [gameID]);

  useEffect(() => {
    console.log("called useEffect() game =>", game);
    if (game && game.status === "FINISHED" && !finished) {
      if (game.winner === null) {
        playSound("draw");
      } else if (game.winner === user?.username) {
        playSound("win");
      } else {
        playSound("lost");
      }
    }
  }, [game]);

  useEffect(() => {
    console.log("called useEffect()");
    initGame();
  }, []);

  return (
    <Wrapper>
      <ScrollView contentContainerStyle={styles.container}>
        {loading && <Loading style={{ backgroundColor: "transparent" }} />}
        {user && game && (
          <View>
            <Text style={styles.turnHeader} numberOfLines={1}>
              {!isActive ? `Game Over` : game.turn === user.username ? `Your turn` : `Waiting for opponent`}
            </Text>
            <View style={styles.results}>
              <View
                style={[
                  styles.resultsBox,
                  (!isActive && game.winner === player1["username"]) || (isActive && game.turn === player1["username"])
                    ? { borderWidth: 6 }
                    : {},
                ]}
              >
                <Text style={[styles.resultsName, { textAlign: "right" }]} numberOfLines={1}>
                  {player1["name"]}
                </Text>
                <Text style={[styles.resultsUsername, { textAlign: "right" }]} numberOfLines={1}>
                  {player1["username"]}
                </Text>
              </View>
              <View style={styles.vsBox}>
                <Text style={styles.vsLabel}>VS</Text>
              </View>
              <View
                style={[
                  styles.resultsBox,
                  (!isActive && game.winner === player2["username"]) || (isActive && game.turn === player2["username"])
                    ? { borderWidth: 6 }
                    : {},
                ]}
              >
                <Text style={[styles.resultsName, { textAlign: "left" }]} numberOfLines={1}>
                  {player2["name"]}
                </Text>
                <Text style={[styles.resultsUsername, { textAlign: "left" }]} numberOfLines={1}>
                  {player2["username"]}
                </Text>
              </View>
            </View>
          </View>
        )}
        {game && (
          <Board
            size={SCREEN_WIDTH * 0.8}
            disabled={
              game.turn !== user?.username ||
              playingTurn !== false ||
              (game.status !== "ACTIVE" && game.status !== "REQUESTED")
            }
            loading={playingTurn}
            gameResult={gameResult}
            state={game?.state as BoardState}
            onCellPressed={(index) => playTurn(index as Moves)}
          />
        )}

        {user && game && game.status === "FINISHED" && (
          <View style={styles.modal}>
            <Text style={styles.modalText}>
              {game.winner === user.username ? "You Won" : game.winner === null ? "Draw Game" : "You Lost"}
            </Text>
            <Button
              title="Play Again"
              onPress={() => {
                if (opponentUsername) {
                  navigation.replace("MultiplayerGame", { invitee: opponentUsername });
                }
              }}
            />
          </View>
        )}
      </ScrollView>
    </Wrapper>
  );
}
