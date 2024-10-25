import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authActions } from "../store/reducers/auth-slice";

const screenWidth = Dimensions.get("window").width;

const VerificationScreen = ({ route }) => {
  const { email, screen } = route.params;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        navigation.navigate("Main", { screen: "chats" });
      }
    }, [isLoggedIn])
  );

  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
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
      const enteredCode = code.join("");
      setLoading(true);
      const response = await axios.post(`${baseURL}/api/verify/verifyEmail/`, {
        code: enteredCode,
        email: email,
      });
      try {
        await AsyncStorage.setItem(
          "token",
          JSON.stringify(response.data.token)
        );
      } catch (storageError) {
        Alert.alert("Failed to save token try again...");
        return;
      }
      dispatch(authActions.login({ token: response.data.token }));
      setLoading(false);
      navigation.navigate("ChooseProfilePicture");
      Alert.alert("Your email verified successfully");
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        Alert.alert(err.response.data.message);
      } else {
        Alert.alert(err.response.data.message);
      }
    }
  };

  const handleSubmit2 = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Alert.alert(
          "There might be an issue with your internet connection try again..."
        );
        return;
      }
      const enteredCode = code.join("");
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/api/verify/verifyForgotPasswordEmail/`,
        {
          code: enteredCode,
          email: email,
        }
      );
      setLoading(false);
      Alert.alert("You may now reset your password");
      navigation.navigate("ForgotPassword", { email: email });
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        Alert.alert(err.response.data.message);
      } else {
        Alert.alert(err.response.data.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        We sent a 6-digit code to the email you provided.
      </Text>

      <View style={styles.codeInputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={screen === "verify" ? handleSubmit : handleSubmit2}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator></ActivityIndicator>
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    width: screenWidth * 0.8,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth * 0.8,
    marginBottom: 40,
  },
  input: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    backgroundColor: "#f5f6fa",
    color: "#000",
    fontSize: 20,
    textAlign: "center",
    borderRadius: 10,
  },
  button: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.1,
    backgroundColor: "#fef80e",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});

export default VerificationScreen;
