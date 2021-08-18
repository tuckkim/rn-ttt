import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { HomeScr, SinglePlayerGameScr, SettingsScr } from "@screens";
import { colors } from "@utils";

export type RootNavParams = {
  homeScr: undefined;
  singlePlayerScr: undefined;
  settingsScr: undefined;
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
      <Stack.Navigator initialRouteName="homeScr" screenOptions={navOptions}>
        <Stack.Screen name="homeScr" component={HomeScr} />
        <Stack.Screen name="singlePlayerScr" component={SinglePlayerGameScr} />
        <Stack.Screen name="settingsScr" component={SettingsScr} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
