import axios from "axios"
import baseurl from "./baseurl"

class CategoryApi extends baseurl {
    subPath = "api/category"

    async getAllCategory() {
        return axios.get(this.BASE_URL + this.subPath + "/get-all-category", await this.authHeaders())
    }

    getCategory(idCategory) {
        return axios.get(this.BASE_URL + this.subPath + `/get-category/${idCategory}`, this.authHeaders())
    }

    addCategory(body) {
        return axios.post(this.BASE_URL + this.subPath + "/add-category", body, this.authHeaders())
    }

    updateCategory(idCategory, body) {
        return axios.put(this.BASE_URL + this.subPath + `/update-category/${idCategory}`, body, this.authHeaders())
    }

    deleteCategory(idCategory) {
        return axios.delete(this.BASE_URL + this.subPath + `/delete-category/${idCategory}`, this.authHeaders())
    }

}

export default CategoryApi