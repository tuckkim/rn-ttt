import React, { ReactElement, forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";

import styles from "./text-input.styles";

const TxtInput = forwardRef<TextInput, TextInputProps>(({ style, ...props }: TextInputProps, ref): ReactElement => {
  return <TextInput ref={ref} placeholderTextColor="#5d5379" style={[styles.input, style]} {...props} />;
});
TxtInput.displayName = "TxtInput";

export default TxtInput;
