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


export default function Fines({ route, navigation }) {

    const isFocused = useIsFocused();
    var date = moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)).format('L');
    let [teacher, setTeacher] = useState(null);
    const [data, setData] = useState([])
    // {
    //     RegNo : 'PR-3B-11',
    //     photo : 'https://bootdey.com/img/Content/avatar/avatar1.png',
    //     name : 'Amna Shah',
    //     Violations : [
    //         {violation : 'InAppropriate Shoes',
    //          date : '09/01/2021'
    //         },
    //         {violation : 'InAppropriate Shoes',
    //          date : '09/03/2021'
    //         },
    //         {violation : 'InAppropriate Shoes',
    //          date : '09/05/2021'
    //         }],
    //     status : 'Pending',
    //     amount : 500,
    //     date : '09/19/2021',
    //     dueDate : '09/25/2021'
    // },

    // {
    //     RegNo : 'PR-3B-81',
    //     photo : 'https://bootdey.com/img/Content/avatar/avatar2.png',
    //     name : 'Ahmed Ali',
    //     Violations : [
    //         {violation : 'Tie Missing',
    //          date : '09/05/2021'
    //         },
    //         {violation : 'Tie Missing',
    //          date : '09/07/2021'
    //         },
    //         {violation : 'Tie Missing',
    //          date : '09/10/2021'
    //         }],
    //     status : 'Pending',
    //     amount : 500,
    //     date : '09/10/2021',
    //     dueDate : '09/16/2021'
    // },

    // {
    //     RegNo : 'PR-3B-50',
    //     photo : 'https://bootdey.com/img/Content/avatar/avatar3.png',
    //     name : 'Bilal Ahmed',
    //     Violations : [
    //         {violation : 'Tie Missing',
    //          date : '09/01/2021'
    //         },
    //         {violation : 'Tie Missing',
    //          date : '09/02/2021'
    //         },
    //         {violation : 'Tie Missing',
    //          date : '09//2021'
    //         }],
    //     status : 'Paid',
    //     amount : 500,
    //     date : '09/12/2021',
    //     dueDate : '09/15/2021'
    // },


    const [selector, setSelector] = useState('Pending');
    const [userViolations, setuserViolations] = useState([
        { name : 'Badge Missing',
          date : '09/28/2021' },
          { name : 'Badge Missing',
          date : '09/29/2021' },
          { name : 'Badge Missing',
          date : '09/30/2021' }
    ]);

    const [modal, setModal] = useState(false);
    let [userSelected, setUserSelected] = useState(null);


    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('Teacher')

            setTeacher(JSON.parse(jsonValue));
        } catch (e) {
            // error reading value
        }
    }

    const fetchData = () => {

        axios.get(`http://10.0.2.2:8000/v2/fine?classs=${teacher.assignedClass}&date=${date}`)
            .then(response => {
                setData(response.data.fine);
               
            })
            .catch(error => {
            });
    }

    const fetchViolation = (id) => {

        axios.get(`http://localhost:8000/v2/violationById?id=${id}`)
            .then(response => {
                 return (response.violation)
            })
            .catch(error => {
                return 'None'
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



    const clickEventListener = (item) => {

        setUserSelected(item);
        setModal(true);

    }


    return (
        <View style={styles.container}>

            <View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                    <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Back </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.date}>
                <Text style={{ color: '#2575C0' }}> Since {moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)).format('LL')} </Text>
            </View>

            <View style={styles.formContent}>
                <TouchableOpacity onPress={() => setSelector('Pending')}><View style={[styles.selector, { width: 100, backgroundColor: selector == 'Pending' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Pending' ? '#ffffff' : '#2575C0' }]}>Pending </Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('Paid')}><View style={[styles.selector, { backgroundColor: selector == 'Paid' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Paid' ? '#ffffff' : '#2575C0' }]}>Paid</Text></View></TouchableOpacity>
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
                                <TouchableOpacity style={[styles.card]} onPress={() => { clickEventListener(item) }}>
                                    <Image style={styles.image} source={{ uri: item.studentId.photo}} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.name}>{item.studentId.name}</Text>
                                        <Text style={styles.position}>{item.RegNo}</Text>
                                        <Text style={styles.position}>{item.date}</Text>
                                        <View style={item.status == 'Paid' ? styles.Vstatus : (item.dueDate <= moment(new Date()).format('L')) ? [styles.NVstatus, { backgroundColor: '#FF0000' }] : styles.NVstatus}><Text style={styles.statusText}>{((item.dueDate < moment(new Date()).format('L')) && item.status == 'Pending') ? 'Past Due' : item.status}</Text></View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }

                    }} />
            }


            {userSelected == null ? null :
            
            <Modal
                animationType={'fade'}
                transparent={true}
                onRequestClose={() => setModal(false)}
                visible={modal}>

                <View style={styles.popupOverlay}>
                    <View style={styles.popup}>
                        <View style={styles.popupContent}>
                            <ScrollView contentContainerStyle={styles.modalInfo}>
                                <Image style={[styles.image, { alignSelf: 'center', marginTop: 10 }]} source={{ uri: userSelected.studentId.photo }} />
                                <Text style={styles.about}><Text style={styles.label}>RegNo :</Text> {userSelected.date}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Name :</Text> {userSelected.studentId.name}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Violations :</Text></Text>
                                {userViolations.length != 0 ? userViolations.map((x, index) => { return <View key={index} style={{ backgroundColor: '#2575C0', margin: 2, marginLeft: 25, padding: 2, borderRadius: 8 }}><Text style={{ color: '#ffffff' }}>{x.name} on {x.date} </Text></View> }) : null}
                                <Text style={styles.about}><Text style={styles.label}>levied On :</Text> {userSelected.date}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Amount :</Text> {userSelected.amount}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Due Date : </Text> {userSelected.dueDate} {(userSelected.dueDate <= moment(new Date()).format('L')) && userSelected.status != 'Paid' ? '(Past Due)' : null}</Text>

                            </ScrollView>
                        </View>
                        <View style={styles.popupButtons}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => { setModal(false) }}>
                                <Text style={styles.actionButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            }
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

    label: {
        fontWeight: 'bold',

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
        borderWidth: 5,
        marginBottom: 20

    },

    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 4,
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: "white",
        flexBasis: '46%',
        padding: 5,
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
        marginHorizontal: 25,
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
        padding: 10,
        marginTop: 15
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