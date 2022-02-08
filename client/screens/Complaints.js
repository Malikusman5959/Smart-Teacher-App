
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList
} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'


export default function Complaints({ navigation }) {


  let [teacher, setTeacher] = useState(null);
  var date = moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 720)).format('L');
  const isFocused = useIsFocused();
  const [selector, setSelector] = useState('Today')
  const [data, setData] = useState([]);
  

  const findDate = (status) => {

    if (status == 'Today') {
      return moment(new Date()).format('L')
    }
    else if (status == 'This Week') {
      return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)).format('L')
    }
    else {
      return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 720)).format('L')
    }
  }


  const getData = async () => {
    
    try {
      const jsonValue = await AsyncStorage.getItem('Teacher')
       setTeacher(JSON.parse(jsonValue));
    } catch(e) {
      // error reading value
    }
}

const fetchData = () => {


    axios.get(`http://10.0.2.2:8000/v2/complaint?classs=${teacher.assignedClass}&date=${date}`)
        .then(response => {     
            setData(response.data.complaint)
        })
        .catch(error => {
            console.log("Hi" + error);
        });
}

useEffect(() => {

    getData();

}, [isFocused])


useEffect(() => {

    if (teacher !== null) {
        fetchData();
    }

}, [teacher])


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => true}>
        <View style={styles.date}>
          <Text style={{ color: '#2575C0' }}> Today,  {moment(new Date((new Date()).valueOf())).format('LL')} </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.formContent}>
        <TouchableOpacity onPress={() => setSelector('Today')}><View style={[styles.selector, { backgroundColor: selector == 'Today' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Today' ? '#ffffff' : '#2575C0' }]}>Today </Text></View></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelector('This Week')}><View style={[styles.selector, { backgroundColor: selector == 'This Week' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'This Week' ? '#ffffff' : '#2575C0' }]}>This Week </Text></View></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelector('This Month')}><View style={[styles.selector, { backgroundColor: selector == 'This Month' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'This Month' ? '#ffffff' : '#2575C0' }]}>This Month</Text></View></TouchableOpacity>

      </View>

      <TouchableOpacity style={[{ position: 'absolute', bottom: 12, right: 0, zIndex: 1 }]} onPress={() => navigation.navigate("ComplaintUpload")}>
        <View onPress={() => navigation.navigate("ComplaintUpload")} style={[{  width: 80, height: 80, backgroundColor: '#2575C0', borderColor: 'white', borderRadius: 50, borderWidth: 5 }, styles.shadow]}>
          <Text style={[{ fontSize: 50, marginLeft: 8, color: 'white' }]}> + </Text>
        </View>
      </TouchableOpacity>

     {data.length == 0 ? null : 
     
     <FlatList
        style={styles.list}
        data={data}
        contentContainerStyle={styles.listContainer}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item, index) => {
          return 'key' + index;
        }}
        renderItem={({ item }) => {

          if ((selector == 'Today' && findDate(selector) == item.date) || (selector == 'This Week' && findDate(selector) <= item.date) || (selector == 'This Month' && findDate(selector) <= item.date)) {
            return (

              <TouchableOpacity style={styles.card} onPress={() => { navigation.navigate("ComplaintDetail", item) }}>
                <Text style={[styles.position, { marginTop: 8 }]}>{item.date}</Text>


                <Image style={styles.userImage} source={{ uri: item.studentId.photo }} />
                <View style={styles.cardFooter}>

                  <Text style={styles.name}>{item.studentId.name}</Text>
                  <Text style={styles.position}>{item.RegNo}</Text>
                  <View style={item.status == 'Pending' ? styles.Pstatus : item.status == 'Under Investigation' ? styles.UIstatus : styles.Cstatus}><Text style={[styles.statusText, { color: item.status == 'Closed' ? '#000000' : '#ffffff' }]}>{item.status}</Text></View>

                </View>
              </TouchableOpacity>

            )
          }
          else {
            return (
              null
            );
          }

        }} />

     }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  formContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  date:
  {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    width: '100%',
    padding: 5,
    borderRadius: 0,
    backgroundColor: '#ffffff',
  },

  selector: {
    marginTop: 5,
    height: 30,
    width: 80,
    padding: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#2575C0",
    backgroundColor: '#2575C0'
  },
  selectorText: {
    color: "white",
    fontSize: 14,
  },

  shadow: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 4.37,
    shadowRadius: 7.49,
    elevation: 5,
  },


  body: {
    color: '#2575C0'
  },

  list: {
    paddingHorizontal: 5,
    marginTop: 18,
    backgroundColor: "#E6E6E6",
  },
  listContainer: {
    alignItems: 'flex-start',

  },
  /******** card **************/
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 5,
    backgroundColor: "white",
    flexBasis: '46%',
    marginHorizontal: 5,
    // height : 220,
    borderRadius: 15
  },
  cardFooter: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  userImage: {
    height: 100,
    width: 100,
    marginTop: 8,
    borderRadius: 60,
    alignSelf: 'center',
    borderColor: "#2575C0",
    borderWidth: 4,
  },
  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: 'center',
    color: "#2575C0",
    fontWeight: 'bold'
  },
  position: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: "#2575C0"
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  icon: {
    height: 20,
    width: 20,
  },
  Pstatus: {
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
    borderColor: "#ffa291",
    backgroundColor: '#ffa291'
  },

  UIstatus: {
    marginTop: 5,
    height: 20,
    width: 125,
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
  Cstatus: {
    marginTop: 5,
    height: 20,
    width: 60,
    padding: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#90ee90",
    backgroundColor: '#90ee90'
  },
  statusText: {
    color: "white",
    fontSize: 12,
  },

});