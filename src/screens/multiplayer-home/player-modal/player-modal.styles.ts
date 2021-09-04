import { StyleSheet } from "react-native";

import { colors } from "@utils";

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  backdrop: { height: "40%", backgroundColor: "#111", opacity: 0.9 },
  modalBody: {
    height: "60%",
    padding: 20,
    backgroundColor: colors.purple,
    opacity: 0.96,
  },
  searchInput: { backgroundColor: colors.darkPurple, borderBottomWidth: 0, fontSize: 12 },
  searchContainer: { flex: 1, marginVertical: 10 },
  btnBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderTopColor: colors.lightPurple,
    backgroundColor: colors.darkPurple,
  },
  playerLabel: {
    color: colors.lightGreen,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 8,
  },
});
