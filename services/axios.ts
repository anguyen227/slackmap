import { getCookie } from 'cookies-next'
import axios from 'axios'

import Cookie from 'enum/Cookie'

function initAxios() {
    const instance = axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}` + '/api',
        xsrfCookieName: 'CSRF-TOKEN',
        xsrfHeaderName: 'X-CSRF-TOKEN',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    instance.interceptors.request.use(
        (config) => {
            const token = getCookie(Cookie.Token)
            if (token) {
                if (!config.headers) config.headers = {}
                config.headers['Authorization'] = `Bearer ${token}`
            }

            return config
        },

        (error) => {
            return Promise.reject(error)
        }
    )

    return instance
}

export default initAxios
