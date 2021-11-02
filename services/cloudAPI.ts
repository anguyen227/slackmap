import axios from 'axios'

function initAxios() {
    const instance = axios.create({
        baseURL: `${process.env.FIREBASE_CLOUD_FUNCTION_URL}`,
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return instance
}

export default initAxios
