import axios from "axios"
import baseurl from "./baseurl"

class UserApi extends baseurl {
    subPath = "api/user"

    readAllUser() {
        return axios.get(this.BASE_URL + this.subPath + "/get-all-user", this.authHeaders())
    }

    getUserDivisi(body) {
        return axios.post(this.BASE_URL + this.subPath + "/get-user-divisi", body, this.authHeaders())
    }

    filterUser(body, page = 1) {
        return axios.post(this.BASE_URL + this.subPath + `/filter-user?page=${page}`, body, this.authHeaders())
    }

    addUser(body) {
        return axios.post(this.BASE_URL + this.subPath + "/add-user", body, this.authHeaders())
    }

    checkEmail(body) {
        return axios.post(this.BASE_URL + this.subPath + "/check-email", body, this.authHeaders())
    }

    removeUser(id) {
        return axios.delete(this.BASE_URL + this.subPath + `/delete-user/${id}`, this.authHeaders())
    }

    getUserId(idUser) {
        return axios.get(this.BASE_URL + this.subPath + `/get-user/${idUser}`, this.authHeaders())
    }

    async editUser(id, body) {
        return axios.put(this.BASE_URL + this.subPath + `/edit-user/${id}`, body, await this.authHeaders())
    }
}

export default UserApi