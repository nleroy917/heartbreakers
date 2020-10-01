import axios from 'axios';

class Tinder {
    constructor(accessToken) {
        this.base = process.env.REACT_APP_API_BASE
        this.accessToken = accessToken
    }
    getUser = async (id) => {
        let data = {
            access_token: this.accessToken
        }
        let uri = `${this.base}/tinder/user/${id}`
        let res = await axios.get(uri, {data: data})
        if (res.status === 200){
            let data = res.data
            return data
        }
    }
}

export default Tinder;