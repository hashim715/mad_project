// GroupDetailsScreen.js
import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import useAxios from "../utils/useAxios";
import { useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import { Linking } from "react-native";
import { useDispatch } from "react-redux";
import { handleUseffectActions } from "../store/reducers/handleUseffect";
import NetInfo from "@react-native-community/netinfo";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const GroupMembers = ({ route }) => {
  const { id, socket, username } = route.params;
  const navigation = useNavigation();
  const [groupname, setGroupname] = useState("");
  const [numMembers, setNumMembers] = useState(0);
  const [groupMembers, setGroupMembers] = useState([]);
  const [theimageurl, settheImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaveChat, setLeaveChat] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const api = useAxios();
  const dispatch = useDispatch();
  const [networkLoad, setnetworkLoad] = useState(false);
  const [loadingImage, setLoadingImage] = useState(new Map());

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  useEffect(() => {
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
    return () => {
      urlListener.remove();
    };
  }, []);

  const handleNetworkError = () => {
    if (!networkLoad) {
      setnetworkLoad(true);
      Alert.alert(
        "Something went wrong",
        "Please retry or check your internet connection..."
      );
    }
  };

  const getGroupDetails = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError();
        return;
      }
      setLoading(true);
      const response = await api.get(
        `${baseURL}/api/user/getGroupDetails/${id}`
      );
      setGroupname(response.data.group.name);
      setNumMembers(response.data.members.users.length);
      settheImageUrl(response.data.group.image);
      setGroupMembers(response.data.members.users);
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
    getGroupDetails();
  }, [id]);

  const getProfile = (id, socket, username, group_id) => {
    navigation.navigate("UserProfile", {
      id: id,
    });
  };

  const handleLinkShare = async () => {
    try {
      const url = `${baseURL}/api/user/getGroupJoinUrl/${id}`;
      Clipboard.setStringAsync(url);
      Alert.alert("Link Copied", "Your group invite link has been copied!");
      //console.log(url);
    } catch (error) {
      console.error("Error sharing link: ", error);
    }
  };

  const handleQrCode = async () => {
    try {
      const response = await api.get(
        `${baseURL}/api/user/generateQrCode/${id}`
      );
      console.log(response.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLeaveChat = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Alert.alert(
          "Network Error",
          "There might be an issue with your internet connection try again..."
        );
        return;
      }
      setLeaveChat(true);
      const response = await api.post(`${baseURL}/api/user/leaveGroup/${id}/`);
      setLeaveChat(false);
      Alert.alert("Group Left", "You left the group");
      dispatch(handleUseffectActions.setRefreshChats({ reload: true }));
      navigation.navigate("Main", { screen: "chats" });
    } catch (err) {
      setLeaveChat(false);
      if (err.response.status === 503) {
        Alert.alert("Network Error", err.response.data.message);
      } else {
        Alert.alert("Something went wrong", err.response.data.message);
      }
    }
  };

  const retryfetch = () => {
    setnetworkLoad(false);
    getGroupDetails();
  };

  const renderMemberItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.memberCard}
        onPress={() => getProfile(item.id, socket, username, id)}
      >
        <View style={styles.memberInnerLeft}>
          {loadingImage.get(`album-${item.id}`) === true && (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator></ActivityIndicator>
            </View>
          )}

          <Image
            source={{ uri: item.image }}
            style={styles.memberImage}
            onLoadStart={() => {
              setLoadingImage((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.set(`album-${item.id}`, true);
                return newMap;
              });
            }}
            onLoadEnd={() => {
              setLoadingImage((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.set(`album-${item.id}`, false);
                return newMap;
              });
            }}
          />
        </View>

        <View style={styles.memberInnerCenter}>
          <Text style={styles.memberName}>
            <Text>
              {item.name}
              {"\n"}
              <Text style={styles.usernameText}>@{item.username}</Text>
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() =>
            navigation.navigate("ChatMessages", {
              id: id,
              socket: socket,
              username: username,
            })
          }
        >
          <Svg viewBox="0 0 24 24" width={24} height={24}>
            <Path d="M0 0h24v24H0z" fill="none" />
            <Path
              fill="white"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {networkLoad ? (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 150,
          }}
        >
          <Button title="Refresh" onPress={() => retryfetch()}></Button>
        </View>
      ) : loading ? (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 150,
          }}
        >
          <ActivityIndicator></ActivityIndicator>
        </View>
      ) : (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image source={{ uri: theimageurl }} style={styles.groupImage} />
          <Text style={styles.groupName}>{groupname}</Text>
          <Text style={styles.membersText}>{numMembers} members</Text>
          <Text style={styles.membersText}>University of Houston-Downtown</Text>
        </View>
      )}

      {/* <View style={styles.shareContainer}>
        <TouchableOpacity
          style={{ ...styles.leaveButton, borderColor: "#4cd964" }}
          onPress={() => {
            handleLinkShare();
          }}
        >
          <Text style={{ ...styles.buttonText, color: "#4cd964" }}>
            Share the group link
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.leaveButton, borderColor: "#007aff" }}
          onPress={() => {
            handleQrCode();
          }}
        >
          <Text style={{ ...styles.buttonText, color: "#007aff" }}>
            Generate QR code
          </Text>
        </TouchableOpacity>
      </View> */}

      {leaveChat ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={() => {
            handleLeaveChat();
          }}
        >
          <Text style={styles.buttonText}>Leave</Text>
        </TouchableOpacity>
      )}

      <View style={styles.memberHeaderContainer}>
        <Text style={styles.memberHeaderText}>Group Members</Text>
      </View>

      {loading ? (
        <View style={styles.memberListContainer}>
          <ActivityIndicator></ActivityIndicator>
        </View>
      ) : (
        <View style={styles.memberListContainer}>
          <FlatList
            data={groupMembers}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.username}
            contentContainerStyle={styles.memberList}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black",
  },
  topContainer: {
    position: "absolute",
    top: 10,
    left: screenWidth * 0.05,
    display: "flex",
    flexDirection: "row",
    width: screenWidth * 0.95,
    height: screenWidth * 0.3,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  groupImage: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    borderRadius: 10,
    marginTop: 70,
    marginBottom: 10,
  },

  groupName: {
    color: "#ffffff",
    fontSize: 25,
    fontFamily: "Poppins",
    fontWeight: "bold",
    marginTop: 15,
    width: screenWidth * 0.7,
    textAlign: "center",
  },
  leaveButton: {
    backgroundColor: "black",
    borderColor: "#ff3b30",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    borderRadius: 100,
    width: screenWidth * 0.35,
    marginTop: 35,
  },
  buttonText: {
    color: "#ff3b30",
    fontSize: 14,
    fontFamily: "Poppins",
    outline: "none",
  },
  backIcon: {
    width: 25,
    height: 25,
    backgroundColor: "transparent",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  memberListContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 500,
    // marginBottom: 150,
  },
  memberList: {
    width: screenWidth * 0.95,
    //paddingBottom: 200,
    //marginBottom: -100,
    alignItems: "center",
    flexDirection: "column",
    //flexGrow: 1,
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 50000,
    borderWidth: 1,
    borderColor: "white",
  },
  memberName: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "700",
  },
  memberCard: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.2,
    backgroundColor: "transparent",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    marginVertical: 0,
    borderRadius: 15,
  },
  memberInnerLeft: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    height: "100%",
  },
  memberInnerCenter: {
    display: "flex",
    alignItems: "left",
    flexDirection: "column",
    justifyContent: "center",
    width: "50%",
    height: "100%",
  },
  memberInnerRight: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "30%",
    height: "100%",
  },
  memberButton: {
    width: "80%",
    height: "33%",
    borderColor: "yellow",
    backgroundColor: "#232222",
    color: "#fef80e",
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "500",
    borderWidth: 1,
    borderRadius: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  membersText: {
    color: "#c2c2c2",
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "500",
    marginTop: 5,
  },
  usernameText: {
    color: "#c2c2c2",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "700",
    lineHeight: 15,
  },
  shareContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
    height: "12%",
    width: "90%",
  },
  memberHeaderContainer: {
    display: "flex",
    alignItems: "left",
    justifyContent: "center",
    width: "90%",
    height: "10%",
    marginTop: 20,
    marginLeft: 20,
  },
  memberHeaderText: {
    color: "#ffffff",
    fontSize: 21,
    fontFamily: "Raleway",
    fontWeight: "bold",
    lineHeight: 26,
  },
});

export default GroupMembers;
