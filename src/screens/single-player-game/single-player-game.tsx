import React, { ReactElement, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import styles from "./single-player-game.styles";
import { RootNavParams } from "@config/navigator";
import { Wrapper, Board, Text, Button } from "@components";
import { BoardState, isTerminal, getBestMove, isEmpty, Cell, useSounds } from "@utils";
import { useSettings, difficulties } from "@contexts/settings-context";

const SCREEN_WIDTH = Math.min(600, Dimensions.get("window").width);
type StackNavProps = {
  navigation: NativeStackNavigationProp<RootNavParams, "singlePlayerScr">;
};

export default function SinglePlayerGame({ navigation }: StackNavProps): ReactElement {
  // prettier-ignore
  const [state, setState] = useState<BoardState>([
    null, null, null,
    null, null, null,
    null, null, null,
  ]);
  const getRndTurn = (): "HUMAN" | "BOT" => {
    return Math.random() < 0.5 ? "HUMAN" : "BOT";
  };
  const [turn, setTurn] = useState<"HUMAN" | "BOT">(getRndTurn());
  const [isHumanMaximizing, setIsHumanMaximizing] = useState<boolean>(true);
  const [gameCount, setGameCount] = useState<{ wins: number; lost: number; draws: number }>({
    wins: 0,
    lost: 0,
    draws: 0,
  });

  const gameResult = isTerminal(state);
  const playSound = useSounds();
  const { settings } = useSettings();

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

  const newGame = (): void => {
    setState([null, null, null, null, null, null, null, null, null]);
    setTurn(getRndTurn());
  };

  useEffect(() => {
    if (gameResult) {
      const winner = getWinner(gameResult.winner);
      try {
        if (winner === "HUMAN") {
          playSound("win");
          setGameCount((prevState) => ({
            ...prevState,
            wins: prevState.wins + 1,
          }));
          // alert("u win!");
        } else if (winner === "BOT") {
          playSound("lost");
          setGameCount((ps) => {
            return { ...ps, lost: ps.lost + 1 };
          });
          // alert("u lost!");
        } else {
          playSound("draw");
          setGameCount((ps) => ({ ...ps, draws: ps.draws + 1 }));
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
          const best = getBestMove(state, !isHumanMaximizing, 0, parseInt(settings?.difficulty || "1"));
          insertCell(best, isHumanMaximizing ? "o" : "x");
          setTurn("HUMAN");
        }
      }
    }
  }, [state, turn]);

  return (
    <Wrapper>
      <View style={styles.container}>
        <View>
          <Text style={styles.difficulty}>Difficulty: {difficulties[settings?.difficulty || "1"]}</Text>
          <View style={styles.results}>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Wins</Text>
              <Text style={styles.resultsCount}>{gameCount.wins}</Text>
            </View>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Draws</Text>
              <Text style={styles.resultsCount}>{gameCount.draws}</Text>
            </View>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Lost</Text>
              <Text style={styles.resultsCount}>{gameCount.lost}</Text>
            </View>
          </View>
        </View>
        <Board
          disabled={(isTerminal(state) as boolean) || turn !== "HUMAN"}
          onCellPressed={(index) => handleOnCellPressed(index)}
          size={SCREEN_WIDTH * 0.8}
          state={state}
          gameResult={gameResult}
        />

        {gameResult && (
          <View style={styles.modal}>
            <Text style={styles.modalText}>
              {getWinner(gameResult.winner) === "HUMAN" && "You Won"}
              {getWinner(gameResult.winner) === "BOT" && "You Lost"}
              {getWinner(gameResult.winner) === "DRAW" && "Draw Game"}
            </Text>
            <Button title="Play Again" onPress={newGame} />
          </View>
        )}
      </View>
    </Wrapper>
  );
}
