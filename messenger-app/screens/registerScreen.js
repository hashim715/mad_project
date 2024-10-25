import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import CheckBox from "expo-checkbox";
import { LogBox } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;
LogBox.ignoreAllLogs();

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isAbove18, setIsAbove18] = useState(false);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        navigation.navigate("Main", { screen: "chats" });
      }
    }, [isLoggedIn])
  );

  const handleRegister = async () => {
    const user = {
      name: name,
      username: username,
      email: email,
      password: password,
    };

    if (!validateUsername(username)) {
      return;
    }

    if (!isAbove18) {
      Alert.alert(
        "Please confirm you are above 18 years old and agree to the terms and conditions."
      );
      return;
    }
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Alert.alert(
          "There might be an issue with your internet connection try again..."
        );
        return;
      }
      setLoading(true);
      const response = await axios.post(`${baseURL}/api/user/register/`, user);
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setLoading(false);
      navigation.navigate("emailInputScreen", { screen: "verification" });
      Alert.alert("User registered successfully");
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        Alert.alert(err.response.data.message);
      } else {
        Alert.alert(err.response.data.message);
      }
    }
  };

  const validateUsername = (text) => {
    const regex = /^[a-z0-9._]+$/;
    if (text === "" || regex.test(text)) {
      setUsername(text);
      return true;
    } else {
      Alert.alert(
        "Username can only contain lowercase letters, numbers, full stops, and underscores."
      );
      setUsername("");
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.title}>Lets get started.</Text>
          </View>

          <View style={{ marginTop: 50, marginBottom: 5 }}>
            <View style={{ marginTop: 10, marginBottom: 13 }}>
              {/* <Text style={styles.label}>Choose a username*</Text> */}

              <TextInput
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.input}
                placeholder="@username"
                placeholderTextColor={"gray"}
              />
            </View>

            <View style={{ marginBottom: 13 }}>
              {/* <Text style={styles.label}>Enter your name*</Text> */}

              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={"gray"}
              />
            </View>

            <View style={{ marginBottom: 13 }}>
              {/* <Text style={styles.label}>Enter your school email address*</Text> */}

              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
                placeholder="College email (must end with .edu)"
                placeholderTextColor={"gray"}
              />
            </View>

            <View style={{ marginBottom: 13 }}>
              {/* <Text style={styles.label}>Password*</Text> */}

              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={"gray"}
              />
            </View>

            {/* Checkbox for "Above 18 years old" */}
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={isAbove18}
                onValueChange={setIsAbove18}
              />

              <Text style={styles.checkboxLabel}>I am over the age of 13</Text>
            </View>

            <View
              style={{
                width: screenWidth * 0.8,
                height: screenWidth * 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...styles.checkboxLabel,
                  fontSize: 10,
                  width: screenWidth * 0.5,
                }}
              >
                By continuing, I agree to the{" "}
                <Text
                  style={styles.link}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.privacypolicies.com/live/c236401d-27d4-4e2d-904b-508e9495d62b"
                    )
                  }
                >
                  privacy policy
                </Text>
                ,{" "}
                <Text
                  style={styles.link}
                  onPress={() =>
                    Linking.openURL("https://www.w-groupchats.com")
                  }
                >
                  terms and conditions
                </Text>
                .
              </Text>
            </View>

            {loading ? (
              <ActivityIndicator></ActivityIndicator>
            ) : (
              <TouchableOpacity
                onPress={handleRegister}
                style={styles.registerButton}
              >
                <Text style={styles.registerButtonText}>Lesgooo</Text>
              </TouchableOpacity>
            )}

            <Pressable
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 15 }}
            >
              <Text style={styles.loginText}>
                or <Text style={styles.loginTextBold}>log into my account</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "Raleway",
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "bold",
    textAlign: "justify",
    marginBottom: 5,
  },
  input: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    padding: screenWidth * 0.03,
    border: "0",
    boxSizing: "border-box",
    borderRadius: 10,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#505050",
    color: "white",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "500",
    outline: "none",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#c2c2c2",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: 500,
    textAlign: "center",
  },
  link: {
    fontWeight: "bold",
    color: "#c2c2c2",
  },
  registerButton: {
    marginTop: -20,
    cursor: "pointer",
    width: screenWidth * 0.7,
    height: screenWidth * 0.1,
    padding: "0px 8px",
    border: "1px solid #fef80e",
    boxSizing: "border-box",
    borderRadius: 100000,
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    lineHeight: 16,
    outline: "none",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    textAlign: "center",
  },
  registerButtonText: {
    fontSize: 18,
    fontFamily: "Raleway",
    fontWeight: "500",
    textAlign: "center",
    color: "black",
  },
  loginText: {
    color: "#7f7f7f",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 25,
  },
  loginTextBold: {
    //fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    width: screenWidth,
  },
});
