import React, { ReactElement, ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import Text from "../text/Text";
import styles from "./button.styles";

type tProps = {
  title: string;
} & TouchableOpacityProps;

export default function Board({
  title,
  style,
  ...props
}: tProps): ReactElement {
  return (
    <TouchableOpacity {...props} style={[styles.button, style]}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}
