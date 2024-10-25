import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Button,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useAxios from "../utils/useAxios";
import { useSelector } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { useState, useRef } from "react";
import { useCallback } from "react";
import { Path, Svg } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const DiscoverScreen = () => {
  const navigation = useNavigation();
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const api = useAxios();
  const [username, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPeople, setfilteredPeople] = useState([]);
  const [filteredEvents, setfilteredEvents] = useState([]);
  const [filteredGroups, setfilteredGroups] = useState([]);
  const [mixed, setMixed] = useState([]);
  const [networkLoad, setnetworkLoad] = useState(false);
  const [loadingImage, setLoadingImage] = useState(new Map());
  const selectedMap = new Map();
  selectedMap.set("People", false);
  selectedMap.set("Events", false);
  selectedMap.set("Groups", false);
  const [selectedButton, setSelectedButton] = useState(selectedMap);
  const [fetchData, setfetchData] = useState(new Map());
  const networkErrorRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   if (searchQuery === "") {
  //     getRecentEvents();
  //     getRecentGroups();
  //     getRecentUsers();
  //     getRecentAlbumsAndEvents();
  //   } else {
  //     const lowercasedQuery = searchQuery.toLowerCase();
  //   }
  // }, [searchQuery]);

  const getUserName = async () => {
    try {
      let username = await AsyncStorage.getItem("username");
      username = JSON.parse(username);
      setUserName(username);
    } catch (err) {
      setUserName(null);
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  const handleNetworkError = (fetchEvent) => {
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

  const getRecentUsers = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("users");
        return;
      }
      setLoadingPeople(true);
      const response = await api.get(`${baseURL}/api/user/getRecentUsers`);
      setfilteredPeople(response.data.message);
      setLoadingPeople(false);
    } catch (err) {
      setLoadingPeople(false);
      if (err.response.status === 503) {
        handleNetworkError("users");
      } else {
        handleNetworkError("users");
      }
    }
  };

  const getRecentEvents = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("events");
        return;
      }
      setLoadingEvents(true);
      const response = await api.get(`${baseURL}/api/user/getRecentEvents`);
      setfilteredEvents(response.data.message);
      setLoadingEvents(false);
    } catch (err) {
      setLoadingEvents(false);
      if (err.response.status === 503) {
        handleNetworkError("events");
      } else {
        handleNetworkError("events");
      }
    }
  };

  const getRecentGroups = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("groups");
        return;
      }
      setLoadingGroups(true);
      const response = await api.get(`${baseURL}/api/user/getRecentGroups`);
      setfilteredGroups(response.data.message);
      setLoadingGroups(false);
    } catch (err) {
      setLoadingGroups(false);
      if (err.response.status === 503) {
        handleNetworkError("groups");
      } else {
        handleNetworkError("groups");
      }
    }
  };

  // const getRecentAlbumsAndEvents = async () => {
  //   try {
  //     const state = await NetInfo.fetch();

  //     if (!state.isConnected) {
  //       handleNetworkError("albums");
  //       return;
  //     }
  //     setLoadingAlbums(true);
  //     const response = await api.get(
  //       `${baseURL}/api/user/getMixedEventsAndAlbums`
  //     );
  //     setMixed(response.data.message);
  //     setLoadingAlbums(false);
  //   } catch (err) {
  //     setLoadingAlbums(false);
  //     if (err.response.status === 503) {
  //       handleNetworkError("albums");
  //     } else {
  //       handleNetworkError("albums");
  //     }
  //   }
  // };

  useEffect(() => {
    getRecentEvents();
    getRecentGroups();
    getRecentUsers();
    // getRecentAlbumsAndEvents();
  }, []);

  const getGroupDetails = (id) => {
    navigation.navigate("GroupDetails", { id: id });
  };

  const getEventDetails = (id) => {
    navigation.navigate("EventDetails", { id });
  };

  const getPeopleDetails = (id) => {
    navigation.navigate("UserProfile", {
      id: id,
    });
  };

  const renderGroupItem = ({ item }) => (
    <View style={styles.groupItem} key={`group-${item.id}`}>
      <TouchableOpacity
        style={styles.groupimageContainer}
        onPress={() => getGroupDetails(item.id)}
      >
        {loadingImage.get(`group-${item.id}`) && (
          <ActivityIndicator></ActivityIndicator>
        )}
        <Image
          source={{ uri: item.image }}
          style={styles.groupimageContainer}
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
        />
      </TouchableOpacity>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.GroupMembers}>{item._count.users} members</Text>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem} key={`event-${item.id}`}>
      <TouchableOpacity
        style={styles.eventimageContainer}
        onPress={() => getEventDetails(item.id)}
      >
        {loadingImage.get(`event-${item.id}`) && (
          <ActivityIndicator></ActivityIndicator>
        )}
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.eventimage}
          imageStyle={styles.eventimageStyle}
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
      <View style={styles.eventdetailsBox}>
        <Text style={styles.eventName}>
          {item.name} @ {item.location}
        </Text>

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

  const renderPeopleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.peopleCard}
      onPress={() => getPeopleDetails(item.id)}
      key={`people-${item.id}`}
    >
      <View style={styles.peopleInnerLeft}>
        <Image source={{ uri: item.image }} style={styles.peopleImage} />
      </View>

      <View style={styles.peopleInnerCenter}>
        <Text style={styles.peopleDetails}>{item.name}</Text>
        <Text
          style={{ ...styles.peopleDetails, fontSize: 14, color: "#c2c2c2" }}
        >
          @{item.username}
        </Text>
        {/* <Text style={{...styles.peopleDetails, fontSize:14, color:"#c2c2c2"}}>{item.university}</Text> */}
        <Text
          style={{ ...styles.peopleDetails, fontSize: 14, color: "#c2c2c2" }}
        >
          {item.tagline}
        </Text>
      </View>

      <View style={styles.peopleInnerCenter}></View>
    </TouchableOpacity>
  );

  // const renderMixedItem = ({ item, index }) => {
  //   if (item.type === "event") {
  //     return (
  //       <View style={styles.eventItem} key={index}>
  //         <TouchableOpacity
  //           style={styles.eventimageContainer}
  //           onPress={() => getEventDetails(item.id)}
  //         >
  //           {loadingImage.get(`mixed-event-${item.id}`) && (
  //             <ActivityIndicator></ActivityIndicator>
  //           )}
  //           <ImageBackground
  //             source={{ uri: item.image }}
  //             style={styles.eventimage}
  //             imageStyle={styles.eventimageStyle}
  //             onLoadStart={() => {
  //               setLoadingImage((prevMap) => {
  //                 const newMap = new Map(prevMap);
  //                 newMap.set(`mixed-event-${item.id}`, true);
  //                 return newMap;
  //               });
  //             }}
  //             onLoadEnd={() => {
  //               setLoadingImage((prevMap) => {
  //                 const newMap = new Map(prevMap);
  //                 newMap.set(`mixed-event-${item.id}`, false);
  //                 return newMap;
  //               });
  //             }}
  //           ></ImageBackground>
  //         </TouchableOpacity>
  //         <View style={styles.eventdetailsBox}>
  //           <Text style={styles.eventName}>
  //             {item.name} @ {item.location}
  //           </Text>

  //           <Text style={styles.eventTime}>
  //             {new Date(item.startTime).toLocaleDateString(undefined, {
  //               weekday: "long",
  //               day: "numeric",
  //               month: "short",
  //               year: "numeric",
  //             })}
  //           </Text>

  //           <Text style={styles.eventTime}>
  //             {new Date(item.startTime).toLocaleTimeString(undefined, {
  //               hour: "2-digit",
  //               minute: "2-digit",
  //               hour12: true,
  //             })}
  //             -
  //             <Text style={{ ...styles.eventTime, color: "orange" }}>
  //               {new Date(item.endTime).toLocaleTimeString(undefined, {
  //                 hour: "2-digit",
  //                 minute: "2-digit",
  //                 hour12: true,
  //               })}
  //             </Text>
  //           </Text>
  //         </View>
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View style={{ alignItems: "center", height: 100 }} key={index}>
  //         <TouchableOpacity
  //           style={styles.albumImageContainer}
  //           onPress={() => {
  //             navigation.navigate("Album", { id: item.id });
  //           }}
  //         >
  //           {loadingImage.get(`album-${item.id}`) === true && (
  //             <ActivityIndicator></ActivityIndicator>
  //           )}
  //           <ImageBackground
  //             source={{ uri: item.album_cover }}
  //             style={styles.albumImage}
  //             // imageStyle={styles.imageStyle}
  //             onLoadStart={() => {
  //               setLoadingImage((prevMap) => {
  //                 const newMap = new Map(prevMap);
  //                 newMap.set(`album-${item.id}`, true);
  //                 return newMap;
  //               });
  //             }}
  //             onLoadEnd={() => {
  //               setLoadingImage((prevMap) => {
  //                 const newMap = new Map(prevMap);
  //                 newMap.set(`album-${item.id}`, false);
  //                 return newMap;
  //               });
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 color: "white",
  //                 fontSize: 20,
  //                 fontWeight: "bold",
  //                 alignSelf: "flex-end",
  //                 marginVertical: 10,
  //                 marginHorizontal: 10,
  //                 fontFamily: "Montserrat",
  //               }}
  //             >
  //               @AazarJan
  //             </Text>
  //           </ImageBackground>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }
  // };

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const pressHandle = (buttonName) => {
    setSelectedButton((buttonMap) => {
      const buttonNames = ["Groups", "Events", "People"];
      const filtered_buttonNames = buttonNames.filter(
        (button) => button !== buttonName
      );
      const newMap = new Map(buttonMap);
      newMap.set(`${buttonName}`, !newMap.get(`${buttonName}`));
      filtered_buttonNames.forEach((button) => {
        newMap.set(`${button}`, false);
      });
      return newMap;
    });
  };

  const getRecent = () => {
    getRecentEvents();
    getRecentGroups();
    getRecentUsers();
    // getRecentAlbumsAndEvents();
  };

  const retryfetch = () => {
    setnetworkLoad(false);
    networkErrorRef.current = false;
    if (fetchData.get("users")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set("users", false);
        return newMap;
      });
      getRecentUsers();
    }

    if (fetchData.get("events")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set("events", false);
        return newMap;
      });
      getRecentEvents();
    }

    if (fetchData.get("groups")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set("groups", false);
        return newMap;
      });
      getRecentGroups();
    }

    // if (fetchData.get("albums")) {
    //   setfetchData((prevMap) => {
    //     const newMap = new Map(prevMap);
    //     newMap.set("albums", false);
    //     return newMap;
    //   });
    //   getRecentAlbumsAndEvents();
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getRecent} />
        }
      >
        <View style={styles.topHeadingBox}>
          <Text style={{ ...styles.heading, fontSize: 26, fontWeight: 500 }}>
            aurasky
          </Text>
        </View>

        <View style={styles.topContainer}>
          <Text style={styles.heading}>Hey {username},</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputbox}
              placeholder="What's the move today?"
              placeholderTextColor="gray"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Svg
              viewBox="0 0 24 24"
              height={24}
              width={24}
              style={{ marginLeft: screenWidth * 0.0125 }}
            >
              <Path d="M0 0h24v24H0z" fill="none" />
              <Path
                fill="white"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </Svg>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedButton.get("Events") && {
                backgroundColor: "#d400ac",
                borderColor: "transparent",
              },
            ]}
            onPress={() => pressHandle("Events")}
          >
            <Text style={styles.buttonText}>Events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              selectedButton.get("Groups") && {
                backgroundColor: "#000ecb",
                borderColor: "transparent",
              },
            ]}
            onPress={() => pressHandle("Groups")}
          >
            <Text style={styles.buttonText}>Groupchats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              selectedButton.get("People") && {
                backgroundColor: "#008d0a",
                borderColor: "transparent",
              },
            ]}
            onPress={() => pressHandle("People")}
          >
            <Text style={styles.buttonText}>People</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
          style={[
            styles.button,
            selectedButton.get("Refresh") && {
              backgroundColor: "#008d0a",
              borderColor: "transparent",
            },
          ]}
          onPress={() => getRecent()}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity> */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {networkLoad ? (
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                title="Refresh"
                onPress={() => {
                  retryfetch();
                }}
              ></Button>
            </View>
          ) : (
            <View style={styles.peopleListContainer}>
              {selectedButton.get("People") ? (
                loadingPeople ? (
                  <ActivityIndicator></ActivityIndicator>
                ) : (
                  <FlatList
                    data={filteredPeople}
                    renderItem={renderPeopleItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.peopleList}
                  />
                )
              ) : selectedButton.get("Events") ? (
                loadingEvents ? (
                  <ActivityIndicator></ActivityIndicator>
                ) : (
                  <FlatList
                    data={filteredEvents}
                    renderItem={renderEventItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.peopleList}
                  />
                )
              ) : selectedButton.get("Groups") ? (
                loadingGroups ? (
                  <ActivityIndicator></ActivityIndicator>
                ) : (
                  <FlatList
                    data={filteredGroups}
                    renderItem={renderGroupItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    key={selectedButton}
                    contentContainerStyle={styles.groupList}
                  />
                )
              ) : null}
            </View>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

// !selectedButton.get("Events") &&
//               !selectedButton.get("Groups") &&
//               !selectedButton.get("People") ? (
//                 loadingAlbums ? (
//                   <ActivityIndicator></ActivityIndicator>
//                 ) : (
//                   <View>
//                     <Text style={styles.Popular}>Popular Searches</Text>
//                     <FlatList
//                       data={mixed}
//                       renderItem={renderMixedItem}
//                       keyExtractor={(item, index) => index.toString()}
//                       contentContainerStyle={styles.peopleList}
//                     />
//                   </View>
//                 )
//               )

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  scrollViewContent: {
    alignItems: "center",
  },
  imageContainer: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.5,
    borderRadius: 12,
    resizeMode: "cover",
  },
  heading: {
    color: "#ffffff",
    fontSize: 30,
    fontFamily: "Red Hat Display",
    fontWeight: "bold",
  },
  topContainer: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.1,
    justifyContent: "center",
    alignSelf: "center",
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.9,
    height: screenWidth * 0.5,
  },
  topHeadingBox: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: screenWidth * 0.9,
    height: screenWidth * 0.1,
    alignSelf: "center",
    marginTop: 10,
  },
  inputWrapper: {
    width: "100%",
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
  buttonContainer: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
  button: {
    width: "auto",
    height: 27,
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderColor: "white",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    borderRadius: "100000px",
    backgroundColor: "#030303",
  },
  buttonText: {
    color: "#c1c1c1",
    fontSize: 12,
    fontFamily: "Red Hat Display",
    fontWeight: 500,
    textAlign: "center",
  },
  peopleCard: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.3,
    backgroundColor: "black",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    marginVertical: 5,
    borderRadius: 15,
    alignSelf: "center",
  },
  peopleInnerLeft: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "35%",
    height: "100%",
  },
  peopleInnerCenter: {
    display: "flex",
    alignItems: "left",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "65%",
    height: "70%",
    marginTop: 5,
  },
  peopleListContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "black",
  },
  peopleList: {
    width: screenWidth * 0.95,
    height: "100%",
    paddingBottom: 20,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "column",
    flexGrow: 1,
  },
  peopleImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  peopleDetails: {
    color: "#ffffff",
    fontSize: 17,
    fontFamily: "Red Hat Display",
    fontWeight: "500",
    marginBottom: 5,
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
    marginVertical: 8,
  },
  eventimageContainer: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.6,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 0.8,
    borderColor: "white",
  },
  eventimage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  eventimageStyle: {
    borderRadius: 12,
  },
  eventdetailsBox: {
    width: screenWidth * 0.8,
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
  groupItem: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.55,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginHorizontal: 5,
    marginVertical: 5,
  },
  groupimageContainer: {
    width: "100%",
    height: "80%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  groupName: {
    color: "#ffffff",
    fontSize: 17,
    fontFamily: "Red Hat Display",
    fontWeight: "500",
    lineHeight: "16px",
    textAlign: "center",
  },
  GroupMembers: {
    color: "#c2c2c2",
    fontSize: "10px",
    fontFamily: "Red Hat Display",
    fontWeight: "500",
    lineHeight: "13px",
    textAlign: "center",
  },
  albumImage: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 20,
    resizeMode: "cover",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  albumImageContainer: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 20,
    resizeMode: "cover",
    display: "flex",
    overflow: "hidden",
  },
  Popular: {
    color: "#f8ee04",
    fontSize: 16,
    fontFamily: "Arial",
    fontWeight: "500",
    fontStyle: "italic",
    marginLeft: "5%",
    marginBottom: 10,
  },
});

export default DiscoverScreen;
