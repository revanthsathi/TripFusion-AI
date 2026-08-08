// =====================================================
// TripFusion AI - API Configuration
// =====================================================

const API_BASE_URL = "http://localhost:5000/api";


// =====================================================
// Generic API Request
// =====================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const token =
        localStorage.getItem("accessToken");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                    ...options,
                    headers
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Something went wrong."
            );

        }

        return data;

    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;

    }

}


// =====================================================
// Authentication APIs
// =====================================================

async function registerUser(
    userData
) {

    return apiRequest(
        "/auth/register",
        {
            method: "POST",

            body: JSON.stringify(
                userData
            )
        }
    );

}


async function loginUser(
    email,
    password
) {

    return apiRequest(
        "/auth/login",
        {
            method: "POST",

            body: JSON.stringify({
                email,
                password
            })
        }
    );

}


async function getCurrentUser() {

    return apiRequest(
        "/auth/me",
        {
            method: "GET"
        }
    );

}


async function logoutUser() {

    return apiRequest(
        "/auth/logout",
        {
            method: "POST"
        }
    );

}


async function refreshAccessToken(
    refreshToken
) {

    return apiRequest(
        "/auth/refresh-token",
        {
            method: "POST",

            body: JSON.stringify({
                refreshToken
            })
        }
    );

}


// =====================================================
// Export for Browser Scripts
// =====================================================

window.TripFusionAPI = {

    // Generic API function
    apiRequest,

    // Authentication
    registerUser,

    loginUser,

    getCurrentUser,

    logoutUser,

    refreshAccessToken

};