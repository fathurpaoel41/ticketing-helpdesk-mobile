import { View, Text, Spinner } from 'native-base'
import React, { useEffect, useState } from 'react'
import AuthApi from '../../API/AuthApi'

export default function Dashboard() {
    const authApi = new AuthApi()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDataMe()
    }, [])

    const getDataMe = async () => {
        await authApi.me().then((res) => {
            // console.log(res.data.data[0])
            setData(res.data.data[0])
            setLoading(false)
        })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (<><Spinner color="emerald.500" /></>) : (<><Text>Selamat Datang {data.nama}</Text></>)}
        </View>
    )
}