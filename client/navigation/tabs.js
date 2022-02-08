import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";

import { Attendance , Complaints , Homework , MyClass , Violations } from "../screens";
import { icons } from "../constants";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
    initialRouteName = 'Class'
    // screenOptions={{ headerShown: false }}
    screenOptions={{
      showLabel: false,
      }}
    >
      {/* Violations Tab */}
      <Tab.Screen
        name="Violations"
        component={Violations}
        style = {{borderTopColor : '#0075eb' }}
        options={{
          headerStyle : {
            backgroundColor : "#2575C0",
          },
          headerTitleStyle: {
            alignSelf : 'center',
            color : "#ffffff",
          },
          headerTitleAlign : 'center',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tapScreenView}>
              <Image
                source={icons._violationIcon}
                resizeMode="contain"
                style={[
                  styles.tapScreenImg,
                  { tintColor: focused ? '#0075eb' : '#878787' },
                ]}
              />
              {/* <Text
                style={{
                  color: focused ? '#0075eb' : '#878787',
                  fontSize : 10
                }}
              >
                
              </Text> */}
            </View>
          ),
        }}
      />

{/* Attendance Tab */}
<Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          headerStyle : {
            backgroundColor : "#2575C0",
          },
          headerTitleStyle: {
            alignSelf : 'center',
            color : "#ffffff",
          },
          headerTitleAlign : 'center',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tapScreenView}>
              <Image
                source={icons._attendanceIcon}
                resizeMode="contain"
                style={[
                  styles.tapScreenImg,
                  { tintColor: focused ? '#0075eb' : '#878787' },
                ]}
              />
              {/* <Text
                style={{
                  color: focused ? '#0075eb' : '#878787',
                  fontSize : 10
                }}
              >
                Attendance
              </Text> */}
            </View>
          ),
        }}
      />


{/* Class TAb */}
<Tab.Screen
        name="Class"
        component={MyClass}
        options={{
          headerStyle : {
            backgroundColor : "#2575C0",
          },
          headerTitleStyle: {
            alignSelf : 'center',
            color : "#ffffff",
          },
          headerTitleAlign : 'center',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tapScreenView}>
              <Image
                source={icons._homeIcon}
                resizeMode="contain"
                style={[
                  styles.tapScreenImg,
                  { tintColor: focused ? '#0075eb' : '#878787' , width: 35,
                  height: 35, },
                ]}
              />
              {/* <Text
                style={{
                  color: focused ? '#0075eb' : '#878787',
                  fontSize : 10
                }}
              >
                Class
              </Text> */}
            </View>
          ),
        }}
      />


{/* Complaints Tab */}
<Tab.Screen
        name="Complaints"
        component={Complaints}
        options={{
          headerStyle : {
            backgroundColor : "#2575C0",
          },
          headerTitleStyle: {
            alignSelf : 'center',
            color : "#ffffff",
          },
          headerTitleAlign : 'center',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tapScreenView}>
              <Image
                source={icons._complaintIcon}
                resizeMode="contain"
                style={[
                  styles.tapScreenImg,
                  { tintColor: focused ? '#0075eb' : '#878787' },
                ]}
              />
              {/* <Text
                style={{
                  color: focused ? '#0075eb' : '#878787',
                  fontSize : 10
                }}
              >
                Complaints
              </Text> */}
            </View>
          ),
        }}
      />


{/* Homework Tab */}
<Tab.Screen
        name="Homework"
        component={Homework}
        options={{
          headerStyle : {
            backgroundColor : "#2575C0",
          },
          headerTitleStyle: {
            alignSelf : 'center',
            color : "#ffffff",
          },
          headerTitleAlign : 'center',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tapScreenView}>
              <Image
                source={icons._homeworkIcon}
                resizeMode="contain"
                style={[
                  styles.tapScreenImg,
                  { tintColor: focused ? '#0075eb' : '#878787' , width : 27 , height : 27},
                ]}
              />
              {/* <Text
                style={{
                  color: focused ? '#0075eb' : '#878787',
                  fontSize : 10
                }}
              >
                Homework
              </Text> */}
            </View>
          ),
        }}
      />


    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#FFA500',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tapScreenView: {
    alignItems: "center",
    justifyContent: "center",
  },
  tapScreenImg: {
    width: 30,
    height: 30,
  },
});

export default Tabs;
