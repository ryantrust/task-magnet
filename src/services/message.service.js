import { callExternalApi } from "./external-api.service";
const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
export const getPublicResource = async () => {
    const config = {
        url: `${apiServerUrl}/api/public`,
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
    };

    const { data, error } = await callExternalApi({ config });

    return {
        data: data || null,
        error,
    };
};

export const getProtectedResource = async (sub, accessToken) => {
    const config = {
        url: `${apiServerUrl}/api/private/${sub}`,
        method: "GET",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const { data, error } = await callExternalApi({ config });

    return {
        data: data || null,
        error,
    };
};

export const getAdminResource = async (accessToken) => {
    const config = {
        url: `${apiServerUrl}/api/private`,
        method: "GET",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const { data, error } = await callExternalApi({ config });

    return {
        data: data || null,
        error,
    };
};