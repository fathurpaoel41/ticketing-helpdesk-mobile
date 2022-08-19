import React, { useState, useEffect } from 'react'
import {
    AlertDialog,
    Box,
    Button,
    Center,
    CheckIcon,
    Select,
    Spinner,
    Stack,
    TextArea,
    View,
    Text
} from "native-base"
import TicketApi from "../../API/TicketApi"
import TrackingApi from "../../API/TrackingApi"
import FeedbackApi from "../../API/FeedbackApi"
import { TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native"


const DetailTicket = ({ route, navigation }) => {
    const { idTicket } = route.params;
    const ticketApi = new TicketApi()
    const trackingApi = new TrackingApi()
    const feedbackApi = new FeedbackApi()
    const [dataTicket, setDataTicket] = useState(null)
    const [dataTracking, setDataTracking] = useState(null)
    const [loadingTicket, setLoadingTicket] = useState(false)
    const [loadingTracking, setLoadingTracking] = useState(false)
    const [loadingSubmitFeedback, setLoadingSubmitFeedback] = useState(false)
    const [feedback, setFeedback] = useState("")

    useEffect(() => {
        getDataTicket()
        getDataTracking()
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('Refreshed!');
        });
        return unsubscribe;
    }, [])

    const getDataTicket = async () => {
        setLoadingTicket(true)
        await ticketApi.readTicketByIdTicket(idTicket).then(res => {
            setDataTicket(res.data.data[0])
            setLoadingTicket(false)
        }).catch(error => {
            setLoadingTicket(false)
            alert("Terjadi Kesalahan")
            console.log({ error })
        })
    }

    const getDataTracking = async () => {
        setLoadingTracking(true)
        await trackingApi.readAllTracking(idTicket).then(res => {
            setDataTracking(res.data.data)
            setLoadingTracking(false)
        }).catch(error => {
            setLoadingTicket(false)
            alert("Terjadi Kesalahan")
            console.log({ error })
        })
    }

    const handleSubmitFeedback = async () => {
        setLoadingSubmitFeedback(true)
        let body = {
            id_ticket: idTicket,
            feedback: feedback
        }

        await feedbackApi.addFeedback(body).then(res => {
            if (res) {
                getDataTicket()
                getDataTracking()
            } else {
                alert("Terjadi Kesalahan")
            }
            setLoadingSubmitFeedback(false)
        }).catch(error => {
            setLoadingTicket(false)
            alert("Terjadi Kesalahan")
            console.log({ error })
        })
    }


    return (
        <>
            <HideKeyboard>
                <ScrollView>
                    <View style={{ marginTop: 20, marginLeft: 10 }}>
                        {loadingTicket ? <Spinner color="emerald.500" /> : (
                            dataTicket !== null ?
                                <View>
                                    <Text style={{ fontSize: 20 }}>Detail Ticket</Text>
                                    <Text>idTicket : {idTicket}</Text>
                                    <Text>Kategori : {dataTicket.nama_kategori == null ? "Null" : dataTicket.nama_kategori}</Text>
                                    <Text>Problem Detail : {dataTicket.problem_detail == null ? "Null" : dataTicket.problem_detail}</Text>
                                    <Text>Tanggal Dibuat : {dataTicket.tanggal_dibuat == null ? "Null" : dataTicket.tanggal_dibuat}</Text>
                                    <Text>Tanggal Solved : {dataTicket.tanggal_solved == null ? "Null" : dataTicket.tanggal_solved}</Text>
                                    <Text>Assigned : {dataTicket.assigned == null ? "Null" : dataTicket.nama_assigned}</Text>
                                </View> : null)
                        }
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 10 }}>
                        {loadingTracking ? <Spinner color="emerald.500" /> :
                            (<>
                                {dataTracking !== null ?
                                    (
                                        <>
                                            <Text style={{ fontSize: 20 }}>Detail Tracking</Text>
                                            {dataTracking.map((res, idx) => {
                                                return (
                                                    <Box key={idx}>
                                                        <Text>- status : {res.status}</Text>
                                                        <Text>  tanggal : {res.created_at}</Text>
                                                    </Box>)
                                            })}
                                        </>
                                    )
                                    : null}
                            </>
                            )
                        }
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 10 }}>
                        {dataTicket !== null && dataTicket.solusi !== null ? (
                            <>
                                <Text style={{ fontSize: 20 }}>Solusi</Text>
                                <Text>{dataTicket.solusi}</Text>
                            </>
                        ) : null}
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 10 }}>
                        {dataTicket !== null && dataTicket.feedback == null && dataTicket.status == "Done" ? (
                            <>
                                <Text style={{ fontSize: 20 }}>Input Feedback</Text>
                                <TextArea h={20} placeholder="Input Feedback" w="75%" maxW="300" onChangeText={(text) => { setFeedback(text) }} />
                                <Button onPress={handleSubmitFeedback} style={{ marginTop: 10, width: 150, height: 40 }}>Input Feedback</Button>
                                {loadingSubmitFeedback ? <Spinner color="emerald.500" /> : null}
                            </>
                        ) : null}
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 10 }}>
                        {dataTicket !== null && dataTicket.feedback !== null && dataTicket.status == "Done" ? (
                            <>
                                <Text style={{ fontSize: 20 }}>Feedback</Text>
                                <Text>{dataTicket.feedback}</Text>
                            </>
                        ) : null}
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 10 }}>
                        {dataTicket !== null && dataTicket.reason !== null ? (
                            <>
                                <Text style={{ fontSize: 20 }}>Reason Rejected</Text>
                                <Text>{dataTicket.reason}</Text>
                            </>
                        ) : null}
                    </View>
                </ScrollView>
            </HideKeyboard>
        </>
    )
}
export default DetailTicket

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);