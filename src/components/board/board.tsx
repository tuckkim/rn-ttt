import React, { ReactElement } from "react";
import { TouchableOpacity, View } from "react-native";

import Text from "../text/Text";
import { BoardResult, BoardState, Moves } from "@utils";
import BoardLine from "./board-line";
import styles from "./board.styles";
import Loading from "../loading/loading";

type BoardProps = {
  state: BoardState;
  size: number;
  disabled?: boolean;
  gameResult?: BoardResult | false;
  onCellPressed?: (i: number) => void;
  loading?: Moves | false;
};

export default function Board({ state, size, disabled, gameResult, loading, onCellPressed }: BoardProps): ReactElement {
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
            {loading === index ? (
              <Loading style={{ backgroundColor: "transparent" }} />
            ) : (
              <Text style={[styles.cellText, { fontSize: size / 7 }]}>{cell}</Text>
            )}
          </TouchableOpacity>
        );
      })}
      {gameResult && <BoardLine size={size} gameResult={gameResult} />}
    </View>
  );
}
