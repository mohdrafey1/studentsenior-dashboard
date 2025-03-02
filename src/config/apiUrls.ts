export const API_BASE_URL = process.env.API_URL || 'http://localhost:8080';
export const API_KEY = process.env.API_KEY || '1234';
export const API_KEY_URL = process.env.API_KEY_URL || '1234';

export const api = {
    auth: {
        login: `${API_BASE_URL}/dashboard/auth/signin`,
        signup: `${API_BASE_URL}/dashboard/auth/signup`,
    },

    college: {
        getColleges: `${API_BASE_URL}/dashboard/college`,
        editCollege: `${API_BASE_URL}/dashboard/college`,
        deleteCollege: `${API_BASE_URL}/dashboard/college`,
        collegeData: `${API_BASE_URL}/dashboard/college/collegeData`,
    },

    report: {
        stats: `${API_BASE_URL}/dashboard/stats`,
    },
};
