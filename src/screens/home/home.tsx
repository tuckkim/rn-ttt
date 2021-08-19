import React, { ReactElement } from "react";
import { Image, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import styles from "./home.styles";
import { Button, Wrapper } from "@components";
import { RootNavParams } from "@config/navigator";

type StackNavProps = {
  navigation: NativeStackNavigationProp<RootNavParams, "homeScr">;
};

export default function Home({ navigation }: StackNavProps): ReactElement {
  return (
    <Wrapper>
      <View style={styles.container}>
        <Image source={require("@assets/logo.png")} style={styles.logo} />
        <View style={styles.buttons}>
          <Button
            style={styles.btn}
            title="Single Player"
            onPress={() => {
              navigation.navigate("singlePlayerScr");
            }}
          />
          <Button style={styles.btn} title="Multiplayer" />
          <Button style={styles.btn} title="Login" />
          <Button
            style={styles.btn}
            title="Settings"
            onPress={() => {
              navigation.navigate("settingsScr");
            }}
          />
        </View>
      </View>
    </Wrapper>
  );
}
