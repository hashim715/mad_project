import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";
import Svg, { Path } from "react-native-svg";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const ChooseTheme = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [theme, setTheme] = useState(1);

  const toggleRadio = (option) => {
    setSelectedOption(option);
    if (option === 1) {
      setTheme(1);
    }
    if (option === 2) {
      setTheme(2);
    }
  };

  const theimageurl_1 =
    "https://assets.api.uizard.io/api/cdn/stream/d75c8cdd-01aa-40b8-a20e-9b4ba5fcbbf0.png";
  const theimageurl_2 =
    "https://assets.api.uizard.io/api/cdn/stream/53cb8275-294d-4739-8c4f-71fae3c27cc4.png";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>What's the vibe in it?</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AlbumCover", { background: theme });
          }}
        >
          <Svg viewBox="0 0 24 24" width={24} height={24}>
            <Path d="M0 0h24v24H0V0z" fill="none" />
            <Path
              fill="white"
              d="M6.23 20.23L8 22l10-10L8 2 6.23 3.77 14.46 12z"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.imageWrapper}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => toggleRadio(1)}
        >
          <View
            style={[
              styles.radioContainer,
              selectedOption === 1 && styles.radioChecked,
            ]}
          >
            <Svg viewBox="0 0 24 24" width={20} height={20}>
              <Path d="M0 0h24v24H0z" fill="none" />
              {selectedOption === 1 ? (
                <Path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  fill="#ffffff"
                />
              ) : (
                <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#ffffff" />
              )}
            </Svg>
          </View>
        </TouchableOpacity>
        <Image source={{ uri: theimageurl_1 }} style={styles.imageContainer} />
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.subHeading}>The Half-time Hype 🏈📸🔥🚀⚡</Text>
        <Text style={{ ...styles.details, marginTop: 10 }}>
          A visual journey capturing the energy,
        </Text>
        <Text style={styles.details}>emotion, electrifying moments</Text>
        <Text style={styles.details}>that define the spirit of the game</Text>
      </View>

      <View style={styles.imageWrapper}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => toggleRadio(2)}
        >
          <View
            style={[
              styles.radioContainer,
              selectedOption === 2 && styles.radioChecked,
            ]}
          >
            <Svg viewBox="0 0 24 24" width={20} height={20}>
              <Path d="M0 0h24v24H0z" fill="none" />
              {selectedOption === 2 ? (
                <Path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  fill="#ffffff"
                />
              ) : (
                <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#ffffff" />
              )}
            </Svg>
          </View>
        </TouchableOpacity>
        <Image source={{ uri: theimageurl_2 }} style={styles.imageContainer} />
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.subHeading}>Sorority Shenanigans 🪩🍾🥳🎉🏛️</Text>
        <Text style={{ ...styles.details, marginTop: 10 }}>
          A playful mix of candid snaps, wild nights,
        </Text>
        <Text style={styles.details}>
          inside jokes, and all the fun-filled chaos that
        </Text>
        <Text style={styles.details}>
          turns everyday moments into unforgettable
        </Text>
        <Text style={styles.details}>memories.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F1E1E",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  topContainer: {
    width: screenWidth * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
  },
  descriptionBox: {
    width: screenWidth * 0.9,
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 20,
  },
  subHeading: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
  details: {
    color: "#c2c2c2",
    fontSize: 13,
    fontFamily: "Montserrat",
    fontWeight: "500",
    lineHeight: 18,
  },
  imageWrapper: {
    position: "relative",
  },
  radioButton: {
    position: "absolute",
    top: 25,
    left: 25,
    zIndex: 1,
    backgroundColor: "gray",
    borderRadius: 50,
  },
  radioContainer: {
    padding: 3,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  radioChecked: {
    backgroundColor: "green",
  },
  radioUnchecked: {
    backgroundColor: "Grey",
  },
  imageContainer: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.5,
    borderRadius: 12,
    resizeMode: "cover",
  },
  heading: {
    color: "#ffffff",
    fontSize: 25,
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
});

export default ChooseTheme;
