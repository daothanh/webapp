export type MenuTopType = {
    id: number
    name: string
    clientId?: string
    url?: string
    open?: boolean
    children?: MenuTopType[]
}

export type FilesProps = {
    id: number
    fileUrl: string
    fileName: string
    key: string
    publicKey?: string
}

export type SelectRouter = {
    value?: number
    label?: string
    name: string
    uriRole?: string
    children?: any[]
}
export type TreeSelectRouter = {
    value: number
    label: string
    name?: string
    uriRole?: string
    children?: any
}

export type ResponseType = {
    code: string
    body: any
    message: string
}

export type APIError = {
    code: string
    message: string
    context?: any
}

export interface GlobalListItem {
    globalListId: number
    value: string
    name: string
    code: string
}


export type TypeAPIError =
    | {
    response?: { data?: APIError }
}
    | any
