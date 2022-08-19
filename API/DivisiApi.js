import axios from "axios"
import baseurl from "./baseurl"

class DivisiApi extends baseurl {
    subPath = "api/divisi"

    readAllDivisi() {
        return axios.get(this.BASE_URL + this.subPath + "/get-all-divisi", this.authHeaders())
    }

    readAllDivisiSelected() {
        return axios.get(this.BASE_URL + this.subPath + "/get-all-divisi-selected", this.authHeaders())
    }

    addDivisi(body) {
        return axios.post(this.BASE_URL + this.subPath + "/add-divisi", body, this.authHeaders())
    }

    deleteDivisi(idDivisi) {
        return axios.delete(this.BASE_URL + this.subPath + `/delete-divisi/${idDivisi}`, this.authHeaders())
    }

    getDivisi(idDivisi) {
        return axios.get(this.BASE_URL + this.subPath + `/get-divisi/${idDivisi}`, this.authHeaders())
    }

    updateDivisi(idDivisi, body) {
        return axios.put(this.BASE_URL + this.subPath + `/update-divisi/${idDivisi}`, body, this.authHeaders())
    }
}

export default DivisiApi