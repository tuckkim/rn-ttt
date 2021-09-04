import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import Observable from "zen-observable";

import styles from "./multiplayer-home.styles";
import { PlayerGameType } from "./multiplayer-home.graphql";
import { useAuth } from "@contexts/auth-context";
import { Text } from "@components";
import { colors, onUpdateGameById } from "@utils";

type CmpProps = {
  item: PlayerGameType;
} & TouchableOpacityProps;

export default function GameItem({ item, ...props }: CmpProps): ReactElement | null {
  const { user } = useAuth();
  const [playerGame, setPlayerGame] = useState(item);

  const getResult = (playerGame: PlayerGameType): "win" | "loss" | "draw" | false => {
    if (!playerGame || !user) return false;
    const game = playerGame.game;
    if (game.status !== "FINISHED") return false;
    const opponent = game?.players?.items?.find((pg) => pg?.player.username !== user.username);
    if (game.winner === user.username) return "win";
    if (game.winner === opponent?.player.username) return "loss";
    if (game.winner === null) return "draw";
    return false;
  };

  if (!user || !playerGame) return null;
  const game = playerGame?.game;
  const result = getResult(playerGame);
  const opponent = game?.players?.items?.find((pg) => pg?.player.username !== user.username);
  const animationRef = useRef<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    if (game && (game.status === "REQUESTED" || game.status === "ACTIVE")) {
      const gameUpdate = API.graphql(graphqlOperation(onUpdateGameById, { id: game.id })) as unknown as Observable<{
        [key: string]: any;
      }>;
      const subscription = gameUpdate.subscribe({
        next: ({ value }) => {
          const newGame = value.data.onUpdateGameById;
          if (newGame) {
            setPlayerGame({
              ...playerGame,
              ["game"]: { ...playerGame?.game, ...newGame },
            });
            if (newGame.status === "FINISHED") {
              subscription.unsubscribe();
            }

            Animated.sequence([
              Animated.timing(animationRef.current, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.delay(100),
              Animated.timing(animationRef.current, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
              }),
            ]).start();
          }
        },
      });
      console.log("mount", game.id);
      return () => {
        subscription.unsubscribe();
        console.log("unmount", game.id);
      };
    }
  }, []);

  return (
    <TouchableOpacity {...props} style={styles.btnBox}>
      <Animated.View
        style={[
          styles.btnBg,
          {
            backgroundColor: colors.lightPurple,
            opacity: animationRef.current.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }),
          },
        ]}
      />
      <Text style={styles.playerLabel} weight="400">
        {game?.id}
      </Text>
      <Text style={styles.playerLabel} weight="400">
        {opponent?.player.name} ({opponent?.player.username})
      </Text>
      {(game?.status === "ACTIVE" || game?.status === "REQUESTED") && (
        <Text style={styles.playerLabel}>
          {game.turn === user.username ? "Your Turn!" : `Waiting for ${opponent?.player.username}`}
        </Text>
      )}
      {result && (
        <Text style={[styles.playerLabel, { color: colors[result] }]}>
          {result === "win" && "You Won!"}
          {result === "loss" && "You Lost!"}
          {result === "draw" && "It's a draw!"}
        </Text>
      )}
    </TouchableOpacity>
  );
}
