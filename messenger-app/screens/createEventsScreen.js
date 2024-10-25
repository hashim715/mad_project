import React, { useState, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Svg, Path } from "react-native-svg";

import { LogBox } from "react-native";
import useAxios from "../utils/useAxios";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { handleUseffectActions } from "../store/reducers/handleUseffect";
import NetInfo from "@react-native-community/netinfo";
import { s3 } from "../utils/aws-sdk-config";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const createEventScreen = () => {
  const [image, setImage] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [theimageurl, settheImageUrl] = useState(
    "https://assets.api.uizard.io/api/cdn/stream/cca69e27-9924-47d5-a8e1-c9894f474008.jpg"
  );
  const [startTime, setstartTime] = useState(null);
  const [endTime, setendTime] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigation = useNavigation();
  const api = useAxios();
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const handleConfirm1 = (selectedDate) => {
    setstartTime(selectedDate);
    hideDatePicker1();
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleConfirm2 = (selectedDate) => {
    setendTime(selectedDate);
    hideDatePicker2();
  };

  const uploadPicturestos3 = async (image) => {
    let imageUrl = "";
    if (!image) {
      return null;
    }
    try {
      setImageUploading(true);
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const params = {
        Bucket: "w-groupchat-images",
        Key: `${Date.now()}_${image.fileName}`,
        Body: blob,
        ContentType: image.type || "image/jpeg",
      };
      const s3Response = await s3.upload(params).promise();
      imageUrl = s3Response.Location;
      setImageUploading(false);
      return imageUrl;
    } catch (err) {
      console.log(err);
      setImageUploading(false);
      Alert.alert("Failed to upload image, please try again.");
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
      const eventImage = await uploadPicturestos3(image);
      const data = {
        name: eventName,
        description: eventDescription,
        location: location,
        image: eventImage,
        startTime: startTime ? startTime.toISOString() : null,
        endTime: endTime ? endTime.toISOString() : null,
      };
      const response = await api.post(`${baseURL}/api/user/createEvent/`, data);
      setEventName("");
      setEventDescription("");
      setLocation("");
      setImage(null);
      settheImageUrl(
        "https://assets.api.uizard.io/api/cdn/stream/cca69e27-9924-47d5-a8e1-c9894f474008.jpg"
      );
      setstartTime(new Date());
      setendTime(new Date());
      setLoading(false);
      dispatch(handleUseffectActions.setRefreshEventsScreen({ reload: true }));
      dispatch(
        handleUseffectActions.setRefreshDiscoverScreen({ reload: true })
      );
      navigation.navigate("Main", { screen: "chats" });
      Alert.alert("Event created 🔥");
    } catch (err) {
      console.log(err);
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
        setImage(result.assets[0]);
        settheImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image:", error.message);
      Alert.alert("Failed to select image. Select again");
    }
  };

  const handlePress = () => {
    navigation.navigate("Main", { screen: "chats" });
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={handlePress}>
        <Svg width={24} height={24} viewBox="0 0 320 512">
          <Path
            fill="white"
            d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
          />
        </Svg>
      </TouchableOpacity>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
        >
          <DateTimePickerModal
            isVisible={isDatePickerVisible1}
            mode="datetime"
            onConfirm={handleConfirm1}
            onCancel={hideDatePicker1}
          />

          <DateTimePickerModal
            isVisible={isDatePickerVisible2}
            mode="datetime"
            onConfirm={handleConfirm2}
            onCancel={hideDatePicker2}
          />

          <View style={styles.imageWrapper}>
            <ImageBackground
              source={{ uri: theimageurl }}
              style={styles.imageContainer}
            >
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  selectImage();
                }}
              >
                <Text style={styles.selectButtonText}>
                  Select an Event Cover
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={{ marginBottom: 8, marginTop: 13 }}>
            <TextInput
              value={eventName}
              onChangeText={(text) => setEventName(text)}
              style={styles.input}
              placeholder="Event Name"
              placeholderTextColor={"#ffffff"}
            />
          </View>

          <View style={{ marginBottom: 5, marginTop: 12 }}>
            <TouchableOpacity
              onPress={showDatePicker1}
              style={styles.timeButton}
            >
              <Text style={styles.timeButtonText}>
                {startTime
                  ? startTime.toLocaleString(undefined, options)
                  : "Start Time and Date"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showDatePicker2}
              style={{ ...styles.timeButton, marginTop: 20 }}
            >
              <Text style={styles.timeButtonText}>
                {endTime
                  ? endTime.toLocaleString(undefined, options)
                  : "End Time and Date"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 8, marginTop: 13 }}>
            <TextInput
              value={location}
              onChangeText={(text) => setLocation(text)}
              style={styles.input}
              placeholder="Location"
              placeholderTextColor={"#ffffff"}
            />
          </View>

          <View style={{ marginTop: 13 }}>
            <TextInput
              style={styles.input}
              value={eventDescription}
              onChangeText={(text) => setEventDescription(text)}
              placeholder="Description"
              placeholderTextColor={"#ffffff"}
            />
          </View>

          {loading || imageUploading ? (
            <ActivityIndicator></ActivityIndicator>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Create Event</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 0,
    marginBottom: 24,
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    alignSelf: "center",
    borderRadius: 5,
  },
  input: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    padding: screenWidth * 0.03,
    boxSizing: "border-box",
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: "#1f1e1e",
    borderColor: "white",
    color: "white",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "500",
    lineHeight: 15,
  },
  timeButton: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.12,
    padding: screenWidth * 0.03,
    boxSizing: "border-box",
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "#1f1e1e",
  },
  field: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "700",
    textAlign: "justify",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#f900ff",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 100,
    marginTop: 40,
    width: screenWidth * 0.5,
  },
  buttonText: {
    color: "black",
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "bold",
    outline: "none",
    color: "yellow",
  },
  backIcon: {
    position: "absolute",
    top: screenWidth * 0.18,
    left: 20,
    width: 25,
    height: 25,
    backgroundColor: "transparent",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timeButtonText: {
    color: "white",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "500",
    textAlign: "justify",
  },
  imageWrapper: {
    position: "relative",
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
  imageContainer: {
    marginTop: 40,
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 12,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default createEventScreen;
