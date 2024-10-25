import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";
import Svg, { Path, Use } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const AlbumCover = ({ route }) => {
  const navigation = useNavigation();
  const [albumName, setAlbumName] = useState("");
  const [albumdescription, setAlbumDescription] = useState("");
  const [imageurl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);

  const background = route.params.background;

  useEffect(() => {
    if (background === 2) {
      setImageUrl(
        "https://assets.api.uizard.io/api/cdn/stream/f8cc1623-a034-4905-bc48-6a60ed226560.png"
      );
    }
    if (background === 1) {
      setImageUrl(
        "https://assets.api.uizard.io/api/cdn/stream/c6ba2001-08e6-41ef-a0e1-0a749d353b06.png"
      );
    }
  }, [background]);

  const selectImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Failed to select image. try again..");
    }
  };

  const redirect = () => {
    if (!albumName.trim() || !albumdescription.trim() || !image) {
      Alert.alert("Please fill out the form completely.");
    } else {
      navigation.navigate("AlbumPhotos", {
        theme: background,
        album_title: albumName,
        album_description: albumdescription,
        album_cover: image,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topContainer}>
              <Text style={styles.heading}>It's time.</Text>

              <TouchableOpacity
                onPress={() => {
                  redirect();
                }}
                style={styles.nextButton}
              >
                <Svg viewBox="0 0 24 24" width={24} height={24}>
                  <Path d="M0 0h24v24H0V0z" fill="none" />
                  <Path
                    fill="white"
                    d="M6.23 20.23L8 22l10-10L8 2 6.23 3.77 14.46 12z"
                  />
                </Svg>
              </TouchableOpacity>
            </View>

            <View style={styles.imageWrapper}>
              <ImageBackground
                source={{ uri: imageurl }}
                style={styles.imageContainer}
              >
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    selectImage();
                  }}
                >
                  <Text style={styles.selectButtonText}>
                    Select an Album Cover
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>

            <View style={{ marginTop: 20, alignSelf: "center" }}>
              <TextInput
                value={albumName}
                onChangeText={(text) => setAlbumName(text)}
                style={styles.input}
                placeholder="Album Name"
                placeholderTextColor={"white"}
              />
            </View>

            <View style={{ marginTop: 20, alignSelf: "center" }}>
              <TextInput
                value={albumdescription}
                onChangeText={(text) => setAlbumDescription(text)}
                style={{
                  ...styles.input,
                  height: screenWidth * 0.3,
                  textAlignVertical: "top",
                }}
                multiline={true}
                placeholder="Album Description"
                placeholderTextColor={"white"}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F1E1E",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  topContainer: {
    width: screenWidth * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  imageContainer: {
    marginTop: 40,
    width: screenWidth * 0.9,
    height: screenWidth,
    borderRadius: 12,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#ffffff",
    fontSize: 25,
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
  nextButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#2F2E2E",
    justifyContent: "center",
    alignItems: "center",
  },
  selectButton: {
    width: screenWidth * 0.6,
    height: 50,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 25,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  selectButtonText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: "500",
  },
  input: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.15,
    padding: screenWidth * 0.03,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "#2F2E2E",
    color: "white",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "500",
  },
  scrollView: {
    width: screenWidth,
  },
});

export default AlbumCover;
