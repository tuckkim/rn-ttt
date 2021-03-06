import React, { ReactElement, useState } from "react";
import { Alert, Image, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import styles from "./home.styles";
import { Button, Text, Wrapper } from "@components";
import { RootNavParams } from "@config/navigator";
import { useAuth } from "@contexts/auth-context";
import { Auth } from "aws-amplify";

type StackNavProps = {
  navigation: NativeStackNavigationProp<RootNavParams, "Home">;
};

export default function Home({ navigation }: StackNavProps): ReactElement {
  const { user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const signOutHandler = async (): Promise<void> => {
    setSigningOut(true);
    try {
      await Auth.signOut();
    } catch (err) {
      Alert.alert("Error!", "Error signing out!");
    }
    setSigningOut(false);
  };

  return (
    <Wrapper>
      <View style={styles.container}>
        <Image source={require("@assets/logo.png")} style={styles.logo} />
        <View style={styles.buttons}>
          <Button
            style={styles.btn}
            title="Single Player"
            onPress={() => {
              navigation.navigate("SinglePlayer");
            }}
          />
          <Button style={styles.btn} title="Multiplayer" />
          <Button
            loading={signingOut}
            style={styles.btn}
            title={user ? "Sign Out" : "Login"}
            onPress={() => {
              if (user) {
                signOutHandler();
              } else {
                navigation.navigate("Login");
              }
            }}
          />
          <Button
            style={styles.btn}
            title="Settings"
            onPress={() => {
              navigation.navigate("Settings");
            }}
          />
          {user && (
            <Text weight="400" style={styles.loggedInText}>
              Logged in as <Text weight="700">{user.username}</Text>
            </Text>
          )}
        </View>
      </View>
    </Wrapper>
  );
}
