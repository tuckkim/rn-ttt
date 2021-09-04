import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";

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
  return (
    <NavigationContainer>
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
