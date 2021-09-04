import { StyleSheet } from "react-native";

import { colors } from "@utils";
import { globalStyles } from "@utils";

export default StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  forgotPasswordLink: {
    marginBottom: 20,
    textAlign: "right",
    color: colors.lightGreen,
    textDecorationLine: "underline",
  },
  registerLink: {
    marginVertical: 10,
    textAlign: "center",
    color: colors.lightGreen,
    textDecorationLine: "underline",
  },
});
