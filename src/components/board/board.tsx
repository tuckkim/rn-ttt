import React, { ReactElement } from "react";
import { TouchableOpacity, View } from "react-native";

import Text from "../text/Text";
import { BoardResult, BoardState } from "@utils";
import BoardLine from "./board-line";
import styles from "./board.styles";

type BoardProps = {
  state: BoardState;
  size: number;
  disabled?: boolean;
  gameResult?: BoardResult | false;
  onCellPressed?: (i: number) => void;
};

export default function Board({ state, size, disabled, gameResult, onCellPressed }: BoardProps): ReactElement {
  return (
    <View
      style={[
        styles.board,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {state.map((cell, index) => {
        return (
          <TouchableOpacity
            disabled={cell !== null || disabled}
            onPress={() => onCellPressed && onCellPressed(index)}
            key={index}
            style={[styles.cell, styles[`cell${index}` as "cell"]]}
          >
            <Text style={[styles.cellText, { fontSize: size / 7 }]}>{cell}</Text>
          </TouchableOpacity>
        );
      })}
      {gameResult && <BoardLine size={size} gameResult={gameResult} />}
    </View>
  );
}
