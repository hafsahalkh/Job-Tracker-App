// tests/functional.test.js

// Import the functions from utils.js
const {
    saveApplication,
    getApplications,
    updateApplication,
    validateJobApplication,
    calculateStatistics
} = require('../utils.js');

// Improved localStorage mock
const localStorageMock = {
    store: {},
    getItem(key) {
        return this.store[key] || null;  // Return null instead of undefined
    },
    setItem(key, value) {
        this.store[key] = String(value);  // Ensure value is converted to string
    },
    clear() {
        this.store = {};
    }
};

// Set up localStorage mock before running tests
global.localStorage = localStorageMock;

describe('Job Tracker Functional Tests', () => {
    beforeEach(() => {
        localStorage.clear();
        // Initialize empty applications array in localStorage
        localStorage.setItem('jobApplications', JSON.stringify([]));
    });

    // Test Case 1: Adding a New Job
    test('TC_001: Add new job to tracker', () => {
        const newJob = {
            company: 'Google',
            position: 'Software Engineer',
            status: 'applied',
            dateApplied: new Date().toISOString(),
            salary: '120000',
            location: 'Mountain View, CA'
        };
        
        const savedJob = saveApplication(newJob);
        const applications = getApplications();
        
        expect(applications).toHaveLength(1);
        expect(applications[0].company).toBe('Google');
        expect(applications[0].position).toBe('Software Engineer');
        expect(savedJob.id).toBeDefined();
    });

    // Test Case 2: Editing Job Status
    test('TC_002: Update job status', () => {
        const job = saveApplication({
            company: 'Google',
            status: 'applied'
        });
        
        const updated = updateApplication(job.id, { 
            status: 'interview',
            notes: 'Phone interview scheduled for May 2nd at 2 PM'
        });
        
        expect(updated).toBeTruthy();
        const applications = getApplications();
        expect(applications[0].status).toBe('interview');
        expect(applications[0].notes).toBe('Phone interview scheduled for May 2nd at 2 PM');
    });

    // Test Case 3: Deleting a Job
    test('TC_003: Delete job from tracker', () => {
        const job = saveApplication({
            company: 'Google'
        });
        
        let applications = getApplications();
        expect(applications).toHaveLength(1);
        
        // Delete application
        applications = applications.filter(app => app.id !== job.id);
        localStorage.setItem('jobApplications', JSON.stringify(applications));
        
        applications = getApplications();
        expect(applications).toHaveLength(0);
    });

    // Test Case 4: Search Functionality
    test('TC_004: Search jobs by title', () => {
        const jobs = [
            { position: 'Software Engineer', company: 'Google' },
            { position: 'Product Manager', company: 'Facebook' },
            { position: 'UX Designer', company: 'Apple' }
        ];
        
        jobs.forEach(job => saveApplication(job));
        const applications = getApplications();
        const searchResults = applications.filter(app => 
            app.position.toLowerCase().includes('engineer')
        );
        
        expect(searchResults).toHaveLength(1);
        expect(searchResults[0].position).toBe('Software Engineer');
    });

    // Test Case 5: Sorting Jobs
    test('TC_005: Sort jobs by date', () => {
        const jobs = [
            { dateApplied: '2024-03-01', company: 'Google' },
            { dateApplied: '2024-03-15', company: 'Facebook' },
            { dateApplied: '2024-03-10', company: 'Apple' }
        ];
        
        jobs.forEach(job => saveApplication(job));
        const applications = getApplications();
        const sortedApps = [...applications].sort((a, b) => 
            new Date(b.dateApplied) - new Date(a.dateApplied)
        );
        
        expect(sortedApps[0].dateApplied).toBe('2024-03-15');
    });

    // Test Case 6: Data Persistence
    test('TC_006: Verify data persistence', () => {
        const job = {
            company: 'Google',
            position: 'Software Engineer'
        };
        
        saveApplication(job);
        const applications = getApplications();
        
        expect(applications).toHaveLength(1);
        expect(applications[0].company).toBe('Google');
    });

    // Test Case 7: Form Validation
    test('TC_007: Form validation for required fields', () => {
        const invalidJob = {
            position: 'Software Engineer',
            company: '' // Required field is empty
        };
        
        const isValid = validateJobApplication(invalidJob);
        expect(isValid).toBeFalsy();
    });

    // Test Case 8: Filter Applications
    test('TC_008: Filter applications by status', () => {
        const jobs = [
            { status: 'applied', company: 'Google' },
            { status: 'interview', company: 'Facebook' },
            { status: 'applied', company: 'Apple' }
        ];
        
        jobs.forEach(job => saveApplication(job));
        const applications = getApplications();
        const appliedJobs = applications.filter(app => app.status === 'applied');
        
        expect(appliedJobs).toHaveLength(2);
    });

    // Test Case 9: Multiple Status Updates
    test('TC_009: Multiple status updates for a job', () => {
        const job = saveApplication({
            company: 'Google',
            status: 'applied'
        });
        
        const statusUpdates = ['interview', 'offer', 'rejected'];
        statusUpdates.forEach(status => {
            const updated = updateApplication(job.id, { status });
            expect(updated).toBeTruthy();
        });
        
        const applications = getApplications();
        expect(applications[0].status).toBe('rejected');
    });

    // Test Case 10: Statistics Calculation
    test('TC_010: Calculate application statistics', () => {
        const jobs = [
            { status: 'applied' },
            { status: 'applied' },
            { status: 'interview' },
            { status: 'offer' },
            { status: 'rejected' }
        ];
        
        jobs.forEach(job => saveApplication(job));
        const applications = getApplications();
        
        const stats = calculateStatistics(applications);
        
        expect(stats.total).toBe(5);
        expect(stats.successRate).toBe(20);
        expect(stats.byStatus.applied).toBe(2);
    });
});
