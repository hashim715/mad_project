import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Button,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import useAxios from "../utils/useAxios";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { handleUseffectActions } from "../store/reducers/handleUseffect";
import NetInfo from "@react-native-community/netinfo";

const screenWidth = Dimensions.get("window").width;

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setfilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const api = useAxios();
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [networkLoad, setnetworkLoad] = useState(false);
  const [loadingImage, setLoadingImage] = useState(new Map());

  const theImageUrl =
    "https://assets.api.uizard.io/api/cdn/stream/4c6b919c-9607-4823-bc54-78bfc965b099.png";

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  useEffect(() => {
    if (searchQuery === "") {
      setfilteredEvents(events);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setfilteredEvents(
        groups.filter((event) =>
          event.name.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  }, [searchQuery, events]);

  const handleNetworkError = () => {
    if (!networkLoad) {
      setnetworkLoad(true);
      Alert.alert(
        "Something went wrong",
        "Please retry or check your internet connection..."
      );
    }
  };

  const getEvents = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError();
        return;
      }
      setLoading(true);
      const response = await api.get(`${baseURL}/api/user/getEvents`);
      setEvents(response.data.message);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        handleNetworkError();
      } else {
        handleNetworkError();
      }
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, []);

  const handlePress = () => {
    navigation.navigate("Main", {
      screen: "Discover",
    });
  };

  const getDetails = (id) => {
    navigation.navigate("EventDetails", { id });
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const renderEventItem = ({ item }) => (
    // <TouchableOpacity
    //   style={styles.eventCard}
    //   onPress={() => getDetails(item.id)}
    // >
    //   <View style={styles.eventInnerLeft}>
    //     <Image source={{ uri: item.image }} style={styles.eventImage} />
    //   </View>

    //   <View style={styles.eventInnerCenter}>
    //     <Text style={styles.eventName}>{item.name}</Text>

    //     <Text style={styles.eventTime}>
    //       {new Date(item.startTime).toLocaleDateString(undefined, {
    //         weekday: "long",
    //         day: "numeric",
    //         month: "short",
    //         year: "numeric",
    //       })}
    //     </Text>

    //     <Text style={styles.eventTime}>
    //       {new Date(item.startTime).toLocaleTimeString(undefined, {
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         hour12: true,
    //       })}
    //       -
    //       <Text style={{ ...styles.eventTime, color: "orange" }}>
    //         {new Date(item.endTime).toLocaleTimeString(undefined, {
    //           hour: "2-digit",
    //           minute: "2-digit",
    //           hour12: true,
    //         })}
    //       </Text>
    //     </Text>
    //   </View>
    // </TouchableOpacity>
    <View style={styles.eventItem} key={item.id}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => getDetails(item.id)}
      >
        
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.image}
          imageStyle={styles.imageStyle}
          onLoadStart={() => {
            setLoadingImage((prevMap) => {
              const newMap = new Map(prevMap);
              newMap.set(`event-${item.id}`, true);
              return newMap;
            });
          }}
          onLoadEnd={() => {
            setLoadingImage((prevMap) => {
              const newMap = new Map(prevMap);
              newMap.set(`event-${item.id}`, false);
              return newMap;
            });
          }}
        ></ImageBackground>
      </TouchableOpacity>
      <View style={styles.detailsBox}>
        <Text style={styles.eventName}>{item.name}</Text>

        <Text style={styles.eventTime}>
          {new Date(item.startTime).toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>

        <Text style={styles.eventTime}>
          {new Date(item.startTime).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
          -
          <Text style={{ ...styles.eventTime, color: "orange" }}>
            {new Date(item.endTime).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </Text>
      </View>
    </View>

  );

  const retryfetch = () => {
    setnetworkLoad(false);
    getEvents();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={handlePress}>
        <Svg width={30} height={30} viewBox="0 0 320 512">
          <Path
            fill="white"
            d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
          />
        </Svg>
      </TouchableOpacity>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Events</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            navigation.navigate("CreateEvent");
          }}
        >
          <Text style={styles.createButtonText} >Create</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventsListContainer}>
        {networkLoad ? (
          <Button title="Refresh" onPress={() => retryfetch()}></Button>
        ) : loading ? (
          <ActivityIndicator></ActivityIndicator>
        ) : (
          <FlatList
            data={events} // Use filtered groups directly
            renderItem={renderEventItem} // Render individual group items
            keyExtractor={(item) => item.id.toString()} // Ensure unique keys for groups
            numColumns={2} // Two items per row
            // key={selectedButton} // This forces FlatList to re-render when selectedButton changes
            //contentContainerStyle={styles.groupList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    justifyContent: "flex-start",
    alignItems: "center",
    flexGrow: 1,
  },
  scrollViewContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    alignSelf: "center",
    marginTop: 50,
  },
  heading: {
    color: "#ffffff",
    fontSize: 25,
    fontFamily: "Raleway",
    fontWeight: "bold",
    lineHeight: "26px",
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
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: screenWidth * 0.95,
    height: screenWidth * 0.2,
  },
  inputWrapper: {
    width: "65%",
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 3,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 1000,
  },
  inputbox: {
    backgroundColor: "black",
    borderWidth: 0,
    height: "100%",
    fontSize: 15,
    flex: 1,
    marginLeft: 5,
    color: "white",
    fontFamily: "Raleway",
  },
  createButton: {
    backgroundColor: "black",
    borderColor: "#f900ff",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "50%",
    width: "33%",
    borderRadius: 100,
  },
  createText: {
    color: "#f900ff",
    fontSize: 14,
    fontFamily: "Poppins",
    outline: "none",
  },
  eventName: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: "500",
    marginTop: 10,
  },
  eventItem: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  detailsBox: {
    width: screenWidth * 0.44,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: -10,
  },
  eventTime: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Montserrat",
    fontWeight: 700,
    lineHeight: "12px",
    marginTop: 5,
  },
  imageContainer: {
    width: screenWidth * 0.44,
    height: screenWidth * 0.44,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 0.8,
    borderColor: "white",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  imageStyle: {
    borderRadius: 12,
  },
  createButton: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00aeff",
    boxSizing: "border-box",
    borderRadius: "25px",
    backgroundColor: "#000000",
  },
  createButtonText: {
    color: "#00aeff",
    fontSize: 10,
    fontFamily: "Montserrat",
    fontWeight: "500",
  },
  eventsListContainer: {
    flex: 1, // Add this line
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  eventImageContainer: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4, // Define a fixed height or use a dynamic one
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
});

export default EventsScreen;
