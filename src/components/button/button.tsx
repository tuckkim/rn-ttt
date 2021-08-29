import React, { ReactElement } from "react";
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";

import Text from "../text/Text";
import styles from "./button.styles";

type tProps = {
  title: string;
  loading?: boolean;
} & TouchableOpacityProps;

export default function Board({ title, loading, style, ...props }: tProps): ReactElement {
  return (
    <TouchableOpacity disabled={loading} {...props} style={[styles.button, style]}>
      {loading ? <ActivityIndicator color="#222" /> : <Text style={styles.btnText}>{title}</Text>}
    </TouchableOpacity>
  );
}
