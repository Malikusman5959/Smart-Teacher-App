import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,Alert,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import moment from 'moment';
import axios from 'axios';


export default function ViolationDetail({route , navigation }) {

  const [data, setData] = useState(route.params)
  const [violations , setViolations] = useState(route.params.violations)

  const deleteItem = (itemName) => {
    // console.log(violations.filter(item => item !== itemName))
    setViolations (violations.filter(item => item !== itemName))
  }

  const verifyViolations = () => {

      axios.patch(`http://10.0.2.2:8000/v2/violation?date=${data.date}&RegNo=${data.RegNo}` , violations )
          .then(response => {
                // navigation.navigate("Home")
                setData ({...data , status : "Verified"})
          })
          .catch(error => {
              console.log("HI" + error);
          });
  }

  const deleteViolation = () => {

    axios.delete(`http://10.0.2.2:8000/v2/violation?id=${data._id}`)
        .then(response => {
            navigation.goBack();
        })
        .catch(error => {
            console.log("HI" + error);
        });
}

  clickEventListener = () => {
    Alert.alert('Cannot delete the last violation. Use delete button instead.');
  }


  return (
    <View style={styles.container}>
      <View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
          <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Back </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image style={styles.avatar} source={{ uri: data.studentId.photo }} />
          <Text style={styles.name}> {data.name} </Text>
          <Text style={styles.name}>{data.RegNo}</Text>
        </View>
      </View>
      <Text style={styles.Violationstitle}> Violations </Text>


      <View style={styles.body}>
        <FlatList
          style={styles.container}
          enableEmptySections={true}
          data={violations}
          keyExtractor={(item , index) => {
            return 'key'+index;
          }}
          renderItem={({ item , index }) => {
            return (
              <View style={styles.box}>
                <Text style={styles.title}> {item}</Text>
                {data.status == 'Not-Verified' && data.date == moment(new Date()).format('L') ? <TouchableOpacity onPress={()=>{violations.length > 1 ? deleteItem(item) : clickEventListener()}}><Image style={styles.deleteIcon} source={{ uri: 'https://img.icons8.com/flat-round/64/000000/delete-sign.png' }} /></TouchableOpacity>  : null}
              </View>

            )
          }} />
      </View>

      {data.status == 'Not-Verified' && data.date == moment(new Date()).format('L') ?
      
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

      <TouchableOpacity style={styles.actionButton} onPress={() => {

         verifyViolations();

      }}>
        <Text style={styles.actionButtonText}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ffa291', borderColor: '#ffa291' }]} onPress={() => {

         deleteViolation(); 
      }}>
        <Text style={styles.actionButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
    : null}

     

    </View>

  );

}

const styles = StyleSheet.create({

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
    fontSize: 15,
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