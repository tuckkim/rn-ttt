import { StyleSheet } from "react-native";
import { colors } from "@utils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  difficulty: {
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
    backgroundColor: colors.lightGreen,
    borderWidth: 1,
    borderColor: colors.lightPurple,
    alignItems: "center",
    padding: 15,
    marginHorizontal: 5,
  },
  resultsTitle: {
    color: colors.darkPurple,
    fontSize: 14,
  },
  resultsCount: {
    color: colors.darkPurple,
    fontSize: 20,
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

export default styles;
