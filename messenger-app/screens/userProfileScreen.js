import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useAxios from "../utils/useAxios";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Svg, { Path } from "react-native-svg";
import { LogBox } from "react-native";
import NetInfo from "@react-native-community/netinfo";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const UserProfileScreen = ({ route }) => {
  // const { id, socket, username, group_id } = route.params;
  const { id } = route.params;
  const [user_username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [theProfileImage, setProfileImage] = useState(
    "https://assets.api.uizard.io/api/cdn/stream/76560e1c-27c0-49e9-bae9-0c65dfc3e18b.jpeg"
  );
  const [theCoverImage, setCoverImage] = useState("");
  const [courses, setCourses] = useState("");
  const [numGroups, setNumGroups] = useState(0);
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState("");
  const [albums, setAlbums] = useState([]);
  const [year, setYear] = useState("Sophomore");
  const [major, setMajor] = useState("Computer Science");
  const [tagline, setTagline] = useState("Speed is Intelligence");
  const [fraternity, setFraternity] = useState("Sigma Alpha Epsilon");
  const [theme2Color, setTheme2Color] = useState("#d0b9a2");
  const [relationship, setRelationship] = useState("Single");
  const [loadingImage, setLoadingImage] = useState(new Map());
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigation = useNavigation();
  const api = useAxios();
  const [networkLoad, setnetworkLoad] = useState(false);

  const handleNetworkError = () => {
    if (!networkLoad) {
      setnetworkLoad(true);
      Alert.alert(
        "Something went wrong",
        "Please retry or check your internet connection..."
      );
    }
  };

  const getUserInfo = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError();
        return;
      }
      setLoading(true);
      const response = await api.get(
        `${baseURL}/api/user/getUerInfoById/${id}`
      );
      setName(response.data.message.name);
      setUsername(response.data.message.username);
      setProfileImage(response.data.message.image);
      setCoverImage(response.data.message.cover_image);
      setTheme(response.data.message.theme);
      setFraternity(response.data.message.fraternity);
      setYear(response.data.message.year);
      setRelationship(response.data.message.relationship_status);
      setMajor(response.data.message.major);
      setNumGroups(response.data.totalGroups);
      setCourses(response.data.message.courses);
      setCollege(response.data.message.college);
      setAlbums(response.data.albums);
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
    getUserInfo();
  }, [id]);

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

  const retryfetch = () => {
    setnetworkLoad(false);
    getUserInfo();
  };

  const itemsPerRow = 1;
  const rowData = transformDataIntoRows(albums, itemsPerRow);

  const renderAlbumItem = ({ item }) => (
    <View style={{ alignItems: "center", height: 100 }} key={item.id}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => {
          navigation.navigate("Album", {
            id: item.id,
          });
        }}
      >
        {loadingImage.get(item.id) === true && (
          <ActivityIndicator></ActivityIndicator>
        )}
        <ImageBackground
          source={{ uri: item.album_cover }}
          style={styles.image}
          imageStyle={styles.imageStyle}
          onLoadStart={() => {
            setLoadingImage((prevMap) => {
              const newMap = new Map(prevMap);
              newMap.set(item.id, true);
              return newMap;
            });
          }}
          onLoadEnd={() => {
            setLoadingImage((prevMap) => {
              const newMap = new Map(prevMap);
              newMap.set(item.id, false);
              return newMap;
            });
          }}
        >
          <View style={styles.albumPhotosNum}>
            <Text style={styles.numPhotosText}>{item.album_photos.length}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <Text style={styles.albumName}>{item.name}</Text>
    </View>
  );

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((group) => renderAlbumItem({ item: group }))}
    </View>
  );

  return (
    <ImageBackground
      source={{
        uri: theme,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.backgroundOverlay} />

        {networkLoad ? (
          <View style={styles.scrollView}>
            <Button title="Refresh" onPress={() => retryfetch()}></Button>
          </View>
        ) : loading ? (
          <View style={styles.scrollView}>
            <ActivityIndicator />
          </View>
        ) : (
          <SafeAreaView style={styles.scrollView}>
            <View>
              {loadingImage.get(`coverImage`) === true && (
                <View
                  style={{
                    marginLeft: "20%",
                    top: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator></ActivityIndicator>
                </View>
              )}
              <Image
                source={{ uri: theCoverImage }}
                style={styles.Circle}
                onLoadStart={() => {
                  setLoadingImage((prevMap) => {
                    const newMap = new Map(prevMap);
                    newMap.set(`coverImage`, true);
                    return newMap;
                  });
                }}
                onLoadEnd={() => {
                  setLoadingImage((prevMap) => {
                    const newMap = new Map(prevMap);
                    newMap.set(`coverImage`, false);
                    return newMap;
                  });
                }}
              />
            </View>

            <View style={styles.profileImageContainer}>
              {loadingImage.get(`profileImage`) === true && (
                <ActivityIndicator></ActivityIndicator>
              )}
              <Image
                source={{ uri: theProfileImage }}
                style={styles.profileImage}
                onLoadStart={() => {
                  setLoadingImage((prevMap) => {
                    const newMap = new Map(prevMap);
                    newMap.set(`profileImage`, true);
                    return newMap;
                  });
                }}
                onLoadEnd={() => {
                  setLoadingImage((prevMap) => {
                    const newMap = new Map(prevMap);
                    newMap.set(`profileImage`, false);
                    return newMap;
                  });
                }}
              />
            </View>

            <View style={styles.nameBox}>
              <Text style={styles.nameText}>{name}</Text>
              <Text style={styles.usernameText}>@{user_username}</Text>
            </View>

            <View style={styles.taglineBox}>
              <Text style={styles.tagline}>{tagline}</Text>
            </View>

            <View style={styles.aboutBox}>
              <Text style={styles.aboutText}>About Me</Text>
            </View>

            <View style={styles.HorizontalDivider}></View>

            <View style={styles.detailBox}>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>College: </Text> {college}
              </Text>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>Year: </Text> {year}
              </Text>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>Major: </Text> {major}
              </Text>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>Courses: </Text>
                {courses}
              </Text>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>Fraternity: </Text>{" "}
                {fraternity}
              </Text>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>Clubs: </Text> Hockey Club,
                Cheerleading Squad
              </Text>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>
                  Relationship Status:{" "}
                </Text>{" "}
                {relationship}
              </Text>
            </View>

            <View style={styles.albumHeadingbox}>
              <Text style={styles.aboutText}>Album</Text>

              {/* <Svg height={24} width={24} viewBox="0 0 24 24" fill="none">
                <Path d="M0 0h24v24H0z" fill="none" />
                <Path
                  fill="white"
                  d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </Svg> */}
            </View>

            <View style={styles.HorizontalDivider}></View>

            <View style={styles.albumsListContainer}>
              <FlatList
                data={rowData}
                renderItem={renderRow}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.albumsList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.75, // Add opacity here only for the background
  },
  container: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  scrollView: {
    // Remove opacity here so it doesn't affect the children
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Circle: {
    width: screenWidth * 0.9,
    height: 130,
    borderRadius: 5,
    marginTop: 80,
  },
  profileImageContainer: {
    position: "absolute",
    top: 170, // Adjust this value to align the profile image with the cover photo
    alignSelf: "center",
    marginLeft: screenWidth * 0.1,
    width: screenWidth * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileIamgeSection: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: screenWidth * 0.45,
    //backgroundColor: "red"
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginLeft: screenWidth * 0.05,
  },
  nameText: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "bold",
    lineHeight: 30,
    marginTop: 10,
    marginLeft: screenWidth * 0.05,
  },
  usernameText: {
    color: "#c2c2c2",
    fontSize: 15,
    fontFamily: "Montserrat",
    marginLeft: screenWidth * 0.05,
  },
  universityText: {
    color: "#c2c2c2",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 15,
    textAlign: "center",
    marginTop: 10,
  },
  coursesText: {
    color: "#c2c2c2",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 5,
    width: "70%",
    textAlign: "center",
  },
  numGroupButton: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.1,
    borderRadius: 25,
    backgroundColor: "#232222",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  numGroupText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 14,
  },
  editSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: screenWidth * 0.45,
    marginTop: 60,
  },
  editButton: {
    width: 130,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 200,
    // marginTop: 75,
    backgroundColor: "rgba(255,140,0,0.32)",
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Montserrat",
  },
  taglineBox: {
    width: screenWidth * 0.85,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "left",
    marginTop: 10,
  },
  tagline: {
    color: "white",
    fontSize: 15,
    fontFamily: "Helvetica",
    marginLeft: 10,
  },
  aboutBox: {
    width: screenWidth * 0.8,
    borderRadius: 10,
    alignItems: "left",
    marginTop: 5,
  },
  aboutText: {
    color: "#bea2d0",
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    textAlign: "left",
  },
  HorizontalDivider: {
    width: screenWidth * 0.8,
    height: 1,
    backgroundColor: "#bea2d0",
    borderRadius: "2px",
    marginTop: 5,
  },
  detailBox: {
    width: screenWidth * 0.8,
    borderRadius: 10,
    alignItems: "left",
    marginTop: 10,
    flexDirection: "column",
  },
  details: {
    color: "white",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  albumHeadingbox: {
    width: screenWidth * 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  nameBox: {
    width: screenWidth * 0.9,
    height: 50,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "left",
    marginTop: 60,
  },
  albumName: {
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
    borderWidth: 0.8,
    borderColor: "white",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageStyle: {
    borderRadius: 12,
  },
  nunmPhotoContainer: {
    width: 200,
    height: 20,
    justifyContent: "center",
    alignItems: "green",
  },
  albumPhotosNum: {
    width: 30,
    height: 30,
    borderRadius: 1000,
    backgroundColor: "#232222",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 12,
    opacity: 0.95,
    marginRight: 10,
    marginTop: 10,
  },
  albumsListContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: screenWidth * 1.05,
  },
  albumsList: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  numPhotosText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
});

export default UserProfileScreen;


