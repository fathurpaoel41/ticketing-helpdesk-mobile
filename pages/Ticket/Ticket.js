import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, FlatList, View, Text, Button, TouchableOpacity } from 'react-native'
import TicketApi from "../../API/TicketApi"
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { StackNavigator } from 'react-navigation';
import { Spinner } from "native-base"


export default function Ticket({ navigation }) {
    const [dataTicket, setDataTicket] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingLoad, setLoadingLoad] = useState(false)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(null)
    const ticketApi = new TicketApi()

    useEffect(() => {
        getData()
        setLoading(true)
    }, [])

    async function getData(page = 1) {
        let role = null
        let body = undefined
        let iduser = null
        try {
            role = await AsyncStorage.getItem('@role')
            iduser = await AsyncStorage.getItem('@id_user')
            switch (role) {
                case "IT Support":
                    body = {
                        assigned: parseInt(iduser)
                    }
                    break
                case "IT Operator":
                    break
                case "Administrator":
                    break
                default:
                    body = {
                        id_user: parseInt(iduser)
                    }
            }
        } catch (error) {
            console.log({ error })
        }
        await ticketApi.readTicketClient(page, body).then(async (res) => {
            let data = dataTicket.concat(res.data.data.data)
            setLastPage(res.data.data.last_page)
            setDataTicket(data)
            setLoading(false)
            setLoadingLoad(false)
        })
    }

    const handleLoadMore = () => {
        if (page !== lastPage) {
            let halaman = page
            let total = halaman + 1
            setPage(total)
            setLoadingLoad(true)
            getData(total)
        }
    }

    const loadingComponent = () => {
        return (loadingLoad ? <View><Spinner color="emerald.500" /></View> : null)
    }

    function renderTicket(item) {
        return (
            <TouchableOpacity>
                <View style={styles.itemRow}>
                    <Text style={styles.itemText}>ID Ticket : {item.item.id_ticket}</Text>
                    <Text style={styles.itemText}>status : {item.item.status}</Text>
                    <Text style={styles.itemText}>kategori : {item.item.nama_kategori}</Text>
                    <Button title="See Detail" onPress={() => navigation.navigate('DetailTicket', {
                        idTicket: item.item.id_ticket,
                    })} />
                </View >
            </TouchableOpacity >
        )
    }

    const handleRefresh = useCallback(() => {
        setLoading(true)
        setDataTicket([])
        setPage(1)
        getData()
    }, []);

    return (
        <>
            {loading ? <Spinner color="emerald.500" /> : (<><FlatList
                style={styles.container}
                data={dataTicket}
                renderItem={renderTicket}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0}
                ListFooterComponent={loadingComponent}
                refreshing={loading}
                onRefresh={handleRefresh}
            /></>)}
            <View style={styles.screen}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("InputTicket")}
                    style={styles.roundButton1}>
                    <Text style={{ fontSize: 30 }}>+</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        backgroundColor: '#f5fcff',
    },
    itemRow: {
        borderBottomColor: 'black',
        marginBottom: 10,
        borderBottomWidth: 1
    },
    itemText: {
        fontSize: 16,
        padding: 5
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        right: 20,
        position: 'absolute',
        bottom: 20
    },
    roundButton1: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'orange',
    },
})

