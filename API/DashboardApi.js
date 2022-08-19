import axios from "axios"
import baseurl from "./baseurl"

class DashboardApi extends baseurl {
    subPath = "api/dashboard"

    categoryChart() {
        return axios.get(this.BASE_URL + this.subPath + "/category-chart", this.authHeaders())
    }

}

export default DashboardApi