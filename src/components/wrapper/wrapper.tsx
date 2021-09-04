import React, { ReactElement, ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import styles from "./wrapper.styles";

type tProps = {
  children: ReactNode;
} & ViewProps;

export default function Wrapper({ children, style, ...props }: tProps): ReactElement {
  return (
    <View {...props} style={[styles.container, style]}>
      <LinearGradient style={styles.linearGradient} colors={["#120318", "#221a36"]} />
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeView}>{children}</SafeAreaView>
    </View>
  );
}
