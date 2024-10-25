import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  SafeAreaView,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import RNPickerSelect from "react-native-picker-select";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const GetProfileData = ({ route }) => {
  const { image } = route.params;
  const navigation = useNavigation();

  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [courses, setCourses] = useState("");
  const [fraternity, setFraternity] = useState("");
  const [relationship, setRelationship] = useState("");
  const [clubs, setClubs] = useState("");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const handleSubmitData = () => {
    if (
      !college ||
      !college.trim() ||
      !year ||
      !year.trim() ||
      !major ||
      !major.trim() ||
      !courses ||
      !courses.trim() ||
      !fraternity ||
      !fraternity.trim() ||
      !relationship ||
      !relationship.trim() ||
      !clubs ||
      !clubs.trim()
    ) {
      Alert.alert("Please fill out the form completely..");
      return;
    } else {
      const data = {
        college: college,
        year: year,
        major: major,
        courses: courses,
        fraternity: fraternity,
        clubs: clubs,
        relationship_status: relationship,
        profile_image: image,
      };
      navigation.navigate("GetBio", { data: data });
    }
  };

  return (
    <SafeAreaView style={styles.profileContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <Text style={styles.heading}>
            Hell yeah, lets get into your college life now.
          </Text>
          <Text
            style={{
              ...styles.heading,
              fontSize: 12,
              color: "#c2c2c2",
              marginTop: 10,
              fontWeight: "300",
              width: screenWidth * 0.7,
              alignSelf: "center",
            }}
          >
            we know college is fun and this is why we want to know more about
            your college life.
          </Text>
          <View style={{ ...styles.dropdown, marginTop: 60 }}>
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
                    fontSize: 13,
                    fontFamily: "Raleway",
                    fontWeight: "500",
                  },
                  inputAndroid: {
                    color: "white",
                  },
                  placeholder: {
                    color: "gray",
                    fontSize: 13,
                    fontFamily: "Raleway",
                    fontWeight: "500",
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
                    fontSize: 13,
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
                    fontSize: 13,
                    fontFamily: "Raleway",
                    fontWeight: "500",
                  },
                  inputAndroid: {
                    color: "white",
                  },
                  placeholder: {
                    color: "gray",
                    fontSize: 13,
                    fontFamily: "Raleway",
                    fontWeight: "500",
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
            value={clubs}
            onChangeText={(text) => setClubs(text)}
            style={styles.input_2}
            placeholder="Clubs/Societies/etc."
            placeholderTextColor={"gray"}
          />

          <View style={styles.dropdown}>
            <View style={styles.selectionField}>
              <RNPickerSelect
                activeItemStyle={{ color: "gray" }}
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
                  color: "gray",
                }}
                style={{
                  inputIOS: {
                    color: "white",
                    fontSize: 13,
                    fontFamily: "Raleway",
                    fontWeight: "500",
                  },
                  inputAndroid: {
                    color: "white",
                  },
                  placeholder: {
                    color: "gray",
                    fontSize: 13,
                    fontFamily: "Raleway",
                    fontWeight: "500",
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleSubmitData();
            }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "column",
    backgroundColor: "#000",
    flex: 1,
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

    marginBottom: 13,
  },
  selectionField: {
    width: "80%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input_2: {
    width: screenWidth * 0.8,
    height: 40,
    padding: screenWidth * 0.03,
    boxSizing: "border-box",
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#1f1e1e",
    borderColor: "#505050",
    color: "white",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "500",
    marginBottom: 13,
  },
  heading: {
    marginTop: 28,
    color: "#ffffff",
    fontSize: 25,
    fontFamily: "Raleway",
    fontWeight: "bold",
    textAlign: "center",
    width: screenWidth * 0.8,
    justifyContent: "center",
    marginTop: 50,
  },
  button: {
    marginTop: 60,
    width: screenWidth * 0.5,
    height: screenWidth * 0.1,
    borderColor: "#c2c2c2",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Raleway",
  },
});

export default GetProfileData;
