import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImageManipulator from "expo-image-manipulator";

export const CameraScreen = () => {
  const [type, setType] = useState(CameraType.back);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const cameraRef = useRef(null);
  // const [permission, requestPermission] = Camera.useCameraPermissions();
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const onPress = async () => {
    const pictureMetadata = await cameraRef.current.takePictureAsync();
    await ImageManipulator.manipulateAsync(pictureMetadata.uri, [
      { resize: { width: 800 } },
    ]);
  };

  if (cameraPermission === null) {
    return <View />;
  }
  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <Camera type={type} style={styles.camera} ref={cameraRef}>
        <View style={styles.cameraView}>
          <TouchableOpacity
            onPress={toggleCameraType}
            style={[styles.button, styles.toggleButton]}
          >
            <Icon name="retweet" color="black" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPress}
            style={[styles.button, styles.cameraButton]}
          >
            <Icon name="camera" color="black" size={20} />
          </TouchableOpacity>
        </View>
      </Camera>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  cameraView: {
    padding: 10,
  },
  button: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(206, 202, 209, 0.6)",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
  },
  toggleButton: {
    alignSelf: "flex-end",
  },
  cameraButton: {
    alignSelf: "center",
    position: "absolute",
    top: 550,
  },
});
