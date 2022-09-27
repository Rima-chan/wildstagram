import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import * as FileSystem from "expo-file-system";

export const ImagesScreen = () => {
  const [imagesUri, setImagesUri] = useState([]);

  useEffect(() => {
    (async () => {
      const images = await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory + "ImageManipulator"
      );
      setImagesUri(images);
    })();
  }, []);

  const renderImage = (itemData) => {
    console.log("itemData", itemData);
    return (
      <Image
        style={styles.image}
        source={{
          uri: `${FileSystem.cacheDirectory}/ImageManipulator/${itemData.item}`,
        }}
      />
    );
  };

  return imagesUri.length > 0 ? (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={imagesUri}
        renderItem={renderImage}
        keyExtractor={(imageUri) => imageUri}
      />
    </SafeAreaView>
  ) : (
    <Text>Aucune image</Text>
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
