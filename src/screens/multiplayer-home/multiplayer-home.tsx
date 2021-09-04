import React, { useEffect, useCallback, useState, ReactElement } from "react";
import { FlatList, LogBox, Platform, RefreshControl, TouchableOpacity, View } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import styles from "./multiplayer-home.styles";
import PlayerModal from "./player-modal/player-modal";
import GameItem from "./game-item";
import { getPlayer, PlayerGameType } from "./multiplayer-home.graphql";
import { useAuth } from "@contexts/auth-context";
import { GetPlayerQuery, ModelSortDirection } from "@api";
import { Button, Loading, Text, Wrapper } from "@components";
import { colors } from "@utils";
import { RootNavParams } from "@config/navigator";

type StackNavProps = NativeStackNavigationProp<RootNavParams, "MultiplayerHome">;
type ScrProps = {
  navigation: StackNavProps;
};

export default function MultiplayerHome({ navigation }: ScrProps): ReactElement {
  const { user } = useAuth();
  const [playerGames, setPlayerGames] = useState<PlayerGameType[] | null | undefined>(null);
  const [nextToken, setNextToken] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [playersModal, setPlayersModal] = useState(false);

  const fetchPlayer = useCallback(async (nextToken: string | null, init = false) => {
    if (user) {
      setLoading(true);
      if (nextToken === null && !init) {
        setRefreshing(true);
      }
      try {
        const player = (await API.graphql(
          graphqlOperation(getPlayer, {
            username: user.username,
            limit: 1,
            sortDirection: ModelSortDirection.DESC,
            nextToken: nextToken,
          })
        )) as GraphQLResult<GetPlayerQuery>;
        if (player.data?.getPlayer?.games) {
          const newPlayerGames = player.data.getPlayer.games.items || [];
          setPlayerGames((ps) => {
            if (!ps || nextToken === null) return newPlayerGames;
            return [...ps, ...newPlayerGames];
          });
          setNextToken(player.data.getPlayer.games.nextToken);
        }
      } catch (err) {
        alert("An error has occured!");
      }
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
    }

    fetchPlayer(null, true);
  }, [fetchPlayer]);

  return (
    <Wrapper>
      {user ? (
        <>
          <FlatList
            contentContainerStyle={styles.container}
            data={playerGames}
            renderItem={({ item }) => (
              <GameItem
                item={item}
                onPress={() => {
                  navigation.navigate("MultiplayerGame", { gameID: item?.game.id });
                }}
              />
            )}
            keyExtractor={(playerGames) => (playerGames ? playerGames.game.id : `${new Date().getTime()}`)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchPlayer(null)}
                tintColor={colors.lightGreen}
              />
            }
            ListEmptyComponent={() => {
              return loading ? (
                <Loading style={{ backgroundColor: "transparent", marginBottom: 40 }} />
              ) : (
                <Text>Empty list</Text>
              );
            }}
            ListFooterComponent={() => {
              if (!nextToken) return null;
              return (
                <Button
                  title="Load More"
                  loading={loading}
                  onPress={() => {
                    fetchPlayer(nextToken);
                  }}
                />
              );
            }}
          />
          <TouchableOpacity
            style={styles.newGameBtn}
            onPress={() => {
              setPlayersModal(true);
            }}
          >
            <Text style={styles.newGameLabel}>New Game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.container}>
          <Text>You must be logged in order to play a multiplayer game!</Text>
        </View>
      )}

      {playersModal && (
        <PlayerModal
          onBackdropPress={setPlayersModal}
          onItemPress={(username: string) => {
            setPlayersModal(false);
            navigation.navigate("MultiplayerGame", { invitee: username });
          }}
        />
      )}
    </Wrapper>
  );
}
