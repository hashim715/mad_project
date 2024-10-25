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
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import useAxios from "../utils/useAxios";
import { useSelector, useDispatch } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { handleUseffectActions } from "../store/reducers/handleUseffect";

const screenWidth = Dimensions.get("window").width;

const GroupsScreen = () => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const baseURL = useSelector((state) => state.baseUrl.url);
  const api = useAxios();
  const dispatch = useDispatch();
  const refreshGroupsScreen = useSelector(
    (state) => state.handleUseffect.refreshGroupsScreen
  );
  const [networkLoad, setnetworkLoad] = useState(false);
  const [loadingImage, setLoadingImage] = useState(new Map());

  const theImageUrl =
    "https://assets.api.uizard.io/api/cdn/stream/8ef6e940-755d-4bc2-aaeb-1ca5c5d0571b.png";

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

  const getGroups = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError();
        return;
      }
      setLoading(true);
      const response = await api.get(`${baseURL}/api/user/getGroups`);
      setGroups(response.data.message);
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

  // useEffect(() => {
  //   if (refreshGroupsScreen) {
  //     getGroups();
  //     dispatch(handleUseffectActions.setRefreshGroupsScreen({ reload: false }));
  //   }
  // }, [refreshGroupsScreen]);

  useEffect(() => {
    getGroups();
  }, []);

  const handlePress = () => {
    navigation.navigate("Main", { screen: "chats" });
  };

  const getDetails = (id) => {
    navigation.navigate("GroupDetails", { id: id });
  };

  // const renderGroupItem = ({ item }) => (
  //   <View style={styles.groupCard}>
  //     <View style={styles.groupInnerLeft}>
  //       <Image source={{ uri: item.image }} style={styles.groupImage} />
  //     </View>

  //     <View style={styles.groupInnerCenter}>
  //       <Text style={styles.groupName}>{item.name}</Text>
  //       {/* <Text style={styles.membersText}>0 members</Text> */}
  //     </View>

  //     <View style={styles.groupInnerRight}>
  //       <TouchableOpacity
  //         style={styles.groupButton}
  //         onPress={() => getDetails(item.id)}
  //       >
  //         <Text style={{ color: "yellow" }}>view</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => getDetails(item.id)}
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

  const retryfetch = () => {
    setnetworkLoad(false);
    getGroups();
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
        <Text style={styles.heading}>
          Groupchats
        </Text>
        <TouchableOpacity style={styles.createButton} onPress={()=>{navigation.navigate("CreateGroup")}}>
          <Text style={styles.createButtonText} >Create</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.groupsListContainer}>
        {networkLoad ? (
          {/* <Button title="Refresh" onPress={() => retryfetch()}></Button> */}
        ) : loading ? (
          <ActivityIndicator></ActivityIndicator>
        ) : (
          <FlatList
            data={groups} // Use filtered groups directly
            renderItem={renderGroupItem} // Render individual group items
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
  imageContainer: {
    width: screenWidth,
    height: screenWidth * 0.5,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    alignSelf: "center",
    marginTop: 50
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
  groupName: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "700",
    marginLeft: 10,
  },
  groupButton: {
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
  heading:{
    color: '#ffffff',
    fontSize: 25,
    fontFamily: 'Raleway',
    fontWeight: 'bold',
    lineHeight: '26px',
  },
  createButton:{
    width:100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00aeff',
    boxSizing: 'border-box',
    borderRadius: '25px',
    backgroundColor: '#000000',
  },
  createButtonText:{
    color: '#00aeff',
    fontSize: 10,
    fontFamily: 'Montserrat',
    fontWeight: '500',
  },
  groupItem: {
    width: screenWidth * 0.40,
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
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  groupName: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "500",
    textAlign: "center",
  },
  GroupMembers:{
    color: '#c2c2c2',
    fontSize: '10px',
    fontFamily: 'Red Hat Display',
    fontWeight: '500',
    lineHeight: '13px',
    textAlign: 'center',
  },
  groupsListContainer: {
    flex: 1,  // Add this line
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  groupButton:{
    width: screenWidth * 0.40,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#232222",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    opacity: 0.95,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  imageStyle: {
    width: screenWidth * 0.40,
    height: screenWidth * 0.40, // Define a fixed height or use a dynamic one
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  imageContainer: {
    width: screenWidth * 0.44,
    height: screenWidth * 0.44,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    marginVertical: 10,
    
  },
});

export default GroupsScreen;
