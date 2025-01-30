// views.js

// Get current viewers count from localStorage or initialize it
let viewers = localStorage.getItem("viewers") ? parseInt(localStorage.getItem("viewers")) : 0;

// Get unique viewers from localStorage or initialize it
let uniqueViewers = localStorage.getItem("uniqueViewers") ? JSON.parse(localStorage.getItem("uniqueViewers")) : [];

// Get visit history or initialize it
let visitHistory = localStorage.getItem("visitHistory") ? JSON.parse(localStorage.getItem("visitHistory")) : [];

// Get daily viewers data
let dailyViewers = localStorage.getItem("dailyViewers") ? JSON.parse(localStorage.getItem("dailyViewers")) : {};

// Ensure dailyViewers stores unique users correctly as an array
Object.keys(dailyViewers).forEach(date => {
    if (!Array.isArray(dailyViewers[date].unique)) {
        dailyViewers[date].unique = [];
    }
});

// Get user data
let userId = sessionStorage.getItem("userId");
if (!userId) {
    userId = Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("userId", userId);
    if (!uniqueViewers.includes(userId)) {
        uniqueViewers.push(userId);
        localStorage.setItem("uniqueViewers", JSON.stringify(uniqueViewers));
    }
}

// Capture visit time and store data
const visitTime = new Date();
const dateKey = visitTime.toISOString().split('T')[0]; // YYYY-MM-DD format

const visitData = {
    userId: userId,
    ip: "Unknown", // IP tracking requires a backend
    date: dateKey,
    time: visitTime.toTimeString().split(' ')[0]
};
visitHistory.push(visitData);
localStorage.setItem("visitHistory", JSON.stringify(visitHistory));

// Update daily viewers count
if (!dailyViewers[dateKey]) {
    dailyViewers[dateKey] = { total: 0, unique: [] };
}
dailyViewers[dateKey].total++;
if (!dailyViewers[dateKey].unique.includes(userId)) {
    dailyViewers[dateKey].unique.push(userId);
}
localStorage.setItem("dailyViewers", JSON.stringify(dailyViewers));

// Increment viewer count
viewers++;
localStorage.setItem("viewers", viewers);

// Send viewers count and visit data to admin page
function updateAdminPage() {
    const adminPage = window.location.pathname.includes("admin/index.html");
    if (adminPage) {
        document.addEventListener("DOMContentLoaded", () => {
            const viewerCountElement = document.getElementById("viewer-count");
            const uniqueViewerCountElement = document.getElementById("unique-viewer-count");
            const visitHistoryElement = document.getElementById("visit-history");
            
            if (viewerCountElement) {
                viewerCountElement.textContent = `Total Viewers: ${viewers}`;
            }
            if (uniqueViewerCountElement) {
                uniqueViewerCountElement.textContent = `Unique Viewers: ${uniqueViewers.length}`;
            }
            if (visitHistoryElement) {
                visitHistoryElement.innerHTML = visitHistory.map(v => `<li>${v.date} - ${v.time} (User: ${v.userId})</li>`).join('');
            }
        });
    }
}

updateAdminPage();
