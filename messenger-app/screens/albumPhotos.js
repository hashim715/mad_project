import React, { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";
import Svg, { Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import useAxios from "../utils/useAxios";
import { ActivityIndicator } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { s3 } from "../utils/aws-sdk-config";
import { handleUseffectActions } from "../store/reducers/handleUseffect";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const AlbumPhotos = ({ route }) => {
  const navigation = useNavigation();
  const { theme, album_title, album_description, album_cover } = route.params;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const api = useAxios();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const uploadImagesToS3 = async (images) => {
    let imageUrls = [];
    try {
      setLoading(true);
      if (images.length < 2) {
        Alert.alert("Please upload at least 2 images");
        return null;
      }

      const response_ = await fetch(album_cover.uri);
      const blob_ = await response_.blob();

      const params_ = {
        Bucket: "w-groupchat-images",
        Key: `${Date.now()}_${album_cover.fileName}`,
        Body: blob_,
        ContentType: album_cover.type || "image/jpeg",
      };
      const s3_cover_photo = await s3.upload(params_).promise();
      imageUrls.push(s3_cover_photo.Location);

      for (const image of images) {
        const response = await fetch(image.uri);
        const blob = await response.blob();

        const params = {
          Bucket: "w-groupchat-images",
          Key: `${Date.now()}_${image.fileName}`,
          Body: blob,
          ContentType: image.type || "image/jpeg",
        };

        const s3Response = await s3.upload(params).promise();
        imageUrls.push(s3Response.Location);
      }
      setLoading(false);
      return imageUrls;
    } catch (err) {
      console.log(err);
      setLoading(false);
      Alert.alert("Failed to upload images, please try again.");
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Alert.alert(
          "There might be an issue with your internet connection try again..."
        );
        return;
      }
      setLoading(true);
      const imageUrls = await uploadImagesToS3(images);
      if (imageUrls) {
        const response = await api.post(`${baseURL}/api/user/createAlbum/`, {
          album_title: album_title,
          album_description: album_description,
          album_cover: imageUrls[0],
          album_photos: JSON.stringify(imageUrls.slice(1)),
          theme_name:
            theme === 1
              ? "https://assets.api.uizard.io/api/cdn/stream/e16a6e9f-6b62-42cd-a233-9b3620639bd2.jpg"
              : "https://assets.api.uizard.io/api/cdn/stream/00e8f1ea-1dfd-4d2e-8044-01a182c1e270.jpg",
        });
        setLoading(false);
        dispatch(
          handleUseffectActions.setRefreshProfileScreen({ reload: true })
        );
        dispatch(
          handleUseffectActions.setRefreshDiscoverScreen({ reload: true })
        );
        navigation.navigate("Main", { screen: "profile" });
        Alert.alert("Your album created successfully");
      } else {
        setLoading(false);
        return;
      }
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        Alert.alert(err.response.data.message);
      } else {
        Alert.alert(err.response.data.message);
      }
    }
  };

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
        const selectedImage = {
          uri: result.assets[0].uri,
          id: result.assets[0].id || result.assets[0].uri,
          fileName: result.assets[0].fileName,
        };
        setImages((prevImages) => [...prevImages, selectedImage]);
      }
    } catch (error) {
      Alert.alert("Failed to select image. Select again");
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
              <Text style={styles.heading}>Don't be a camera shy.</Text>

              {loading ? (
                <ActivityIndicator></ActivityIndicator>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit();
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
              )}
            </View>

            <View style={styles.imageWrapper}>
              <ImageBackground
                source={{
                  uri: "https://assets.api.uizard.io/api/cdn/stream/429ca90f-703b-4dd6-b7b8-9d1dab9712d6.png",
                }}
                style={styles.imageContainer}
              >
                {images.slice(0).map((img, index) => (
                  <Image
                    key={img.id || index}
                    source={{ uri: img.uri }}
                    style={[
                      styles.overlayImage,
                      {
                        top: 20 + index * 20,
                        left: 20 + index * 20,
                      },
                    ]}
                  />
                ))}
              </ImageBackground>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                selectImage();
              }}
              disabled={loading ? true : false}
            >
              <Text
                style={
                  images.length > 0
                    ? {
                        ...styles.selectButtonText,
                        width: screenWidth * 0.6,
                        textAlign: "center",
                      }
                    : styles.selectButtonText
                }
              >
                {images.length > 0
                  ? `Select More Photos (${images.length} selected)`
                  : "Select Photos"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.message}>*Choose at least 2 photos</Text>
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
  overlayImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    position: "absolute",
    borderWidth: 2,
    borderColor: "#ffffff",
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
    marginTop: 50,
  },
  selectButtonText: {
    color: "#000000",
    fontSize: 18,
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
  message: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Montserrat",
    fontWeight: "500",
    marginTop: 10,
  },
});

export default AlbumPhotos;
