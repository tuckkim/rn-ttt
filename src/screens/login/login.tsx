import React, { ReactElement, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Auth } from "aws-amplify";

import { Button, Text, TxtInput, Wrapper } from "@components";
import { RootNavParams } from "@config/navigator";
import styles from "./login.styles";

type StackNavProps = {
  navigation: NativeStackNavigationProp<RootNavParams, "Login">;
};

export default function Login({ navigation }: StackNavProps): ReactElement {
  const pwdRef = useRef<TextInput | null>(null);
  const [form, setForm] = useState({
    username: "test",
    password: "12345678",
  });
  const [loading, setLoading] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string): void => {
    setForm({ ...form, [key]: value });
  };

  const LoginHandler = async (): Promise<void> => {
    setLoading(true);
    const { username, password } = form;
    try {
      const res = await Auth.signIn(username, password);
      setLoading(false);

      navigation.navigate("Home");
    } catch (err) {
      if (err.code === "UserNotConfirmedException") {
        navigation.navigate("SignUp", { username });
      } else {
        setLoading(false);
        alert(err.message || "An error occurred!");
      }
    }
  };

  return (
    <Wrapper>
      <View style={styles.container}>
        <TxtInput
          value={form.username}
          onChangeText={(value: string) => setFormInput("username", value)}
          returnKeyType="next"
          placeholder="Username"
          style={{ marginBottom: 20 }}
          onSubmitEditing={() => {
            pwdRef.current?.focus();
          }}
        />
        <TxtInput
          ref={pwdRef}
          value={form.password}
          onChangeText={(value: string) => setFormInput("password", value)}
          secureTextEntry
          returnKeyType="done"
          placeholder="Password"
          style={{ marginBottom: 20 }}
        />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ForgotPassword");
          }}
        >
          <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
        </TouchableOpacity>

        <Button loading={loading} title="Login" onPress={LoginHandler} />

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.registerLink}>Don&apos;t have an account?</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
}
