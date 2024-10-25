import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  BackHandler,
  AppState,
  Alert,
  Button,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";

import { LogBox } from "react-native";
import useAxios from "../utils/useAxios";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { handleUseffectActions } from "../store/reducers/handleUseffect";
import { Linking } from "react-native";
import io, { Socket } from "socket.io-client";
import * as jwtDecodeModule from "jwt-decode";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const ChatsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [groups, setGroups] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const refreshChats = useSelector(
    (state) => state.handleUseffect.refreshChats
  );
  const refreshEventsScreen = useSelector(
    (state) => state.handleUseffect.refreshEventsScreen
  );
  const [username, setUsername] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [eventLoading, setEventLoading] = React.useState(false);
  const api = useAxios();
  const socket = useRef(null);
  const HOST = baseURL;
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [networkLoad, setnetworkLoad] = useState(false);
  const [loadingImage, setLoadingImage] = useState(new Map());
  const [fetchData, setfetchData] = useState(new Map());
  const networkErrorRef = useRef(false);

  const handlePress = () => {
    navigation.navigate("CreateGroup");
  };

  const getUserName = async () => {
    try {
      let username = await AsyncStorage.getItem("username");
      username = JSON.parse(username);
      setUsername(username);
    } catch (err) {
      setUsername(null);
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  useEffect(() => {
    const connectSocket = () => {
      socket.current = io(HOST, {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
      });

      socket.current.on("connect", () => {
        console.log("connected");
        setIsConnected(true);
        setReconnectAttempts(0);
      });

      socket.current.on("reconnect_attempt", () => {
        setReconnectAttempts((prev) => prev + 1);
        console.log("Reconnecting... Attempt:", reconnectAttempts + 1);
      });

      socket.current.on("reconnect_failed", () => {
        console.log("Reconnect failed");
      });
    };

    connectSocket();

    return () => {
      if (socket.current) {
        console.log("Component is unmounted");
        socket.current.disconnect();
      }
    };
  }, [reconnectAttempts]);

  const handleAddUser = useCallback(() => {
    socket.current.emit("add-user", { username: username });
  }, [username]);

  const handleNetworkError = (fetchEvent, err = null) => {
    setfetchData((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(`${fetchEvent}`, true);
      return newMap;
    });
    if (!networkErrorRef.current) {
      setnetworkLoad(true);
      networkErrorRef.current = true;
      Alert.alert(
        "Something went wrong",
        "Please retry or check your internet connection..."
      );
    }
  };

  const updateMessageSentStatusToDeliver = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("update-messages");
        return;
      }
      const response = await api.get(
        `${baseURL}/api/chats/updatedeliverstatus`
      );
    } catch (err) {
      if (err.response.status === 503) {
        handleNetworkError("update-messages", err);
      } else {
        handleNetworkError("update-messages", err);
      }
    }
  }, []);

  useEffect(() => {
    updateMessageSentStatusToDeliver();
  }, [username]);

  useEffect(() => {
    const handleDisconnect = () => {
      console.log("disconnecting.......");
      setIsConnected(false);
    };

    if (socket.current) {
      if (isConnected) {
        handleAddUser();
      }
      socket.current.on("disconnect", handleDisconnect);
    }

    return () => {
      if (socket.current) {
        socket.current.off("disconnect", handleDisconnect);
      }
    };
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const transformDataIntoRows = (data, itemsPerRow) => {
    const rows = [];
    for (let i = 0; i < data.length; i += itemsPerRow) {
      rows.push(data.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const getGroupsByUser = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("groups");
        return;
      }
      setLoading(true);
      const response = await api.get(`${baseURL}/api/user/getGroupsByUser`);
      setGroups(response.data.message);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        handleNetworkError("groups");
      } else {
        handleNetworkError("groups");
      }
    }
  }, []);

  useEffect(() => {
    if (refreshChats) {
      getGroupsByUser();
      dispatch(handleUseffectActions.setRefreshChats({ reload: false }));
    }
  }, [refreshChats]);

  const getEvents = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("events");
        return;
      }
      setEventLoading(true);
      const response = await api.get(`${baseURL}/api/user/getEventsByUser`);
      setEvents(response.data.message);
      setEventLoading(false);
    } catch (err) {
      setEventLoading(false);
      if (err.response.status === 503) {
        handleNetworkError("events");
      } else {
        handleNetworkError("events");
      }
    }
  }, []);

  useEffect(() => {
    if (refreshEventsScreen) {
      getEvents();
      dispatch(handleUseffectActions.setRefreshEventsScreen({ reload: false }));
    }
  }, [refreshEventsScreen]);

  const getEventDetails = (id) => {
    navigation.navigate("EventDetails", { id });
  };

  useFocusEffect(
    useCallback(() => {
      const handleBackButtonPress = () => {
        if (route.name === "chats") {
          BackHandler.exitApp();
        }
        return true;
      };

      const handleUrl = (event) => {
        const url = event.url;
        const route = url.replace(/.*?:\/\//g, "");
        const screen = route.split("/")[route.split("/").length - 2];
        const groupId = route.split("/")[route.split("/").length - 1];
        if (screen == "group") {
          navigation.navigate("GroupDetails", { id: groupId });
        }
      };

      const urlListener = Linking.addEventListener("url", handleUrl);
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonPress
      );

      return () => {
        backHandler.remove();
        urlListener.remove();
      };
    }, [])
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem} key={item.id}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => getEventDetails(item.id)}
      >
        {loadingImage.get(`event-${item.id}`) === true && (
          <ActivityIndicator></ActivityIndicator>
        )}
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

  useFocusEffect(
    useCallback(() => {
      const handleBackButtonPress = () => {
        if (route.name === "chats") {
          BackHandler.exitApp();
        }
        return true;
      };

      const handleUrl = (event) => {
        const url = event.url;
        const route = url.replace(/.*?:\/\//g, "");
        const screen = route.split("/")[route.split("/").length - 2];
        const groupId = route.split("/")[route.split("/").length - 1];
        if (screen == "group") {
          navigation.navigate("GroupDetails", { id: groupId });
        }
      };

      const urlListener = Linking.addEventListener("url", handleUrl);
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonPress
      );

      return () => {
        backHandler.remove();
        urlListener.remove();
      };
    }, [])
  );

  const itemsPerRow = 1;
  const rowData = transformDataIntoRows(groups, itemsPerRow);
  const eventRowData = transformDataIntoRows(events, itemsPerRow);

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() =>
        navigation.navigate("ChatMessages", {
          id: item.id,
          socket: socket,
          username: username,
        })
      }
      key={item.id}
    >
      {loadingImage.get(`group-${item.id}`) === true && (
        <ActivityIndicator></ActivityIndicator>
      )}
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.image}
        imageStyle={styles.imageStyle}
        onLoadStart={() => {
          setLoadingImage((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(`group-${item.id}`, true);
            return newMap;
          });
        }}
        onLoadEnd={() => {
          setLoadingImage((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(`group-${item.id}`, false);
            return newMap;
          });
        }}
      >
        <View style={styles.groupButton}>
          <Text style={styles.groupName}>{item.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((group) => renderGroupItem({ item: group }))}
    </View>
  );

  const renderEventRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((group) => renderEventItem({ item: group }))}
    </View>
  );

  const retryfetch = () => {
    setnetworkLoad(false);
    networkErrorRef.current = false;
    if (fetchData.get("groups")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set("groups", false);
        return newMap;
      });
      getGroupsByUser();
    }

    if (fetchData.get("events")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set("events", false);
        return newMap;
      });
      getEvents();
    }

    if (fetchData.get("update-messages")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set("update-messages", false);
        return newMap;
      });
      updateMessageSentStatusToDeliver();
    }
  };

  if (networkLoad) {
    return (
      <View
        style={{
          ...styles.container,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title="Refresh"
          onPress={() => {
            retryfetch();
          }}
        ></Button>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.heading}>Groupchats</Text>
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={handlePress}
          >
            <Text style={styles.buttonText}>Create Group</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.groupsListContainer}>
            <ActivityIndicator></ActivityIndicator>
          </View>
        ) : (
          <View style={styles.groupsListContainer}>
            <FlatList
              data={rowData}
              renderItem={renderRow}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.groupsList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomHeading} onPress={()=>{navigation.navigate("Groups")}}>see more...</Text>
        </View>

        <View style={styles.topContainer}>
          <Text style={styles.heading}>Events</Text>
          <TouchableOpacity
            style={{ ...styles.createGroupButton, borderColor: "#f900ff" }}
            onPress={() => {
              navigation.navigate("CreateEvent");
            }}
          >
            <Text style={{ ...styles.buttonText, color: "#f900ff" }}>
              Create Event
            </Text>
          </TouchableOpacity>
        </View>

        {eventLoading ? (
          <View style={styles.groupsListContainer}>
            <ActivityIndicator></ActivityIndicator>
          </View>
        ) : (
          <View
            style={{ ...styles.groupsListContainer, height: screenWidth * 0.8 }}
          >
            <FlatList
              data={eventRowData}
              renderItem={renderEventRow}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.groupsList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        <View style={{ ...styles.bottomContainer, marginTop: -50 }}>
          <Text style={styles.bottomHeading} onPress={() =>{navigation.navigate("Events")}}>see more...</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    flexGrow: 1,
    paddingTop: 100,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: screenWidth * 0.9,
    height: screenWidth * 0.2,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: screenWidth * 0.9,
    height: screenWidth * 0.04,
  },
  heading: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "Raleway",
    fontWeight: "bold",
  },
  bottomHeading: {
    color: "#c2c2c2",
    fontSize: 12,
    fontFamily: "Montserrat",
    fontWeight: 700,
  },
  Button: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "black",
    marginBottom: 20,
  },
  innerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Raleway",
    fontWeight: "500",
    marginLeft: 10,
  },
  groupsListContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: screenWidth * 0.5,
    marginTop: -20,
  },
  groupsList: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 0,
  },
  groupName: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "500",
    textAlign: "center",
  },
  imageContainer: {
    width: screenWidth * 0.44,
    height: screenWidth * 0.44,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    marginVertical: 10,
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
  createGroupButton: {
    width: 100,
    height: 30,
    padding: "0px 8px",
    border: "1px solid #00aeff",
    borderWidth: 1,
    borderColor: "#00aeff",
    boxSizing: "border-box",
    borderRadius: "25px",
    boxShadow: "0px 0px 10px rgba(3,3,3,0.1)",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#00aeff",
    fontSize: 12,
    fontFamily: "Montserrat",
    fontWeight: "500",
    outline: "none",
  },
  groupButton: {
    width: "80%",
    height: 30,
    borderRadius: 15,
    backgroundColor: "#232222",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    opacity: 0.95,
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
});

export default ChatsScreen;
