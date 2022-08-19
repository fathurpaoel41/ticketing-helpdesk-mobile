import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Button, Icon, Input, Spinner, Stack, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import AuthApi from "../../API/AuthApi";

function Login({ handleStatus }) {
    const [status, setStatus] = useState(false)
    const [show, setShow] = React.useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(true)
    const authApi = new AuthApi()
    const handleChangeEmail = (e) => setEmail(e)
    const handleChangePassword = (e) => setPassword(e)

    useEffect(() => {
        return () => {
            setLoading(true)
        }
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
                handleStatus(false)
                setLoading(true)
            } else {
                try {
                    await AsyncStorage.setItem('@storage_Key', res.data.access_token)
                    await AsyncStorage.setItem('@id_user', JSON.stringify(res.data.user.id))
                } catch (e) {
                    console.log({ error: e })
                }
                await authApi.me().then(async (resp) => {
                    try {
                        await AsyncStorage.setItem('@role', resp.data.data[0].nama_divisi)
                    } catch (error) {
                        console.log({ error })
                    }
                    setStatus(false)
                    handleStatus(true)
                })
            }
        })
    }

    return (
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
    )
}

export default Login

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