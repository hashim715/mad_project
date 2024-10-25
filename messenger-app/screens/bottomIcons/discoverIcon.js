import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';

const DiscoverIcon = (props) => (

    <Svg width={24} height={24} viewBox="0 0 24 24" fill={props.color}>
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
    </Svg>

);

const styles = StyleSheet.create({
});

export default DiscoverIcon;
