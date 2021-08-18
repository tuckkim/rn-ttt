import React, { ReactNode, ReactElement } from "react";
import { Text as NativeText, TextProps } from "react-native";

type txtProps = {
  weight?: "400" | "700";
  children: ReactNode;
} & TextProps;

export default function Text(props: txtProps): ReactElement {
  const fontFamily =
    props.weight === "400"
      ? "DeliusUnicase_400Regular"
      : "DeliusUnicase_700Bold";

  return (
    <NativeText
      {...props}
      style={[{ fontFamily, fontSize: 12, color: "#fff" }, props.style]}
    >
      {props.children}
    </NativeText>
  );
}
