import React, { ReactElement } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";

import styles from "./settings.styles";
import { Wrapper, Text } from "@components";
import { colors } from "@utils";
import { useSettings, difficulties } from "@contexts/settings-context";

export default function Settings(): ReactElement | null {
  const { settings, saveSettings } = useSettings();

  if (!settings) return null;
  return (
    <Wrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Bot Difficulty</Text>
          <View style={styles.choices}>
            {Object.keys(difficulties).map((level) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    saveSettings("difficulty", level as keyof typeof difficulties);
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
              saveSettings("sounds", !settings.sounds);
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
              saveSettings("haptics", !settings.haptics);
            }}
            trackColor={{
              false: colors.purple,
              true: colors.lightPurple,
            }}
            thumbColor={colors.lightGreen}
            ios_backgroundColor={colors.purple}
          />
        </View>
      </ScrollView>
    </Wrapper>
  );
}
