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



export default function HomeWorkUpload({ route, navigation }) {


  const [subjectList, setSubjectList] = useState(route.params.subjects)
  const [classList, setClassList] = useState(route.params.classes)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [errorr, setError] = useState(0);
  const [teacher, setTeacher] = useState(route.params)
  var date = moment(new Date((new Date()))).format('L');



  const [data, setData] = useState(
    {
      class: '',
      subject: '',
      teacherId: teacher._id,
      homeWorkDescription: '',
      date: date,
      dueDate: moment(new Date((new Date()).valueOf() + 1000 * 60 * 60 * 24)).format('L'),
    }
  )


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setData({ ...data, dueDate: moment(date).format('L') })
    hideDatePicker();
  };


  const uploadHomeWork= () => {

    console.log(data)
    axios.post(`http://10.0.2.2:8000/v2/homework`, data)
      .then(response => {
        navigation.goBack();

      })
      .catch(error => {
        console.log("HI" + error);
      });
  }

  const submitForm = () => {
    if ( data.dueDate > moment(new Date()).format('L') && data.homeWorkDescription != '' )
    {
        //call Api
        uploadHomeWork();
    }
    else
    {
      setError(1);
    }
  }

  useEffect(() => {

    setClassList(teacher.classes);
    setSubjectList(teacher.subjects);
    setData({ ...data, class: classList[0] , subject : subjectList[0]})

}, [])



  return (

    <View style={styles.container}>

      <View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
          <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Cancel </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', padding: 5 }}>
          <TouchableOpacity onPress={() => { submitForm() }}>
            <Text style={{ marginRight: 15, color: '#ffffff', fontSize: 17 }}> Upload </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>

        {inputFocused ? null :
        <View>

          {errorr === 0 ? null : <Text style={{alignSelf : 'center' , color : '#FF0000'}}> Homework must not be empty. </Text>}


          {/* class */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={[styles.label]}>Class </Text>
          <Picker
            selectedValue={data.class}
            style={styles.pickerStyle}
            onValueChange={(itemValue, itemIndex) => setData({ ...data, class: itemValue })}
          >
            {classList.map((item, index) => {
              return <Picker.Item key={index} style={styles.pickerItemStyle} label={item} value={item} />
            })}
          </Picker>
        </View>

        {/* subject */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={[styles.label]}>Subject </Text>
          <Picker
            selectedValue={data.subject}
            style={styles.pickerStyle}
            onValueChange={(itemValue, itemIndex) => setData({ ...data, subject: itemValue })}
          >
            {subjectList.map((item, index) => {
              return <Picker.Item key={index} style={styles.pickerItemStyle} label={item} value={item} />
            })}
          </Picker>
        </View>

        {/* Due Date */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={[styles.label]}>Due Date </Text>
           <Text style={[styles.datePicker , {borderColor : (data.dueDate > moment(new Date()).format('L')) ? '#145691' : '#FF0000'} ]} onPress={showDatePicker}> {data.dueDate} </Text>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
          
        </View>
        }

        {/* Description */}
        <Text style={[styles.label , {alignSelf : 'flex-start' , height : 40 , marginLeft : 15 , marginTop : 24}]}> Homework  </Text>
        <InputScrollView>
          <TextInput
          
            style={[styles.textArea]}
            underlineColorAndroid="transparent"
            numberOfLines={15}
            multiline={true}
            value={data.homeWorkDescription}
            onChangeText={(text) => {setError(0) ;setData({ ...data, homeWorkDescription: text })}}
            onFocus={() =>setInputFocused(true) }
            onBlur={() => setInputFocused(false) }
          />

        </InputScrollView>
        
      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  datePicker: {
    fontSize : 15,
    width : '60%',
    height: 40,
    width: '60%',
    color: '#145691',
    textAlign : 'center',
    textAlignVertical : 'center',
    borderWidth: 1,
    borderColor: '#145691',
    borderRadius: 8,
    marginRight : 20
  },

  label:{
    fontSize: 17, 
    color: '#145691',
    alignSelf: 'center',
    marginLeft: 20
  },

  pickerStyle: {

    height: 50,
    width: '60%',
    color: '#145691',
    textAlign : 'center',
    borderWidth: 2,
    borderColor: '#2575C0',
    borderRadius: 5,
    marginRight : 20

  },

  pickerItemStyle: {

    color: '#2575C0',

  },

  textArea: {
    height: 'auto',
    justifyContent: "flex-start",
    borderColor: '#145691',
    borderWidth: 1,
    borderRadius : 8,
    padding: 8,
    color: '#145691',
    textAlignVertical: 'top',
    margin : 18
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