export function useLocalStorage () {
    const setItem = (key: string, payload: any): any => {
        return localStorage.setItem(key, JSON.stringify(payload))
    }
    const getItem = (key: string) => {
        return JSON.parse(localStorage.getItem(key) || '{}')
    }

    return { setItem, getItem }
}