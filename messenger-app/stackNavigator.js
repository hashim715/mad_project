import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileIcon from "./screens/bottomIcons/profileIcon";
import ChatIcon from "./screens/bottomIcons/chatsIcon";
import DiscoverIcon from "./screens/bottomIcons/discoverIcon";
import { Text } from "react-native";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

// Screens
import ChatScreen from "./screens/chatScreen";
import EditProfileScreen from "./screens/editprofileScreen";
import SettingScreen from "./screens/settingScreen";
import DiscoverScreen from "./screens/discoverScreen";
import IntroScreen from "./screens/introScreen";
import loginScreen from "./screens/loginScreen";
import registerScreen from "./screens/registerScreen";
import groupsScreen from "./screens/groupsScreen";
import createGroupnScreen from "./screens/createGroupScreen";
import GroupDetailsScreen from "./screens/groupDetails";
import GroupMembers from "./screens/groupMembers";
import ChatMessagesScreen from "./screens/chatMessageScreen";
import EventsScreen from "./screens/eventsScreen";
import EventDetailsScreen from "./screens/eventDetails";
import createEventScreen from "./screens/createEventsScreen";
import VerificationScreen from "./screens/verificationScreen";
import EmailInputScreen from "./screens/emailInputScreen";
import UserProfileScreen from "./screens/userProfileScreen";
import ProfileScreen from "./screens/profileScreen";
import AlbumScreen from "./screens/albumScreen";
import CreateAlbum from "./screens/createAlbumScreen";
import ChooseTheme from "./screens/chooseThemeScreen";
import AlbumCover from "./screens/albumCover";
import AlbumPhotos from "./screens/albumPhotos";
import ForgotPasswordScreen from "./screens/forgotPassword";
import ChooseProfilePicture from "./screens/chooseProfilePicture";
import GetProfileData from "./screens/getProfileData";
import GetBio from "./screens/getBio";

// import OtherScreen from "./screens/other";

// Screen names
const chats = "chats";
const discover = "discover";
const profile = "profile";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={chats}
      detachInactiveScreens={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;
          let rn = route.name;

          if (rn === chats) {
            IconComponent = (props) => <ChatIcon size={size} color={color} />;
          } else if (rn === discover) {
            IconComponent = (props) => (
              <DiscoverIcon size={size} color={color} />
            );
          } else if (rn === profile) {
            IconComponent = (props) => (
              <ProfileIcon size={size} color={color} />
            );
          }

          return <IconComponent />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "black",
          height: 90,
          borderTopWidth: 0,
          paddingTop: 10, // Add padding here
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
        },
        tabBarLabel: ({ focused, color }) => {
          let label;
          if (route.name === chats) {
            label = "wall";
          } else if (route.name === discover) {
            label = "discover";
          } else if (route.name === profile) {
            label = "profile";
          }
          return (
            <Text
              style={{
                color: focused ? "white" : "grey",
                fontSize: 12,
                paddingBottom: 5,
              }}
            >
              {label}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name={discover} component={DiscoverScreen} />
      <Tab.Screen name={chats} component={ChatScreen} />
      <Tab.Screen name={profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const config = {
  screens: {
    GroupDetails: "group/:id",
    Register: "register",
    Groups: "groups",
  },
};

const linking = {
  prefixes: ["exp://", "messenger-app://", "https://yourdomain.com"],
  config,
};

const Stack = createNativeStackNavigator();

function StackNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={registerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={loginScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Groups"
          component={groupsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateGroup"
          component={createGroupnScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupDetails"
          component={GroupDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupMembers"
          component={GroupMembers}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="ChatMessages"
          component={ChatMessagesScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Events"
          component={EventsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventDetails"
          component={EventDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateEvent"
          component={createEventScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="verificationScreen"
          component={VerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="emailInputScreen"
          component={EmailInputScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Album"
          component={AlbumScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateAlbum"
          component={CreateAlbum}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChooseTheme"
          component={ChooseTheme}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AlbumCover"
          component={AlbumCover}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AlbumPhotos"
          component={AlbumPhotos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChooseProfilePicture"
          component={ChooseProfilePicture}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="GetProfileData"
          component={GetProfileData}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GetBio"
          component={GetBio}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
