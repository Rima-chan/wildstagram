import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";
import singleFileUploader from "single-file-uploader";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/FontAwesome";

export const ImagesScreen = () => {
  const [imagesUri, setImagesUri] = useState([]);
  const [isFecthing, setIsFecthing] = useState(false);

  useEffect(() => {
    (async () => {
      const images = await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory + "ImageManipulator"
      );
      setImagesUri(images);
    })();
  }, []);

  const onPress = async (itemData) => {
    console.log("fecthing");
    try {
      console.log("test");
      await singleFileUploader({
        distantUrl: "https://wildstagram.nausicaa.wilders.dev/upload",
        expectedStatusCode: 201,
        filename: itemData.item,
        filetype: "image/jpeg",
        formDataName: "fileData",
        localUri:
          FileSystem.cacheDirectory + "/ImageManipulator/" + itemData.item,
        token: Constants.manifest.extra.token,
      });
      alert("success");
    } catch (e) {
      console.log("error");
      console.log(e);
      alert("failed");
    }
  };

  const onDelete = async (itemData) => {
    await FileSystem.deleteAsync(
      FileSystem.cacheDirectory + "/ImageManipulator/" + itemData.item
    );
    setImagesUri((current) =>
      current.filter((imageUri) => imageUri !== itemData.item)
    );
  };

  const onRefresh = async () => {
    setIsFecthing(true);
    const images = await FileSystem.readDirectoryAsync(
      FileSystem.cacheDirectory + "ImageManipulator"
    );
    setImagesUri(images);
    setIsFecthing(false);
  };

  const renderImage = (itemData) => {
    return (
      <>
        <TouchableOpacity
          title="delete"
          onPress={() => onDelete(itemData)}
          style={[styles.button, styles.deleteButton]}
        >
          <Icon name="trash" color="black" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          title="upload"
          onPress={() => onPress(itemData)}
          style={[styles.button, styles.uploadButton]}
        >
          <Icon name="download" color="black" size={20} />
        </TouchableOpacity>
        <Image
          style={styles.image}
          source={{
            uri: `${FileSystem.cacheDirectory}/ImageManipulator/${itemData.item}`,
          }}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {imagesUri.length === 0 && (
        <Text style={styles.noImageText}>Gallerie vide</Text>
      )}
      <FlatList
        data={imagesUri}
        renderItem={renderImage}
        keyExtractor={(imageUri) => imageUri}
        refreshing={isFecthing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
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
  noImageText: {
    textAlign: "center",
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "rgba(206, 202, 209, 0.6)",
    width: 50,
    height: 50,
    borderRadius: 50,
    marginTop: 5,
  },
  uploadButton: {
    zIndex: 1001,
    position: "absolute",
    right: 0,
    marginRight: 5,
  },
  deleteButton: {
    zIndex: 1001,
    position: "absolute",
    left: 0,
    marginLeft: 5,
  },
});
