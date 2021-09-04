import { colors } from "@utils";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    alignItems: "center",
  },
  turnHeader: {
    color: colors.lightGreen,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  results: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 80,
  },
  resultsBox: {
    width: 141,
    backgroundColor: colors.lightGreen,
    borderWidth: 1,
    borderColor: colors.lightPurple,
    padding: 15,
    marginHorizontal: 5,
  },
  vsBox: {
    padding: 15,
    marginHorizontal: 3,
  },
  vsLabel: {
    color: colors.lightGreen,
  },
  resultsName: {
    color: colors.darkPurple,
    fontSize: 18,
  },
  resultsUsername: {
    color: colors.darkPurple,
    fontSize: 12,
  },
  modal: {
    position: "absolute",
    backgroundColor: colors.lightPurple,
    opacity: 0.9,
    bottom: 12,
    left: 12,
    right: 12,
    padding: 30,
    borderWidth: 3,
    borderColor: colors.lightGreen,
  },
  modalText: {
    color: colors.lightGreen,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
  },
});
