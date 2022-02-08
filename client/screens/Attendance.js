
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



export default function Attendance({ navigation }) {

    var date = moment(new Date()).format('L');
    // var date = '09/18/2021';
    const isFocused = useIsFocused();
    const [selector, setSelector] = useState('All')
    const [data, setData] = useState([])
    let [teacher, setTeacher] = useState(null);


    //     {
    //         RegNo: 'PR-3B-12',
    //         name: 'Muhammad Ali',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-13',
    //         name: 'Atif Ijaz',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-14',
    //         name: 'Maya Irfan',
    //         date: '09/05/2021',
    //         status: 'Absent',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-15',
    //         name: 'Ali Safdar',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-16',
    //         name: 'Fatima Mazhar',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-17',
    //         name: 'Moeez Ahmed',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-18',
    //         name: 'Junaid Shah',
    //         date: '09/05/2021',
    //         status: 'Absent',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-19',
    //         name: 'Arfa Imran',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-20',
    //         name: 'Shahrukh Khan',
    //         date: '09/05/2021',
    //         status: 'OnLeave',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-21',
    //         name: 'Safina Javed',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-22',
    //         name: 'Nimra Batool',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-23',
    //         name: 'Ahmed Malik',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-24',
    //         name: 'Hayat Kashif',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-25',
    //         name: 'Muneeba Riaz',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-26',
    //         name: 'Maham Riaz',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-27',
    //         name: 'Sheryar Mazhar',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    //     {
    //         RegNo: 'PR-3B-28',
    //         name: 'Mubeen Ahmed',
    //         date: '09/05/2021',
    //         status: 'Present',
    //         time: '07:12 AM'
    //     },
    // ])

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('Teacher')

           setTeacher(JSON.parse(jsonValue));
        } catch(e) {
          // error reading value
        }
    }

    const fetchData = () => {

        axios.get(`http://10.0.2.2:8000/v2/attendance?classs=${teacher.assignedClass}&date=${date}`)
            .then(response => {
                setData(response.data.attendance)
            })
            .catch(error => {
            });
    }


    useEffect(() => {

        getData();

    }, [isFocused])


    useEffect(() => {

        // getData();
        if (teacher !== null) {
            fetchData();
        }

    }, [teacher])


    const getIndex = (regNo, arr) => {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].RegNo === regNo) {
                return i;
            }
        }
        return -1;
    }

    const updateAttendance = (regNo, newStatus) => {

        axios.patch(`http://10.0.2.2:8000/v2/attendance?RegNo=${regNo}&date=${date}&status=${newStatus}`)
            .then(response => {
                // setData(response.data.violation)
            })
            .catch(error => {
                console.log("Hi" + error);
            });

            fetchData();
    }

    const updateStatus = (regNo, newStatus) => {

        let newData = data;
        var index = getIndex(regNo, data);
        newData[index] = { ...newData[index], status: newStatus };
        setData(newData);
        //make an API call to update status
        updateAttendance(regNo, newStatus);
    }


    const HandleLongPress = (regNo, status) => {

        var newStatus = status == 'Present' ? 'Absent' : 'Present';

        return Alert.alert(
            "Change Attendance Status",
            `Do you want to update this ${status} to ${newStatus}?`,
            [
                {
                    text: "Yes",
                    onPress: () => {
                        updateStatus(regNo, newStatus);
                        console.log('Done');
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    }

    const findPresent = () => {
        var present = data.filter((item) => {
            return item.status == 'Present'
        })
        return present.length
    }

    const findOnLeave = () => {
        var OnLeave = data.filter((item) => {
            return item.status == 'OnLeave'
        })
        return OnLeave.length
    }

    return (
        <View style={styles.container}>

            <View style={styles.date}>
                <Text style={{ color: '#2575C0' }}> Today, {moment(new Date()).format('LL')} </Text>
            </View>


            <View style={styles.formContent}>
                <TouchableOpacity onPress={() => setSelector('Present')}><View style={[styles.selector, { backgroundColor: selector == 'Present' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Present' ? '#ffffff' : '#2575C0' }]}>Present {findPresent()}</Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('All')}><View style={[styles.selector, { backgroundColor: selector == 'All' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'All' ? '#ffffff' : '#2575C0' }]}>All {data.length}</Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('Absent')}><View style={[styles.selector, { backgroundColor: selector == 'Absent' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Absent' ? '#ffffff' : '#2575C0' }]}>Absent {data.length - findPresent() - findOnLeave()}</Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('OnLeave')}><View style={[styles.selector, { backgroundColor: selector == 'OnLeave' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'OnLeave' ? '#ffffff' : '#2575C0' }]}>OnLeave {findOnLeave()}</Text></View></TouchableOpacity>
            </View>


            <FlatList
                style={styles.notificationList}
                data={data}
                keyExtractor={(item) => {
                    return item.RegNo;
                }}
                renderItem={({ item }) => {
                    if (selector != 'All') {
                        if (selector == item.status) {
                            return (


                                <TouchableOpacity onLongPress={() => { item.status == 'OnLeave' ? null : HandleLongPress(item.RegNo, item.status) }} delayLongPress={1000}>
                                    <View style={styles.notificationBox}>

                                        <View style={{ flexDirection: 'row' }}>

                                            <Text style={[styles.status, { marginLeft: 5, backgroundColor: item.status == 'Present' ? '#2575C0' : item.status == 'Absent' ? '#ffa291' : '#90ee90' }]}>{item.status == 'Present' ? 'P' : item.status == 'Absent' ? 'A' : 'L'}</Text>
                                            <Text style={styles.name}>{item.RegNo}</Text>
                                            <Text style={styles.name}>{item.name}</Text>

                                        </View>

                                        <View style={{ justifyContent: 'center' }}>

                                            <Text style={[styles.name, { marginRight: 8 }]}>{item.time}</Text>

                                        </View>
                                    </View>
                                </TouchableOpacity>

                            )
                        }
                        else {
                            return null;
                        }

                    }


                    else {
                        return (

                            <TouchableOpacity onLongPress={() => { HandleLongPress(item.RegNo, item.status) }} delayLongPress={1000}>
                                <View style={styles.notificationBox}>
                                    <View style={{ flexDirection: 'row' }}>

                                        <Text style={[styles.status, { marginLeft: 5, backgroundColor: item.status == 'Present' ? '#2575C0' : item.status == 'Absent' ? '#ffa291' : '#90ee90' }]}>{item.status == 'Present' ? 'P' : item.status == 'Absent' ? 'A' : 'L'}</Text>
                                        <Text style={styles.name}>{item.RegNo}</Text>
                                        <Text style={styles.name}>{item.name}</Text>

                                    </View>

                                    <View style={{ justifyContent: 'center' }}>

                                        <Text style={[styles.name, { marginRight: 8 }]}>{item.time}</Text>

                                    </View>


                                </View>
                            </TouchableOpacity>
                        )

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
    notificationList: {
        marginTop: 10,
        padding: 10,
    },
    notificationBox: {
        paddingTop: 3,
        paddingBottom: 3,
        marginTop: 1,
        marginBottom: 3,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginLeft: 20
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
});