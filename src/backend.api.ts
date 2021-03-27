import Axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {ApiURL} from "./resources";


// AxiosInstance using the ApiURL from resources.
const backendApi = Axios.create({
    baseURL: ApiURL
})


/**
 * Function for handling correctly returning API responses.
 */
export const handleApiResponse = ((res: AxiosResponse) => {

    // Unpack API result
    const {
        status: status,
        data: data,
        config: {method, url}
    } = res;


    // Log if in dev mode
    if (process.env.NODE_ENV === "development") {
        console.log(`${method} ${url}`)
        console.log(res)
    }

    // return data from call
    return data
})

/**
 * Function for handling API responses containing an error.
 */
export const handleApiErrorResponse = (res: any) => {
    // Unpack API result
    const {
        data: data,
        status: status,
        statusText: statusText
    } = res.response

    console.log(statusText + " - " + status + ": " + data);
}

/**
 * Wrapper for communicating with teh backend.
 */
export default class APIWrapper {

    /**
     * Gets the available phonemes from the backend.
     */
    public static getPhonemes(): any {
        return backendApi.get('/api/v1/phonemes')
            .then(handleApiResponse)
            .catch(handleApiErrorResponse);
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
            .catch(handleApiErrorResponse);
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
            .catch(handleApiErrorResponse);
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
            .catch(handleApiErrorResponse);
    }

    /**
     * Sends an audio file to the microcontroller via the microcontroller/audiofile backend endpoint.
     *
     * @param file      AudioFile to be send. Either in webm, ogg or flac format.
     * @param body      Containing the source_language of speech in audio, target_language, and mime type of the audio.
     * @param config    (OPTIONAL) Axios config for configuring request.
     *
     * See backend endpoint or more details.
     */
    public static async sendAudioFile(file: any,
                                      body: {source_language: string, target_language: string, type: string},
                                      config?: AxiosRequestConfig){
        // Initialize multi-part form
        const formData = new FormData();

        // Append data to form
        formData.append("file", file);
        formData.append('data', new Blob([JSON.stringify(body)], {
            type: "application/json"
        }));

        // Send request to backend
        return backendApi.post("/api/v1/microcontroller/audiofile", formData)
            .then(handleApiResponse)
            .catch(handleApiErrorResponse);
    }
}
