import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import gql from "graphql-tag";

const addExpoToken = gql`
  mutation addExpoToken($token: String!) {
    addExpoToken(token: $token) {
      playerUsername
      token
    }
  }
`;

const initNotifications = async (): Promise<void> => {
  if (Constants.isDevice) {
    console.log("requesting notification permission...");
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }

    let tokenRes;
    let tokenStr;
    if (Platform.OS === "web") {
      tokenRes = await Notifications.getDevicePushTokenAsync();
      tokenStr = tokenRes.data.endpoint;
    } else {
      tokenRes = await Notifications.getExpoPushTokenAsync();
      tokenStr = tokenRes.data;
    }
    try {
      await API.graphql(
        graphqlOperation(addExpoToken, {
          token: tokenStr,
        })
      );
    } catch (err) {
      console.log(err);
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
  }
};

export default initNotifications;
