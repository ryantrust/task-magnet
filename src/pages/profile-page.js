import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useState, useEffect} from 'react'
import {getProtectedResource} from "../services/message.service";

const CheckProfile = () => {
    const {user, isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    const [message, setMessage] = useState("");

    // const [userMetadata, setUserMetadata] = useState(null);
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;

    useEffect(() => {
        let isMounted = true;

        const getMessage = async () => {
            const accessToken = await getAccessTokenSilently();
            const {data, error} = await getProtectedResource(accessToken);

            if (!isMounted) {
                return;
            }

            if (data) {
                setMessage(JSON.stringify(data, null, 2));
            }

            if (error) {
                setMessage(JSON.stringify(error, null, 2));
            }
        };

        getMessage();

        return () => {
            isMounted = false;
        };
    }, [getAccessTokenSilently]);


    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name}/>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <h3>User Metadata</h3>
                {user ? (
                    <>
                        <pre>{JSON.stringify(user, null, 2)}</pre>
                        {/* <pre>{JSON.stringify(getAccessTokenSilently())}</pre> */}
                    </>
                ) : (
                    "No user metadata defined"
                )}
                <div>
                    <p>Auth only: {message}</p>
                </div>
            </div>
        )
    );
};

export default CheckProfile;