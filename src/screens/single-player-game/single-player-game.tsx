import React, { ReactElement, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import styles from "./single-player-game.styles";
import { RootNavParams } from "@config/navigator";
import { Wrapper, Board } from "@components";
import { printFormattedBoard, BoardState, isTerminal } from "@utils";

type StackNavProps = {
  navigation: NativeStackNavigationProp<RootNavParams, "singlePlayerScr">;
};

export default function SinglePlayerGame({
  navigation,
}: StackNavProps): ReactElement {
  // prettier-ignore
  const [state, setState] = useState<BoardState>([
    null, null, null,
    null, null, null,
    null, null, null,
  ]);
  printFormattedBoard(state);
  console.log(`isTerminal(state)`, isTerminal(state));

  const handleOnCellPressed = (idx: number): void => {
    const stCopy: BoardState = [...state];
    if (stCopy[idx] || isTerminal(stCopy)) {
      return;
    }
    stCopy[idx] = "x";
    setState(stCopy);
  };

  return (
    <Wrapper>
      <SafeAreaView style={styles.container}>
        <Board
          disabled={isTerminal(state) as boolean}
          onCellPressed={(index) => handleOnCellPressed(index)}
          size={300}
          state={state}
        />
      </SafeAreaView>
    </Wrapper>
  );
}
