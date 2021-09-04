import React, { Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, TextInput, FlatList } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";

import styles from "./player-modal.styles";
import { searchPlayers } from "../multiplayer-home.graphql";
import { searchPlayersQuery } from "@api";
import { Loading, Text, TxtInput } from "@components";

type PlayerModalProps = {
  onBackdropPress: Dispatch<SetStateAction<boolean>>;
  onItemPress: (username: string) => void;
};

type PlayersListType = Exclude<searchPlayersQuery["searchPlayers"], null | undefined>["items"];

export default function PlayerModal({ onBackdropPress, onItemPress }: PlayerModalProps): ReactElement {
  const [players, setPlayers] = useState<PlayersListType>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [firstQuery, setFirstQuery] = useState(true);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const fetchPlayers = async (searchStr: string) => {
    setLoading(true);
    setFirstQuery(false);
    try {
      const players = (await API.graphql(
        graphqlOperation(searchPlayers, {
          limit: 6,
          searchString: searchStr,
        })
      )) as GraphQLResult<searchPlayersQuery>;
      if (players.data?.searchPlayers?.items) {
        setPlayers(players.data.searchPlayers.items);
      }
    } catch (err) {
      alert("An error has occurred!");
    }
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={() => {
          onBackdropPress(false);
        }}
      ></TouchableOpacity>
      <View style={styles.modalBody}>
        <TxtInput
          value={searchQuery}
          onChangeText={(t) => setSearchQuery(t)}
          onSubmitEditing={() => {
            fetchPlayers(searchQuery);
          }}
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Type to search by username or name"
          returnKeyType="search"
        />
        <View style={styles.searchContainer}>
          {loading ? (
            <Loading />
          ) : (
            <FlatList
              data={players}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity style={styles.btnBox} onPress={() => item && onItemPress(item?.username)}>
                    <Text style={styles.playerLabel}>{item?.name}</Text>
                    <Text style={[styles.playerLabel, { fontSize: 12 }]} weight="400">
                      {item?.username}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(player) => player?.username || `${new Date().getTime()}`}
              ListEmptyComponent={() => {
                return firstQuery ? null : <Text>No result found!</Text>;
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
