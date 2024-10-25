import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import useAxios from "../utils/useAxios";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";

const screenWidth = Dimensions.get("window").width;

const EventDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [eventname, setEventName] = useState("");
  const [startTime, setstartTime] = useState(null);
  const [endTime, setendTime] = useState(null);
  const [eventdescription, setEventDescription] = useState("");
  const [eventlocation, setEventLocation] = useState("");
  const [theimageurl, settheImageUrl] = useState("");
  const api = useAxios();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const [loading, setLoading] = useState(false);
  const [networkLoad, setnetworkLoad] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const handleNetworkError = () => {
    if (!networkLoad) {
      setnetworkLoad(true);
      Alert.alert(
        "Something went wrong",
        "Please retry or check your internet connection..."
      );
    }
  };

  const getEventDetails = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError();
        return;
      }
      setLoading(true);
      const response = await api.get(
        `${baseURL}/api/user/getEventDetails/${id}`
      );
      setEventName(response.data.message.name);
      setstartTime(response.data.message.startTime);
      setendTime(response.data.message.endTime);
      setEventLocation(response.data.message.location);
      setEventDescription(response.data.message.description);
      settheImageUrl(response.data.message.image);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        handleNetworkError();
      } else {
        handleNetworkError();
      }
    }
  }, [id]);

  useEffect(() => {
    getEventDetails();
  }, [id]);

  const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true};

  const retryfetch = () => {
    setnetworkLoad(false);
    getEventDetails();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.navigate("Events")}
      >
        <Svg viewBox="0 0 24 24" width={24} height={24}>
          <Path d="M0 0h24v24H0z" fill="none" />
          <Path
            fill="white"
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </Svg>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image source={{ uri: theimageurl }} style={styles.eventImage} />

      {networkLoad ? (
        <View style={styles.descriptionBox}>
          <Button title="Refresh" onPress={() => retryfetch()}></Button>
        </View>
      ) : loading ? (
        <View style={styles.descriptionBox}>
          <ActivityIndicator></ActivityIndicator>
        </View>
      ) : (
        <View style={styles.descriptionBox}>
          <Text style={styles.eventName}>{eventname}</Text>

            {/* Date Display */}
            <Text style={styles.descriptionText}>
              <Text style={{ fontWeight: "bold" }}>Date:</Text>{" "}
              {startTime && new Date(startTime).toLocaleDateString(undefined, dateOptions)}
            </Text>

            {/* Time Display */}
            <Text style={styles.descriptionText}>
              <Text style={{ fontWeight: "bold" }}>Time:</Text>{" "}
              {startTime && new Date(startTime).toLocaleTimeString(undefined, timeOptions)} -{" "}
              {endTime && new Date(endTime).toLocaleTimeString(undefined, timeOptions)}
            </Text>

            {/* Location */}
            <Text style={styles.descriptionText}>
              <Text style={{ fontWeight: "bold" }}>Location:</Text> {eventlocation}
            </Text>

            {/* Description */}
            <Text style={styles.descriptionText}>{eventdescription}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    flexGrow: 1,
  },
  scrollView: {
    paddingBottom: 20, // Add padding to make scrolling smoother
    alignItems: "center",
  },
  eventImage: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 10,
    marginTop: 80,
  },
  eventName: {
    color: "#ffffff",
    fontSize: 35,
    fontFamily: "Poppins",
    fontWeight: "700",
    marginBottom: 20,
  },
  descriptionBox: {
    backgroundColor: "black",
    width: screenWidth * 0.9,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    textAlign: "left",
    borderColor: "grey",
    borderWidth: 0,
    marginTop: 30,
    marginLeft: "5%",
  },
  descriptionText: {
    color: "#c2c2c2",
    fontSize: 17,
    fontFamily: "Poppins",
    fontWeight: "500",
    textAlign: "left",
    width: screenWidth * 0.8,
    marginVertical: 5,
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
});

export default EventDetailsScreen;
