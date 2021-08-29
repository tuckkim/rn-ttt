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

exports.handler = async (event, context, callback) => {
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

  const query = gql`
    query getPlayer($username: String!) {
      getPlayer(username: $username) {
        id
      }
    }
  `;

  const mutation = gql`
    mutation createPlayer($name: String!, $cognitoID: String!, $username: String!, $email: AWSEmail!) {
      createPlayer(input: { cognitoID: $cognitoID, email: $email, name: $name, username: $username }) {
        id
      }
    }
  `;

  try {
    const res = await graphqlClient.query({
      query,
      variables: {
        username: event.userName,
      },
    });
    if (res.data.getPlayer) {
      callback(null, event);
    } else {
      try {
        await graphqlClient.mutate({
          mutation,
          variables: {
            name: event.request.userAttributes.name,
            username: event.userName,
            cognitoID: event.request.userAttributes.sub,
            email: event.request.userAttributes.email,
          },
        });
        callback(null, event);
      } catch (err) {
        callback(err);
      }
    }
  } catch (err) {
    callback(err);
  }
};
