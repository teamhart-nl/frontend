import Axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {ApiURL} from "./resources";

//api handler that is used by the components to do api calls.

//apiURL is received from resources 
const backendApi = Axios.create({
    baseURL: ApiURL
})

//method that check validity of 
export const handleApiResponse = ((res: AxiosResponse) => {
    //unpack api result
    //if confusing: google ES6 destructuring assignment
    const {
        status: status,
        data: data,
        config: {method, url}
    } = res;

    console.log(status, data)


    if (process.env.NODE_ENV === "development") {
        console.log(`${method} ${url}`)
        console.log(res)
    }

    //return data from call
    if (status === 200 && data !== undefined)
        return data;
    else
        throw Error(`something went wrong with api call to ${method} : ${url}. 
                    \nStatus: ${status}
                    \nData: ${data}`);
})

//the methods that wrap the api calls
export default class APIWrapper {

    public static getWelcomeMessage(): any {
        return backendApi.get('/vue-test')
            .then(handleApiResponse)
            .catch(e => console.log(e));
    }

    public static getPhonemes(): any {
        return backendApi.get('/api/v1/phonemes')
            .then(handleApiResponse)
            .catch(e => console.log(e));
    }

    /**
     * Sends a phoneme to the microcontroller via the microcontroller/phonemes backend endpoint.
     *
     * @param body      JSON containing the phonemes to send (check backend endpoint for specification).
     * @param config    (OPTIONAL) Axios config for configuring request.
     */
    public static async sendPhonemeMicrocontroller(body: any, config?: AxiosRequestConfig) {
        return backendApi.post('/api/v1/microcontroller/phonemes', body, config)
            .then(handleApiResponse)
            .catch(e => console.log(e));
    }

    /**
     * Sends a list of words to the microcontroller via the microcontroller/words backend endpoint.
     *
     * @param body      JSON containing the phonemes to send (check backend endpoint for specification).
     * @param config    (OPTIONAL) Axios config for configuring request.
     */
    public static async sendWordsMicrocontroller(body: any, config?: AxiosRequestConfig) {
        return backendApi.post('/api/v1/microcontroller/words', body, config)
            .then(handleApiResponse)
            .catch(e => console.log(e));
    }

    /**
     * Sends a list of sentences to the microcontroller via the microcontroller/sentences backend endpoint.
     *
     * @param body      JSON containing the sentences to send (check backend endpoint for specification).
     * @param config    (OPTIONAL) Axios config for configuring request.
     */
    public static async sendSentencesMicrocontroller(body: any, config?: AxiosRequestConfig) {
        return backendApi.post('/api/v1/microcontroller/sentences', body, config)
            .then(handleApiResponse)
            .catch(e => console.log(e));
    }

    public static sendAudioFile(file: any, config?: AxiosRequestConfig){
        var formData = new FormData();
        formData.append("file", file);
        formData.append('data', new Blob([JSON.stringify({
            source_language: "nl",
            target_language: "en"
        })], {
            type: "application/json"
        }));
        var request = new XMLHttpRequest();
        request.open("POST", ApiURL + "/api/v1/microcontroller/audiofile");
        request.send(formData);
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200 && request.statusText === 'OK') {
              console.log('successful');
            } else {
              console.log('failed');
            }
          }
        }
    }
}
