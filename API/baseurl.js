import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';

class CoreApi {

    constructor(session = null) {
        this.userSession = session
        this.BASE_URL = "https://ticketing-ubl-api.herokuapp.com/"
    }

    getData = async () => {
        let AccessToken = null
        try {
            AccessToken = await AsyncStorage.getItem('@storage_Key')
        } catch (error) {
            console.log({ error })
        }
        return AccessToken
    }

    async authHeaders() {
        let token = await this.getData()
        return {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    }

    checkSession() {
        return axios.get(this.BASE_URL + "api/auth/me", this.authHeaders())
    }

    async authMe() {
        const body = null
        await this.checkSession().then(res => {
            body = {
                id: res.data.data.id,
                email: res.data.data.email,
                email_verified_at: res.data.data.email_verified_at,
                nama: res.data.data.nama,
                divisi: res.data.data.divisi,
                remember_token: res.data.data.remember_token,
                created_at: res.data.data.created_at,
                updated_at: res.data.data.updated_at
            }
        })
        return body
    }

}

export default CoreApi