import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScr, SinglePlayerGameScr } from "@screens";

export type RootNavParams = {
  homeScr: undefined;
  singlePlayerScr: undefined;
};

const Stack = createNativeStackNavigator<RootNavParams>();

export default function Navigator(): ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="singlePlayerScr"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="homeScr" component={HomeScr} />
        <Stack.Screen name="singlePlayerScr" component={SinglePlayerGameScr} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
