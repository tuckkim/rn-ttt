import { StyleSheet } from "react-native";
import { colors, globalStyles } from "@utils";

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  btnBox: {
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderTopColor: colors.lightPurple,
    backgroundColor: colors.purple,
  },
  btnBg: {
    zIndex: 99999,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playerLabel: {
    color: colors.lightGreen,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 8,
  },
  newGameBtn: {
    backgroundColor: colors.lightPurple,
    padding: 20,
    paddingBottom: 30,
  },
  newGameLabel: {
    color: colors.lightGreen,
    textAlign: "center",
    fontSize: 18,
  },
});

export default styles;
