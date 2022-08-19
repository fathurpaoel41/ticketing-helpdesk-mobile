import axios from "axios"
import baseurl from "./baseurl"

class FeedbackApi extends baseurl {
    subPath = "api/feedback"

    async addFeedback(body) {
        return axios.post(this.BASE_URL + this.subPath + "/add-feedback", body, await this.authHeaders())
    }

}

export default FeedbackApi