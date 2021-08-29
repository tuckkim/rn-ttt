import React, { ReactElement, useRef, useState, useEffect } from "react";
import { View, TextInput, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import OtpInputs from "react-native-otp-inputs";
import { Auth } from "aws-amplify";

import { Button, Loading, Text, TxtInput, Wrapper } from "@components";
import { RootNavParams } from "@config/navigator";
import styles from "./signup.styles";

type StackNavProps = {
  navigation: NativeStackNavigationProp<RootNavParams, "SignUp">;
  route: RouteProp<RootNavParams, "SignUp">;
};

export default function Signup({ navigation, route }: StackNavProps): ReactElement {
  const unconfirmUsername = route.params?.username;
  const headerHeight = useHeaderHeight();
  const pwdRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const [form, setForm] = useState({
    username: "test2",
    password: "12345678",
    email: "keyontae066@jriversm.com",
    name: "Test Name",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"signUp" | "otp">(unconfirmUsername ? "otp" : "signUp");
  const [confirming, setConfirming] = useState(false);
  const [resending, setResending] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string): void => {
    setForm({ ...form, [key]: value });
  };

  const SignUpHandler = async (): Promise<void> => {
    setLoading(true);
    const { username, password, email, name } = form;
    try {
      const res = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          name,
        },
      });
      setStep("otp");
    } catch (err) {
      alert(err.message || "An error occurred!");
    }
    setLoading(false);
  };

  const ConfirmCode = async (code: string): Promise<void> => {
    setConfirming(true);
    try {
      const res = await Auth.confirmSignUp(form.username || unconfirmUsername || "", code);
      setConfirming(false);
      alert("Success! You can now login with your account detail.");
      navigation.navigate("Login");
    } catch (err) {
      alert(err.message || "An error occurred!");
      setConfirming(false);
    }
  };

  const resendCode = async (username: string): Promise<void> => {
    setResending(true);
    try {
      console.log("...sending code to =>", username);
      const res = await Auth.resendSignUp(username);
    } catch (err) {
      alert(err.message || "An error occurred!");
    }
    setResending(false);
  };

  useEffect(() => {
    if (unconfirmUsername) {
      resendCode(unconfirmUsername);
    }
  }, []);

  return (
    <Wrapper>
      <KeyboardAvoidingView keyboardVerticalOffset={headerHeight} behavior="padding" style={{ flex: 1 }}>
        <View style={styles.container}>
          {step === "otp" && (
            <View style={styles.otpView}>
              <Text style={styles.otpLabel}>Enter the code that you received from email.</Text>

              {confirming ? (
                <Loading style={{ backgroundColor: "transparent" }} />
              ) : (
                <>
                  <OtpInputs
                    handleChange={(code) => {
                      if (code.length === 6) {
                        ConfirmCode(code);
                      }
                    }}
                    numberOfInputs={6}
                    autofillFromClipboard={false}
                    clearTextOnFocus={true}
                    style={styles.otpBox}
                    inputStyles={styles.otpInput}
                  />
                  {resending ? (
                    <Loading style={{ backgroundColor: "transparent" }} />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (form.username) {
                          resendCode(form.username);
                        } else if (unconfirmUsername) {
                          resendCode(unconfirmUsername);
                        }
                      }}
                    >
                      <Text style={styles.resentLink}>Resend code</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}

          {step === "signUp" && (
            <View>
              <TxtInput
                value={form.username}
                onChangeText={(value: string) => setFormInput("username", value)}
                returnKeyType="next"
                placeholder="Username"
                style={{ marginBottom: 20 }}
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />
              <TxtInput
                keyboardType="email-address"
                ref={emailRef}
                value={form.email}
                onChangeText={(value: string) => setFormInput("email", value)}
                returnKeyType="next"
                placeholder="Email"
                style={{ marginBottom: 20 }}
                onSubmitEditing={() => {
                  nameRef.current?.focus();
                }}
              />
              <TxtInput
                ref={nameRef}
                value={form.name}
                onChangeText={(value: string) => setFormInput("name", value)}
                returnKeyType="next"
                placeholder="Name"
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
              <Button loading={loading} title="Register" onPress={SignUpHandler} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Wrapper>
  );
}
