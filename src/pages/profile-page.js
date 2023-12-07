import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { getProtectedResource } from "../services/message.service";

const CheckProfile = () => {
    const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();
    const [message, setMessage] = useState("");

    const domain = process.env.REACT_APP_AUTH0_DOMAIN;

    useEffect(() => {
        let isMounted = true;
        const getMessage = async () => {
            let accessToken = await getAccessTokenSilently({ authorizationParams: { audience: process.env.REACT_APP_AUTH0_AUDIENCE } });
            const { data, error } = await getProtectedResource(accessToken);
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

    const formattedMetadata = user ? (
        <div className="bg-gray-200 p-4 rounded-md overflow-auto">
            <h3 className="text-xl font-bold mb-2">User Metadata:</h3>
            <p><strong>Username:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {user.sub}</p>
            <p><strong>Updated At:</strong> {user.updated_at}</p> 
        </div>
    ) : (
        <p>No user metadata defined</p>
    );

    return (
        isAuthenticated && (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="mb-4">
                    <img
                        src={user.picture}
                        alt={user.name}
                        className="w-40 h-40 rounded-full mx-auto mb-2 mt-2"
                    />
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-center">Your username: {user.name}</h2>
                        <p className="text-sm text-gray-400 text-center">Your email: {user.email}</p>
                        <p className="text-sm text-gray-500 text-center">Email verified: {user.email_verified || false} </p>
                        <p className="text-sm text-gray-500 text-center">UserID: {user.sub} </p>
                    </div>
                </div>
                <div className="mt-4">
                    {formattedMetadata}
                </div>
                {/* Uncomment this section if you want to display the 'message' */}
                {/* <div className="mt-4">
                    <p className="text-red-500">Auth only: {message}</p>
                </div> */}
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                    <a href="/dashboard">Dashboard</a>
                </button>
                <button
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => logout({ returnTo: window.location.origin })}
                >
                    Log Out
                </button>
            </div>
        )
    );
};

export default CheckProfile;
