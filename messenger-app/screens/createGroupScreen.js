import React, { useState, useEffect } from "react";
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Svg, Path } from "react-native-svg";

import { LogBox } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useAxios from "../utils/useAxios";
import { handleUseffectActions } from "../store/reducers/handleUseffect";

import RNPickerSelect from "react-native-picker-select";

import NetInfo from "@react-native-community/netinfo";
import { s3 } from "../utils/aws-sdk-config";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const createGroupScreen = () => {
  const [image, setImage] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [theimageurl, settheImageUrl] = useState(
    "https://imgvisuals.com/cdn/shop/products/animated-plus-white-line-ui-icon-440491.gif?v=1697071143"
  );
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigation = useNavigation();
  const baseURL = useSelector((state) => state.baseUrl.url);
  const dispatch = useDispatch();
  const api = useAxios();
  const [imageUploading, setImageUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

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
      const groupImage = await uploadPicturestos3(image);
      const data = {
        name: groupName,
        description: groupDescription,
        college: selectedValue,
        image: groupImage,
      };
      const response = await api.post(`${baseURL}/api/user/createGroup/`, data);
      setGroupName("");
      setImage(null);
      setGroupDescription("");
      settheImageUrl(
        "https://imgvisuals.com/cdn/shop/products/animated-plus-white-line-ui-icon-440491.gif?v=1697071143"
      );
      setLoading(false);
      dispatch(handleUseffectActions.setRefreshChats({ reload: true }));
      dispatch(handleUseffectActions.setRefreshGroupsScreen({ reload: true }));
      dispatch(
        handleUseffectActions.setRefreshDiscoverScreen({ reload: true })
      );
      navigation.navigate("Main", { screen: "chats" });
      Alert.alert("Group created 🔥");
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
          <TouchableOpacity onPress={selectImage}>
            <Image source={{ uri: theimageurl }} style={styles.image} />
          </TouchableOpacity>

          <View style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Groupchat name</Text>
            <TextInput
              value={groupName}
              onChangeText={(text) => setGroupName(text)}
              style={styles.input}
            />
          </View>

          <View style={{ marginBottom: 5, marginTop: 13 }}>
            <Text style={styles.field}>School/College</Text>
            <View style={styles.dropdown}>
              <RNPickerSelect
                activeItemStyle={{ color: "black" }}
                onValueChange={(value) => setSelectedValue(value)}
                items={[
                  {
                    label: "University of Houston-Downtown",
                    value: "University of Houston-Downtown",
                  },
                  {
                    label: "University of Houston",
                    value: "University of Houston",
                  },
                  {
                    label: "University of Texas",
                    value: "University of Texas",
                  },
                ]}
                placeholder={{
                  label: "Choose a University",
                  value: null,
                  color: "white",
                }}
                style={{
                  inputIOS: {
                    color: "white",
                  },
                  inputAndroid: {
                    color: "white",
                  },
                  placeholder: {
                    color: "white",
                  },
                }}
              />
            </View>
          </View>

          <View style={{ marginBottom: 30, marginTop: 13 }}>
            <Text style={styles.field}>Groupchat description</Text>
            <TextInput
              value={groupDescription}
              onChangeText={(text) => setGroupDescription(text)}
              style={styles.input}
            />
          </View>

          {loading || imageUploading ? (
            <ActivityIndicator></ActivityIndicator>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Done</Text>
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
    marginTop: -20,
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
    border: "0",
    boxSizing: "border-box",
    borderRadius: 15,
    backgroundColor: "#1f1e1e",
    color: "white",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "500",
    lineHeight: 13,
    outline: "none",
  },
  field: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "bold",
    textAlign: "justify",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "transparent",
    borderColor: "yellow",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 100,
    marginTop: 120,
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
  picker: {
    color: "black",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    padding: screenWidth * 0.03,
    borderRadius: 15,
    backgroundColor: "#1f1e1e",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#1f1e1e",
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 10,
    width: screenWidth * 0.8,
    color: "white",
    backgroundColor: "#1f1e1e",
  },
});

export default createGroupScreen;
