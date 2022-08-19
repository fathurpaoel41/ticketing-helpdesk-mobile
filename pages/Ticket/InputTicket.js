import AsyncStorage from '@react-native-async-storage/async-storage'
import { AlertDialog, Box, Button, Center, CheckIcon, Keyboard, Select, Spinner, Stack, TextArea } from "native-base"
import React, { useEffect, useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import CategoryApi from "../../API/CategoryApi"
import TicketApi from "../../API/TicketApi"

export default function InputTicket({ navigation: { goBack } }) {
    const [problemDetail, setProblemDetail] = useState("")
    const [idUser, setIdUser] = useState(null)
    const [kategori, setKategori] = useState("")
    const [getCategory, setGetCategory] = useState([])
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const ticketApi = new TicketApi()
    const categoryApi = new CategoryApi()

    useEffect(async () => {
        setLoading(true)
        getAllCategory()
        try {
            let getIdUser = await AsyncStorage.getItem("@id_user")
            setIdUser(getIdUser)
        } catch (error) {
            console.log({ error })
        }
    }, [])

    async function getAllCategory() {
        let arrCategory = []
        await categoryApi.getAllCategory().then(r => {
            r.data.data.data.map(res => {
                let obj = {
                    id_kategori: res.id_kategori,
                    nama_kategori: res.nama_kategori
                }
                arrCategory.push(obj)
            })
            setLoading(false)
        })
        setGetCategory(arrCategory)

    }

    const openModalSet = () => setOpenModal(true)

    function handleSubmit() {
        if (problemDetail.length > 0 && kategori.length > 0) {
            openModalSet()
        } else if (problemDetail.length <= 5) {
            alert("problem detail harus lebih dari 5 karakter")
        }
        else {
            alert("isikan data dengan benar")
        }
    }

    async function handleSubmitTicket() {
        setLoadingSubmit(true)
        let obj = {
            kategori: kategori,
            problem_detail: problemDetail,
            id_user: idUser,
        }

        await ticketApi.inputTicketClient(obj).then(res => {
            if (res) {
                alert("sukses")
                goBack()
            } else {
                alert("gagal")
            }
        })
        setLoadingSubmit(false)
    }

    const closeModal = (status) => setOpenModal(status)

    return (
        <>
            <HideKeyboard>
                {loading ? <View><Spinner color="emerald.500" /></View> :
                    (<><View style={{ marginTop: 50 }}>
                        <Box alignItems="center" w="100%">
                            <Text>Kategori</Text>
                            <Box w="3/4" maxW="300">
                                <Select minWidth="200" accessibilityLabel="Pilih Kategori" placeholder="Pilih Kategori" _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setKategori(itemValue)}>
                                    {getCategory.map((res, idx) => {
                                        return <Select.Item key={idx} label={res.nama_kategori} value={res.id_kategori} />
                                    })}
                                </Select>
                            </Box>
                        </Box>
                        <Box alignItems="center" w="100%">
                            <Text>Problem Detail</Text>
                            <TextArea h={20} placeholder="Input Problem Detail" w="75%" maxW="300" onChangeText={(text) => { setProblemDetail(text) }} />
                        </Box>
                        <Stack space={4} w="100%" alignItems="center">
                            <Button onPress={handleSubmit} style={{ marginTop: 10 }}>Input Ticket</Button>
                        </Stack>
                    </View ></>)
                }
            </HideKeyboard>
            <AlertConfirm openModal={openModal} closeModal={closeModal} handleSubmitTicket={handleSubmitTicket} loadingSubmit={loadingSubmit} />
        </>
    )
}

const AlertConfirm = ({ openModal, closeModal, handleSubmitTicket, loadingSubmit }) => {
    const handleSubmit = () => handleSubmitTicket(true);
    const onClose = () => closeModal(false)


    const cancelRef = React.useRef(null);
    return <Center>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={openModal} onClose={onClose}>
            <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Peringatan!</AlertDialog.Header>
                <AlertDialog.Body>
                    <Text>1. Dengan ini saya setuju untuk menyerahkan barang yang ingin di perbaiki</Text>
                    <Text>2. Detail data yang diinput tidak dapat diubah, Pastikan data diinput dengan benar dan sesuai dengan keadaan yang diinputkan</Text>
                    <Text>3. Para teknisi akan melakukan pengerjaan sesuai antrian</Text>
                    <Text>4. Apabila kesalahan akibat Human Error maka karyawan sendiri yang harus bertanggung jawab</Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                    {loadingSubmit ? (<View><Spinner color="emerald.500" /></View>) : null}
                    <Button.Group space={2}>
                        <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                            Cancel
                        </Button>
                        <Button colorScheme="primary" onPress={handleSubmit}>
                            Setuju
                        </Button>
                    </Button.Group>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    </Center>;
};

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);
