
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




export default function Circulars ({navigation}) {

 

    let [teacher, setTeacher] = useState(null);
    var date = moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 720)).format('L') ;
    const [selector, setSelector] = useState('Today')
    const [shown, setShown] = useState({})

    const [data, setData] = useState([])


    const findDate = (status) => {

        if (status == 'Today') {
            return moment(new Date()).format('L')
        }
        else if (status == 'This Month') {
            return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 720)).format('L') 
        }
        else if (status == 'This Week') {
            return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)).format('L')
        }
        else{

        }

    }

    const fetchData = () => {

        axios.get(`http://10.0.2.2:8000/v2/circular?classs=${teacher.assignedClass}&date=${date}`)
          .then(response => {
            // console.log('getting data from axios', response.data);
            setData(response.data.circular)
          })
          .catch(error => {
            console.log("Hi" + error);
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



  useEffect(() => {

      getData();

  }, [])


  useEffect(() => {

      if (teacher !== null) {
          fetchData();
      }

  }, [teacher])


    return (
        <View style={styles.container}>

<View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center' , justifyContent : 'space-between' }}>
        <TouchableOpacity onPress={() => { navigation.navigate("Home")}}>
          <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Back </Text>
        </TouchableOpacity>
        
      </View>

            <View style={styles.formContent}>
                <TouchableOpacity onPress={() => setSelector('Today')}><View style={[styles.selector, { backgroundColor: selector == 'Today' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Today' ? '#ffffff' : '#2575C0' }]}>Today </Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('This Week')}><View style={[styles.selector, { backgroundColor: selector == 'This Week' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'This Week' ? '#ffffff' : '#2575C0' }]}>This Week </Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('This Month')}><View style={[styles.selector, { backgroundColor: selector == 'This Month' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'This Month' ? '#ffffff' : '#2575C0' }]}>This Month</Text></View></TouchableOpacity>
           
            </View>


            <FlatList
                style={styles.notificationList}
                data={data}
                keyExtractor={(item, index) => {
                    return 'key' + index;
                }}
                renderItem={({ item }) => {

                    if ((selector == 'Today' && findDate(selector) == item.date) || (selector == 'This Week' && findDate(selector) <= item.date) || (selector == 'This Month' && findDate(selector) <= item.date)) {
                        return (

                            <TouchableOpacity onPress={() => { shown == item ? setShown ({}) : setShown (item) }}>
                            <View style={[styles.eventBox ]}>
                              <View style={styles.eventDate}>
                                 <Text  style={styles.eventDay}>{moment(moment(item.date).format()).format('D')}</Text>
                                 <Text  style={styles.eventMonth}>{moment(moment(item.date).format()).format('MMM')}</Text>
                              </View>
                              <View style={styles.eventContent}>
                                <Text  style={styles.eventTime}>{item.subject}</Text>
                                {shown == item ? 
                                <>
                                 <Text  style={styles.description}>{item.body}</Text>
                                 <Text  style={styles.description1}> Farhan Jamil, VP
                                 </Text>
                                 </> : null} 
                              </View>
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
    name: {
        fontSize: 12,
        color: "#2575C0",
        marginLeft: 25,
        alignSelf: 'center'
    },

    status: {
        fontSize: 13,
        borderRadius: 100,
        fontWeight: 'bold',
        color: "#ffffff",
        backgroundColor: '#2575C0',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        marginLeft: 25,
        alignSelf: 'center'
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

    notificationList: {
        marginTop: 10,

    },

    name: {
        color: 'white',
        fontSize : 12
    },

    card: {
        shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowRadius: 7.49,
    elevation: 5,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,

    },
    shadow : {
        shadowColor: '#00000021',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 4.37,
        shadowRadius: 7.49,
        elevation: 5,
    },

    cardContent1: {
        backgroundColor: '#2575C0',
        flexDirection: 'row',
        borderRadius: 10,
        padding: 10

    },

    cardContent2: {
        backgroundColor: 'white',
        padding: 10,
        maxHeight: 100,
        borderRadius: 10,
    },

    cardContent3: {
        backgroundColor: '#ffffff',
        padding : 5,
        flexDirection : 'row',
        justifyContent : 'space-between',
        borderTopColor : '#2575C0',
        borderTopWidth : 1,
        borderBottomLeftRadius : 10,
        borderBottomRightRadius : 10
    },

    body: {
        color: '#2575C0'
    },
    eventList:{
        marginTop:20,
      },
      eventBox: {
        padding:4,
        marginTop:3,
        flexDirection: 'row',
        
      },
      eventDate:{
        flexDirection: 'column',
        width : 30,
        alignSelf : 'center',
        
      },
      eventDay:{
        fontSize:25,
        color: "#2575C0",
        fontWeight: "bold",
      },
      eventMonth:{
        fontSize:15,
        color: "#2575C0",
        fontWeight: "bold",

      },
      eventContent: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft:10,
        backgroundColor: '#FFFFFF',
        padding:10,
        borderRadius:10,
        // borderWidth : 2,
        // borderColor : '#2575C0'
        shadowColor: '#00000021',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 4.37,
        shadowRadius: 7.49,
        elevation: 5,
      },
      description:{
        fontSize:15,
        color: "#646464",
      },
      description1:{
          marginTop : 8,
        fontSize:15,
        color: "#646464",
      },
      eventTime:{
        fontSize:17,
        fontWeight : 'bold',
        marginBottom : 8,
        color:"#2575C0",
      },
      userName:{
        fontSize:16,
        color:"#151515",
      },

});