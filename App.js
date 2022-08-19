import {
  createDrawerNavigator,
  DrawerContentScrollView, DrawerItem, DrawerItemList
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Box, Button, Icon, Input, NativeBaseProvider, Spinner, Stack, Text, View } from 'native-base';
import { useEffect, useState } from 'react';
// Component
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'localstorage-polyfill';
import { DevSettings, Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import 'react-native-gesture-handler';
import AuthApi from "./API/AuthApi";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import DetailTicket from './pages/Ticket/DetailTicket';
import InputTicket from './pages/Ticket/InputTicket';
import Ticket from "./pages/Ticket/Ticket";

function CustomDrawerContent(props) {

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.log({ error })
    }
    // props.navigation.dispatch(
    //   CommonActions.reset({
    //     index: 1,
    //     routes: [
    //       { name: "Logout" },
    //     ],
    //   })
    // );
    DevSettings.reload()
  }
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => handleLogout()} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
const StackNavigator = createNativeStackNavigator()


function MyDrawer() {
  let setstatus = false
  const [login, setLogin] = useState(setstatus)

  //login
  const [status, setStatus] = useState(false)
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const authApi = new AuthApi()
  const handleChangeEmail = (e) => setEmail(e)
  const handleChangePassword = (e) => setPassword(e)

  useEffect(() => {
    console.log("jalan my drawer")
  }, [])

  const handleLogin = async () => {
    setLoading(false)
    let body = {
      email: email,
      password: password
    }

    await authApi.login(body).then(async (res) => {
      if (res.data.status == false) {
        setStatus(true)
        setLogin(false)
        setLoading(true)
      } else {
        try {
          await AsyncStorage.setItem('@storage_Key', res.data.access_token)
          await AsyncStorage.setItem('@id_user', JSON.stringify(res.data.user.id))
        } catch (e) {
          console.log({ error: e })
        }
        await authApi.me().then(async (resp) => {
          const role = resp.data.data[0].nama_divisi
          try {
            await AsyncStorage.setItem('@role', role)
          } catch (error) {
            console.log({ error })
          }
          setStatus(false)
          if (role == "IT Support" || role == "IT Operator" || role == "Administrator") {
            alert("Aplikasi hanya untuk client, silahkan login lewat web browser")
          } else {
            setLogin(true)
          }
          setLoading(true)
        }).catch(error => {
          console.log({ error })
          alert("terjadi kesalahan")
        })
      }
    }).catch(error => {
      console.log({ error })
      alert("terjadi kesalahan")
    })
  }

  return (
    <>
      {login ?
        (
          <Drawer.Navigator
            useLegacyImplementation
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name="Dashboard" component={Dashboard} />
            <Drawer.Screen name="Ticket" component={Ticket} />
            <Drawer.Screen name="Profile" component={Profile} />
          </Drawer.Navigator>
        ) :
        (
          <>
            <HideKeyboard>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={page.title}>Welcome To Ticketing Helpdesk</Text>
                <Box alignItems="center">
                  {status && (<Text style={page.text}>Email dan Password Salah</Text>)}
                  <Stack space={4} w="100%" alignItems="center">
                    <Input
                      w={{
                        base: "75%",
                        md: "25%"
                      }}
                      type="text"
                      InputLeftElement={<Icon as={<MaterialIcons name="person" />}
                        size={5}
                        ml="2" color="muted.400" />}
                      placeholder="Username"
                      onChangeText={handleChangeEmail}
                      name="username"
                    />
                    <Input
                      name="password"
                      w={{
                        base: "75%",
                        md: "25%"
                      }}
                      type={show ? "text" : "password"}
                      InputRightElement={<Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
                        size={5}
                        mr="2"
                        color="muted.400"
                        onPress={() => setShow(!show)} />}
                      placeholder="Password"
                      onChangeText={handleChangePassword}
                    />
                  </Stack>
                  <Stack space={4} w="100%" alignItems="center">
                    <Button onPress={handleLogin} style={page.button}>Login</Button>
                  </Stack>
                  <View>{loading == false ? <Spinner color="emerald.500" /> : (<><Text></Text></>)}</View>
                </Box>
              </View>
            </HideKeyboard>
          </>
        )}
    </>
  );
}

const page = StyleSheet.create({
  title: {
    color: "#70CDE5",
    fontSize: 20,
    marginBottom: 20
  },
  text: {
    color: '#A11212'
  },
  button: {
    marginTop: 10
  }
});

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);


export default function App() {
  return (
    <>
      <NativeBaseProvider>
        <NavigationContainer>
          <StackNavigator.Navigator>
            <StackNavigator.Screen
              name="Root"
              component={MyDrawer}
              options={{ headerShown: false }} />
            <StackNavigator.Screen options={{
              title: 'InputTicket'
            }} name="InputTicket" component={InputTicket} />
            <StackNavigator.Screen options={{
              title: 'DetailTicket'
            }} name="DetailTicket" component={DetailTicket} />
            <StackNavigator.Screen options={{
              headerBackVisible: false,
              headerLeft: null
            }} name="Logout" component={MyDrawer} />
          </StackNavigator.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </>
  );
}