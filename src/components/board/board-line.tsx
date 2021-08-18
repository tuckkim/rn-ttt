import React, { ReactElement, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { BoardResult, colors } from "@utils";

const lineWidth = 6;
const styles = StyleSheet.create({
  line: {
    position: "absolute",
    backgroundColor: colors.lightPurple,
  },
  vLine: {
    width: lineWidth,
    height: "100%",
  },
  hLine: {
    height: lineWidth,
    width: "100%",
  },
  dLine: {
    width: lineWidth,
    height: "100%",
    top: 0,
    left: "50%",
  },
});

type BoardLineProps = {
  size: number;
  gameResult?: BoardResult | false;
};

export default function BoardLine({ size, gameResult }: BoardLineProps): ReactElement {
  const diagHeight = Math.sqrt(Math.pow(size, 2) * 2) - 10;
  const animationRefCur = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationRefCur, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <>
      {gameResult && gameResult.column && gameResult.direction === "V" && (
        <Animated.View
          style={[
            styles.line,
            styles.vLine,
            {
              left: `${33.3333 * gameResult.column - 16.6666 - lineWidth / 8}%`,
              height: animationRefCur.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        ></Animated.View>
      )}
      {gameResult && gameResult.row && gameResult.direction === "H" && (
        <Animated.View
          style={[
            styles.line,
            styles.hLine,
            {
              top: `${33.3333 * gameResult.row - 16.6666 - lineWidth / 8}%`,
              width: animationRefCur.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        ></Animated.View>
      )}
      {gameResult && gameResult.diagonal && gameResult.direction === "D" && (
        <Animated.View
          style={[
            styles.line,
            styles.dLine,
            {
              height: animationRefCur.interpolate({
                inputRange: [0, 1],
                outputRange: [0, diagHeight],
              }),
              transform: [
                {
                  translateY: animationRefCur.interpolate({
                    inputRange: [0, 1],
                    outputRange: [size / 2, -(diagHeight - size) / 2],
                  }),
                },
                {
                  translateX: -lineWidth / 2,
                },
                {
                  rotateZ: gameResult.diagonal === "MAIN" ? "-45deg" : "45deg",
                },
              ],
            },
          ]}
        ></Animated.View>
      )}
    </>
  );
}
