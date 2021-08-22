import React, { ReactElement } from "react";
import { View, ActivityIndicator, ViewStyle } from "react-native";

export default function Loading({ style }: { style?: ViewStyle }): ReactElement {
  return (
    <View style={[{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#222" }, style]}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
}
