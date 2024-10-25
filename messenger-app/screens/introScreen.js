// Place to save other utility functions.
import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const IntroScreen = () => {
  const theimageurl =
    "https://assets.api.uizard.io/api/cdn/stream/53af2456-f992-4387-a701-cfc7e2e62625.png";
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 700); // 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: theimageurl }} style={styles.imageContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  imageContainer: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    borderRadius: 8,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
});

export default IntroScreen;
