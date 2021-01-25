import Axios from 'axios';
import { ApiURL } from "./resources.js";

//api handler that is used by the components to do api calls.

//apiURL is received from resources 
const api = Axios.create({
    baseURL: ApiURL
})

//method that check validity of 
const handleApiResponse = ((res) => {
    //unpack api result
    //if confusing: google ES6 destructuring assignment
    const { 
            status: status ,
            data: data , 
            config: { method, url } 
    } = res;

    
    if (process.env.NODE_ENV === "development") {
        console.log(`${method} ${url}`)
        console.log(res)
    }
    
    //return data from call
    if (status === 200 && data)
        return data;
    else
        throw Error(`something went wrong with api call to ${method} : ${url}. 
                    \nStatus: ${status}
                    \nData: ${data}`);
})

//the methods that wrap the api calls 
export default {
    getWelcomeMessage() {
        return api.get('/vue-test')
        .then(handleApiResponse)
        .catch(e => console.log(e))
    }
}
