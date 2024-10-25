import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
  Keyboard,
  KeyboardAvoidingViewBase,
  TouchableWithoutFeedback,
  BackHandler,
  ActivityIndicator,
  Button,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import useAxios from "../utils/useAxios";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useSelector } from "react-redux";
import { s3 } from "../utils/aws-sdk-config";
import NetInfo from "@react-native-community/netinfo";
import { ImageCompressor } from "react-native-compress-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const ChatMessagesScreen = ({ route }) => {
  const { id, socket, username } = route.params;
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [groupname, setGroupname] = useState("");
  const [imageSaving, setImageSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const lineHeight = 20;
  const maxLines = 3;
  const maxHeight = lineHeight * maxLines;
  const api = useAxios();
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [theimageurl, settheImageUrl] = useState("");
  const [numMembers, setNumMembers] = useState(0);
  const [groupmembers, setGroupMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [messageGoing, setMessageGoing] = useState(false);
  const [loadingImage, setLoadingImage] = useState(new Map());
  const [networkLoad, setnetworkLoad] = useState(false);
  const [fetchData, setfetchData] = useState(new Map());
  const networkErrorRef = useRef(false);

  const handleContentSizeChangeText = (e) => {
    const newHeight = e.nativeEvent.contentSize.height;
    setInputHeight(Math.min(maxHeight, newHeight));
  };

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

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

  const getGroupDetails = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("details");
        return;
      }
      setLoading(true);
      let details = await AsyncStorage.getItem(`group_details_${id}`);
      if (details) {
        details = JSON.parse(details);
        setGroupname(details.group.name);
        setNumMembers(details.members.users.length);
        settheImageUrl(details.group.image);
        setGroupMembers(details.members.users);
      } else {
        const response = await api.get(
          `${baseURL}/api/user/getGroupDetails/${id}`
        );
        setGroupname(response.data.group.name);
        setNumMembers(response.data.members.users.length);
        settheImageUrl(response.data.group.image);
        setGroupMembers(response.data.members.users);
        try {
          await AsyncStorage.setItem(
            `group_details_${id}`,
            JSON.stringify(response.data)
          );
        } catch (storageError) {
          handleNetworkError("details");
          return;
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleLeftRoom();
      if (err.response.status === 503) {
        handleNetworkError("details");
      } else {
        handleNetworkError("details");
      }
    }
  }, [id]);

  const handleJoinRoom = useCallback(() => {
    socket.current.emit("join-room", {
      groupID: id,
      username: username,
    });
  }, [username, id]);

  const handleLeftRoom = useCallback(() => {
    socket.current.emit("leave-room", {
      groupID: id,
      username: username,
    });
  }, [username, id]);

  useFocusEffect(
    useCallback(() => {
      const handleMessage = async (msg) => {
        if (username !== msg.sender) {
          setMessages((prevMessages) => [...prevMessages, msg]);

          let messages_async = await AsyncStorage.getItem(`messages_${id}`);
          if (messages_async) {
            messages_async = JSON.parse(messages_async);
            messages_async.push(msg);
            try {
              await AsyncStorage.setItem(
                `messages_${id}`,
                JSON.stringify(messages_async)
              );
            } catch (storageError) {
              await AsyncStorage.removeItem(`messages_${id}`);
            }
          }
        }
      };

      const handleDisconnect = () => {
        console.log("disconnecting from room.......");
        navigation.navigate("Main", { screen: "chats" });
      };

      if (socket.current) {
        socket.current.on("message", handleMessage);
        socket.current.on("disconnect", handleDisconnect);
      }

      // Clean up the event listener when the component unmounts
      return () => {
        socket.current.off("message", handleMessage);
        socket.current.off("disconnect", handleDisconnect);
      };
    }, [username, id])
  );

  useEffect(() => {
    handleJoinRoom();
  }, [username, id]);

  const getUserMessages = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError("messages");
        return;
      }
      setMessageLoading(true);
      let messages_async = await AsyncStorage.getItem(`messages_${id}`);
      if (messages_async) {
        setMessages(JSON.parse(messages_async));
      } else {
        const response = await api.get(
          `${baseURL}/api/chats/getMessagesByGroup/${id}`
        );
        setMessages(response.data.message);
        try {
          await AsyncStorage.setItem(
            `messages_${id}`,
            JSON.stringify(response.data.message)
          );
        } catch (storageError) {
          handleNetworkError("messages");
          return;
        }
      }
      setMessageLoading(false);
    } catch (err) {
      setMessageLoading(false);
      if (err.response.status === 503) {
        handleNetworkError("messages");
      } else {
        handleNetworkError("messages");
      }
    }
  }, [id]);

  useEffect(() => {
    getGroupDetails();
    getUserMessages();
  }, [id]);

  const retryfetch = () => {
    setnetworkLoad(false);
    networkErrorRef.current = false;
    if (fetchData.get("details")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(`details`, false);
        return newMap;
      });
      getGroupDetails();
    }

    if (fetchData.get("messages")) {
      setfetchData((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(`messages`, false);
        return newMap;
      });
      getUserMessages();
    }
  };

  const compressImage = async (imageUri) => {
    try {
      const compressedImageUri = await ImageCompressor.compress(imageUri, {
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 600,
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Image uploding", "Image uploading failed try again..");
    }
  };

  const uploadImagesToS3 = async (images) => {
    let imageUrls = [];
    try {
      setImageUploading(true);
      for (const image of images) {
        const response = await fetch(image.uri);
        const blob = await response.blob();

        const params = {
          Bucket: "w-groupchat-images",
          Key: `${Date.now()}_${image.fileName}`,
          Body: blob,
          ContentType: image.type || "image/jpeg",
        };

        const s3Response = await s3.upload(params).promise();
        imageUrls.push(s3Response.Location);
      }
      setImageUploading(false);
      return imageUrls;
    } catch (err) {
      console.error(err);
      setImageUploading(false);
      Alert.alert(
        "Error in Image Uploading",
        "Network error may have occurred, please try again."
      );
      return null;
    }
  };

  const handleSubmit = async (type, images = null) => {
    setMessageGoing(true);
    if (socket.current) {
      let messages_async = await AsyncStorage.getItem(`messages_${id}`);
      if (type === "text" && message.length > 0 && message.trim() !== "") {
        const complete_message = {
          message: message,
          sender: username,
          group_id: id,
          timeStamp: new Date(),
          type: "text",
        };
        socket.current.emit("message", complete_message);
        setMessages((prevMessages) => [...prevMessages, complete_message]);
        if (messages_async) {
          messages_async = JSON.parse(messages_async);
          messages_async.push(complete_message);
          try {
            await AsyncStorage.setItem(
              `messages_${id}`,
              JSON.stringify(messages_async)
            );
          } catch (storageError) {
            await AsyncStorage.removeItem(`messages_${id}`);
          }
        }
        setMessage("");
      } else {
        let complete_message_locally = {
          message: message,
          sender: username,
          group_id: id,
          timeStamp: new Date(),
          type: "image",
          images: images.map((image) => image.uri),
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          complete_message_locally,
        ]);

        const recentIndex = messages.length;
        const imageUrls = await uploadImagesToS3(images);

        if (imageUrls !== null) {
          let complete_message = {
            message: message,
            sender: username,
            group_id: id,
            timeStamp: new Date(),
            type: "image",
            images: imageUrls,
          };
          if (messages_async) {
            messages_async = JSON.parse(messages_async);
            messages_async.push(complete_message);
            try {
              await AsyncStorage.setItem(
                `messages_${id}`,
                JSON.stringify(messages_async)
              );
            } catch (storageError) {
              await AsyncStorage.removeItem(`messages_${id}`);
            }
          }
          socket.current.emit("message", complete_message);
        } else {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.splice(recentIndex, 1);
            return updatedMessages;
          });
        }
      }
    }
    setMessageGoing(false);
  };

  useFocusEffect(
    useCallback(() => {
      const handleBackButtonPress = () => {
        handleLeftRoom();
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonPress
      );

      return () => backHandler.remove();
    }, [])
  );

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  };

  const closeImageModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    // Request permissions to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissions",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch the image picker and allow multiple selections
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Enable multiple image selection
      quality: 1, // Keep the quality as high as possible
    });

    // If the user didn't cancel the selection, handle the selected images
    if (!result.canceled && result.assets.length > 0) {
      await handleSubmit("image", result.assets);
      console.log("I am image uploaded");
    }
  };

  const saveImageToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You need to allow permission to save images."
        );
        return;
      }

      setImageSaving(true);
      const fileUri =
        FileSystem.documentDirectory + selectedImage.split("/").pop();
      await FileSystem.downloadAsync(selectedImage, fileUri);

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Downloaded Images", asset, false);
      setImageSaving(false);
      Alert.alert("Success", "Image saved to gallery!");
      closeImageModal();
    } catch (error) {
      console.error("Error saving image:", error);
      setImageSaving(false);
      Alert.alert("Error", "Failed to save the image.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust the offset if needed
      >
        {loading ? (
          <View style={styles.ImageContainer}>
            <ActivityIndicator></ActivityIndicator>
          </View>
        ) : (
          <View style={styles.ImageContainer}>
            <ImageBackground source={{ uri: theimageurl }} style={styles.Image}>
              <View style={styles.overlay} />
              <View style={styles.hedaingBox}>
                <Text style={styles.companyName}>{groupname}</Text>
                <Text style={styles.membersText}>{numMembers} members</Text>
              </View>
            </ImageBackground>
          </View>
        )}

        <TouchableOpacity
          style={styles.backIconBox}
          onPress={() => {
            handleLeftRoom();
            navigation.navigate("Main", { screen: "chats" });
          }}
        >
          <Svg width={20} height={20} viewBox="0 0 320 512">
            <Path
              fill="white"
              d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
            />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailIcon}
          onPress={() => {
            navigation.navigate("GroupMembers", {
              id: id,
              socket: socket,
              username: username,
            });
          }}
        >
          <Svg style={styles.Icon} viewBox="0 0 24 24" width={30} height={30}>
            <Path d="M0 0h24v24H0z" fill="none" />
            <Path
              fill="white"
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </Svg>
        </TouchableOpacity>

        {networkLoad ? (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: "black",
              justifyContent: "flex-end",
              width: "95%",
              marginLeft: "2.5%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onContentSizeChange={handleContentSizeChange}
          >
            <Button
              title="Refresh"
              onPress={() => {
                retryfetch();
              }}
            ></Button>
          </ScrollView>
        ) : messageLoading ? (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: "black",
              justifyContent: "flex-end",
              width: "95%",
              marginLeft: "2.5%",
            }}
            onContentSizeChange={handleContentSizeChange}
          >
            <ActivityIndicator
              style={{ paddingBottom: 20 }}
            ></ActivityIndicator>
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: "black",
              justifyContent: "flex-end",
              width: "95%",
              marginLeft: "2.5%",
            }}
            onContentSizeChange={handleContentSizeChange}
          >
            {messages.map((item, index) => {
              if (item.type === "text") {
                return (
                  <Pressable
                    key={index}
                    style={[
                      item.sender === username
                        ? {
                            alignSelf: "flex-end",
                            backgroundColor: "black",
                            padding: 8,
                            maxWidth: "90%",
                            borderRadius: 7,
                            margin: 3,
                          }
                        : {
                            alignSelf: "flex-start",
                            backgroundColor: "black",
                            padding: 8,
                            margin: 3,
                            borderRadius: 7,
                            maxWidth: "90%",
                          },
                    ]}
                  >
                    <View style={styles.senderDetails}>
                      <Image
                        source={{
                          uri: groupmembers.find(
                            (member) => member.username === item.sender
                          )?.image,
                        }}
                        style={styles.senderImage}
                      />
                      <Text style={styles.senderName}>
                        {item.sender === username ? "You" : item.sender}
                      </Text>

                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: 9,
                          color: "gray",
                          marginTop: -15,
                          marginLeft: 10,
                        }}
                      >
                        {formatTime(item.timeStamp)}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "white",
                        // textAlign: isSelected ? "right" : "left",
                        marginLeft: 45,
                        marginTop: -22,
                      }}
                    >
                      {item?.message}
                    </Text>
                  </Pressable>
                );
              } else {
                return (
                  <Pressable
                    key={index}
                    style={[
                      item.sender === username
                        ? {
                            alignSelf: "flex-end",
                            backgroundColor: "black",
                            padding: 8,
                            // maxWidth: "90%",
                            borderRadius: 7,
                            // margin: -3,
                          }
                        : {
                            alignSelf: "flex-start",
                            backgroundColor: "black",
                            padding: 8,
                            borderRadius: 7,
                            // maxWidth: "90%",
                            // margin:-3,
                          },
                    ]}
                  >
                    <View>
                      <View style={styles.senderDetails}>
                        <Image
                          source={{
                            uri: groupmembers.find(
                              (member) => member.username === item.sender
                            )?.image,
                          }}
                          style={styles.senderImage}
                        />
                        <Text style={styles.senderName}>
                          {item.sender === username ? "You" : item.sender}
                        </Text>

                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: 9,
                            color: "gray",
                            marginTop: -15,
                            marginLeft: 10,
                          }}
                        >
                          {formatTime(item.timeStamp)}
                        </Text>
                      </View>

                      <View
                        style={{
                          ...styles.imageGrid,
                          marginLeft: 45,
                          marginTop: -22,
                        }}
                      >
                        {item.images &&
                          item.images.map((uri, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                onPress={() => openImageModal(uri)}
                              >
                                {loadingImage.get(index) === true && (
                                  <ActivityIndicator></ActivityIndicator>
                                )}
                                <Image
                                  source={{ uri: uri }}
                                  style={{
                                    width: 100,
                                    height: 100,
                                    margin: 2,
                                    borderRadius: 10,
                                  }}
                                  resizeMode="cover"
                                  onLoadStart={() => {
                                    setLoadingImage((prevMap) => {
                                      const newMap = new Map(prevMap);
                                      newMap.set(index, true);
                                      return newMap;
                                    });
                                  }}
                                  onLoadEnd={() => {
                                    setLoadingImage((prevMap) => {
                                      const newMap = new Map(prevMap);
                                      newMap.set(index, false);
                                      return newMap;
                                    });
                                  }}
                                />
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </View>
                  </Pressable>
                );
              }
            })}
          </ScrollView>
        )}

        {isModalVisible && (
          <Modal visible={isModalVisible}>
            <SafeAreaView style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.backIcon_2}
                onPress={() => {
                  setIsModalVisible(false);
                }}
              >
                <Svg viewBox="0 0 24 24" width={24} height={24}>
                  <Path d="M0 0h24v24H0z" fill="none" />
                  <Path
                    fill="white"
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fullImageContainer}
                onPress={closeImageModal}
              >
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {imageSaving ? (
                <View style={styles.saveButtonContainer}>
                  <ActivityIndicator></ActivityIndicator>
                </View>
              ) : (
                <View style={styles.saveButtonContainer}>
                  <Pressable onPress={saveImageToGallery}>
                    <Svg width={24} height={24} viewBox="0 0 24 24">
                      <Path fill="none" d="M0 0h24v24H0z" />
                      <Path
                        fill="white"
                        d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"
                      />
                    </Svg>
                  </Pressable>
                </View>
              )}
            </SafeAreaView>
          </Modal>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          {imageUploading ? (
            <ActivityIndicator></ActivityIndicator>
          ) : (
            <Pressable onPress={pickImage}>
              <Svg
                viewBox="0 0 24 24"
                style={{ marginRight: 10 }}
                width={24} // Optional: specify width
                height={24} // Optional: specify height
              >
                <Path d="M0 0h24v24H0z" fill="none" />
                <Path
                  fill="white"
                  d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4 2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"
                />
              </Svg>
            </Pressable>
          )}

          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.inputbox,
                      { height: Math.max(40, inputHeight) },
                    ]} // Dynamic height with max limit
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    placeholderTextColor="gray"
                    multiline={true}
                    onContentSizeChange={handleContentSizeChangeText} // Update height
                  />

                  <Pressable
                    onPress={() => handleSubmit("text")}
                    disabled={messageGoing ? true : false}
                  >
                    <Svg
                      viewBox="0 0 512 512"
                      width={20} // Optional: set default width
                      height={20} // Optional: set default height
                    >
                      <Path
                        d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"
                        fill="white" // Optional: set default color
                      />
                    </Svg>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    width: screenWidth,
    height: screenWidth * 0.2,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  hedaingBox: {
    display: "flex",
    width: screenWidth * 0.8,
    height: screenWidth * 0.2,
    justifyContent: "center",
    alignItems: "left",
    marginLeft: screenWidth * 0.1,
  },
  Image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backIcon_2: {
    position: "absolute",
    top: screenWidth * 0.15,
    left: screenWidth * 0.02,
    backgroundColor: "transparent",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backIconBox: {
    position: "absolute",
    top: screenWidth * 0.06,
    left: screenWidth * 0.02,
    backgroundColor: "transparent",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  detailIcon: {
    position: "absolute",
    top: screenWidth * 0.06,
    right: screenWidth * 0.02,
    width: 25,
    height: 25,
    backgroundColor: "transparent",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  companyName: {
    color: "white",
    fontSize: 17,
    fontFamily: "Poppins",
    fontWeight: "bold",
    lineHeight: 23,
    textAlign: "left",
    marginLeft: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.5, // 50% opacity for the image
  },
  membersText: {
    color: "#c2c2c2",
    fontSize: 15,
    fontFamily: "Poppins",
    marginTop: -3,
    marginLeft: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: screenWidth * 0.85,
    //height: screenWidth * 0.2,
  },
  inputWrapper: {
    width: "100%",
    //height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 3,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
  },
  inputbox: {
    backgroundColor: "black",
    borderWidth: 0,
    //height: '100%',
    fontSize: 15,
    padding: 8,
    flex: 1,
    marginLeft: 5,
    lineHeight: 20,
    color: "white",
    fontFamily: "Raleway",
  },
  senderDetails: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: -5,
    marginBottom: 5,
  },
  senderName: {
    color: "#fef80e",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "bold",
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -15,
  },
  senderImage: {
    width: 35,
    height: 35,
    borderRadius: 100000,
    borderWidth: 2,
    borderColor: "white",
    marginLeft: 5,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: -5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
  },
  fullImage: {
    width: "100%",
    height: "90%",
    aspectRatio: 1, // Ensure the image maintains its aspect ratio
  },
  fullImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 10, // Optional padding to ensure the image isn't touching the edges
  },
  saveButtonContainer: {
    padding: 20,
    backgroundColor: "transparent",
    alignItems: "center",
  },
});

export default ChatMessagesScreen;
