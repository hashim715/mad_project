// GroupDetailsScreen.js
import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import useAxios from "../utils/useAxios";
import { handleUseffectActions } from "../store/reducers/handleUseffect";
import { Linking } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const screenWidth = Dimensions.get("window").width;

const GroupDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [groupname, setGroupname] = useState("");
  const [numMembers, setNumMembers] = useState(0);
  const [description, setDescription] = useState("");
  const [theimageurl, settheImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinLoading, setjoinLoading] = useState(false);
  const [isUserexists, setisUserexists] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const [college, setCollege] = useState("");
  const api = useAxios();
  const [networkLoad, setnetworkLoad] = useState(false);
  const [fetchData, setfetchData] = useState(new Map());

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  useFocusEffect(() => {
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

  const handleNetworkError = (fetchEvent) => {
    setfetchData((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(`${fetchEvent}`, true);
      return newMap;
    });
    if (!networkLoad) {
      setnetworkLoad(true);
      Alert.alert(
        "Something went wrong",
        "Please retry or check your internet connection..."
      );
    }
  };

  const checkUserisInTheGroup = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("check_user");
        return;
      }
      setLoading(true);
      const response = await api.get(`${baseURL}/api/user/isUserexists/${id}`);
      setisUserexists(response.data.user);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        handleNetworkError("check_user");
      } else {
        handleNetworkError("check_user");
      }
    }
  }, [id]);

  const getGroupDetails = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("details");
        return;
      }
      setLoading(true);
      const response = await api.get(
        `${baseURL}/api/user/getGroupDetails/${id}`
      );
      setGroupname(response.data.group.name);
      setDescription(response.data.group.description);
      setNumMembers(response.data.members.users.length);
      settheImageUrl(response.data.group.image);
      setCollege(response.data.group.college);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 503) {
        handleNetworkError("details");
      } else {
        handleNetworkError("details");
      }
    }
  }, [id]);

  useEffect(() => {
    checkUserisInTheGroup();
    getGroupDetails();
  }, [id]);

  const handleJoin = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Alert.alert(
          "Network Error",
          "There might be an issue with your internet connection try again..."
        );
        return;
      }
      setjoinLoading(true);
      const response = await api.post(`${baseURL}/api/user/joinGroups/${id}/`);
      dispatch(handleUseffectActions.setRefreshChats({ reload: true }));
      Alert.alert("Success", "You have successfully joined the group");
      setjoinLoading(false);
      navigation.navigate("Main", { screen: "chats" });
    } catch (err) {
      setjoinLoading(false);
      if (err.response.status === 503) {
        Alert.alert("Network Error", err.response.data.message);
      } else {
        Alert.alert("Something went wrong", err.response.data.message);
      }
    }
  };

  const retryfetch = () => {
    setnetworkLoad(false);
    if (fetchData.get("check_user")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set("check_user", false);
        return newMap;
      });
      checkUserisInTheGroup();
    }

    if (fetchData.get("details")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set("details", false);
        return newMap;
      });
      getGroupDetails();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.navigate("Groups")}
      >
        <Svg viewBox="0 0 24 24" width={24} height={24}>
          <Path d="M0 0h24v24H0z" fill="none" />
          <Path
            fill="white"
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </Svg>
      </TouchableOpacity>

      {networkLoad ? (
        <View style={{ display: "flex", alignItems: "center", marginTop: 150 }}>
          <Button
            title="Refresh"
            onPress={() => {
              retryfetch();
            }}
          ></Button>
        </View>
      ) : loading ? (
        <View style={{ display: "flex", alignItems: "center", marginTop: 150 }}>
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
          <View style={styles.descriptionBox}>
            <Text
              style={{
                ...styles.membersText,
                color: "white",
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              Group Description
            </Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
          {joinLoading ? (
            <ActivityIndicator></ActivityIndicator>
          ) : (
            isUserexists === false && (
              <TouchableOpacity style={styles.JoinButton} onPress={handleJoin}>
                <Text style={styles.buttonText}>Join Group</Text>
              </TouchableOpacity>
            )
          )}
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
  groupImage: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    borderRadius: 10,
    marginTop: 100,
    marginBottom: 20,
  },

  groupName: {
    color: "#ffffff",
    fontSize: 30,
    fontFamily: "Poppins",
    fontWeight: "bold",
    marginTop: 15,
  },
  membersText: {
    color: "grey",
    fontSize: 17,
    fontFamily: "Poppins",
    marginTop: 5,
  },
  descriptionBox: {
    backgroundColor: "black",
    width: screenWidth * 0.8,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    textAlign: "left",
    borderColor: "grey",
    borderWidth: 1,
    marginBottom: 50,
  },
  descriptionText: {
    color: "#e6e6e6",
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "500",
    lineHeight: 13,
  },
  JoinButton: {
    backgroundColor: "black",
    borderColor: "yellow",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 100,
    marginBottom: 12,
    marginTop: 30,
    width: screenWidth * 0.5,
    height: screenWidth * 0.1,
  },
  buttonText: {
    color: "yellow",
    fontSize: 14,
    fontFamily: "Poppins",
    outline: "none",
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

export default GroupDetailsScreen;
