import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    FlatList,
} from 'react-native';
import { icons } from "../constants";


export default function Home({route , navigation }) {


    {/* profile / circulars / students / leave applications / fines / logout*/ }
    return (
        <>
            <View style={styles.container}>

                <View style={styles.section}>
                   
                    <TouchableOpacity style={[styles.card, { backgroundColor: '#2575C0' }]} onPress={() => { navigation.navigate("Students") }}>
                        <Image style={styles.cardImage} source={icons._classIcon} />
                    </TouchableOpacity>
                    <View style = {{flexDirection : 'row'}}>
                  {true ?  <Text style = {styles.notificationCount}> </Text> : null}
                    <Text style={[styles.title, { color: '#2575C0' }]}>  Students  </Text> 
                    </View>
                   
                    
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={[styles.card, { backgroundColor: '#2575C0' }]}  onPress={() => { navigation.navigate("Circulars") }}>
                        <Image style={styles.cardImage} source={icons._circularIcon}/>
                    </TouchableOpacity>
                    <View style = {{flexDirection : 'row'}}>
                  {false ?  <Text style = {styles.notificationCount}> </Text> : null}
                    <Text style={[styles.title, { color: '#2575C0' }]}>  Circulars  </Text> 
                    </View>
                </View>
            </View>
            <View style={styles.container}>

                <View style={styles.section}>
                    <TouchableOpacity style={[styles.card, { backgroundColor: '#2575C0' }]} onPress={() => { navigation.navigate("LeaveApplications") }}>
                        <Image style={styles.cardImage} source={icons._complaintIcon} />
                    </TouchableOpacity>
                    <View style = {{flexDirection : 'row'}}>
                  {false ?  <Text style = {styles.notificationCount}> </Text> : null}
                    <Text style={[styles.title, { color: '#2575C0' }]}>  Leaves  </Text> 
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={[styles.card, { backgroundColor: '#2575C0' }]} onPress={() => { navigation.navigate("Fines") }}>
                        <Image style={styles.cardImage} source={icons._fineIcon}/>
                    </TouchableOpacity>
                    <View style = {{flexDirection : 'row'}}>
                  {true ?  <Text style = {styles.notificationCount}> </Text> : null}
                    <Text style={[styles.title, { color: '#2575C0' }]}>  Fines  </Text> 
                    </View>
                </View>
            </View>
            <View style={styles.container}>

                <View style={styles.section}>
                    <TouchableOpacity style={[styles.card, { backgroundColor: '#2575C0' }]} onPress={() => { navigation.navigate("ProfileView") }}>
                        <Image style={styles.cardImage} source={icons._emailIcon} />
                    </TouchableOpacity>
                    <View style = {{flexDirection : 'row'}}>
                  {false ?  <Text style = {styles.notificationCount}> </Text> : null}
                    <Text style={[styles.title, { color: '#2575C0' }]}>  Profile  </Text> 
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={[styles.card, { backgroundColor: '#2575C0' }]}  onPress={() => { navigation.navigate("SignIn") }}>
                    <Image style={styles.cardImage} source={icons._logoutIcon} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: '#2575C0' }]}>Logout</Text>
                </View>
            </View>
        </>

    );
}

const styles = StyleSheet.create({

    notificationCount : {
        backgroundColor : '#ffa291',
        height : 12,
        width : 12,
        borderRadius : 50,
        marginTop: 13,
        
    },

    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 25,
        justifyContent: 'space-between',
        alignContent: 'space-around',
        backgroundColor: '#fff',
    },

    section: {
        width: '40%',
        flexDirection: 'column',
        alignItems: 'center',

    },

    card: {
        shadowColor: '#474747',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        // marginVertical: 20,
        // marginHorizontal: 40,
        backgroundColor: "#2575C0",
        width: 100,
        height: 100,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },

    cardImage: {
        height: 50,
        width: 50,
        alignSelf: 'center',
        tintColor: '#ffffff'
    },
    title: {
        marginTop: 6,
        fontSize: 18,
        fontWeight: 'bold'
    },
});