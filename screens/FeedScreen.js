import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, StyleSheet } from "react-native";
import axios from "axios";

export const FeedScreen = () => {
  const [serverImagesUrls, setServerImagesUrls] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "https://wildstagram.nausicaa.wilders.dev/list"
        );
        const imagesUrls = response.data;
        setServerImagesUrls(imagesUrls.reverse());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const renderImage = (itemData) => {
    return (
      <Image
        style={styles.image}
        source={{
          uri: `https://wildstagram.nausicaa.wilders.dev/files/${itemData.item}`,
        }}
      />
    );
  };

  const onRefresh = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "https://wildstagram.nausicaa.wilders.dev/list"
      );
      const imagesUrls = response.data;
      setServerImagesUrls(imagesUrls.reverse());
    } catch (e) {
      console.error(e);
    }
    setIsFetching(false);
  };

  return serverImagesUrls.length > 0 ? (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={serverImagesUrls}
        renderItem={renderImage}
        keyExtractor={(imageUri) => imageUri}
        refreshing={isFetching}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  ) : (
    <Text>Pas d'image</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    height: 500,
  },
});
