import React, { ReactElement, ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import styles from "./wrapper.styles";

type tProps = {
  children: ReactNode;
};

export default function Wrapper({ children }: tProps): ReactElement {
  return (
    <View style={styles.container}>
      <LinearGradient style={styles.linearGradient} colors={["#120318", "#221a36"]} />
      <StatusBar style="light" />
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollView}>{children}</ScrollView>
      </SafeAreaView>
    </View>
  );
}
