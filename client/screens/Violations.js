import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native'
import { SvgUri } from 'react-native-svg';
// import SvgUri from 'react-native-svg-uri';


export default function Violationslist({ navigation }) {

  var date = moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)).format('L');
  const isFocused = useIsFocused();

  //states
  const [viewSelectedValue, setViewSelectedValue] = useState("This Week");
  const [statusSelectedValue, setStatusSelectedValue] = useState("All");
  const [data, setData] = useState([]);
  let [teacher, setTeacher] = useState(null);


  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Teacher')
      setTeacher(JSON.parse(jsonValue));
    } catch (e) {
      // error reading value
    }
  }


  const fetchData = () => {

    axios.get(`http://10.0.2.2:8000/v2/violation?classs=${teacher.assignedClass}&date=${date}`)
      .then(response => {
        console.log('getting data from axios', response.data);
        setData(response.data.violation);
        // setViewSelectedValue('Today');
      })
      .catch(error => {
        console.log("Hi" + error);
      });
  }


  //useEffect
  useEffect(() => {

    getData();
    // fetchData();

    // setData([
    //   {
    //     id: '1',
    //     RegNo: 'PR-3B-12',
    //     name: 'Muhammad Usman',
    //     class: '3B',
    //     photo: 'https://bootdey.com/img/Content/avatar/avatar1.png',
    //     violations: ["Invalid Tie", "Badge Missing", "Inappropriate Shoes"],
    //     date: '09/20/2021',
    //     timeDetected: '07:10AM',
    //     status: 'Verified',

    //   },
    //   {
    //     id: '2',
    //     RegNo: 'SC-8A-56',
    //     name: 'Maryam Shah',
    //     class: '8A',
    //     photo: 'https://bootdey.com/img/Content/avatar/avatar2.png',
    //     violations: ["Inappropriate Scarf", "Inappropriate Shoes"],
    //     date: '09/19/2021',
    //     timeDetected: '07:13AM',
    //     status: 'Not-Verified',
    //   },
    //   {
    //     id: '3',
    //     RegNo: 'PR-2B-42',
    //     name: 'Danish Hassan',
    //     class: '2B',
    //     photo: 'https://bootdey.com/img/Content/avatar/avatar3.png',
    //     violations: ["Invalid Tie"],
    //     date: '09/19/2021',
    //     timeDetected: '07:02AM',
    //     status: 'Verified',
    //   },
    //   {
    //     id: '4',
    //     RegNo: 'PR-3B-12',
    //     name: 'Komal Nida',
    //     class: '3B',
    //     photo: 'https://bootdey.com/img/Content/avatar/avatar4.png',
    //     violations: ["Invalid Tie", "Badge Missing", "Inappropriate Shoes"],
    //     date: '09/18/2021',
    //     timeDetected: '07:10AM',
    //     status: 'Not-Verified',
    //   },
    //   {
    //     id: '5',
    //     RegNo: 'SC-8A-56',
    //     name: 'Maham Riaz',
    //     class: '8A',
    //     photo: 'https://bootdey.com/img/Content/avatar/avatar5.png',
    //     violations: ["Inappropriate Scarf", "Inappropriate Shoes"],
    //     date: '09/17/2021',
    //     timeDetected: '07:13AM',
    //     status: 'Verified',
    //   },
    //   {
    //     id: '6',
    //     RegNo: 'PR-2B-42',
    //     name: 'Sheryar Mazhar',
    //     class: '2B',
    //     photo: 'https://bootdey.com/img/Content/avatar/avatar6.png',
    //     violations: ["Invalid Tie"],
    //     date: '09/17/2021',
    //     timeDetected: '07:02AM',
    //     status: 'Not-Verified',
    //   },
    // ]);

  }, [isFocused])


  //useEffect
  useEffect(() => {

    // getData();
    if (teacher != null) {
      fetchData();
    }

  }, [teacher])


  //methods
  const findDate = (status) => {

    if (status == 'Today') {
      return moment(new Date()).format('L')
    }
    else if (status == 'Yesterday') {
      return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24)).format('L')
    }
    else {
      return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)).format('L')
    }
  }


  return (


    <View style={styles.container}>

      <View style={styles.pickerContainer}>

        <View style={styles.pickerBorder}>
          <Picker
            selectedValue={viewSelectedValue}
            style={styles.pickerStyle}
            onValueChange={(itemValue, itemIndex) => setViewSelectedValue(itemValue)}
          >
            <Picker.Item style={styles.pickerItemStyle} label="Today" value="Today" />
            <Picker.Item style={styles.pickerItemStyle} label="Yesterday" value="Yesterday" />
            <Picker.Item style={styles.pickerItemStyle} label="This Week" value="This Week" />
          </Picker>
        </View>

        <View style={styles.pickerBorder}>
          <Picker
            selectedValue={statusSelectedValue}
            style={styles.pickerStyle}
            onValueChange={(itemValue, itemIndex) => setStatusSelectedValue(itemValue)}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Verified" value="Verified" />
            <Picker.Item label="Not-Verified" value="Not-Verified" />
          </Picker>
        </View>
      </View>

      {data.length == 0 ?

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#2575C0' }}> No Violations found for {viewSelectedValue} </Text>
        </View>
        :
        <FlatList
          style={styles.contentList}
          columnWrapperStyle={styles.listContainer}
          data={data}
          keyExtractor={(item) => {
            return item._id;
          }}
          renderItem={({ item }) => {
            return (

              (((viewSelectedValue == 'Today' && findDate(viewSelectedValue) == item.date) || (viewSelectedValue == 'Yesterday' && findDate(viewSelectedValue) == item.date) || (viewSelectedValue == 'This Week' && findDate(viewSelectedValue) <= item.date)) &&
                ((statusSelectedValue != 'All' && statusSelectedValue == item.status) || (statusSelectedValue == 'All'))) ?

                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ViolationDetail", item)}>
                  {/* <SvgUri
                   style={styles.image}
                    source={{ uri: item.studentId.photo }} /> */}
                  <Image style={styles.image} source={{
                    uri: item.studentId.photo
                  }} />
                  <View style={styles.cardContent}>
                    <Text style={styles.name}> {item.RegNo} ({item.studentId.name}) </Text>
                    <Text style={styles.count}> {item.violations.length} Violation(s)</Text>
                    <Text style={styles.count}> {item.date} at {item.timeDetected} </Text>
                    <View style={item.status == 'Verified' ? styles.Vstatus : styles.NVstatus}><Text style={styles.statusText}>{item.status}</Text></View>
                  </View>
                </TouchableOpacity>

                : null
            )
          }} />}

    </View>

  );

}

const styles = StyleSheet.create({

  pickerBorder: {
    borderRadius: 15,
    backgroundColor: '#ffffff',
    height: 35,
    marginTop: 10
  },

  heading:
  {
    alignSelf: 'center',
    fontSize: 20,
    margin: 8,
    color: '#2575C0',
    fontWeight: 'bold'

  },

  container: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: "#ebf0f7",
  },

  pickerContainer: {

    flexDirection: 'row',
    justifyContent: 'space-around'

  },

  pickerStyle: {

    height: 50,
    width: 160,
    color: '#2575C0',
    margin: -10,
    marginLeft: 5,
    marginRight: 5

  },

  pickerItemStyle: {

    color: '#2575C0',

  },

  contentList: {
    flex: 1,
  },

  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#2575C0"
  },

  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 10,
    flexDirection: 'row',
    borderRadius: 30,
  },

  name: {
    fontSize: 15,
    flex: 1,
    alignSelf: "flex-start",
    color: "#2575C0",
    fontWeight: 'bold'
  },
  count: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'flex-start',
    color: "#2575C0"
  },

  Vstatus: {
    marginTop: 5,
    height: 20,
    width: 65,
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

  NVstatus: {
    marginTop: 5,
    height: 20,
    width: 90,
    padding: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ffa291",
    backgroundColor: '#ffa291'
  },
  statusText: {
    color: "white",
    fontSize: 12,
  },
});