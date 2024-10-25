import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Svg, Path } from "react-native-svg";

import { LogBox } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useAxios from "../utils/useAxios";
import { handleUseffectActions } from "../store/reducers/handleUseffect";
import RNPickerSelect from "react-native-picker-select";

LogBox.ignoreAllLogs(true);

const screenWidth = Dimensions.get("window").width;

const CreateJobsScreen = () => {
  const [selectedValue, setSelectedValue] = useState(
    "University of Houston-Downtown"
  );
  const [jobName, setJobName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobqualifications, setJobQualifications] = useState("");
  const [jobform, setJobForm] = useState("");
  const [joblink, setJobLink] = useState("");
  const [jobid, setJobId] = useState("");
  const [postingDate, setPostingDate] = useState("");
  const [jobschedule, setJobSchedule] = useState("");
  const [jobdepartment, setJobDepartment] = useState("");

  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigation = useNavigation();
  const baseURL = useSelector((state) => state.baseUrl.url);
  const dispatch = useDispatch();
  const api = useAxios();

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        navigation.navigate("Login");
      }
    }, [isLoggedIn])
  );

  const handleSubmit = async () => {
    let formData;

    formData = new FormData();

    formData.append("name", jobName);
    formData.append("description", jobDescription);
    formData.append("qualifications", jobqualifications);
    formData.append("form", jobform);
    formData.append("link", joblink);
    formData.append("id", jobid);
    formData.append("postingDate", postingDate);
    formData.append("schedule", jobschedule);
    formData.append("department", jobdepartment);
    formData.append("college", selectedValue);

    try {
      //   setLoading(true);
      //   const response = await api.post(
      //     `${baseURL}/api/user/createGroup/`,
      //     formData,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //         Accept: "application/json",
      //       },
      //     }
      //   );

      setjobName("");
      setJobDescription("");
      setJobQualifications("");
      setJobForm("");
      setJobLink("");
      setJobId("");
      setPostingDate("");
      setJobSchedule("");
      setJobDepartment("");
      setSelectedValue("University of Houston-Downtown");

      Alert.alert("Job Posted");
      //   setLoading(false);
      dispatch(handleUseffectActions.setRefreshChats({ reload: true }));
      navigation.navigate("Main", { screen: "chats" });
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert("Error", error.response.data.message);
    }
  };

  const handlePress = () => {
    navigation.navigate("Main", {
      screen: ("Main", { screen: "chats" }),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={handlePress}>
        <Svg width={24} height={24} viewBox="0 0 320 512">
          <Path
            fill="white"
            d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
          />
        </Svg>
      </TouchableOpacity>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
        >
          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 50 }}>
            <Text style={styles.field}>Job Name</Text>
            <TextInput
              value={jobName}
              onChangeText={(text) => setJobName(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Job Description</Text>
            <TextInput
              value={jobDescription}
              onChangeText={(text) => setJobDescription(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Job Qualifications</Text>
            <TextInput
              value={jobqualifications}
              onChangeText={(text) => setJobQualifications(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Job Form</Text>
            <TextInput
              value={jobform}
              onChangeText={(text) => setJobForm(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Job Link</Text>
            <TextInput
              value={joblink}
              onChangeText={(text) => setJobLink(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Job ID</Text>
            <TextInput
              value={jobid}
              onChangeText={(text) => setJobId(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Posting Date</Text>
            <TextInput
              value={postingDate}
              onChangeText={(text) => setPostingDate(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Job Schedule</Text>
            <TextInput
              value={jobschedule}
              onChangeText={(text) => setJobSchedule(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>Job Department</Text>
            <TextInput
              value={jobdepartment}
              onChangeText={(text) => setJobDepartment(text)}
              style={styles.input}
            />
          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={{ marginBottom: 8, marginTop: 13 }}>
            <Text style={styles.field}>School/College</Text>
            <View style={styles.picker}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedValue(value)}
                items={[
                  {
                    label: "University of Houston-Downtown",
                    value: "University of Houston-Downtown",
                  },
                  {
                    label: "University of Houston",
                    value: "University of Houston",
                  },
                  {
                    label: "University of Texas",
                    value: "University of Texas",
                  },
                ]}
                placeholder={{
                  label: "Choose a University",
                  value: null,
                  color: "white", // Placeholder text color
                }}
                style={{
                  inputIOS: {
                    color: "white", // Text color for iOS
                  },
                  inputAndroid: {
                    color: "white", // Text color for Android
                  },
                  placeholder: {
                    color: "white", // Color of the placeholder
                  },
                }}
              />
            </View>
          </KeyboardAvoidingView>

          {loading ? (
            <ActivityIndicator></ActivityIndicator>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  scrollView: {
    backgroundColor: "black",
    width: screenWidth,
  },
  input: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.1,
    padding: screenWidth * 0.03,
    border: "0",
    boxSizing: "border-box",
    borderRadius: 15,
    backgroundColor: "#1f1e1e",
    color: "white",
    fontSize: 13,
    fontFamily: "Raleway",
    fontWeight: "500",
    lineHeight: 13,
    outline: "none",
  },
  field: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Raleway",
    fontWeight: "bold",
    textAlign: "justify",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "transparent",
    borderColor: "yellow",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 100,
    marginTop: 120,
    width: screenWidth * 0.5,
  },
  buttonText: {
    color: "black",
    fontSize: 15,
    fontFamily: "Poppins",
    fontWeight: "bold",
    outline: "none",
    color: "yellow",
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
  picker: {
    color: "black",
    width: screenWidth * 0.8,
    height: screenWidth * 0.1, // Keep one height definition
    padding: screenWidth * 0.03,
    borderRadius: 15,
    backgroundColor: "#1f1e1e",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#1f1e1e",
    borderRadius: 5,
    height: 55,
    //backgroundColor: "#1f1e1e",
    paddingHorizontal: 10,
    width: screenWidth * 0.8,
    color: "white",
    backgroundColor: "white",
  },
});

export default CreateJobsScreen;
