import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Modal,
    ScrollView
} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'


export default function Users({route , navigation }) {

    let [teacher, setTeacher] = useState(null);
    var date = moment(new Date()).format('L');
    const isFocused = useIsFocused();
    const [data, setData] = useState([])
        // {

        //     RegNo: 'PR-3B-15',
        //     photo: 'https://bootdey.com/img/Content/avatar/avatar7.png',
        //     date: '09/19/2021',
        //     to: 'Mam Amna',
        //     from: 'Ali Ahmed',
        //     subject: 'Sick Leave Application',
        //     body: 'Sick leave (or paid sick days or sick pay) is paid time off from work that workers can use to stay home to address their health needs without losing pay. It differs from paid vacation time or time off work to deal with personal matters, because sick leave is intended for health-related purposes.',
        //     signedBy: 'Mr Ahmed',
        //     leaveDays: ["09/20/2021", "09/21/2021"],
        //     status: 'Approved'
        // },
        
        // {

        //     RegNo: 'PR-3B-11',
        //     photo: 'https://bootdey.com/img/Content/avatar/avatar3.png',
        //     date: '09/19/2021',
        //     to: 'Mam Amna',
        //     from: 'Uzma Shah',
        //     subject: 'One day leave for dentist appointment',
        //     body: 'Sick leave (or paid sick days or sick pay) is paid time off from work that workers can use to stay home to address their health needs without losing pay. It differs from paid vacation time or time off work to deal with personal matters, because sick leave is intended for health-related purposes.',
        //     signedBy: 'Muraad Shah',
        //     leaveDays: ["09/15/2021"],
        //     status: 'Not-Approved'
        // }
   
    const [selector, setSelector] = useState('Not-Approved')
    const [modal, setModal] = useState(false);
    let [userSelected, setUserSelected] = useState(null);


    const clickEventListener = (item) => {

        setUserSelected(item)
        setModal(true);

    }

    const getIndex = (regNo, arr)=> {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i].RegNo === regNo) {
                return i;
            }
        }
        return -1; 
    }

    const updateApplicationStatus = (id) => {

        axios.patch(`http://10.0.2.2:8000/v2/leaveapplication?id=${id}`)
            .then(response => {     
                console.log("Updated")
            })
            .catch(error => {
                console.log("Not Updated")
               
            });
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


    const updateStatus = (regNo , id) => {
    
        let newData = data;
        var index = getIndex(regNo , data);
        newData[index] = {...newData[index], status : 'Approved'};
        setData(newData);
        setModal(false);

        //make an API call to update status
        console.log("id : " , id)
        updateApplicationStatus(id);
        updateAttendance(regNo , 'OnLeave');


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

        axios.get(`http://10.0.2.2:8000/v2/leaveapplication?classs=${teacher.assignedClass}&date=${date}`)
            .then(response => {     
                setData(response.data.leaveApplication)
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

            <View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                    <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Back </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.date}>
                <Text style={{ color: '#2575C0' }}> Today, {moment(new Date((new Date()))).format('LL')} </Text>
            </View>

            <View style={styles.formContent}>
                <TouchableOpacity onPress={() => setSelector('Not-Approved')}><View style={[styles.selector, { width: 100, backgroundColor: selector == 'Not-Approved' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Not-Approved' ? '#ffffff' : '#2575C0' }]}>Not-Approved </Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('Approved')}><View style={[styles.selector, { backgroundColor: selector == 'Approved' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Approved' ? '#ffffff' : '#2575C0' }]}>Approved</Text></View></TouchableOpacity>
            </View>

            {data.length == 0 ? null : 
            

            <FlatList
                style={styles.userList}
                columnWrapperStyle={styles.listContainer}
                data={data}
                keyExtractor={(item, index) => {
                    return 'key' + index;
                }}
                renderItem={({ item }) => {
                    if (selector == item.status && item.date >= moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)).format('L')) {
                        return (
                            <TouchableOpacity style={styles.card} onPress={() => { clickEventListener(item) }}>
                                <Image style={styles.image} source={{ uri: item.studentId.photo }} />
                                <View style={styles.cardContent}>
                                    <Text style={styles.name}>{item.studentId.name}</Text>
                                    <Text style={styles.position}>{item.RegNo}</Text>
                                    <Text style={styles.position}>{item.date}</Text>
                                    <View style={item.status == 'Approved' ? styles.Vstatus : styles.NVstatus}><Text style={styles.statusText}>{item.status}</Text></View>

                                </View>
                            </TouchableOpacity>
                        )
                    }

                }}/>
            }
            

            {userSelected != null? 
            
            <Modal
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => setModal(false)}
            visible={modal}>

            <View style={styles.popupOverlay}>
                <View style={styles.popup}>
                    <View style={styles.popupContent}>
                        <ScrollView contentContainerStyle={styles.modalInfo}>
                            <Image style={[styles.image, {alignSelf : 'center' , marginTop : 10}]} source={{ uri: userSelected.studentId.photo }} />
                            <Text style={styles.about}><Text style={styles.label}>Date :</Text> {userSelected.date}</Text>
                            <Text style={styles.about}><Text style={styles.label}>To :</Text> {userSelected.to}</Text>
                            <Text style={styles.about}><Text style={styles.label}>From :</Text> {userSelected.from}</Text>
                            <Text style={styles.about}><Text style={styles.label}>Subject :</Text> {userSelected.subject}</Text>
                            <Text style={styles.about}><Text style={styles.label}>Body :</Text> {userSelected.body}</Text>
                            <Text style={styles.about}><Text style={styles.label}>Signed By :</Text> {userSelected.signedBy}</Text>
                            
                            <Text style={styles.about}><Text style={styles.label}>Leave Days :</Text> {userSelected.leaveDays ? userSelected.leaveDays.map((x , index) => {return <Text key={index}> {x},  </Text>} ) : null}</Text>
                        </ScrollView>
                    </View>
                    <View style={styles.popupButtons}>
                       
                        {userSelected.status == 'Not-Approved' ? 
                         <TouchableOpacity style={styles.actionButton} onPress={() => { updateStatus(userSelected.RegNo , userSelected._id) }}>
                         <Text style={styles.actionButtonText}>Approve</Text>
                     </TouchableOpacity> : null}
                        <TouchableOpacity style={styles.actionButton} onPress={() => { setModal(false) }}>
                            <Text style={styles.actionButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal> : null}

        </View>
    );

}

const styles = StyleSheet.create({

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

    label : {
        fontWeight : 'bold',
        
    },

    txtClose: {
        color: '#000000',
        fontSize: 21,
    },
    container: {
        flex: 1,
        backgroundColor: "#eeeeee"
    },
    header: {
        backgroundColor: "#00CED1",
        height: 200
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
        flex: 1,
    },
    detailContent: {
        top: 80,
        height: 500,
        width: Dimensions.get('screen').width - 90,
        marginHorizontal: 30,
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: "#ffffff"
    },
    userList: {
        flex: 1,
    },
    cardContent: {
        marginLeft: 20,
        marginTop: 10
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderColor: '#2575C0',
        borderWidth: 5

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

        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: "white",
        flexBasis: '46%',
        padding: 10,
        flexDirection: 'row',
        borderRadius: 8
    },

    name: {
        fontSize: 18,
        flex: 1,
        alignSelf: 'flex-start',
        color: "#2575C0",
        fontWeight: 'bold'
    },
    position: {
        fontSize: 14,
        flex: 1,
        alignSelf: 'flex-start',
        color: "#2575C0"
    },
    about: {
        marginHorizontal: 10,
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
    /************ modals ************/
    popup: {
        backgroundColor: 'white',
        marginTop: 80,
        marginHorizontal: 20,
        borderRadius: 7,
    },
    popupOverlay: {
        backgroundColor: "#00000057",
        flex: 1,
        marginTop: 30
    },
    popupContent: {
        //alignItems: 'center',
        margin: 5,
        height: 350,
    },
    popupHeader: {
        marginBottom: 45
    },
    popupButtons: {
        marginTop: 15,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: "#eee",
        justifyContent: 'center'
    },
    popupButton: {
        flex: 1,
        marginVertical: 16
    },
    btnClose: {
        height: 20,
        backgroundColor: '#2575C0',
        padding: 20
    },
    modalInfo: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding : 10
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

    formContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
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