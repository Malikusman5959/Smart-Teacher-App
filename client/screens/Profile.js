
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Modal,

} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { icons } from "../constants";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'


export default function ProfileView({ route, navigation }) {


    const isFocused = useIsFocused();
    const [data, setData] = useState(null);

    const [modal, setModal] = useState(false);
    const [see, setSee] = useState(true);
    const [current, setCurrent] = useState('');
    const [neww, setNeww] = useState('');
    const [confirm, setConfirm] = useState('');


    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('Teacher')
            setData(JSON.parse(jsonValue));
        } catch (e) {
            // error reading value
        }
    }

    const changePassword = (id , newPassword) => {

        axios.post(`http://10.0.2.2:8000/v2/teacher/changePassword?id=${id}&newPassword=${newPassword}`)
            .then(response => {
                console.log(response.data.Teacher)
            })
            .catch(error => {
            });
    }


    useEffect(() => {

        getData();

    }, [isFocused])


    const checkCurrentPassword = (text) => {
        if (text == data.password) {
            return true;
        }
        else { return false }
    }

    const validatePassword = (data) => {
        if (
          data.match(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
          )
        ) {
          return true;
        } else {
          return false;
        }
      };

      const setPassword = () => {
        
        changePassword(data.employeeId , neww);

        setModal(false); 
        setConfirm('')
        setCurrent('')
        setNeww('')

      };


    return (
        <ScrollView style={styles.container}>

            <View style={{ height: 60, backgroundColor: '#2575C0', flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                    <Text style={{ marginLeft: 15, color: '#ffffff', fontSize: 17 }}> Back </Text>
                </TouchableOpacity>
            </View>

            {data == null ? null :
            <>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image style={styles.avatar} source={{ uri: data.photo }} />
                    <Text style={styles.name}>
                        {data.name}
                    </Text>
                </View>
            </View>

            <View style={styles.profileDetail}>
                <View style={styles.detailContent}>
                    <Text style={styles.title}>Students</Text>
                    <Text style={styles.count}>60</Text>
                </View>
                <View style={styles.detailContent}>
                    <Text style={styles.title}>Classes</Text>
                    <Text style={styles.count}>{data.classes && data.classes.length}</Text>
                </View>
                <View style={styles.detailContent}>
                    <Text style={styles.title}>Subjects</Text>
                    <Text style={styles.count}>{data.subjects && data.subjects.length}</Text>
                </View>
            </View>


            <View style={styles.bodyContent}>

                <View style={styles.card}>
                    <Text style={styles.cardTittle}>Assigned Class</Text>
                    <Text style={styles.bodyText} > {data.assignedClass}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between' }}>
                    <View style={[styles.card, { width: '45%', marginRight: 25 }]}>
                        <Text style={styles.cardTittle}>Classes</Text>
                        {data.classes && data.classes.map((item, index) => {
                            return <Text key={index} style={styles.bodyText}> {item}</Text>
                        })}
                    </View>

                    <View style={[styles.card, { width: '45%' }]}>
                        <Text style={styles.cardTittle}>Subjects</Text>
                        {data.subjects && data.subjects.map((item, index) => {
                            return <Text key={index} style={styles.bodyText}> {item}</Text>
                        })}
                    </View>
                </View>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => { setModal(true) }}>
                    <Image style={styles.icon} source={icons._pswrdIcon} />
                    <Text style={{ color: '#ffffff', fontSize: 15 }}>Change Password</Text>
                </TouchableOpacity>

            </View>
            
            </>}

            <Modal
                animationType={'fade'}
                transparent={true}
                onRequestClose={() => setModal(false)}
                visible={modal}>

                <View style={styles.popupOverlay}>
                    <View style={styles.popup}>
                        <View style={styles.popupContent}>
                            <ScrollView contentContainerStyle={styles.modalInfo}>


                                <View style={{ backgroundColor: '#2575C0', width: '100%', paddingVertical: 10, paddingBottom: 18, borderTopEndRadius: 6, borderTopStartRadius: 6 }}>
                                    <Text style={{ alignSelf: 'center', fontSize: 22, color: '#ffffff', fontWeight: 'bold', marginTop: 10 }}> Change Password </Text>
                                </View>

                                {see ?
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, width: '80%' }}>
                                        <Text style={[styles.label]}> Current Password </Text>
                                        <TextInput value={current} style={[styles.input, { borderColor: (current == '' || checkCurrentPassword(current)) ? '#145691' : '#FF0000' }]}
                                         onChangeText={(text) => { setCurrent(text) }} />

                                    </View> : null}

                                <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, width: '80%' }}>
                                    <Text style={[styles.label]}> New Password </Text>
                                    <TextInput
                                        style={[styles.input, { borderColor: (neww == '' || validatePassword(neww)) ? '#145691' : '#FF0000' }]}
                                onChangeText={(text) => { setNeww(text) }}
                                        onFocus={() => setSee(false)}
                                        onBlur={() => setSee(true)} />
                                </View>

                                <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, width: '80%' }}>
                                    <Text style={[styles.label]}> Confirm New Password </Text>
                                    <TextInput  style={[styles.input, { borderColor: (confirm == '' || confirm==neww )? '#145691' : '#FF0000' }]}
                                     onChangeText={(text) => { setConfirm(text) }}
                                     onFocus={() => setSee(false)}
                                     onBlur={() => setSee(true)} />
                                </View>


                            </ScrollView>
                        </View>
                        <View style={styles.popupButtons}>


                            <TouchableOpacity style={styles.actionButton} onPress={() => { (current == data.password && validatePassword(neww) && confirm == neww) ? setPassword() : null}}>
                                <Text style={styles.actionButtonText}>Change</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={() => { setModal(false);
                            setConfirm('')
                            setCurrent('')
                            setNeww('')
                              }}>
                                <Text style={styles.actionButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );

}

const styles = StyleSheet.create({

    bodyText: {

    },

    label: {
        color: '#2575C0',
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'flex-start'
    },

    input: {
        fontSize: 13,
        width: '100%',
        height: 35,
        color: '#145691',
        textAlign: 'left',
        textAlignVertical: 'center',
        borderWidth: 1,
        borderColor: '#145691',
        borderRadius: 8,
        marginRight: 0
    },


    cardTittle: {
        color: "#2575C0",
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
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
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        height: 'auto',
        width: '100%',
        marginTop: 10,
        flexDirection: 'column',
        alignItems: 'center'
    },

    icon: {
        height: 20,
        width: 20,
        marginRight: 8,
        alignSelf: 'center',
        tintColor: '#ffffff'
    },
    header: {

        backgroundColor: "#2575C0",
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
    },
    avatar: {

        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 6,
        borderColor: "white",
        marginBottom: 10,
        marginTop: -20
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: 'bold',
        marginBottom: 8
    },
    profileDetail: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        alignSelf: 'center',
        marginTop: 250,
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: "#ffffff",
        borderRadius: 20,
        // borderColor: '#2575C0',
        // borderWidth: 3
    },
    detailContent: {
        margin: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#2575C0"
    },
    count: {
        fontSize: 18,
        fontWeight: 'bold',

    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
        marginTop: 50
    },
    textInfo: {
        fontSize: 18,
        marginTop: 20,
        color: "#696969",
    },
    buttonContainer: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        marginTop: 15,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 200,
        borderRadius: 30,
        backgroundColor: "#2575C0",
    },
    description: {
        fontSize: 20,
        color: "#000000",
        marginTop: 10,
        textAlign: 'center'
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
        // margin: 5,
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
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 10
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
