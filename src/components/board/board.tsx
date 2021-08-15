import React, { ReactElement } from "react";
import { TouchableOpacity, View } from "react-native";

import Text from "../text/Text";
import { BoardState } from "@utils";

type BoardProps = {
  state: BoardState;
  size: number;
  disabled?: boolean;
  onCellPressed?: (i: number) => void;
};

export default function Board({
  state,
  size,
  disabled,
  onCellPressed,
}: BoardProps): ReactElement {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: "green",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {state.map((cell, index) => {
        return (
          <TouchableOpacity
            disabled={cell !== null || disabled}
            onPress={() => onCellPressed && onCellPressed(index)}
            key={index}
            style={{
              width: "33.33%",
              height: "33.33%",
              borderColor: "#888",
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: size / 6 }}>{cell}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
