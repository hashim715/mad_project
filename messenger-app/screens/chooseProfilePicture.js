import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const radius = width / 3;

const ChooseProfilePicture = () => {
  const profilePictures = [
    {
      id: 1,
      uri: "https://assets.api.uizard.io/api/cdn/stream/97f1470f-0823-4ecf-bd7a-946c8b346134.jpg",
    },
    {
      id: 2,
      uri: "https://assets.api.uizard.io/api/cdn/stream/1f8e59c2-3da1-4f55-b431-d3d71adc3d60.jpg",
    },
    {
      id: 3,
      uri: "https://assets.api.uizard.io/api/cdn/stream/da4542a1-bd55-4f93-924a-e45234d49ed2.jpg",
    },
    {
      id: 4,
      uri: "https://images.unsplash.com/photo-1652278859087-a09fd73d39a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHwxMDJ8fGJveXN8ZW58MXx8fHwxNzI3ODI2Nzc0fDA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: 5,
      uri: "https://assets.api.uizard.io/api/cdn/stream/3dfca7fb-d99c-453f-a983-6c25cbf12522.jpg",
    },
    {
      id: 6,
      uri: "https://images.unsplash.com/photo-1623309441302-33b36b9aff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHwyMjN8fGJveXN8ZW58MXx8fHwxNzI3ODI2Nzk4fDA&ixlib=rb-4.0.3&q=80&w=1080",
    },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const [imageUrl, setImageUrl] = useState(
    "https://assets.api.uizard.io/api/cdn/stream/72aa7c72-8bd6-4874-b4ad-36a00b6d5bf2.png"
  );

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
        setImageUrl(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error in selecting image. Select again");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose your profile picture.</Text>
        <Text style={styles.subtitle}>
          Accounts with profile pictures tend to be recognised easily by their
          friends.
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          width: width,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageBackground
          source={{
            uri: "https://assets.api.uizard.io/api/cdn/stream/a7cafd5e-090b-4e62-b130-1a105b23fd12.png",
          }}
          style={styles.imageContainer}
        >
          <TouchableOpacity
            onPress={() => {
              selectImage();
            }}
          >
            <Image
              source={{ uri: imageUrl.uri ? imageUrl.uri : imageUrl }}
              style={styles.profileCircle}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => {
          navigation.navigate("GetProfileData", { image: imageUrl });
        }}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 12,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
    width: "70%",
  },
  profileContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  profileCircle: {
    width: 152,
    height: 152,
    borderRadius: 400,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 25,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  nextButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    position: "absolute",
    bottom: 150,
    width: width * 0.5,
    height: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Raleway",
  },
  imageContainer: {
    width: width * 1.3,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    resizeMode: "contain",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default ChooseProfilePicture;
