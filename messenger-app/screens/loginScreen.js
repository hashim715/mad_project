import React, { useState, useCallback } from "react";
import {
  LogBox,
  Alert,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/reducers/auth-slice";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleUseffectActions } from "../store/reducers/handleUseffect";
import NetInfo from "@react-native-community/netinfo";
import * as jwtDecodeModule from "jwt-decode";

// Get the screen width
const screenWidth = Dimensions.get("window").width;
LogBox.ignoreAllLogs();

const loginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        navigation.navigate("Main", { screen: "chats" });
      }
    }, [isLoggedIn])
  );

  const handleLogin = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Alert.alert(
          "There might be an issue with your internet connection try again..."
        );
        return;
      }
      setLoading(true);
      const response = await axios.post(`${baseURL}/api/user/login/`, {
        email: email,
        password: password,
      });
      const { token } = await response.data;
      const user = jwtDecodeModule.jwtDecode(token);
      try {
        await AsyncStorage.setItem("token", JSON.stringify(token));
        await AsyncStorage.setItem("username", JSON.stringify(user.username));
      } catch (storageError) {
        Alert.alert("Failed to save token");
        return;
      }
      dispatch(authActions.login({ token: token }));
      setEmail("");
      setPassword("");
      setLoading(false);
      dispatch(handleUseffectActions.setRefreshChats({ reload: true }));
      dispatch(handleUseffectActions.setRefreshEventsScreen({ reload: true }));
      dispatch(handleUseffectActions.setRefreshProfileScreen({ reload: true }));
      dispatch(handleUseffectActions.setRefreshGroupsScreen({ reload: true }));
      dispatch(
        handleUseffectActions.setRefreshSettingsScreen({ reload: true })
      );
      dispatch(
        handleUseffectActions.setRefreshDiscoverScreen({ reload: true })
      );
      // navigation.navigate("Main", { screen: "chats" });
      navigation.navigate("ChooseProfilePicture");
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Welcome back.</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor={"gray"}
          placeholder="Your college email address"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={[styles.input, { marginTop: 10 }]}
          placeholderTextColor={"gray"}
          placeholder="Your password"
        />
        <Pressable
          onPress={() =>
            navigation.navigate("emailInputScreen", {
              screen: "forgotPassword",
            })
          }
          style={styles.forgetPasswordContainer}
        >
          <Text style={styles.forgetPasswordText}>Forget Password?</Text>
        </Pressable>
        {loading ? (
          <ActivityIndicator size="large" color="#fef80e" />
        ) : (
          <TouchableOpacity onPress={() => handleLogin()} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        )}

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.signupText}>
            or{" "}
            <Text style={{ color: "white", fontWeight: "500" }}>
              create an account
            </Text>
          </Text>
        </Pressable>
      </View>
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
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 30,
    fontFamily: "Red Hat Display",
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "#c1c1c1",
    fontSize: 18,
    fontFamily: "Raleway",
    fontWeight: "700",
    marginTop: 30,
    textAlign: "center",
    width: screenWidth * 0.8,
  },
  formContainer: {
    marginTop: 50,
  },
  input: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    padding: screenWidth * 0.03,
    backgroundColor: "#",
    borderWidth: 1,
    borderColor: "white",
    color: "#7f7f7f",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "250",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 90,
    width: screenWidth * 0.6,
    height: screenWidth * 0.1,
    borderColor: "#c2c2c2",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Raleway",
    fontWeight: "500",
  },
  signupText: {
    textAlign: "center",
    color: "gray",
    fontSize: 15,
    marginTop: 20,
  },
  forgetPasswordContainer: {
    marginTop: 10,
  },
  forgetPasswordText: {
    color: "#c2c2c2",
    fontSize: 12,
    textAlign: "right",
  },
});

export default loginScreen;
