import React, { ReactElement, ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  useFonts,
  DeliusUnicase_400Regular,
  DeliusUnicase_700Bold,
} from "@expo-google-fonts/delius-unicase";

type tProps = {
  children: ReactNode;
};

export default function AppBootStrap({ children }: tProps): ReactElement {
  const [fontLoaded] = useFonts({
    DeliusUnicase_400Regular,
    DeliusUnicase_700Bold,
  });

  return fontLoaded ? (
    <>{children}</>
  ) : (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
}
