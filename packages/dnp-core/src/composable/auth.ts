import axios, {type AxiosResponse} from "axios";

export function useAuth() {
    const BASE_URL = import.meta.env.VITE_BASE_URL
    const refreshToken = async (params: {
        refresh_token: string
        clientId: string
        access_token: string
    }) => {
        const config = {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${params.access_token}`
            }
        }
        const res: AxiosResponse = await axios.post(
            `${BASE_URL}/cop/auth/auth/refresh-token`,
            { refreshToken: params.refresh_token, clientId: params.clientId },
            config
        )
        return res.data
    }

    return { refreshToken }
}