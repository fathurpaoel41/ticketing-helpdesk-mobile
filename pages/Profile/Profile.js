import { Input, Spinner, Text, View, Icon, Button } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AuthApi from "../../API/AuthApi";
import UserApi from "../../API/UserApi";
import { TouchableWithoutFeedback, Keyboard } from "react-native"

export default function Profile() {
    const authApi = new AuthApi()
    const userApi = new UserApi()
    const [loadingData, setLoadingData] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [dataUser, setDataUser] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")

    useEffect(() => {
        getDataUser()
    }, [])

    const getDataUser = async () => {
        setLoadingData(true)
        await authApi.me().then(res => {
            setDataUser(res.data.data[0])
            setLoadingData(false)
        })
    }

    const handleChangePassword = async () => {
        if (password === passwordConfirmation) {
            setLoadingSubmit(true)
            let body = {
                nama: dataUser.nama,
                divisi: dataUser.divisi,
                password: password
            }
            let idUser = dataUser.id
            await userApi.editUser(idUser, body).then(res => {
                if (res) {
                    alert("Sukses")
                    setLoadingSubmit(false)
                    getDataUser()
                } else {
                    alert("gagal")
                    setLoadingSubmit(false)
                }
            }).catch(error => {
                setLoadingSubmit(false)
                alert("Terjadi Kesalahan")
                console.log({ error })
            })
        } else {
            alert("Harap Isi data dengan benar")
        }
    }

    return (
        <HideKeyboard>
            {loadingData ? <><Spinner color="emerald.500" /></> :
                <>
                    <View>
                        {dataUser !== null ? (<><Text>Nama :  {dataUser.nama}</Text>
                            <Text>Email :  {dataUser.email}</Text>
                            <Text>Divisi :  {dataUser.nama_divisi}</Text></>) : null}

                    </View>
                    <View style={{ marginTop: 20, marginBottom: 10 }}>
                        <Text style={{ fontSize: 20 }}>Ubah Password</Text>
                        <Text>Input Password</Text>
                        <Input
                            name="password"
                            w={{
                                base: "75%",
                                md: "25%"
                            }}
                            type={showPassword ? "text" : "password"}
                            InputRightElement={<Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />}
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() => setShowPassword(!showPassword)} />}
                            placeholder="Password"
                            onChangeText={(text) => { setPassword(text) }}
                        />
                        <Text>Input Password Konfirmasi</Text>
                        <Input
                            name="passwordConfirmatio "
                            w={{
                                base: "75%",
                                md: "25%"
                            }}
                            type={showPasswordConfirmation ? "text" : "password"}
                            InputRightElement={<Icon as={<MaterialIcons name={showPasswordConfirmation ? "visibility" : "visibility-off"} />}
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)} />}
                            placeholder="Password"
                            onChangeText={(text) => { setPasswordConfirmation(text) }}
                        />
                        <Button onPress={handleChangePassword} style={{ marginTop: 4, width: 150, height: 40 }}>Ubah Password</Button>
                        {loadingSubmit ? <><Spinner color="emerald.500" /></> : null}
                    </View>
                </>
            }
        </HideKeyboard>
    )
}

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);