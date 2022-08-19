import axios from "axios"
import baseurl from "./baseurl"

class AuthApi extends baseurl {
    subPath = "api/auth"
    login(body) {
        return axios.post(this.BASE_URL + this.subPath + "/login", body)
    }

    async me() {
        return axios.get(this.BASE_URL + this.subPath + "/me", await this.authHeaders())
    }
}

export default AuthApi