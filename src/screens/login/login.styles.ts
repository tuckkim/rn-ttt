import { colors } from "@utils";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
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
