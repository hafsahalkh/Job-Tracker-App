// utils.js

// Password validation function
function validatePassword(password) {
    const minLength = 8;
    const hasCapital = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        length: password.length >= minLength,
        capital: hasCapital,
        special: hasSpecial
    };
}

// Error message generation
function getErrorMessage(requirements) {
    const missing = [];
    if (!requirements.length) missing.push("at least 8 characters");
    if (!requirements.capital) missing.push("a capital letter");
    if (!requirements.special) missing.push("a special character");
    
    if (missing.length === 0) return "";
    return "Password must contain " + missing.join(", ");
}

// Login status check
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Application Storage Functions
const saveApplication = (application) => {
    let applications = [];
    try {
        applications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    } catch (e) {
        applications = [];
    }

    if (!application.id) {
        application.id = Date.now();
    }
    applications.push(application);
    localStorage.setItem('jobApplications', JSON.stringify(applications));
    return application;
};

const getApplications = () => {
    try {
        return JSON.parse(localStorage.getItem('jobApplications')) || [];
    } catch (e) {
        return [];
    }
};

const updateApplication = (id, updatedData) => {
    let applications = getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
        applications[index] = { ...applications[index], ...updatedData };
        localStorage.setItem('jobApplications', JSON.stringify(applications));
        return true;
    }
    return false;
};

const validateJobApplication = (job) => {
    return job.company !== '';
};

const calculateStatistics = (applications) => {
    const total = applications.length;
    const offers = applications.filter(app => app.status === 'offer').length;
    const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;
    
    const byStatus = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {});
    
    return {
        total,
        successRate,
        byStatus
    };
};

// Time range filter
function filterApplicationsByTimeRange(applications, timeRange) {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch(timeRange) {
        case '7':
            cutoffDate.setDate(now.getDate() - 7);
            break;
        case '30':
            cutoffDate.setDate(now.getDate() - 30);
            break;
        case '90':
            cutoffDate.setDate(now.getDate() - 90);
            break;
        default:
            return applications;
    }
    
    return applications.filter(app => {
        const appDate = new Date(app.dateApplied);
        return appDate >= cutoffDate;
    });
}

// String utility
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Export all functions
module.exports = {
    validatePassword,
    getErrorMessage,
    isLoggedIn,
    saveApplication,
    getApplications,
    updateApplication,
    filterApplicationsByTimeRange,
    capitalizeFirst,
    validateJobApplication,
    calculateStatistics
};
