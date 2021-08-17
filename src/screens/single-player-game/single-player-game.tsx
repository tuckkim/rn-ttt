import React, { ReactElement, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import styles from "./single-player-game.styles";
import { RootNavParams } from "@config/navigator";
import { Wrapper, Board } from "@components";
import {
  BoardState,
  isTerminal,
  getBestMove,
  isEmpty,
  Cell,
  useSounds,
} from "@utils";

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
  const [turn, setTurn] = useState<"HUMAN" | "BOT">(
    Math.random() < 0.5 ? "HUMAN" : "BOT"
  );
  const [isHumanMaximizing, setIsHumanMaximizing] = useState<boolean>(true);

  const gameResult = isTerminal(state);
  const playSound = useSounds();

  const insertCell = (idx: number, symbol: "x" | "o"): void => {
    const stCopy: BoardState = [...state];
    if (stCopy[idx] || isTerminal(stCopy)) {
      return;
    }
    stCopy[idx] = symbol;
    setState(stCopy);
    symbol === "x" ? playSound("pop1") : playSound("pop2");
  };
  const handleOnCellPressed = (idx: number): void => {
    if (turn !== "HUMAN") return;
    insertCell(idx, isHumanMaximizing ? "x" : "o");
    setTurn("BOT");
  };

  const getWinner = (winnerSymbol: Cell): "HUMAN" | "BOT" | "DRAW" => {
    if (winnerSymbol === "x") {
      return isHumanMaximizing ? "HUMAN" : "BOT";
    } else if (winnerSymbol === "o") {
      return isHumanMaximizing ? "BOT" : "HUMAN";
    }
    return "DRAW";
  };

  useEffect(() => {
    if (gameResult) {
      const winner = getWinner(gameResult.winner);
      try {
        if (winner === "HUMAN") {
          playSound("win");
          // alert("u win!");
        } else if (winner === "BOT") {
          playSound("lost");
          // alert("u lost!");
        } else {
          playSound("draw");
          // alert("draw game!");
        }
      } catch (err) {
        console.log("sound error", err);
      }
    } else {
      if (turn === "BOT") {
        if (isEmpty(state)) {
          const firstMove = Math.floor(Math.random() * state.length);
          insertCell(firstMove, "x");
          setIsHumanMaximizing(false);
          setTurn("HUMAN");
        } else {
          const best = getBestMove(state, !isHumanMaximizing, 0, 2);
          insertCell(best, isHumanMaximizing ? "o" : "x");
          setTurn("HUMAN");
        }
      }
    }
  }, [state, turn]);

  return (
    <Wrapper>
      <SafeAreaView style={styles.container}>
        <Board
          disabled={(isTerminal(state) as boolean) || turn !== "HUMAN"}
          onCellPressed={(index) => handleOnCellPressed(index)}
          size={300}
          state={state}
          gameResult={gameResult}
        />
      </SafeAreaView>
    </Wrapper>
  );
}
