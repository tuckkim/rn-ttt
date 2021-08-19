import { Audio } from "expo-av";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

import { useSettings } from "@contexts/settings-context";

type SoundType = "pop1" | "pop2" | "win" | "lost" | "draw";

export default function useSounds(): (sound: SoundType) => void {
  const { settings } = useSettings();

  const isMobile = Platform.OS === "android" || Platform.OS === "ios";
  const popSoundRef = useRef<Audio.Sound | null>(null);
  const pop2SoundRef = useRef<Audio.Sound | null>(null);
  const winSoundRef = useRef<Audio.Sound | null>(null);
  const lostSoundRef = useRef<Audio.Sound | null>(null);
  const drawSoundRef = useRef<Audio.Sound | null>(null);

  const playSound = async (sound: SoundType): Promise<void> => {
    const soundMap = {
      pop1: popSoundRef,
      pop2: pop2SoundRef,
      win: winSoundRef,
      lost: lostSoundRef,
      draw: drawSoundRef,
    };
    try {
      const status = await soundMap[sound].current?.getStatusAsync();
      settings?.sounds && status && status.isLoaded && soundMap[sound].current?.replayAsync();

      if (isMobile && settings?.haptics) {
        switch (sound) {
          case "win":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;

          case "lost":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;

          case "draw":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;

          default:
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
        }
      }
    } catch (err) {
      console.log("sound error", err);
    }
  };

  useEffect(() => {
    const popSoundObj = new Audio.Sound();
    const pop2SoundObj = new Audio.Sound();
    const winSoundObj = new Audio.Sound();
    const lostSoundObj = new Audio.Sound();
    const drawSoundObj = new Audio.Sound();

    const loadSounds = async () => {
      /* eslint-disable @typescript-eslint/no-var-requires */
      await popSoundObj.loadAsync(require("@assets/pop_1.wav"));
      popSoundRef.current = popSoundObj;
      /* eslint-disable @typescript-eslint/no-var-requires */
      await pop2SoundObj.loadAsync(require("@assets/pop_2.wav"));
      pop2SoundRef.current = pop2SoundObj;
      /* eslint-disable @typescript-eslint/no-var-requires */
      await winSoundObj.loadAsync(require("@assets/win.mp3"));
      winSoundRef.current = winSoundObj;
      /* eslint-disable @typescript-eslint/no-var-requires */
      await lostSoundObj.loadAsync(require("@assets/loss.mp3"));
      lostSoundRef.current = lostSoundObj;

      await drawSoundObj.loadAsync(require("@assets/draw.mp3"));
      drawSoundRef.current = drawSoundObj;
    };
    loadSounds();
    console.log("finished loading sound!");

    return () => {
      popSoundObj && popSoundObj.unloadAsync();
      pop2SoundObj && pop2SoundObj.unloadAsync();
      winSoundObj && winSoundObj.unloadAsync();
      lostSoundObj && lostSoundObj.unloadAsync();
      drawSoundObj && drawSoundObj.unloadAsync();
    };
  }, []);

  return playSound;
}
