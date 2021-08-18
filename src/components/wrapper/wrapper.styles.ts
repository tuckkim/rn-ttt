import { Platform, StyleSheet } from "react-native";

const minHeight = Platform.OS === "web" ? "100vh" : "100%";
const minWidth = Platform.OS === "web" ? "100vw" : "100%";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight,
    minWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    minWidth,
    minHeight,
    alignItems: "center",
  },
});

export default styles;
