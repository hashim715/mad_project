import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ImageBackground,
  FlatList,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";
import useAxios from "../utils/useAxios";
import { ActivityIndicator } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const AlbumScreen = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const baseURL = useSelector((state) => state.baseUrl.url);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const api = useAxios();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loadingImage, setLoadingImage] = useState(new Map());
  const [networkLoad, setnetworkLoad] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const [backgroundImage, setBackgroundImage] = React.useState("");

  const handleNetworkError = () => {
    if (!networkLoad) {
      setnetworkLoad(true);
      Alert.alert(
        "Something went wrong",
        "Please retry or check your internet connection..."
      );
    }
  };

  const getAlbumDetails = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        handleNetworkError();
        return;
      }
      setLoading(true);
      const response = await api.get(
        `${baseURL}/api/user/getSingleAlbum/${id}`
      );
      setPhotos(response.data.message.album_photos);
      setName(response.data.message.name);
      setDescription(response.data.message.description);
      setBackgroundImage(response.data.message.theme_name);
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
    getAlbumDetails();
  }, [id]);

  const retryfetch = () => {
    setnetworkLoad(false);
    getAlbumDetails();
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={{ width: "100%", height: "100%" }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.heading}>{name}</Text>
          <Text style={styles.tagline}>{description}</Text>
        </View>

        {networkLoad ? (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onPress={() => retryfetch()} title="Refresh"></Button>
          </View>
        ) : loading ? (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator></ActivityIndicator>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {photos.map((photo, index) => {
              return (
                <View key={index}>
                  {loadingImage.get(index) === true && (
                    <ActivityIndicator></ActivityIndicator>
                  )}
                  <Image
                    source={{
                      uri: `${photo}`,
                    }}
                    style={styles.albumImage}
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
                </View>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topContainer: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.1,
    justifyContent: "center",
  },
  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Red Hat Display",
  },
  tagline: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Red Hat Display",
    fontWeight: "500",
    marginTop: 10,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 0,
    width: screenWidth,
  },
  albumImage: {
    width: screenWidth * 0.85,
    height: 300,
    borderRadius: 12,
    resizeMode: "cover",
    marginVertical: 10,
  },
});

export default AlbumScreen;
