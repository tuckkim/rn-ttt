import { colors } from "@utils";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  otpView: {
    flex: 1,
    alignItems: "center",
  },
  otpLabel: {
    marginVertical: 10,
    color: colors.lightGreen,
  },
  otpBox: {
    width: 360,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  otpInput: {
    width: 44,
    height: 44,
    borderColor: colors.lightGreen,
    borderBottomWidth: 1,
    fontSize: 22,
    fontFamily: "DeliusUnicase_700Bold",
    color: colors.lightGreen,
    backgroundColor: colors.purple,
    textAlign: "center",
    marginBottom: 10,
  },
  resentLink: {
    marginVertical: 10,
    color: colors.lightGreen,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
