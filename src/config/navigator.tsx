import React, { ReactElement, useState, useEffect, useRef } from "react";
import { NavigationContainer, NavigationContainerRef, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";

import {
  HomeScr,
  SinglePlayerGameScr,
  SettingsScr,
  LoginScr,
  SignUpScr,
  ChangePasswordScr,
  ForgotPasswordScr,
  MultiplayerHomeScr,
  MultiplayerGameScr,
} from "@screens";
import { colors } from "@utils";
import { useAuth } from "@contexts/auth-context";

export type RootNavParams = {
  Home: undefined;
  SinglePlayer: undefined;
  Settings: undefined;
  Login: undefined | { redirect: keyof RootNavParams };
  SignUp: undefined | { username: string };
  ChangePassword: undefined;
  ForgotPassword: undefined;
  MultiplayerHome: undefined;
  MultiplayerGame: { gameID?: string; invitee?: string };
};

const navOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: colors.purple,
  },
  headerShadowVisible: false,
  headerTintColor: colors.lightGreen,
  headerTitleStyle: {
    fontFamily: "DeliusUnicase_700Bold",
    fontSize: 20,
  },
};

const Stack = createNativeStackNavigator<RootNavParams>();

export default function Navigator(): ReactElement {
  const { user } = useAuth();
  const navRef = useRef<NavigationContainerRef<RootNavParams> | null>(null);
  const [isNavigatorReady, setIsNavigatorReady] = useState(false);

  useEffect(() => {
    if (user && isNavigatorReady) {
      const subscription = Notifications.addNotificationResponseReceivedListener((res) => {
        console.log(res);
        const gameID = res.notification.request.content.data.gameId;
        if (gameID) {
          if (navRef.current?.getCurrentRoute()?.name === "MultiplayerGame") {
            navRef.current.dispatch(StackActions.replace("MultiplayerGame", { gameID: gameID }));
          }
          navRef.current?.navigate("MultiplayerGame", { gameID: gameID as string });
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [user, isNavigatorReady]);

  return (
    <NavigationContainer
      ref={navRef}
      onReady={() => {
        setIsNavigatorReady(true);
      }}
    >
      <Stack.Navigator initialRouteName="Home" screenOptions={navOptions}>
        <Stack.Screen name="Home" component={HomeScr} options={{ headerShown: false }} />
        <Stack.Screen name="SinglePlayer" component={SinglePlayerGameScr} options={{ title: "Single Player Game" }} />
        <Stack.Screen name="Settings" component={SettingsScr} />
        <Stack.Screen name="Login" component={LoginScr} />
        <Stack.Screen name="SignUp" component={SignUpScr} options={{ title: "Sign Up" }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScr} options={{ title: "Change Password" }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScr} options={{ title: "Forgot Password" }} />
        <Stack.Screen name="MultiplayerHome" component={MultiplayerHomeScr} options={{ title: "Multiplayer Home" }} />
        <Stack.Screen name="MultiplayerGame" component={MultiplayerGameScr} options={{ title: "Multiplayer Game" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
