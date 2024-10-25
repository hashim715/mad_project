// import React from "react";
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   Image,
//   StyleSheet,
//   SafeAreaView,
//   Dimensions,
//   ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { LogBox } from "react-native";

// LogBox.ignoreAllLogs(true);

// const screenWidth = Dimensions.get("window").width;
// const screenHeight = Dimensions.get("window").height;

// const DiscoverScreen = () => {
//   const navigation = useNavigation();

//   const handlePress = () => {
//     navigation.navigate("Groups");
//   };

//   const handlePress_2 = () => {
//     navigation.navigate("Events");
//   };

//   const handlePress_3 = () => {
//     navigation.navigate("Jobs");
//   };

//   const theimageurl_1 =
//     "https://assets.api.uizard.io/api/cdn/stream/873fb4de-91e5-42b1-a835-b975c97b3134.png";
//   const theimageurl_2 =
//     "https://assets.api.uizard.io/api/cdn/stream/c9b4d047-16ac-4d16-a0a1-c23f93280d9d.png";

//   const theimageurl_3 = "";

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <View style={styles.topContainer}>
//           <Text style={styles.heading}>Discover Campus Life</Text>
//         </View>

//         <TouchableOpacity style={styles.bottomContainer} onPress={handlePress}>
//           <Image
//             source={{ uri: theimageurl_1 }}
//             style={styles.imageContainer}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={{ ...styles.bottomContainer, marginTop: 30 }}
//           onPress={handlePress_2}
//         >
//           <Image
//             source={{ uri: theimageurl_2 }}
//             style={styles.imageContainer}
//           />
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "black",
//     flex: 1,
//   },
//   scrollViewContent: {
//     alignItems: "center",
//     paddingBottom: 20,
//     paddingTop: 100,
//   },
//   imageContainer: {
//     width: screenWidth * 0.9,
//     height: screenWidth * 0.5,
//     borderRadius: 12,
//     resizeMode: "cover",
//   },
//   heading: {
//     color: "#ffffff",
//     fontSize: 25,
//     fontFamily: "Monserat",
//     fontWeight: "bold",
//     // marginTop: -50,
//   },
//   topContainer: {
//     width: screenWidth * 0.9,
//     height: screenHeight * 0.1,
//     justifyContent: "center",
//     marginTop: -100,
//   },
//   bottomContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: screenWidth * 0.9,
//     height: screenWidth * 0.5,
//   },
// });

// export default DiscoverScreen;
