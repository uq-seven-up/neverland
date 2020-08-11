import { AxiosResponse } from 'axios';
declare type ApiCallback = (response: AxiosResponse) => void;
export declare class API {
    static CFKIT_ENVIRONMENT: string;
    static instance: API;
    constructor();
    private readCookie;
    call: (method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, callback: ApiCallback, params?: any) => Promise<void>;
    private objectToFormData;
}
export {};
