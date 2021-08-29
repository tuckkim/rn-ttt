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
} from "@screens";
import { colors } from "@utils";

export type RootNavParams = {
  Home: undefined;
  SinglePlayer: undefined;
  Settings: undefined;
  Login: undefined;
  SignUp: undefined | { username: string };
  ChangePassword: undefined;
  ForgotPassword: undefined;
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
        <Stack.Screen name="Home" component={HomeScr} />
        <Stack.Screen name="SinglePlayer" component={SinglePlayerGameScr} />
        <Stack.Screen name="Settings" component={SettingsScr} />
        <Stack.Screen name="Login" component={LoginScr} />
        <Stack.Screen name="SignUp" component={SignUpScr} options={{ title: "Sign Up" }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScr} options={{ title: "Change Password" }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScr} options={{ title: "Forgot Password" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
