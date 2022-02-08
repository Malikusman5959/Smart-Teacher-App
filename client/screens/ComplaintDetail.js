import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image, Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import moment from 'moment';
import InputScrollView from 'react-native-input-scroll-view';
import axios from 'axios';




export default function ComplaintDetail({ route, navigation }) {

  const [data, setData] = useState(route.params)
  const [editing, setEditing] = useState(false)


  const deleteComplaint = () => {

    return Alert.alert(
      "Delete Complaint",
      `Do you want to delete this Complaint?`,
      [
        {
          text: "Yes",
          onPress: () => {
            deleteC();
          },
        },
        {
          text: "No",
        },
      ]
    );
  }

  const updateComplaint = () => {

    axios.patch(`http://10.0.2.2:8000/v2/complaint?id=${data._id}`, { description: data.description })
      .then(response => {
        // navigation.navigate("Home")
        // setData ({...data , status : "Verified"})
        setEditing(false);

      })
      .catch(error => {
        console.log("HI" + error);
      });
  }

  const deleteC = () => {

    axios.delete(`http://10.0.2.2:8000/v2/complaint?id=${data._id}`)
      .then(response => {
        navigation.goBack();
      })
      .catch(error => {
        console.log("HI" + error);
      });
  }

  return (

    <View style={styles.container}>
      <View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
          <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Back </Text>
        </TouchableOpacity>
        {data.date == moment(new Date()).format('L') && data.status == 'Pending' ?
          <View style={{ flexDirection: 'row', padding: 5 }}>
            <TouchableOpacity onPress={() => { deleteComplaint() }}>
              <Text style={{ marginRight: 15, color: '#ffffff', fontSize: 17 }}> Delete </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { editing ? updateComplaint() : setEditing(true) }}>
              <Text style={{ marginRight: 15, color: '#ffffff', fontSize: 17 }}> {editing ? 'Save' : 'Edit'} </Text>
            </TouchableOpacity>
          </View>

          : null}
      </View>


      {editing ? null :

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image style={styles.userImage} source={{ uri: data.studentId.photo }} />

            <View>
              <Text style={[styles.name, { marginTop: 10, marginLeft: -5 }]}> {data.studentId.name} </Text>
              <Text style={[styles.name, { fontSize: 15, marginTop: 0, marginLeft: -5 }]}> {data.RegNo} </Text>
            </View>
          </View>
        </View>

      }

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <Text style={[styles.name, { fontSize: 13, fontWeight: 'bold', color: '#2575C0' }]}>Posted : <Text style={{ fontWeight: '100' }}> {data.date} </Text> </Text>
        <Text style={[styles.name, { fontSize: 13, marginRight: 10, fontWeight: 'bold', color: '#2575C0' }]}>Status : <Text style={{ fontWeight: '100' }}> {data.status} </Text></Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0 }}>
        <Text style={[styles.name, { fontSize: 13, fontWeight: 'bold', color: '#2575C0' }]}>By : <Text style={{ fontWeight: '100' }}> {data.filedBy.name} </Text></Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0 }}>
        <Text style={[styles.name, { fontSize: 13, fontWeight: 'bold', color: '#2575C0' }]}>Subject : <Text style={{ fontWeight: '100' }}> {data.subject} </Text></Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0 }}>
        {data.status == 'Pending' ? null : <Text style={[styles.name, { fontSize: 13, marginRight: 10, fontWeight: 'bold', color: '#2575C0' }]}>Respondant : <Text style={{ fontWeight: '100' }}> {data.respondent} </Text></Text>}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        {data.status == 'Pending' ? null : <Text style={[styles.name, { fontSize: 13, marginRight: 10, fontWeight: 'bold', color: '#2575C0' }]}>Remarks : <Text style={{ fontWeight: '100' }}> {data.remarks} </Text></Text>}
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
        <Text style={[styles.name, { fontSize: 13, marginRight: 10, fontWeight: 'bold', color: '#2575C0' }]}>Complaint : </Text>
      </View>

      <InputScrollView>
        <TextInput
          style={[styles.textArea, { borderWidth: editing ? 1 : 0, marginTop: 0 }]}
          underlineColorAndroid="transparent"
          numberOfLines={editing ? 8 : 23}
          multiline={true}
          value={data.description}
          editable={editing ? true : false}
          onChangeText={(text) => setData({ ...data, description: text })}

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
    padding: 8,
    paddingTop: 0,
    color: '#2575C0',
    textAlignVertical: 'top'
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
    justifyContent: 'space-between',
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
  userImage: {
    height: 120,
    width: 120,
    marginTop: -15,
    borderRadius: 60,
    alignSelf: 'center',
    borderColor: "#ffffff",
    borderWidth: 4,
  },
});