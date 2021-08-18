import { isTerminal, getAvailableMoves } from "./board";
import { BoardState } from "./types";

export const getBestMove = (
  state: BoardState,
  maximizing: boolean,
  depth = 0,
  maxDepth = -1
): number => {
  const childValues: { [key: string]: string } = {};
  // let lpCtr = 0;

  const getSidedBestMove = (
    state: BoardState,
    maximizing: boolean,
    depth: number,
    maxDepth: number
  ) => {
    // lpCtr++;
    let best = maximizing ? -100 : 100;
    getAvailableMoves(state).forEach((index) => {
      const child: BoardState = [...state];
      child[index] = maximizing ? "x" : "o";
      const childValue = getBestMoveRecursive(
        child,
        !maximizing,
        depth + 1,
        maxDepth
      );
      best = maximizing
        ? Math.max(best, childValue)
        : Math.min(best, childValue);

      if (depth === 0) {
        childValues[childValue] = childValues[childValue]
          ? `${childValues[childValue]},${index}`
          : `${index}`;
      }
    });
    return best;
  };

  const getBestMoveRecursive = (
    state: BoardState,
    maximizing: boolean,
    depth: number,
    maxDepth: number
  ): number => {
    const terminalObject = isTerminal(state);
    if (terminalObject) {
      if (terminalObject.winner === "x") {
        return 100 - depth;
      } else if (terminalObject.winner === "o") {
        return -100 + depth;
      }
      return 0;
    }
    if (depth === maxDepth) {
      return 0;
    }

    const best = getSidedBestMove(state, maximizing, depth, maxDepth);
    if (depth === 0) {
      const arr = childValues[best].split(",");
      const rand = Math.floor(Math.random() * arr.length);
      //   console.log(`loop #`, lpCtr);
      //   console.log(`childValues`, childValues);
      //   console.log(`#next best move index => ${arr[rand]}, score =>`, best);
      return parseInt(arr[rand]);
    }
    return best;
  };

  return getBestMoveRecursive(state, maximizing, depth, maxDepth);
};
