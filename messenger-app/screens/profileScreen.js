import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  FlatList,
  TextInput,
  Alert,
  Button,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useAxios from "../utils/useAxios";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Svg, { Path } from "react-native-svg";
import { useDispatch } from "react-redux";
import { handleUseffectActions } from "../store/reducers/handleUseffect";
import { handleImageLoadingActions } from "../store/reducers/handleImageLoading";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";

import { LogBox } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { s3 } from "../utils/aws-sdk-config";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ProfileScreen = ({ route }) => {
  const [user_username, setUsername] = useState("");
  const [name, setName] = useState("");

  const [theProfileImage, setProfileImage] = useState(
    "https://assets.api.uizard.io/api/cdn/stream/76560e1c-27c0-49e9-bae9-0c65dfc3e18b.jpeg"
  );
  const [theCoverImage, setCoverImage] = useState(
    "https://assets.api.uizard.io/api/cdn/stream/76560e1c-27c0-49e9-bae9-0c65dfc3e18b.jpeg"
  );

  const [uploadCoverImage, setuploadCoverImage] = useState(
    "https://assets.api.uizard.io/api/cdn/stream/76560e1c-27c0-49e9-bae9-0c65dfc3e18b.jpeg"
  );

  const [refresh, setRefresh] = useState(false);
  const [courses, setCourses] = useState("courses");
  const [numGroups, setNumGroups] = useState(0);
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState("");
  const [albums, setAlbums] = useState([]);
  const [year, setYear] = useState("Sophomore");
  const [major, setMajor] = useState("Computer Science");
  const [tagline, setTagline] = useState("Speed is Intelligence");
  const [fraternity, setFraternity] = useState("Sigma Alpha Epsilon");
  const [themeColor, setThemeColor] = useState("black");
  const [relationship, setRelationship] = useState("Single");
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Theme");
  const [clubs, setClubs] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(5);
  const [theme, setTheme] = useState("");
  const [bio, setBio] = useState("");
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [submitLoading, setsubmitLoading] = useState(false);
  const navigation = useNavigation();
  const api = useAxios();
  const [networkLoad, setnetworkLoad] = useState(false);

  const refreshProfileScreen = useSelector(
    (state) => state.handleUseffect.refreshProfileScreen
  );

  const imageLoadingMap = useSelector(
    (state) => state.handleImageLoading.imageLoadingMap
  );
  const dispatch = useDispatch();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = {
          uri: result.assets[0].uri,
          id: result.assets[0].id || result.assets[0].uri,
          fileName: result.assets[0].fileName,
        };
        setProfileImage(selectedImage);
      }
    } catch (error) {
      console.error("Error selecting image:", error.message);
      Alert.alert("Error in selecting image. Select again");
    }
  };

  const selectImage2 = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = {
          uri: result.assets[0].uri,
          id: result.assets[0].id || result.assets[0].uri,
          fileName: result.assets[0].fileName,
        };
        setuploadCoverImage(selectedImage);
      }
    } catch (error) {
      console.error("Error selecting image:", error.message);
      Alert.alert("Error in selecting image. Select again");
    }
  };

  const handleNetworkError = () => {
    if (!networkLoad) {
      setnetworkLoad(true);
      Alert.alert("Please retry or check your internet connection...");
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
      const response = await api.get(`${baseURL}/api/user/getuserinfo`);
      const profile_data = response.data;
      setName(profile_data.message.name);
      setUsername(profile_data.message.username);
      setProfileImage(profile_data.message.image);
      setCoverImage(profile_data.message.cover_image);
      setCollege(profile_data.message.college);
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: `#${profile_data.message.theme_color}`,
          height: 85,
          paddingTop: 5,
        },
      });
      setThemeColor(`#${profile_data.message.theme_color}`);
      setTheme(profile_data.message.theme);
      setClubs(profile_data.message.clubs);
      setYear(profile_data.message.year);
      setFraternity(profile_data.message.fraternity);
      setMajor(profile_data.message.major);
      setRelationship(profile_data.message.relationship_status);
      setSelectedTheme(profile_data.message.theme);
      setBio(profile_data.message.bio);
      setNumGroups(profile_data.totalGroups);
      setCourses(profile_data.message.courses);
      setAlbums(profile_data.albums);
      setLoading(false);
      setRefresh(false);
    } catch (err) {
      setLoading(false);
      setRefresh(false);
      if (err.response.status === 503) {
        handleNetworkError();
      } else {
        handleNetworkError();
      }
    }
  }, [refreshProfileScreen, refresh]);

  useEffect(() => {
    if (refreshProfileScreen || refresh) {
      getUserInfo();
      dispatch(
        handleUseffectActions.setRefreshProfileScreen({ reload: false })
      );
    }
  }, [refreshProfileScreen, refresh]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const uploadPicturestos3 = async (image) => {
    let imageUrl = "";
    if (!image.uri) {
      return null;
    }
    try {
      setsubmitLoading(true);
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const params = {
        Bucket: "w-groupchat-images",
        Key: `${Date.now()}_${image.fileName}`,
        Body: blob,
        ContentType: image.type || "image/jpeg",
      };
      const s3Response = await s3.upload(params).promise();
      imageUrl = s3Response.Location;
      setsubmitLoading(false);
      return imageUrl;
    } catch (err) {
      console.log(err);
      setsubmitLoading(false);
      Alert.alert("Failed to upload image, please try again.");
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Alert.alert(
          "There might be an issue with your internet connection try again..."
        );
        return;
      }
      setsubmitLoading(true);
      let profile_imageUri = await uploadPicturestos3(theProfileImage);
      if (profile_imageUri) {
        setProfileImage(profile_imageUri);
      }
      let cover_imageUri = await uploadPicturestos3(uploadCoverImage);
      if (cover_imageUri) {
        setCoverImage(cover_imageUri);
      }

      const data = {
        name: name,
        college: college,
        year: year,
        courses: courses === null ? "courses" : courses,
        major: major,
        fraternity: fraternity,
        relationship_status: relationship,
        theme: getThemeImage(selectedTheme),
        theme_color: getThemeColor(selectedTheme),
        clubs: "clubs",
        profile_image: profile_imageUri ? profile_imageUri : theProfileImage,
        cover_image: cover_imageUri ? cover_imageUri : theCoverImage,
        bio: bio,
      };
      const response = await api.post(
        `${baseURL}/api/user/updateUserInfo/`,
        data
      );
      dispatch(
        handleUseffectActions.setRefreshSettingsScreen({ reload: true })
      );
      setRefresh(true);
      setsubmitLoading(false);
      Alert.alert("Your profile info updated successfully");
    } catch (err) {
      setsubmitLoading(false);
      setRefresh(false);
      if (err.response.status === 503) {
        Alert.alert(err.response.data.message);
      } else {
        Alert.alert(err.response.data.message);
      }
    }
  };

  const retryfetch = () => {
    setnetworkLoad(false);
    getUserInfo();
  };

  const getThemeImage = (theme_id) => {
    const theme = sampleThemes.find((theme) => {
      if (theme.id === theme_id) {
        return theme;
      }
    });
    if (theme) {
      return theme.image;
    }
    return theme_id;
  };

  const getThemeColor = (theme_id) => {
    const theme_color = theme_colors.find((theme_color) => {
      if (theme_color.id === theme_id) {
        return theme_color;
      }
    });
    if (theme_color) {
      return theme_color.theme_color;
    }
    return theme_id;
  };

  const sampleThemes = [
    {
      id: 1,
      image:
        "https://assets.api.uizard.io/api/cdn/stream/e16a6e9f-6b62-42cd-a233-9b3620639bd2.jpg",
    },
    {
      id: 2,
      image:
        "https://assets.api.uizard.io/api/cdn/stream/cc9d5d47-209a-4615-84ce-51690fc233e2.jpg",
    },
    {
      id: 3,
      image:
        "https://assets.api.uizard.io/api/cdn/stream/00e8f1ea-1dfd-4d2e-8044-01a182c1e270.jpg",
    },
    {
      id: 4,
      image:
        "https://assets.api.uizard.io/api/cdn/stream/6cf0f545-1049-48e3-acbf-5a58a5fe7f65.jpg",
    },
    {
      id: 5,
      image:
        "https://w0.peakpx.com/wallpaper/469/175/HD-wallpaper-pitch-black-dark-phone-plain-solid-thumbnail.jpg",
    },
  ];

  const theme_colors = [
    { id: 1, theme_color: "451204" },
    { id: 2, theme_color: "1C2E1D" },
    { id: 3, theme_color: "110B25" },
    { id: 4, theme_color: "5e0f49" },
    { id: 5, theme_color: "000000" },
  ];

  const transformDataIntoRows = (data, itemsPerRow) => {
    const rows = [];
    for (let i = 0; i < data.length; i += itemsPerRow) {
      rows.push(data.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const itemsPerRow = 1;
  const rowData = transformDataIntoRows(albums, itemsPerRow);
  const themeRowData = transformDataIntoRows(sampleThemes, itemsPerRow);

  const handleLoadStart = (type, name, value) => {
    const isLoading = imageLoadingMap[`${type}-${name}`] || false;
    if (!isLoading) {
      dispatch(
        handleImageLoadingActions.setImageLoading({
          type: type,
          name: name,
          value: value,
        })
      );
    }
  };

  const handleLoadEnd = (type, name, value) => {
    const isLoading = imageLoadingMap[`${type}-${name}`] || false;
    if (isLoading) {
      dispatch(
        handleImageLoadingActions.setImageLoading({
          type: type,
          name: name,
          value: value,
        })
      );
    }
  };

  const renderAlbumItem = ({ item }) => (
    <View style={{ alignItems: "center", height: 100 }} key={item.id}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => {
          navigation.navigate("Album", { id: item.id });
        }}
      >
        {imageLoadingMap[`profile-album-${item.id}`] === true && (
          <ActivityIndicator></ActivityIndicator>
        )}
        <ImageBackground
          source={{ uri: item.album_cover }}
          style={styles.image}
          imageStyle={styles.imageStyle}
          onLoadStart={() => {
            handleLoadStart("profile", `album-${item.id}`, true);
          }}
          onLoadEnd={() => {
            handleLoadEnd("profile", `album-${item.id}`, false);
          }}
        >
          <View style={styles.albumPhotosNum}>
            <Text style={styles.numPhotosText}>{item.album_photos.length}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  const RadioButton = ({ isSelected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.radioButton}>
      {isSelected ? <View style={styles.radioButtonSelected} /> : null}
    </TouchableOpacity>
  );

  const renderthemeItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedTheme(item.id)} key={item.id}>
      <ImageBackground style={styles.themeOption} source={{ uri: item.image }}>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            isSelected={selectedTheme === item.id}
            onPress={() => setSelectedTheme(item.id)}
          />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderRow = ({ item }) => (
    <View>{item.map((group) => renderAlbumItem({ item: group }))}</View>
  );

  const renderthemeRow = ({ item }) => (
    <View>{item.map((group) => renderthemeItem({ item: group }))}</View>
  );

  return (
    <View>
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
            <View
              style={{
                ...styles.container,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button title="Refresh" onPress={() => retryfetch()}></Button>
            </View>
          ) : loading || submitLoading ? (
            <View
              style={{
                ...styles.container,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator />
            </View>
          ) : (
            <View style={styles.container}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {imageLoadingMap[`profile-coverImage`] === true && (
                  <View
                    style={{
                      marginLeft: "70%",
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
                    handleLoadStart("profile", "coverImage", true);
                  }}
                  onLoadEnd={() => {
                    handleLoadEnd("profile", "coverImage", false);
                  }}
                />
              </View>

              <View style={styles.profileImageContainer}>
                {imageLoadingMap[`profile-profileImage`] === true && (
                  <ActivityIndicator></ActivityIndicator>
                )}
                <Image
                  source={{ uri: theProfileImage }}
                  style={styles.profileImage}
                  onLoadStart={() => {
                    handleLoadStart("profile", "profileImage", true);
                  }}
                  onLoadEnd={() => {
                    handleLoadEnd("profile", "profileImage", false);
                  }}
                />

                <View style={styles.editSection}>
                  <TouchableOpacity
                    style={{
                      ...styles.editButton,
                      backgroundColor: themeColor,
                    }}
                    onPress={toggleModal}
                  >
                    <Text style={styles.editButtonText}>Edit your profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                      backgroundColor: themeColor,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      navigation.navigate("Setting");
                    }}
                  >
                    <Svg width={18} height={18} viewBox="0 0 24 24">
                      <Path fill="none" d="M0 0h24v24H0z" />
                      <Path
                        fill="white"
                        d="M17.41 6.59 15 5.5l2.41-1.09L18.5 2l1.09 2.41L22 5.5l-2.41 1.09L18.5 9l-1.09-2.41zm3.87 6.13L20.5 11l-.78 1.72-1.72.78 1.72.78.78 1.72.78-1.72L23 13.5l-1.72-.78zm-5.04 1.65 1.94 1.47-2.5 4.33-2.24-.94c-.2.13-.42.26-.64.37l-.3 2.4h-5l-.3-2.41c-.22-.11-.43-.23-.64-.37l-2.24.94-2.5-4.33 1.94-1.47c-.01-.11-.01-.24-.01-.36s0-.25.01-.37l-1.94-1.47 2.5-4.33 2.24.94c.2-.13.42-.26.64-.37L7.5 6h5l.3 2.41c.22.11.43.23.64.37l2.24-.94 2.5 4.33-1.94 1.47c.01.12.01.24.01.37s0 .24-.01.36zM13 14c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3z"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.nameBox}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.usernameText}>@{user_username}</Text>
              </View>

              <View style={styles.taglineBox}>
                <Text style={styles.tagline}>{tagline}</Text>
              </View>

              <View style={styles.aboutBox}>
                <Text style={{ ...styles.aboutText, color: "#c7c7c7" }}>
                  About Me
                </Text>
              </View>

              <View
                style={{
                  ...styles.HorizontalDivider,
                  backgroundColor: "white",
                }}
              ></View>

              <View style={styles.detailBox}>
                <Text style={styles.details}>
                  <Text style={{ fontWeight: "bold" }}>College: </Text>{" "}
                  {college}
                </Text>
                <Text style={styles.details}>
                  <Text style={{ fontWeight: "bold" }}>Year: </Text> {year}
                </Text>
                <Text style={styles.details}>
                  <Text style={{ fontWeight: "bold" }}>Major: </Text> {major}
                </Text>
                <Text style={styles.details}>
                  <Text style={{ fontWeight: "bold" }}>Courses: </Text>{" "}
                  {courses}
                </Text>
                <Text style={styles.details}>
                  <Text style={{ fontWeight: "bold" }}>Fraternity: </Text>{" "}
                  {fraternity}
                </Text>
                <Text style={styles.details}>
                  <Text style={{ fontWeight: "bold" }}>Clubs: </Text> Hockey
                  Club, Cheerleading Squad
                </Text>
                <Text style={styles.details}>
                  <Text style={{ fontWeight: "bold" }}>
                    Relationship Status:{" "}
                  </Text>{" "}
                  {relationship}
                </Text>
              </View>

              <View style={styles.albumHeadingbox}>
                <Text style={{ ...styles.aboutText, color: "#c7c7c7" }}>
                  Album
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CreateAlbum");
                  }}
                >
                  <Svg height={24} width={24} viewBox="0 0 24 24" fill="none">
                    <Path d="M0 0h24v24H0z" fill="none" />
                    <Path
                      fill="white"
                      d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  ...styles.HorizontalDivider,
                  backgroundColor: "white",
                }}
              ></View>

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
            </View>
          )}

          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.bottomSheet}>
                <View style={styles.navBar}>
                  <TouchableOpacity onPress={() => setActiveTab("Theme")}>
                    <Text
                      style={[
                        styles.navButton,
                        activeTab === "Theme" && styles.activeButton,
                      ]}
                    >
                      Theme
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setActiveTab("Profile")}>
                    <Text
                      style={[
                        styles.navButton,
                        activeTab === "Profile" && styles.activeButton,
                      ]}
                    >
                      Profile
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setActiveTab("About Me")}>
                    <Text
                      style={[
                        styles.navButton,
                        activeTab === "About Me" && styles.activeButton,
                      ]}
                    >
                      About Me
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleSubmit();
                      toggleModal();
                    }}
                  >
                    <Text style={styles.saveButton}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      toggleModal();
                    }}
                  >
                    <Text style={{ ...styles.saveButton, color: "red" }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.contentSection}>
                  {activeTab === "Profile" && (
                    <View style={styles.profileContainer}>
                      <TouchableOpacity
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => selectImage2()}
                      >
                        {imageLoadingMap["profile-editcoverImage"] && (
                          <ActivityIndicator />
                        )}
                        {/* Apply borderRadius and overflow to this View */}
                        <View
                          style={{
                            borderRadius: 5,
                            overflow: "hidden",
                            width: screenWidth * 0.9,
                          }}
                        >
                          <ImageBackground
                            source={{
                              uri: theCoverImage.uri
                                ? theCoverImage.uri
                                : theCoverImage,
                            }}
                            style={{
                              ...styles.coverImage,
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                            }}
                            onLoadStart={() => {
                              handleLoadStart(
                                "profile",
                                "editcoverImage",
                                true
                              );
                            }}
                            onLoadEnd={() => {
                              handleLoadEnd("profile", "editcoverImage", false);
                            }}
                          >
                            <TouchableOpacity style={{ margin: "2%" }}>
                              <Svg width={20} height={20} viewBox="0 0 24 24">
                                <Path d="M0 0h24v24H0z" fill="none" />
                                <Path
                                  fill="white"
                                  d="M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 1 0 0-6.4z"
                                />
                                <Path
                                  fill="white"
                                  d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                                />
                              </Svg>
                            </TouchableOpacity>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>

                      <View
                        style={{ ...styles.profileImageContainer, top: 100 }}
                      >
                        {imageLoadingMap["profile-editprofileImage"] && (
                          <ActivityIndicator></ActivityIndicator>
                        )}
                        <TouchableOpacity
                          onPress={() => selectImage()}
                          style={{
                            borderRadius: 5,
                            overflow: "hidden",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ImageBackground
                            source={{
                              uri: theProfileImage.uri
                                ? theProfileImage.uri
                                : theProfileImage,
                            }}
                            style={{
                              ...styles.profileImage,
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "flex-end",
                            }}
                            onLoadStart={() => {
                              handleLoadStart(
                                "profile",
                                "editprofileImage",
                                true
                              );
                            }}
                            onLoadEnd={() => {
                              handleLoadEnd(
                                "profile",
                                "editprofileImage",
                                false
                              );
                            }}
                          >
                            <TouchableOpacity
                              style={{ margin: "2%" }}
                              onPress={() => {
                                selectImage();
                              }}
                            >
                              <Svg width={20} height={20} viewBox="0 0 24 24">
                                <Path d="M0 0h24v24H0z" fill="none" />
                                <Path
                                  fill="white"
                                  d="M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 1 0 0-6.4z"
                                />
                                <Path
                                  fill="white"
                                  d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                                />
                              </Svg>
                            </TouchableOpacity>
                          </ImageBackground>
                        </TouchableOpacity>
                      </View>

                      <TextInput
                        style={{ ...styles.input, marginTop: 40 }}
                        placeholder="Margot Robbie"
                        defaultValue="Margot Robbie"
                        value={name}
                        onChangeText={(text) => setName(text)}
                      />

                      <TextInput
                        style={styles.inputMulti}
                        placeholder="Currently in Europe, busy being an island girl"
                        defaultValue="Currently in Europe, busy being an island girl"
                        multiline
                        value={tagline}
                        onChangeText={(text) => setTagline(text)}
                      />
                    </View>
                  )}

                  {activeTab === "Theme" && (
                    <View style={styles.themeContainer}>
                      <View style={styles.themeHeadingContainer}>
                        <Text style={styles.themeHeading}>
                          Pick a theme that represents you.
                        </Text>
                      </View>
                      <FlatList
                        data={themeRowData}
                        renderItem={renderthemeRow}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.albumsList}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>
                  )}

                  {activeTab === "About Me" && (
                    <View style={styles.profileContainer}>
                      <View style={{ ...styles.dropdown, marginTop: 40 }}>
                        <View style={styles.selectionField}>
                          <RNPickerSelect
                            activeItemStyle={{ color: "black" }}
                            onValueChange={(value) => setCollege(value)}
                            items={[
                              {
                                label: "University of Houston-Downtown",
                                value: "University of Houston-Downtown",
                              },
                            ]}
                            placeholder={{
                              label: "Choose a University",
                              value: null,
                              color: "white",
                            }}
                            style={{
                              inputIOS: {
                                color: "white",
                              },
                              inputAndroid: {
                                color: "white",
                              },
                              placeholder: {
                                color: "gray",
                              },
                            }}
                          />
                        </View>
                        <Svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M7 10l5 5 5-5"
                            stroke="gray"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>

                      <View style={styles.dropdown}>
                        <View style={styles.selectionField}>
                          <RNPickerSelect
                            activeItemStyle={{ color: "black" }}
                            onValueChange={(value) => setYear(value)}
                            items={[
                              {
                                label: "Freshmen",
                                value: "Freshmen",
                              },
                              {
                                label: "Sophomore",
                                value: "Sophomore",
                              },
                              {
                                label: "Junior",
                                value: "Junior",
                              },
                              {
                                label: "Senior",
                                value: "Senior",
                              },
                            ]}
                            placeholder={{
                              label: "Year",
                              value: null,
                              color: "white",
                            }}
                            style={{
                              inputIOS: {
                                color: "white",
                              },
                              inputAndroid: {
                                color: "white",
                              },
                              placeholder: {
                                color: "gray",
                              },
                            }}
                          />
                        </View>

                        <Svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M7 10l5 5 5-5"
                            stroke="gray"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>

                      <TextInput
                        value={major}
                        onChangeText={(text) => setMajor(text)}
                        style={styles.input_2}
                        placeholder="Major(s)"
                        placeholderTextColor={"gray"}
                      />

                      <TextInput
                        value={courses}
                        onChangeText={(text) => setCourses(text)}
                        style={styles.input_2}
                        placeholder="Courses"
                        placeholderTextColor={"gray"}
                      />

                      <View style={styles.dropdown}>
                        <View style={styles.selectionField}>
                          <RNPickerSelect
                            activeItemStyle={{ color: "black" }}
                            onValueChange={(value) => setFraternity(value)}
                            items={[
                              {
                                label: "alpha-kappa",
                                value: "alpha-kappa",
                              },
                            ]}
                            placeholder={{
                              label: "Franternity",
                              value: null,
                              color: "white",
                            }}
                            style={{
                              inputIOS: {
                                color: "white",
                              },
                              inputAndroid: {
                                color: "white",
                              },
                              placeholder: {
                                color: "gray",
                              },
                            }}
                          />
                        </View>

                        <Svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M7 10l5 5 5-5"
                            stroke="gray"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>

                      <View style={styles.dropdown}>
                        <View style={styles.selectionField}>
                          <RNPickerSelect
                            activeItemStyle={{ color: "black" }}
                            onValueChange={(value) => setRelationship(value)}
                            items={[
                              {
                                label: "Single",
                                value: "Single",
                              },
                              {
                                label: "In a relationship",
                                value: "In a relationship",
                              },
                              {
                                label: "Situationship",
                                value: "Situationship",
                              },
                            ]}
                            placeholder={{
                              label: "Relationship Status",
                              value: null,
                              color: "white",
                            }}
                            style={{
                              inputIOS: {
                                color: "white",
                              },
                              inputAndroid: {
                                color: "white",
                              },
                              placeholder: {
                                color: "gray",
                              },
                            }}
                          />
                        </View>

                        <Svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M7 10l5 5 5-5"
                            stroke="gray"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.75,
  },
  container: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    flexGrow: 1,
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
    justifyContent: "flex-end",
    alignItems: "flex-end",
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
    backgroundColor: "#391B3E",
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
    width: screenWidth * 0.37,
    height: screenWidth * 0.37,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    marginVertical: 10,
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
    marginRight: 7,
    marginTop: 7,
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
  bottomSheet: {
    backgroundColor: "black",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // This ensures the bottom sheet stays at the bottom
    backgroundColor: "transparent", // Semi-transparent background
  },
  bottomSheet: {
    backgroundColor: "#1f1e1e",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.8, // Set a fixed height for the bottom sheet (adjust as needed)
    // You can set minHeight here if needed:
    // minHeight: 150,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between", // Spaces buttons evenly
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444", // Optional, for dividing line under the nav bar
  },
  navButton: {
    fontSize: 16,
    color: "#C0C0C0", // Light gray for unselected buttons
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  saveButton: {
    fontSize: 16,
    color: "#FFD700", // Bright yellow color for the Save button
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  activeButton: {
    color: "white", // Highlight color for the selected button
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  coverImage: {
    width: screenWidth * 0.9,
    height: 150,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },
  inputMulti: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    height: 100,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    borderColor: "#505050",
    paddingHorizontal: 10,
    width: screenWidth * 0.8,
    height: 40,
    color: "white",
    backgroundColor: "#1f1e1e",
    flexDirection: "row",
    justifyContent: "space-between", // Aligns items to the start (left)
    alignItems: "center", // Keeps items vertically centered
    marginBottom: 20,
  },
  input_2: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    padding: screenWidth * 0.03,
    border: "0",
    boxSizing: "border-box",
    borderRadius: 10,
    backgroundColor: "#1f1e1e",
    borderWidth: 1,
    borderColor: "#505050",
    color: "white",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "500",
    outline: "none",
    marginBottom: 20,
  },
  selectionField: {
    width: "80%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  themeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  themeHeadingContainer: {
    width: screenWidth * 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  themeHeading: {
    color: "#ffffff",
    fontSize: "18px",
    fontFamily: "Raleway",
    fontWeight: 700,
    lineHeight: "22px",
  },
  themeOption: {
    width: screenWidth * 0.9,
    height: 400,
    marginTop: 20,
    marginHorizontal: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  radioButtonContainer: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  radioButton: {
    height: 15,
    width: 15,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  radioButtonSelected: {
    height: 15,
    width: 15,
    borderRadius: 6,
    backgroundColor: "white",
  },
});

export default ProfileScreen;
