import React, { ReactElement, useEffect, useState } from "react";
import { Alert, Switch, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./settings.styles";
import { Wrapper, Text } from "@components";
import { colors } from "@utils";

const difficulties = {
  "1": "Beginner",
  "2": "intermediate",
  "3": "Hard",
  "-1": "Impossible",
};

type SettingsType = {
  difficulty: keyof typeof difficulties;
  haptics: boolean;
  sounds: boolean;
};

const defaultSettings: SettingsType = {
  difficulty: "1",
  haptics: true,
  sounds: true,
};

export default function Settings(): ReactElement | null {
  const [settings, setSettings] = useState<SettingsType | null>(null);

  const saveSettings = async (newSettings: SettingsType | null) => {
    try {
      if (newSettings) {
        const jsonSettings = JSON.stringify(newSettings);
        await AsyncStorage.setItem("@settings", jsonSettings);
      }
    } catch (err) {
      Alert.alert("An error occurred", err);
    }
  };

  const loadSettings = async () => {
    try {
      const setts = await AsyncStorage.getItem("@settings");
      setts !== null ? setSettings(JSON.parse(setts)) : setSettings(defaultSettings);
    } catch (err) {
      setSettings(defaultSettings);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  if (!settings) return null;
  return (
    <Wrapper>
      <View style={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Bot Difficulty</Text>
          <View style={styles.choices}>
            {Object.keys(difficulties).map((level) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSettings((ps) => {
                      const newSetts: SettingsType | null = ps
                        ? { ...ps, difficulty: level as keyof typeof difficulties }
                        : null;
                      saveSettings(newSetts);
                      return newSetts;
                    });
                  }}
                  style={[
                    styles.choice,
                    {
                      backgroundColor: settings.difficulty === level ? colors.lightPurple : colors.lightGreen,
                    },
                  ]}
                  key={level}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      {
                        color: settings.difficulty === level ? colors.lightGreen : colors.lightPurple,
                      },
                    ]}
                  >
                    {difficulties[level as keyof typeof difficulties]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.field, styles.switchField]}>
          <Text style={styles.label}>Sounds</Text>
          <Switch
            value={settings.sounds}
            onValueChange={() => {
              setSettings((ps) => {
                const newSetts: SettingsType | null = ps ? { ...ps, sounds: !ps.sounds } : null;
                saveSettings(newSetts);
                return newSetts;
              });
            }}
            trackColor={{
              false: colors.purple,
              true: colors.lightPurple,
            }}
            thumbColor={colors.lightGreen}
            ios_backgroundColor={colors.purple}
          />
        </View>

        <View style={[styles.field, styles.switchField]}>
          <Text style={styles.label}>Haptics/Vibrations</Text>
          <Switch
            value={settings.haptics}
            onValueChange={() => {
              setSettings((ps) => {
                const newSetts: SettingsType | null = ps ? { ...ps, haptics: !ps.haptics } : null;
                saveSettings(newSetts);
                return newSetts;
              });
            }}
            trackColor={{
              false: colors.purple,
              true: colors.lightPurple,
            }}
            thumbColor={colors.lightGreen}
            ios_backgroundColor={colors.purple}
          />
        </View>
      </View>
    </Wrapper>
  );
}
