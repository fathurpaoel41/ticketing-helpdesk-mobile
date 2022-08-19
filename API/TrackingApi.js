import axios from "axios"
import baseurl from "./baseurl"

class TrackingApi extends baseurl {
    subPath = "api/tracking"

    async readAllTracking(idTicket) {
        return axios.get(this.BASE_URL + this.subPath + `/read-all-tracking/${idTicket}`, await this.authHeaders())
    }

    confirmTrackingProgress(body) {
        return axios.post(this.BASE_URL + this.subPath + "/confirm-tracking-progress", body, this.authHeaders())
    }
}

export default TrackingApi