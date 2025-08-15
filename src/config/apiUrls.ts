export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export const API_KEY_URL = process.env.NEXT_PUBLIC_API_KEY_URL;

export const api = {
    auth: {
        login: `${API_BASE_URL}/dashboard/auth/signin`,
        signup: `${API_BASE_URL}/dashboard/auth/signup`,
    },

    user: {
        allUser: `${API_BASE_URL}/dashboard/user`,
        allDashboardUser: `${API_BASE_URL}/dashboard/user/dashboarduser`,
    },

    college: {
        getColleges: `${API_BASE_URL}/dashboard/college`,
        editCollege: `${API_BASE_URL}/dashboard/college`,
        deleteCollege: `${API_BASE_URL}/dashboard/college`,
        collegeData: `${API_BASE_URL}/dashboard/college/collegeData`,
    },

    report: {
        stats: `${API_BASE_URL}/dashboard/stats`,
        contactus: `${API_BASE_URL}/dashboard/stats/contactus`,
    },

    resource: {
        courses: `${API_BASE_URL}/dashboard/resource/courses`,
        branches: `${API_BASE_URL}/dashboard/resource/branches`,
        subjects: `${API_BASE_URL}/dashboard/resource/subjects`,
    },

    transactions: {
        transaction: `${API_BASE_URL}/dashboard/transactions`,
        redemption: `${API_BASE_URL}/dashboard/transactions/redemption`,
        addPoint: `${API_BASE_URL}/dashboard/transactions/add-points`,
        payments: `${API_BASE_URL}/dashboard/transactions/all-payments`,
        getPaymentById: `${API_BASE_URL}/dashboard/transactions/payments`,
    },

    store: {
        affiliateProducts: `${API_BASE_URL}/dashboard/store/affiliate`,
        products: `${API_BASE_URL}/dashboard/store`,
    },

    pyqs: {
        getPyqs: `${API_BASE_URL}/dashboard/pyqs`,
        requestPyq: `${API_BASE_URL}/dashboard/pyqs/request-pyq`,
    },

    notes: {
        getNotes: `${API_BASE_URL}/dashboard/notes`,
    },

    seniors: {
        getSeniors: `${API_BASE_URL}/dashboard/seniors`,
    },

    community: {
        getPosts: `${API_BASE_URL}/dashboard/community`,
    },

    lostfound: {
        allLostFoundItems: `${API_BASE_URL}/dashboard/lostfound`,
    },

    groups: {
        getGroups: `${API_BASE_URL}/dashboard/groups`,
    },

    opportunity: {
        getOpportunities: `${API_BASE_URL}/dashboard/opportunity`,
    },

    getSignedUrl: `${API_BASE_URL}/api/get-signed-url`,

    course: {
        enrollCourse: `${API_BASE_URL}/courseapi/course/enroll`,
    },
};
