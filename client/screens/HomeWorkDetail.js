import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import moment from 'moment';
import InputScrollView from 'react-native-input-scroll-view';
import axios from 'axios';



export default function HomeWorkDetail ({route , navigation }) {

  const [data, setData] = useState(route.params)
  const [editing, setEditing] = useState(false)

  const deleteHomeWork = ()=> {

    return Alert.alert(
        "Delete HomeWork",
        `Do you want to delete this Homework?`,
        [
          {
            text: "Yes",
            onPress: () => {
              deleteH();
            },
          },
          {
            text: "No",
          },
        ]
      );
  }


  const updateHomeWork = () => {

    console.log(data.homeWorkDescription);

    axios.patch(`http://10.0.2.2:8000/v2/homework?id=${data._id}`, { homeWorkDescription: data.homeWorkDescription })
      .then(response => {

        setEditing(false);

      })
      .catch(error => {
        console.log("HI" + error);
      });
  }

  const deleteH = () => {

    axios.delete(`http://10.0.2.2:8000/v2/homework?id=${data._id}`)
      .then(response => {
        navigation.goBack();
      })
      .catch(error => {
        console.log("HI" + error);
      });
  }

  return (
    
    <View style={styles.container}>
      <View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center' , justifyContent : 'space-between' }}>
        <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
          <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Back </Text>
        </TouchableOpacity>
        {data.date == moment(new Date()).format('L') ? 
        <View style = {{flexDirection : 'row' , padding : 5}}> 
            <TouchableOpacity onPress={() => {deleteHomeWork()}}>
               <Text style={{ marginRight: 15, color: '#ffffff', fontSize: 17 }}> Delete </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {editing ? updateHomeWork() : setEditing(true) }}>
               <Text style={{ marginRight: 15, color: '#ffffff', fontSize: 17 }}> {editing ? 'Save' : 'Edit'} </Text>
            </TouchableOpacity>
        </View>
        
        : null}
      </View>
      <View style={styles.header}>
        <View style={styles.headerContent}>
        <View style={{ width: 70, height: 70, backgroundColor: 'white', borderRadius: 50, justifyContent: 'center' , alignContent : 'center' , alignItems : 'center'}} >
            <Text style={[styles.name, { color: '#2575C0', fontSize: 30, alignSelf: 'center' , marginRight : 7 }]}>{data.class}</Text>
        </View>
        <View> 
          <Text style={styles.name}> {data.subject} </Text>
          
        </View>
         
        </View>
      </View>

      <View style={{flexDirection : 'row' , justifyContent : 'space-between' , marginTop : 10}}>
    <Text style={[styles.name , {fontSize : 13 , fontWeight : 'bold', color : '#2575C0'}]}>Posted : {data.date}</Text>
      <Text style={[styles.name , {fontSize : 13 , fontWeight : 'bold' , color : '#2575C0'}]}>Due : {data.dueDate}</Text>
       </View>

      <InputScrollView>
     <TextInput
      style={[styles.textArea , { borderWidth: editing ? 1 : 0, marginTop : 15}]}
      underlineColorAndroid="transparent"
      numberOfLines={editing ? 8 : 23}
      multiline={true}
      value={data.homeWorkDescription}
      editable = {editing ? true : false}
      onChangeText={(text) => setData({...data , homeWorkDescription : text})}
      
    />
      </InputScrollView>

    </View>

  );

}

const styles = StyleSheet.create({

  textArea: {
    height: 'auto',
    justifyContent: "flex-start",
    borderColor: '#2575C0',
    borderWidth: 1,
    padding : 8,
    color : '#2575C0',
    textAlignVertical : 'top'
  },

  header: {
    backgroundColor: "#2575C0",
  },

  headerContent: {
    padding: 15,
    alignItems: 'center',
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "#ffffff",
    marginBottom: 10,
  },

  deleteIcon: {
    width: 20,
    height: 20,
    borderColor: "#ffffff",
  },

  icon: {
    width: 40,
    height: 40,
  },

  title: {
    fontSize: 15,
    color: "#2575C0",
    marginLeft: 4
  },

  Violationstitle: {
    fontSize: 20,
    color: "#2575C0",
    margin: 15,
    alignSelf: 'center'
  },


  btn: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
  },

  body: {
    backgroundColor: "#E6E6FA",
  },

  box: {
    padding: 8,
    margin: 3,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent : 'space-between',
    shadowColor: 'black',
    shadowOpacity: .2,
    shadowOffset: {
      height: 1,
      width: -2
    },
    elevation: 2,
    borderRadius: 6
  },

  name: {
    color: "#ffffff",
    fontSize: 25,
    alignSelf: 'center',
    marginLeft: 10
  },

  actionButton: {
    margin: 15,
    height: 40,
    width: 100,
    padding: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#2575C0",
    backgroundColor: '#2575C0'
  },

  actionButtonText: {
    color: "white",
    fontSize: 12,
  },
});