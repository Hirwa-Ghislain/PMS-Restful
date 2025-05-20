// utils/apiPaths.js

export const BASE_URL = "http://localhost:5000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        SIGNUP: "/api/v1/auth/signup",
        GET_USER_INFO: "/api/v1/auth/me",
    },
    DASHBOARD: {
        GET_PROFILE: "/api/v1/dashboard/profile",
    },
    PARKINGS: {
        GET_ALL: "/api/v1/parkings",
        SEARCH: "/api/v1/parkings/search",
        ADD: "/api/v1/parkings",
        UPDATE: (id) => `/api/v1/parkings/${id}`,
        DELETE: (id) => `/api/v1/parkings/${id}`,
    },
    REGISTER_CARS: {
        // User routes
        GET_USER_REGISTRATIONS: "/api/v1/registercars/user",
        CREATE: "/api/v1/registercars",
        UPDATE: (id) => `/api/v1/registercars/${id}`,
        DELETE: (id) => `/api/v1/registercars/${id}`,
        GET_TICKET: (id) => `/api/v1/registercars/${id}/ticket`,
        PROCESS_EXIT: (id) => `/api/v1/registercars/${id}/exit`,
        PAY_BILL: (id) => `/api/v1/registercars/bills/${id}/pay`,
        // Admin routes
        GET_ALL: "/api/v1/registercars/admin",
        GET_OUTGOING: "/api/v1/registercars/admin/outgoing",
        UPDATE_TICKET_STATUS: (id) => `/api/v1/registercars/${id}/ticket-status`,
        GENERATE_BILL: (id) => `/api/v1/registercars/${id}/generate-bill`,
    },
    BILLS: {
        GET_USER_BILLS: "/api/v1/registercars/user/bills",
        PAY_BILL: (id) => `/api/v1/registercars/bills/${id}/pay`,
        GET_ALL_BILLS: "/api/v1/registercars/admin/bills",
    }
};

// Optional helper to get full path
export const getFullPath = (path) => `${BASE_URL}${path}`;
