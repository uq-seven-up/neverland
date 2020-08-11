import axios, {AxiosResponse } from 'axios';

/* This variable must be set by the page that embeds the application. */
declare const CFKIT_API: any;

interface Fieldset {[key:string]:string|number|boolean};

type ApiCallback = (response:AxiosResponse) => void;

/**
 * Singleton for interacting with the internal aXcelerate API.
 */
export class API {
    static CFKIT_ENVIRONMENT = 'development';
    static instance:API;

    constructor(){
        if(API.instance){
            return API.instance;
        }
        
        axios.defaults.withCredentials = false;
        axios.defaults.baseURL = CFKIT_API.BASE_URL;
        axios.defaults.validateStatus =  function (status) {
            return status < 500; // Reject only if the status code is greater than or equal to 500
        };

        API.instance = this;
    }

    private readCookie(name:string):string
    {
        let value = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
        return value ? value.pop() : '';
    }

    /**
     * Calls the CFKIT Rest API.
     * 
     * @param method The API command that should be executed.
     * @param data An object that will be passed as form fields. Each key being 
     * the fieldname and the key value the form value.
     * @param callback A function that will be called when the ajax call completes. 
     *  The AJAX response is passed to the callback function.
     */
    public call = async (method:'GET'|'POST'|'PUT'|'DELETE',endpoint:string,callback:ApiCallback,params?:any) => {
        const sessionid = this.readCookie('CFKITSESSIONID');
        const config = {
            method:method,
            url:endpoint,
            withCredentials:false,
            data:null,
            headers: {
                'Authorization':sessionid,
            }
        };

        if(params) config.data = params;

        const response = await axios.request(config);
        
        callback(response);
    }

    /**
     * Converts a javascript object where each key is a simple value to
     * a formdata object that can be passed as a part of an AJAX call. Enabling similar
     * ajax call syntax as implemented by JQuery. 
     * 
     * @param data An object where every key is a simple value. (string|number|boolean)
     */
    private objectToFormData(data:Fieldset):FormData {
        const formData = new FormData();
        Object.entries(data).forEach(function(item,index)
        {
            formData.append(item[0],String(item[1]));
        });

        return formData;
    }
}