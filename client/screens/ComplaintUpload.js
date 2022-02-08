import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image, Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Button,
  TextInput
} from 'react-native';
import moment from 'moment';
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'



export default function HomeWorkUpload({ route, navigation }) {

  
  let [teacher, setTeacher] = useState(null);
  var date = moment(new Date((new Date()))).format('L');
  const isFocused = useIsFocused();

  const [studentList, setStudentList] = useState([{RegNo : 'PR-3B-21' , _id : '61465f77dbffa10cb40d9115'}])
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const [data, setData] = useState(null)
  const [errorr, setError] = useState(0)


  const getStudentsList = () => {

    axios.post(`http://10.0.2.2:8000/v2/studentsOfClasses`, teacher.classes)
      .then(response => {
       
        console.log(response.data.students);
        setStudentList(response.data.students);

      })
      .catch(error => {
        console.log("HI" + error);
      });
  }
  

  const getData = async () => {
    
    try {
      const jsonValue = await AsyncStorage.getItem('Teacher')
       setTeacher(JSON.parse(jsonValue));
    } catch(e) {
      // error reading value
    }
  }

  const checkRegNo = () => {

    for (let i = 0; i < studentList.length; i++) {
      if (studentList[i].RegNo == data.RegNo )
      return i
    }
    return -1;
     
  }

  const uploadComplaint = () => {

    console.log(data)
    axios.post(`http://10.0.2.2:8000/v2/complaint`, data)
      .then(response => {
        // navigation.navigate("Home")
        // setData ({...data , status : "Verified"})
        navigation.goBack();

      })
      .catch(error => {
        console.log("HI" + error);
      });
  }

  const submitForm = () => {


    if (checkRegNo() != -1  && data.subject != '' && data.description != '')
    {
      setData({ ...data, studentId : studentList[checkRegNo()]._id }) 
    }
    else{
      setError(1)
    }

  }

  useEffect(() => {

    getData();

}, [isFocused])


useEffect(() => {

  if (teacher !== null) {
      setData( {
        RegNo: '',
        studentId: '',
        date: date,
        filedBy: teacher._id,
        description: '',
        subject: '',
        status: "Pending",
        respondent: '',
        remarks: ''
      });

      getStudentsList();
  }

}, [teacher])

useEffect(() => {

  if (data && data.studentId != '' && checkRegNo() != -1  && data.subject != '' && data.description != '')
  {
    uploadComplaint();
  }

}, [data])

  return (

    <View style={styles.container}>

      <View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => {  setData({ ...data, RegNo: '' , description : ''}) ; navigation.navigate("Home") }}>
          <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Cancel </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', padding: 5 }}>
          <TouchableOpacity onPress={() => { submitForm(); }}>
            <Text style={{ marginRight: 15, color: '#ffffff', fontSize: 17 }}> Upload </Text>
          </TouchableOpacity>
        </View>
      </View>

      {data == null ? null : 
      
      <View style={{ marginTop: 10 }}>

       {errorr === 0 ? null : <Text style={{alignSelf : 'center' , color : '#FF0000'}}> All fields are required. </Text>}

        {inputFocused ? null :
          <View>
            {/* class */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={[styles.label]}> RegNo </Text>
              <TextInput value={data.RegNo}
             
              style={[styles.input, { borderColor: (data.RegNo == '' || checkRegNo() != -1) ? '#145691' : '#FF0000' }]}
                onChangeText={(text) => {setError(0); setData({ ...data, RegNo: text })}} />
            </View>

            {/* Subject */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={[styles.label]}> Subject </Text>
              <TextInput value={data.subject} maxLength={40} style={[styles.input]}
                onChangeText={(text) => {setError(0); setData({ ...data, subject: text })}} />
            </View>

          </View>
        }

        {/* Description */}
        <Text style={[styles.label, { alignSelf: 'flex-start', height: 40, marginLeft: 15, marginTop: 24 }]}> Complaint  </Text>
        <InputScrollView>
          <TextInput

            style={[styles.textArea]}
            underlineColorAndroid="transparent"
            numberOfLines={15}
            multiline={true}
            value={data.description}
            onChangeText={(text) => {setError(0);setData({ ...data, description: text })}}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />

        </InputScrollView>

      </View>
      }

    </View>

  );

}

const styles = StyleSheet.create({

  datePicker: {
    fontSize: 15,
    width: '60%',
    height: 40,
    width: '60%',
    color: '#145691',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: '#145691',
    borderRadius: 8,
    marginRight: 20
  },

  input: {
    fontSize: 13,
    width: '65%',
    height: 35,
    color: '#145691',
    textAlign: 'left',
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: '#145691',
    borderRadius: 8,
    marginRight: 15
},

  label: {
    fontSize: 17,
    color: '#145691',
    alignSelf: 'center',
    marginLeft: 20
  },

  pickerStyle: {

    height: 50,
    width: '60%',
    color: '#145691',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#2575C0',
    borderRadius: 5,
    marginRight: 20

  },

  pickerItemStyle: {

    color: '#2575C0',

  },

  textArea: {
    height: 'auto',
    justifyContent: "flex-start",
    borderColor: '#145691',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    color: '#145691',
    textAlignVertical: 'top',
    margin: 18
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
});