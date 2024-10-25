import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';

const ChatIcon = (props) => (

  <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill={props.color}>
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path fill="white" d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
  </Svg>

);

const styles = StyleSheet.create({
  
});

export default ChatIcon;
