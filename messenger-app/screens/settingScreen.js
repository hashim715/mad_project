import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, G } from "react-native-svg";

import { LogBox } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/reducers/auth-slice";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const SettingScreen = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const makePhoneCall = () => {
    Linking.openURL("tel:832-512-4528");
  };

  const signOut = () => {
    dispatch(authActions.logout());
    navigation.navigate("Login");
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
          <TouchableOpacity
            style={{ ...styles.Card, marginTop: 170 }}
            onPress={() => Linking.openURL("https://w-groupchats.com")}
          >
            <View style={styles.innerCard}>
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <G fill="none">
                    <Path d="M0 0h24v24H0z" />
                    <Path d="M0 0h24v24H0z" />
                  </G>
                  <Path
                    fill="#FFFFFF"
                    d="M22 9V7h-2v2h-2v2h2v2h2v-2h2V9zM8 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 1c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm4.51-8.95C13.43 5.11 14 6.49 14 8s-.57 2.89-1.49 3.95C14.47 11.7 16 10.04 16 8s-1.53-3.7-3.49-3.95zm4.02 9.78C17.42 14.66 18 15.7 18 17v3h2v-3c0-1.45-1.59-2.51-3.47-3.17z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>invite a friend</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </View>
          </TouchableOpacity>

          <View
            style={{
              ...styles.Card,
              marginTop: 15,
              height: screenWidth * 0.3,
              borderRadius: 20,
            }}
          >
            <TouchableOpacity style={styles.innerCard2} onPress={makePhoneCall}>
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path d="M0 0h24v24H0z" fill="none" />
                  <Path
                    fill="#FFFFFF"
                    d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>call a founder</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.innerCard2}
              onPress={() =>
                Linking.openURL("https://0ezv666sxix.typeform.com/to/A1TUE04W")
              }
            >
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path d="M0 0h24v24H0z" fill="none" />
                  <Path
                    fill="#FFFFFF"
                    d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>report a problem</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.innerCard2}
              onPress={() =>
                Linking.openURL("https://0ezv666sxix.typeform.com/to/pcRAByEO")
              }
            >
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="M17.41 6.59 15 5.5l2.41-1.09L18.5 2l1.09 2.41L22 5.5l-2.41 1.09L18.5 9l-1.09-2.41zm3.87 6.13L20.5 11l-.78 1.72-1.72.78 1.72.78.78 1.72.78-1.72L23 13.5l-1.72-.78zm-5.04 1.65 1.94 1.47-2.5 4.33-2.24-.94c-.2.13-.42.26-.64.37l-.3 2.4h-5l-.3-2.41c-.22-.11-.43-.23-.64-.37l-2.24.94-2.5-4.33 1.94-1.47c-.01-.11-.01-.24-.01-.36s0-.25.01-.37l-1.94-1.47 2.5-4.33 2.24.94c.2-.13.42-.26.64-.37L7.5 6h5l.3 2.41c.22.11.43.23.64.37l2.24-.94 2.5 4.33-1.94 1.47c.01.12.01.24.01.37s0 .24-.01.36zM13 14c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>make a suggestion</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              ...styles.Card,
              marginTop: 15,
              height: screenWidth * 0.2,
              borderRadius: 18,
            }}
          >
            <TouchableOpacity
              style={{ ...styles.innerCard2, height: "50%" }}
              onPress={() => Linking.openURL("https://beacons.ai/w.app")}
            >
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path d="M0 0h24v24H0z" fill="none" />
                  <Path
                    fill="#FFFFFF"
                    d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>follow our socials</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ ...styles.innerCard2, height: "50%" }}
              onPress={() => Linking.openURL("https://w-groupchats.com")}
            >
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path d="M0 0h24v24H0V0z" fill="none" />
                  <Path
                    fill="#FFFFFF"
                    d="m12 8.89.94 3.11h2.82l-2.27 1.62.93 3.01L12 14.79l-2.42 1.84.93-3.01L8.24 12h2.82L12 8.89M12 2l-2.42 8H2l6.17 4.41L5.83 22 12 17.31 18.18 22l-2.35-7.59L22 10h-7.58L12 2z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>drop a rating</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              ...styles.Card,
              marginTop: 15,
              height: screenWidth * 0.2,
              borderRadius: 18,
            }}
          >
            <TouchableOpacity
              style={{ ...styles.innerCard2, height: "50%" }}
              onPress={() =>
                Linking.openURL("https://www.w-groupchats.com/terms")
              }
            >
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path d="M0 0h24v24H0V0z" fill="none" />
                  <Path
                    fill="#FFFFFF"
                    d="M19.5 3.5 18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z"
                  />
                  <Path
                    fill="#FFFFFF"
                    d="M9 7h6v2H9zm7 0h2v2h-2zm-7 3h6v2H9zm7 0h2v2h-2z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>terms and conditions</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ ...styles.innerCard2, height: "50%" }}
              onPress={() =>
                Linking.openURL(
                  "https://www.privacypolicies.com/live/c236401d-27d4-4e2d-904b-508e9495d62b"
                )
              }
            >
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path d="M0 0h24v24H0z" fill="none" />
                  <Path
                    fill="#FFFFFF"
                    d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>privacy policy</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ ...styles.Card, marginTop: 15, marginBottom: 70 }}
            onPress={signOut}
          >
            <View style={styles.innerCard}>
              <View style={styles.innercardleft}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path d="M0 0h24v24H0z" fill="none" />
                  <Path
                    fill="#FFFFFF"
                    d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                  />
                </Svg>
              </View>
              <View style={styles.innercardCenter}>
                <Text style={styles.centerBoxText}>sign out</Text>
              </View>
              <View style={styles.innercardRight}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Path fill="none" d="M0 0h24v24H0z" />
                  <Path
                    fill="#FFFFFF"
                    d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"
                  />
                </Svg>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    flexGrow: 1,
  },
  topContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: screenWidth * 0.9,
    height: screenWidth * 0.2,
    marginTop: 20,
  },
  heading: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "Raleway",
    fontWeight: "bold",
  },
  scrollView: {
    backgroundColor: "black",
  },
  Circle: {
    width: 180,
    height: 180,
    borderRadius: 15,
    backgroundColor: "white",
    marginTop: 60,
  },
  nameText: {
    color: "#ffffff",
    fontSize: 33,
    fontFamily: "Raleway",
    fontWeight: "bold",
    marginTop: 20,
  },
  usernameText: {
    color: "#c2c2c2",
    fontSize: 17,
    fontFamily: "Raleway",
    fontWeight: "bold",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 5,
  },
  universityText: {
    color: "#c2c2c2",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "700",
    lineHeight: 15,
    textAlign: "center",
    marginTop: 10,
  },
  coursesText: {
    color: "#c2c2c2",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 5,
    width: "60%",
  },
  numGroupButton: {
    cursor: "pointer",
    width: screenWidth * 0.3,
    height: screenWidth * 0.1,
    boxSizing: "border-box",
    borderRadius: 25,
    boxShadow: "0px 0px 10px rgba(3,3,3,0.1)",
    backgroundColor: "#232222",
    outline: "none",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  numGroupText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 14,
  },
  Card: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.1,
    backgroundColor: "#1f1e1e",
    borderRadius: 100000,
    display: "flex",
    marginVertical: -5,
  },
  innerCard: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerCard2: {
    width: "100%",
    height: "33%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innercardleft: {
    width: "20%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  innercardCenter: {
    width: "60%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  innercardRight: {
    width: "20%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  Icon: {
    color: "#ffffff",
    fill: "#ffffff",
    width: 14,
    height: 14,
    fontSize: 14,
  },
  centerBoxText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "500",
    lineHeight: 18,
  },
});

export default SettingScreen;
