// Store applications data
let applications = [];

// Add these variables at the top of your file
const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let activeFilters = ['applied', 'interview', 'offer', 'rejected'];
let searchTerm = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for the add job button
    const addJobBtn = document.querySelector('.add-job-btn');
    addJobBtn.addEventListener('click', () => openModal());

    // Add event listener for the add job form
    const addJobForm = document.getElementById('addJobForm');
    addJobForm.addEventListener('submit', handleAddJob);

    // Add event listener for search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Add filter setup
    setupFilterDropdown();
    setupFilterApplication();

    // Add pagination setup
    setupPaginationControls();

    // Load any existing applications
    loadApplications();

    // Add this after your document.ready function
    document.getElementById('applicationSource').addEventListener('change', function(e) {
        const otherSourceGroup = document.getElementById('otherSourceGroup');
        otherSourceGroup.style.display = e.target.value === 'other' ? 'block' : 'none';
    });
});

function openModal() {
    const modal = document.getElementById('addJobModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('addJobModal');
    modal.style.display = 'none';
}

function handleAddJob(e) {
    e.preventDefault();

    const sourceSelect = document.getElementById('applicationSource');
    let applicationSource = sourceSelect.value;
    
    // If "Other" is selected, use the specified text
    if (applicationSource === 'other') {
        const otherSourceText = document.getElementById('otherSource').value.trim();
        applicationSource = otherSourceText || 'Other';
    }

    const newJob = {
        id: Date.now(),
        company: document.getElementById('company').value,
        position: document.getElementById('position').value,
        salary: document.getElementById('salary').value ? parseInt(document.getElementById('salary').value) : null,
        dateApplied: document.getElementById('dateApplied').value,
        applicationSource: applicationSource,
        status: document.getElementById('status').value,
        gotResponse: document.getElementById('gotResponse').checked,
        notes: document.getElementById('notes').value
    };

    applications.push(newJob);
    saveApplications();
    renderApplications();
    updateAnalytics();
    closeModal();
    e.target.reset();
    document.getElementById('otherSourceGroup').style.display = 'none';
}

function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    currentPage = 1; // Reset to first page when searching
    applyFiltersAndSearch();
}

function saveApplications() {
    localStorage.setItem('applications', JSON.stringify(applications));
}

function loadApplications() {
    const saved = localStorage.getItem('applications');
    if (saved) {
        applications = JSON.parse(saved);
        renderApplications();
    }
}

function renderApplications(apps = applications) {
    const tableBody = document.getElementById('applicationsTableBody');
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, apps.length);
    
    // Update pagination info
    document.getElementById('startRange').textContent = apps.length === 0 ? 0 : startIndex + 1;
    document.getElementById('endRange').textContent = endIndex;
    document.getElementById('totalCount').textContent = apps.length;
    
    // Update pagination buttons
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = endIndex >= apps.length;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Show message if no results
    if (apps.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div class="no-results-message">
                No applications found${searchTerm ? ' matching your search' : ''}
                ${activeFilters.length < 4 ? ' with selected filters' : ''}.
            </div>
        `;
        tableBody.appendChild(noResults);
        return;
    }
    
    // Render only the current page's items
    for (let i = startIndex; i < endIndex; i++) {
        const app = apps[i];
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${app.company}</div>
            <div>${app.position}</div>
            <div>${app.salary ? '$' + app.salary.toLocaleString() : '-'}</div>
            <div>${formatDate(app.dateApplied)}</div>
            <div><span class="status-badge status-${app.status}">${capitalizeFirst(app.status)}</span></div>
            <div class="action-buttons">
                <button class="action-btn edit-btn" onclick="editApplication(${app.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteApplication(${app.id})">Delete</button>
            </div>
        `;
        tableBody.appendChild(row);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function editApplication(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    document.getElementById('company').value = app.company;
    document.getElementById('position').value = app.position;
    document.getElementById('salary').value = app.salary || '';
    document.getElementById('dateApplied').value = app.dateApplied;
    document.getElementById('applicationSource').value = app.applicationSource;
    
    const otherSourceGroup = document.getElementById('otherSourceGroup');
    if (app.applicationSource === 'other') {
        otherSourceGroup.style.display = 'block';
        document.getElementById('otherSource').value = app.applicationSource;
    } else {
        otherSourceGroup.style.display = 'none';
    }
    
    document.getElementById('status').value = app.status;
    document.getElementById('gotResponse').checked = app.gotResponse;
    document.getElementById('notes').value = app.notes;

    openModal();
    applications = applications.filter(a => a.id !== id);
}

function deleteApplication(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        applications = applications.filter(a => a.id !== id);
        saveApplications();
        
        // Adjust current page if necessary
        const maxPage = Math.ceil(applications.length / ITEMS_PER_PAGE);
        if (currentPage > maxPage) {
            currentPage = Math.max(1, maxPage);
        }
        
        renderApplications();
    }
}

// Add these pagination control functions
function setupPaginationControls() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderApplications();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const maxPage = Math.ceil(applications.length / ITEMS_PER_PAGE);
        if (currentPage < maxPage) {
            currentPage++;
            renderApplications();
        }
    });
}

// Add this function to handle the filter dropdown toggle
function setupFilterDropdown() {
    const filterBtn = document.querySelector('.filter-btn');
    const filterDropdown = document.querySelector('.filter-dropdown');
    
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!filterDropdown.contains(e.target)) {
            filterDropdown.classList.remove('active');
        }
    });
}

// Add this function to handle filter application
function setupFilterApplication() {
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const checkboxes = document.querySelectorAll('.filter-content input[type="checkbox"]');
    
    // Initialize checkboxes based on activeFilters
    checkboxes.forEach(checkbox => {
        checkbox.checked = activeFilters.includes(checkbox.value);
    });

    applyFilterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Update activeFilters based on checked boxes
        activeFilters = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Reset to first page when applying filters
        currentPage = 1;
        
        // Apply both filters and search
        applyFiltersAndSearch();
        
        // Close the dropdown
        document.querySelector('.filter-dropdown').classList.remove('active');
    });
}

// Add this function to combine search and filter functionality
function applyFiltersAndSearch() {
    const filteredApplications = applications.filter(app => {
        const matchesSearch = 
            app.company.toLowerCase().includes(searchTerm) ||
            app.position.toLowerCase().includes(searchTerm);
        const matchesFilter = activeFilters.includes(app.status);
        return matchesSearch && matchesFilter;
    });
    
    renderApplications(filteredApplications);
}

// Add styles for no results message
const styles = `
.no-results {
    padding: 2rem;
    text-align: center;
    color: #666;
}

.no-results-message {
    font-size: 1.1rem;
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 