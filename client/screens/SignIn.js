import React, { useState , useEffect } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import _emailIcon from './../assets/icons/user.png'
import _validIcon from './../assets/icons/valid.png'
import _pswrdIcon from './../assets/icons/password.png'
import _eyeIcon from './../assets/icons/eye.png'
import _invisibleIcon from './../assets/icons/invisible.png'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


function SignIn({ navigation }) {

  const [login, setLogin] = useState('');
  const [pswrd, setPswrd] = useState('');
  const [eye, setEye] = useState(_eyeIcon);
  const [valid, setValid] = useState(null);
  const [peek, setPeek] = useState(true);
  const [failed, setFailed] = useState(false);


  const storeData = async (value) => {
    try {
      console.log("Data to be JSON : " + value)
      const jsonValue = JSON.stringify(value)
      console.log("Data JSON : " + jsonValue)
      await AsyncStorage.setItem('Teacher', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      console.log("In method")
      const jsonValue = await AsyncStorage.getItem('Teacher')
      console.log("JSON Value got : " + jsonValue)
      setLogin(JSON.parse(jsonValue).employeeId);
      setPswrd(JSON.parse(jsonValue).password);
    } catch(e) {
      // error reading value
    }
  }

  
  const validatelogIn = () => {

    console.log(login +  "   " + pswrd)
       
      axios.post(`http://10.0.2.2:8000/v2/login/?id=${login}&password=${pswrd}`)
          .then(response => {
              console.log('getting data from axios', response.data);
              if (response.data.Teacher == null)
              {
                setFailed(true)
              }
              else
              {
                //login successfull
                console.log("Data : " + response.data.Teacher)
                storeData(response.data.Teacher);
                navigation.navigate("Home")
              }
              
          })
          .catch(error => {
              setFailed(true)
              console.log("HI" + error);
          });
  }

    

  useEffect(() => {
   
    getData();

  }, [])


  return (    
    <View style={styles.screen}>

      <View style={styles.header}>
        <Text style={styles.heading}> Sign In </Text>
      </View>

      <View style={styles.body}>


      {failed ? <View style={styles.field_contr}>
        <Text style={styles.errormsg}> Invalid Id or Password </Text>
        </View> : null}


        <View style={styles.field_contr}>
          <View>
            <Image style={styles.icon} source={_emailIcon} />
          </View>

          <TextInput
            placeholder="Employee ID"
            placeholderTextColor="#666666"
            style={
              styles.textfield
            }
            value={login}
            onChangeText={(text) => {

              setFailed(false);

              setLogin(text);
              if (checkRegNo(text))
              {
                setValid(_validIcon)
              }
              else{
                setValid(null)
              }
            }}
          />


        <View>
            <Image style={styles.validIcon} source={valid} />
          </View>
        </View>


        <View style={styles.field_contr}>
          <View>
            <Image style={styles.icon} source={_pswrdIcon}/>
          </View>
                                                                                                                                                    
          <TextInput secureTextEntry={peek} style={styles.textfield} placeholder='Password' placeholderTextColor="#666666" value={pswrd} onChangeText={(text) => {
            
            setFailed(false);
            setPswrd(text)
          
          }} />

          <View>
            <TouchableOpacity onPress={() => {
              if (peek === true) {
                setEye(_invisibleIcon);
                setPeek(false);
              }
              else {
                setEye(_eyeIcon);
                setPeek(true);
              }
            }}><Image style={styles.icon} source={eye} /></TouchableOpacity>
          </View>
        </View>


        <View style={styles.field_contr}>
          <TouchableOpacity><Text style={styles.textmsg}> Forgot Password? </Text></TouchableOpacity>
        </View>


        <View style={styles.field_contr}>
          <TouchableOpacity onPress={() => {

            validatelogIn();
            // navigation.navigate("Home")


          }    
            }><Text style={styles.signinBtn}> Signin </Text></TouchableOpacity>
        </View>


      </View>
    </View>
  )
}

export default SignIn


function checkRegNo(regno) {
  if (regno.length == 7) {
    return true;
  }
  else {
    return false;
  }
}


const styles = StyleSheet.create(
  {
    screen:
    {
      flex: 1,
      alignItems: 'center'
    },

    header:
    {
      height: "22%",
      width: "100%",
      justifyContent: 'flex-end',
      alignItems: 'center'
    },

    heading:
    {
      fontSize: 40,
      color: '#2575C0',
      fontFamily: 'Roboto' , 
      marginTop : 10
    },

    body:
    {
      height: "78%",
      width: "100%",
      alignItems: 'center',
      padding: 30
    },

    field_contr:
    {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15
    },

    textfield:
    {
      borderWidth: 1,
      borderColor: '#636363',
      color: '#000000',
      borderRadius: 10,
      width: 240,
      height: 40,
      marginLeft: 5,
      marginRight: -35
    },

    icon:
    {
      height: 28,
      width: 28,
      tintColor : '#2575C0'

    },

    validIcon:
    {
      height: 20,
      width: 20,
      tintColor : '#2575C0'

    },

    textmsg:
    {
      marginTop: 9,
      fontSize: 12,
      color: "#636363"

    },

    errormsg:
    {
      marginTop: 2,
      fontSize: 12,
      color: "red"

    },

    signinBtn:
    {
      marginTop: 30,
      fontSize: 20,
      color: 'white',
      borderWidth: 2,
      borderColor: '#2575C0',
      borderRadius: 8,
      padding: 8,
      paddingLeft: 40,
      paddingRight: 40,
      backgroundColor: '#2575C0'
    },

    signupbtn:
    {
      fontSize: 12,
      color: '#2575C0',
    }

  }
)