
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


export default function Homework({navigation}) {


    let [teacher, setTeacher] = useState(null);
    var date = moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 720)).format('L');
  const isFocused = useIsFocused();

    const [selector, setSelector] = useState('Today');

    const [data, setData] = useState([])
        // {
        //     class: '3B',
        //     subject: 'Maths',
        //     date: '09/20/2021',
        //     dueDate: '09/25/2021',
        //     homeWorkDescription: 'ns, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets',
        //     assignedBy: 'Maira Shah'
        // },
        // {
        //     class: '4B',
        //     subject: 'Algebra',
        //     date: '09/19/2021',
        //     dueDate: '09/24/2021',
        //     homeWorkDescription: 'Here you can generate printable math worksheets for a multitude of topics: all the basic operations, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets by grade levels grades 1, 2, 3, 4, 5, 6, and you can generate printable math worksheets for a multitude of topics: all the basic operations, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets',
        //     assignedBy: 'Maira Shah'
        // },
        // {
        //     class: '3A',
        //     subject: 'Maths',
        //     date: '09/18/2021',
        //     dueDate: '09/16/2021',
        //     homeWorkDescription: 'Here you can generate printable math worksheets for a multitude of topics: all the basic operations, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets by grade levels grades 1, 2, 3, 4, 5, 6, and you can generate printable math worksheets for a multitude of topics: all the basic operations, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets',
        //     assignedBy: 'Maira Shah'
        // },
        // {
        //     class: '3C',
        //     subject: 'Maths',
        //     date: '09/15/2021',
        //     dueDate: '09/15/2021',
        //     homeWorkDescription: 'Here you can generate printable math worksheets for a multitude of topics: all the basic operations, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets by grade levels grades 1, 2, 3, 4, 5, 6, and you can generate printable math worksheets for a multitude of topics: all the basic operations, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets',
        //     assignedBy: 'Maira Shah'
        // },
        // {
        //     class: '3C',
        //     subject: 'Algebra',
        //     date: '09/18/2021',
        //     dueDate: '09/15/2021',
        //     homeWorkDescription: 'Here you can generate printable math worksheets for a multitude of topics: all the basic operations, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets by grade levels grades 1, 2, 3, 4, 5, 6, and you can generate printable math worksheets for a multitude of topics: all the basic operations, clock, money, measuring, fractions, decimals, percent, proportions, ratios, factoring, equations, expressions, geometry, square roots, and more. We also offer pages that list worksheets',
        //     assignedBy: 'Maira Shah'
        // }
    

    const findDate = (status) => {

        if (status == 'Today') {
            return moment(new Date()).format('L')
        }
        else if (status == 'Yesterday') {
            return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24)).format('L')
        }
        else if (status == 'This Month') {
            return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 720)).format('L')
        }
        else {
            return moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 168)).format('L')
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
    
    
        axios.get(`http://10.0.2.2:8000/v2/homework?classs=${teacher.assignedClass}&date=${date}&teacher=${teacher._id}`)
            .then(response => {     
                setData(response.data.homeWork)
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

            <View style={styles.formContent}>
                <TouchableOpacity onPress={() => setSelector('Yesterday')}><View style={[styles.selector, { backgroundColor: selector == 'Yesterday' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Yesterday' ? '#ffffff' : '#2575C0' }]}>Yesterday</Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('Today')}><View style={[styles.selector, { backgroundColor: selector == 'Today' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'Today' ? '#ffffff' : '#2575C0' }]}>Today </Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('This Week')}><View style={[styles.selector, { backgroundColor: selector == 'This Week' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'This Week' ? '#ffffff' : '#2575C0' }]}>This Week </Text></View></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelector('This Month')}><View style={[styles.selector, { backgroundColor: selector == 'This Month' ? '#2575C0' : '#ffffff' }]}><Text style={[styles.selectorText, { color: selector == 'This Month' ? '#ffffff' : '#2575C0' }]}>This Month </Text></View></TouchableOpacity>
            </View>

            <TouchableOpacity style={[{position : 'absolute' , bottom : 12 , right :0 , zIndex : 1} , styles.shadow]} onPress={() => navigation.navigate("HomeWorkUpload" , teacher)}>
            <View style={[{ width : 80 , height : 80, backgroundColor : '#2575C0' , borderColor : 'white' , borderRadius : 50 , borderWidth : 5}]}> 
                <Text style ={[{ fontSize :50 , marginLeft : 8 , color : 'white'} ]}> + </Text>
            </View>
            </TouchableOpacity> 

            <FlatList
                style={styles.notificationList}
                data={data}
                keyExtractor={(item, index) => {
                    return 'key' + index;
                }}
                renderItem={({ item }) => {

                    if ((selector == 'Today' && findDate(selector) == item.date) || (selector == 'Yesterday' && findDate(selector) == item.date) || (selector == 'This Week' && findDate(selector) <= item.date) || (selector == 'This Month' && findDate(selector) <= item.date)) {
                        return (

                            <TouchableOpacity onPress={() => navigation.navigate("HomeWorkDetail" , item)}>

                                <View style={styles.card}>
                                    <View style={styles.cardContent1}>
                                        <View style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 50, justifyContent: 'center' }} >
                                            <Text style={[styles.name, { color: '#2575C0', fontSize: 20, alignSelf: 'center' }]}>{item.class}</Text>
                                        </View>
                                        <View style = {{paddingLeft : 15 , justifyContent :'center'}}>
                                            <Text style={[styles.name , {fontSize : 20}]}>{item.subject}</Text>
                                        </View>

                                    </View>
                                    <View style={[styles.cardContent2]}>
                                        <Text style={styles.body}>{item.homeWorkDescription}</Text>
                                    </View>
                                    <View style={[styles.cardContent3]}>
                                        <Text style={{color : '#2575C0' , fontWeight : 'bold'}}>Posted : {item.date}</Text>
                                        <Text style={{color : '#2575C0' , fontWeight : 'bold'}}>Due : {item.dueDate}</Text>
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
        elevation: 10,
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
    }

});