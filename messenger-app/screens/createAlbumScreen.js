import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const CreateAlbum = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://assets.api.uizard.io/api/cdn/stream/d52b42fa-0eeb-4d3a-b24b-abebb2128683.png",
        }}
        style={styles.imageContainer}
      >
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            navigation.navigate("ChooseTheme");
          }}
        >
          <Text style={styles.createText}>Create Album</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F1E1E",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  imageContainer: {
    width: screenWidth,
    height: screenHeight * 0.7,
    borderRadius: 12,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  createButton: {
    width: 180,
    height: 50,
    padding: "0px 8px",
    border: "1px solid #ffffff",
    boxSizing: "border-box",
    borderRadius: "25px",
    boxShadow: "0px 0px 10px rgba(3,3,3,0.1)",
    backgroundColor: "#ffffff",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  createText: {
    color: "#000000",
    fontSize: 17,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    lineHeight: "18px",
    outline: "none",
  },
});

export default CreateAlbum;
