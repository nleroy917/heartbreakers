import axios from 'axios';

class Tinder {
    constructor(acessToken) {
        this.accessToken = accessToken
        this.base = 'https://api.gotinder.com'
    }
    getUser = async (id) => {
        let uri = `${this.base}/user/${id}?locale=en`
        let res = axios.get(uri)
        if (res.status === 200){
            let data = res.data
            return data
        }
    }
}

export default Tinder;