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
    ScrollView,
    TextInput
} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Students({route , navigation }) {


  let [teacher, setTeacher] = useState(null);
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [userSelected, setUserSelected] = useState(null);
    const [selector, setSelector] = useState('');


    const clickEventListener = (item) => {

        setUserSelected(item)
        setModal(true);

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

        axios.get(`http://10.0.2.2:8000/v2/student?classs=${teacher.assignedClass}`)
          .then(response => {
            // console.log('getting data from axios', response.data);
            setData(response.data.students)
          })
          .catch(error => {
            console.log("Hi" + error);
          });
    }


    useEffect(() => {

        getData();

    }, [])

    //useEffect
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

            <View style={{flexDirection : 'row' , justifyContent : 'space-between' , alignItems : 'center'}}>
            <View style={styles.date}>
            <TextInput  style={[styles.input]}
                                     onChangeText={(text) => { setSelector(text) }}
                                     placeholder="Enter name or regNo"
                                     placeholderTextColor="#666666"
                       />
               
            
            </View>
            <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={{ color: '#ffffff', fontSize: 15 }}>Search</Text>
            </TouchableOpacity>

            </View>
            
            
            <FlatList
                style={styles.userList}
                columnWrapperStyle={styles.listContainer}
                data={data}
                keyExtractor={(item) => {
                    return item._id;
                }}
                renderItem={({ item }) => {
                    if (selector == '' || item.name.toLowerCase().includes(selector.toLowerCase()) || item.RegNo.toLowerCase().includes(selector.toLowerCase()) ) {
                        return (
                            <TouchableOpacity style={styles.card} onPress={() => { clickEventListener(item) }}>
                                <Image style={styles.image} source={{ uri: item.photo }} />
                                <View style={styles.cardContent}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.position}>{item.RegNo}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }

                }} />

            <Modal
                animationType={'fade'}
                transparent={true}
                onRequestClose={() => setModal(false)}
                visible={modal}>

               { userSelected ?  <View style={styles.popupOverlay}>
                    <View style={styles.popup}>
                        <View style={styles.popupContent}>
                            <ScrollView contentContainerStyle={styles.modalInfo}>
                                <Image style={[styles.image, {alignSelf : 'center' , marginTop : 10 , marginBottom : 25 , width : 130 , height : 130 , borderRadius : 70 , borderWidth : 6}]} source={{ uri: userSelected.photo }} />
                                <Text style={styles.about}><Text style={styles.label}>RegNo :</Text> {userSelected.RegNo}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Name :</Text> {userSelected.name}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Class :</Text> {userSelected.class}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Parent :</Text> {userSelected.parentId.name}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Contact :</Text> {userSelected.parentId.phoneNumber}</Text>
                                <Text style={styles.about}><Text style={styles.label}>Address :</Text> {userSelected.parentId.address}</Text>
                            </ScrollView>
                        </View>
                        <View style={styles.popupButtons}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => { setModal(false) }}>
                                <Text style={styles.actionButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> : null}
            </Modal>
        </View>
    );

}

const styles = StyleSheet.create({

    input : {
        
    },

    buttonContainer: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 8,
       
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%',
        marginRight : 8,
        borderRadius: 30,
        backgroundColor: "#2575C0",
    },

    date:
    {
        // borderColor : '#2575C0',
        // borderWidth : 2,
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 3,
       
        borderRadius : 50,
        flexDirection: 'row',
        justifyContent: 'center',
        margin : 5,
        marginTop: 10,
        marginBottom: 10,
        padding: 0,
        height : 45,
        backgroundColor: '#ffffff',
        width : '70%'
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
        marginLeft: 5,
        width : '100%',
        marginTop: 0,
        flexDirection : 'row',
        padding : 8
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 45,
        borderColor: '#2575C0',
        borderWidth: 3,
        

    },

    card: {
        shadowColor: '#00000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.07,
        shadowRadius: 7.49,
        elevation: 1,
        marginVertical: 3,
        marginHorizontal: 5,
        backgroundColor: "white",
        // flexBasis: '46%',
        padding: 5,
        flexDirection: 'row',
        borderRadius: 8
    },

    name: {
        fontSize: 15,
        flex: 1,
        alignSelf: 'flex-start',
        color: "#2575C0",
        // fontWeight: 'bold'
    },
    position: {
        fontSize: 15,
        flex: 1,
        alignSelf: 'flex-start',
        color: "#2575C0"
    },
    about: {
        marginLeft: '25%',
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
        height: 320,
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
        padding : 10,
        
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