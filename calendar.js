// Calendar state
let currentDate = new Date();
let selectedDate = null;

// Initialize calendar
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    
    // Add event listeners for navigation
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthSpan = document.getElementById('currentMonth');
    const todayBtn = document.getElementById('todayBtn');
    
    function updateCurrentMonthDisplay() {
        currentMonthSpan.textContent = currentDate.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });
    }
    
    prevMonthBtn.addEventListener('click', () => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        updateCurrentMonthDisplay();
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        updateCurrentMonthDisplay();
        renderCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        updateCurrentMonthDisplay();
        renderCalendar();
    });
    
    // Initialize the current month display
    updateCurrentMonthDisplay();
    
    // Add event listeners for view switching
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.textContent);
        });
    });
});

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayIndex = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const today = new Date();
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDate; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;
        
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        dayElement.setAttribute('data-date', dateString);
        
        // Check if it's today
        if (day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Check if it's the selected date
        if (selectedDate === dateString) {
            dayElement.classList.add('selected');
        }
        
        dayElement.addEventListener('click', () => selectDate(dateString, dayElement));
        calendarDays.appendChild(dayElement);
    }
    
    // Add empty cells for remaining days to complete the grid
    const remainingDays = 42 - (firstDayIndex + lastDate); // 42 is 6 rows * 7 days
    for (let i = 0; i < remainingDays; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDay);
    }
}

function selectDate(dateString, element) {
    // Remove previous selection
    const previousSelected = document.querySelector('.calendar-day.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    element.classList.add('selected');
    selectedDate = dateString;
}

function switchView(view) {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === view.toLowerCase()) {
            btn.classList.add('active');
        }
    });
    
    // For now, we'll just handle the month view
    // Week and Day views can be implemented later if needed
    switch(view.toLowerCase()) {
        case 'month':
            renderCalendar();
            break;
        case 'week':
            // Week view implementation can be added here
            break;
        case 'day':
            // Day view implementation can be added here
            break;
    }
} 