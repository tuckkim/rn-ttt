import { colors } from "@utils";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logo: {
    marginTop: 40,
    height: 200,
    width: 300,
    maxWidth: "60%",
    resizeMode: "contain",
  },
  buttons: {
    marginTop: 60,
    width: "70%",
  },
  btn: {
    marginBottom: 20,
  },
  loggedInText: {
    marginVertical: 20,
    color: colors.lightGreen,
    fontSize: 10,
    textAlign: "center",
  },
});

export default styles;
