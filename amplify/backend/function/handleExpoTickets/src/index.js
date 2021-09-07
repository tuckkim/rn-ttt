/* Amplify Params - DO NOT EDIT
	API_RNTTT_GRAPHQLAPIENDPOINTOUTPUT
	API_RNTTT_GRAPHQLAPIIDOUTPUT
	API_RNTTT_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const appsync = require("aws-appsync");
const gql = require("graphql-tag");
const { Expo } = require("expo-server-sdk");
require("cross-fetch/polyfill");

const ticketsQuery = gql`
  query list {
    listExpoTicketsObjects {
      items {
        tickets
        id
        createdAt
      }
    }
  }
`;

const deleteExpoToken = gql`
  mutation deleteExpoToken($token: String!) {
    deleteExpoToken(input: { token: $token }) {
      token
    }
  }
`;

const deleteExpoTicketsObject = gql`
  mutation deleteExpoTicketsObject($id: ID!) {
    deleteExpoTicketsObject(input: { id: $id }) {
      id
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

  const ticketsRes = await graphqlClient.query({
    query: ticketsQuery,
  });

  const ticketsObjects = ticketsRes.data.listExpoTicketsObjects.items;
  for (const ticketsObject of ticketsObjects) {
    const currentDate = new Date();
    const tktObjDate = new Date(ticketsObject.createdAt);
    const timeDiff = (currentDate.getTime() - tktObjDate.getTime()) / (1000 * 60 * 60);
    // if ticket is created in less than 1 hour, skipped, bcoz expo might need some time to process (send to device)
    if (timeDiff < 1) {
      continue;
    }

    const tickets = JSON.parse(ticketsObject.tickets);
    const expo = new Expo();
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(Object.keys(tickets));

    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        for (const receiptId in receipts) {
          if (Object.hasOwnProperty.call(receipts, receiptId)) {
            const { status, details } = receipts[receiptId];
            if (status === "error") {
              if (details && details.error === "DeviceNotRegistered") {
                try {
                  await graphqlClient.mutate({
                    mutation: deleteExpoToken,
                    variables: {
                      token: tickets[receiptId],
                    },
                  });
                } catch (err) {}
              }
            }
          }
        }
      } catch (err) {}
    }

    // remove the completed ticket
    try {
      await graphqlClient.mutate({
        mutation: deleteExpoTicketsObject,
        variables: {
          id: ticketsObject.id,
        },
      });
    } catch (err) {}
  }
};
