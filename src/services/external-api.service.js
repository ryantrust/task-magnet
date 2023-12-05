import axios from 'axios';

export const callExternalApi = async (options) => {



    // try {
    //     const token = await getAccessTokenSilently({
    //         authorizationParams: {
    //             audience: process.env.REACT_APP_AUTH0_AUDIENCE, // Value in Identifier field for the API being called.
    //         }
    //     });
    //     let payload = JSON.parse(options.config);
    //     payload.headers['Authorization'] = `Bearer ${token}`;
    //     let payloadJSON = JSON.stringify(payload)

    // } catch (e) {
    //     console.error(e);
    // }


    try {
        // console.log("sending: " + options.config)
        const response = await axios(options.config);
        const { data } = response;

        return {
            data,
            error: null,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error;

            const { response } = axiosError;

            let message = "http request failed";

            if (response && response.statusText) {
                message = response.statusText;
            }

            if (axiosError.message) {
                message = axiosError.message;
            }

            if (response && response.data && response.data.message) {
                message = response.data.message;
            }

            return {
                data: null,
                error: {
                    message,
                },
            };
        }

        return {
            data: null,
            error: {
                message: error.message,
            },
        };
    }
};