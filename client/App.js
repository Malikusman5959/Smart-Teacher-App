import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer} from '@react-navigation/native'
import {Attendance , Complaints , SignIn , ComplaintDetail , ComplaintUpload  , Circulars, Fines, Students ,Homework , MyClass , Violations , ViolationDetail , HomeWorkDetail , HomeWorkUpload , LeaveApplications , ProfileView} from './screens/index'
import Tabs from './navigation/tabs'

import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';


const Stack = createStackNavigator();

function App() {

  return (

    <NavigationContainer> 
      <Stack.Navigator
      screenOptions = {{
        headerShown : false
      }}
      initialRouteName = {"SignIn"}>
        <Stack.Screen name="SignIn" component={SignIn}/>
        <Stack.Screen name="Home" component={Tabs}/>
        <Stack.Screen name="ViolationDetail" component={ViolationDetail}/>
        <Stack.Screen name="Attendance" component={Attendance}/>
        <Stack.Screen name="HomeWorkDetail" component={HomeWorkDetail}/>
        <Stack.Screen name="HomeWorkUpload" component={HomeWorkUpload}/>
        <Stack.Screen name="ProfileView" component={ProfileView}/>
        <Stack.Screen name="LeaveApplications" component={LeaveApplications}/>
        <Stack.Screen name="Students" component={Students}/>
        <Stack.Screen name="Fines" component={Fines}/>
        <Stack.Screen name="Circulars" component={Circulars}/>
        <Stack.Screen name="ComplaintDetail" component={ComplaintDetail}/>
        <Stack.Screen name="ComplaintUpload" component={ComplaintUpload}/>

      </Stack.Navigator>
    </NavigationContainer>
    
  )
};

const styles = StyleSheet.create({


});

export default App;
