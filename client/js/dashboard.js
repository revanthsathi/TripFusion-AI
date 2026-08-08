// =====================================================
// TRIPFUSION AI — USER DASHBOARD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeDashboard();

    }
);


// =====================================================
// INITIALIZE
// =====================================================

async function initializeDashboard() {

    if (
        !TripFusionAuth.requireAuthentication()
    ) {

        return;

    }


    setupSidebar();

    setupActions();

    setupComingSoonButtons();

    await loadDashboard();

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        const response =
            await TripFusionAPI.apiRequest(
                "/user-dashboard",
                {
                    method: "GET"
                }
            );

        const dashboard =
            response.data;

        if (!dashboard) {

            throw new Error(
                "Dashboard data is unavailable."
            );

        }


        renderUser(
            dashboard.user
        );

        renderStatistics(
            dashboard.statistics
        );

        renderUpcomingTrip(
            dashboard.upcomingTrips
        );

        renderBookings(
            dashboard.recentBookings
        );

        renderTrips(
            dashboard.recentTrips
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        showToast(
            error.message ||
            "Unable to load dashboard.",
            "error"
        );

    }

}


// =====================================================
// USER
// =====================================================

function renderUser(user) {

    if (!user) {
        return;
    }


    const name =
        user.fullName ||
        "Traveler";


    const email =
        user.email ||
        "";


    const firstName =
        name
            .trim()
            .split(" ")[0];


    const welcomeName =
        document.getElementById(
            "welcomeName"
        );


    const topUserName =
        document.getElementById(
            "topUserName"
        );


    const topUserEmail =
        document.getElementById(
            "topUserEmail"
        );


    const topAvatar =
        document.getElementById(
            "topAvatar"
        );


    if (welcomeName) {

        welcomeName.textContent =
            firstName;

    }


    if (topUserName) {

        topUserName.textContent =
            name;

    }


    if (topUserEmail) {

        topUserEmail.textContent =
            email;

    }


    if (topAvatar) {

        topAvatar.textContent =
            getInitials(name);

    }

}


// =====================================================
// STATISTICS
// =====================================================

function renderStatistics(
    statistics
) {

    if (!statistics) {
        return;
    }


    const totalTrips =
        document.getElementById(
            "totalTrips"
        );


    const totalBookings =
        document.getElementById(
            "totalBookings"
        );


    const totalSpent =
        document.getElementById(
            "totalSpent"
        );


    if (totalTrips) {

        totalTrips.textContent =
            statistics.totalTrips ?? 0;

    }


    if (totalBookings) {

        totalBookings.textContent =
            statistics.totalBookings ?? 0;

    }


    if (totalSpent) {

        totalSpent.textContent =
            formatCurrency(
                statistics.totalSpent || 0
            );

    }

}


// =====================================================
// UPCOMING TRIP
// =====================================================

function renderUpcomingTrip(
    trips
) {

    const container =
        document.getElementById(
            "upcomingTripContainer"
        );


    if (!container) {
        return;
    }


    if (
        !trips ||
        trips.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✦
                </div>

                <strong>
                    No upcoming trips
                </strong>

                <p>
                    Your next adventure is waiting.
                    Let AI help you plan something amazing.
                </p>

            </div>

        `;

        return;

    }


    const trip =
        trips[0];


    const destination =
        trip.destination;


    const destinationName =
        destination?.name ||
        "Your destination";


    const country =
        destination?.country ||
        "";


    const startDate =
        formatDate(
            trip.startDate
        );


    const endDate =
        formatDate(
            trip.endDate
        );


    const status =
        formatTripStatus(
            trip.status
        );


    container.innerHTML = `

        <div class="trip-feature">

            <div class="trip-feature-content">

                <span class="trip-status">
                    ${escapeHtml(status)}
                </span>

                <h3>
                    ${escapeHtml(destinationName)}
                </h3>

                <div class="trip-meta">

                    <span>
                        ${escapeHtml(country)}
                    </span>

                    <span>
                        ${escapeHtml(startDate)}
                        –
                        ${escapeHtml(endDate)}
                    </span>

                    <span>
                        ${trip.travelers || 1}
                        traveler${trip.travelers === 1 ? "" : "s"}
                    </span>

                </div>

                <a
                    href="#"
                    class="trip-link"
                    data-coming-soon
                >
                    View trip details →
                </a>

            </div>

        </div>

    `;

}


// =====================================================
// BOOKINGS
// =====================================================

function renderBookings(
    bookings
) {

    const container =
        document.getElementById(
            "bookingsContainer"
        );


    if (!container) {
        return;
    }


    if (
        !bookings ||
        bookings.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ▣
                </div>

                <strong>
                    No bookings yet
                </strong>

                <p>
                    Your hotel bookings will appear here.
                </p>

            </div>

        `;

        return;

    }


    const rows =
        bookings
            .map(
                (booking) =>
                    createBookingRow(
                        booking
                    )
            )
            .join("");


    container.innerHTML = `

        <table class="booking-table">

            <thead>

                <tr>

                    <th>
                        HOTEL
                    </th>

                    <th>
                        ROOM
                    </th>

                    <th>
                        CHECK-IN
                    </th>

                    <th>
                        STATUS
                    </th>

                    <th>
                        PAYMENT
                    </th>

                    <th>
                        TOTAL
                    </th>

                </tr>

            </thead>

            <tbody>

                ${rows}

            </tbody>

        </table>

    `;

}


// =====================================================
// BOOKING ROW
// =====================================================

function createBookingRow(
    booking
) {

    const hotel =
        booking.hotel;


    const hotelName =
        hotel?.name ||
        "Hotel";


    const room =
        booking.roomType ||
        "Room";


    const checkIn =
        formatDate(
            booking.checkIn
        );


    const bookingStatus =
        booking.bookingStatus ||
        "pending";


    const paymentStatus =
        booking.paymentStatus ||
        "pending";


    return `

        <tr>

            <td>

                <div class="hotel-name">

                    <span class="hotel-icon">
                        ⌂
                    </span>

                    <span>

                        <strong>
                            ${escapeHtml(hotelName)}
                        </strong>

                        <small>
                            ${booking.roomsBooked || 1}
                            room${booking.roomsBooked === 1 ? "" : "s"}
                        </small>

                    </span>

                </div>

            </td>

            <td>
                ${escapeHtml(room)}
            </td>

            <td>
                ${escapeHtml(checkIn)}
            </td>

            <td>

                <span class="status-pill ${getStatusClass(bookingStatus)}">

                    ${escapeHtml(
                        formatStatus(
                            bookingStatus
                        )
                    )}

                </span>

            </td>

            <td>

                <span class="status-pill ${getStatusClass(paymentStatus)}">

                    ${escapeHtml(
                        formatStatus(
                            paymentStatus
                        )
                    )}

                </span>

            </td>

            <td class="price">

                ${formatCurrency(
                    booking.totalPrice || 0
                )}

            </td>

        </tr>

    `;

}


// =====================================================
// RECENT TRIPS
// =====================================================

function renderTrips(
    trips
) {

    const container =
        document.getElementById(
            "tripsContainer"
        );


    if (!container) {
        return;
    }


    if (
        !trips ||
        trips.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✈
                </div>

                <strong>
                    No trips created yet
                </strong>

                <p>
                    Start planning your first journey
                    with TripFusion AI.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        trips
            .map(
                (trip) =>
                    createTripCard(
                        trip
                    )
            )
            .join("");

}


// =====================================================
// TRIP CARD
// =====================================================

function createTripCard(
    trip
) {

    const destination =
        trip.destination;


    const name =
        destination?.name ||
        "Unknown destination";


    const country =
        destination?.country ||
        "";


    return `

        <article class="trip-list-item">

            <div class="trip-list-top">

                <span class="destination-icon">
                    ◎
                </span>

                <span class="status-pill ${getStatusClass(trip.status)}">
                    ${escapeHtml(
                        formatStatus(
                            trip.status
                        )
                    )}
                </span>

            </div>

            <h3>
                ${escapeHtml(
                    trip.title ||
                    name
                )}
            </h3>

            <p>
                ${escapeHtml(name)}
                ${country ? `, ${escapeHtml(country)}` : ""}
            </p>

            <span class="trip-date">

                ${escapeHtml(
                    formatDate(
                        trip.startDate
                    )
                )}

            </span>

        </article>

    `;

}


// =====================================================
// SIDEBAR
// =====================================================

function setupSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const closeButton =
        document.getElementById(
            "closeSidebar"
        );


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            () => {

                sidebar.classList.add(
                    "open"
                );

                overlay.classList.add(
                    "show"
                );

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    function closeSidebar() {

        sidebar.classList.remove(
            "open"
        );

        overlay.classList.remove(
            "show"
        );

    }

}


// =====================================================
// ACTIONS
// =====================================================

function setupActions() {

    const planButtons =
        [
            document.getElementById(
                "planTripButton"
            ),

            document.getElementById(
                "quickPlanTrip"
            )
        ];


    planButtons.forEach(
        (button) => {

            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                () => {

                    showToast(
                        "AI Trip Planner is coming next.",
                        "success"
                    );

                }
            );

        }
    );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                logoutButton.disabled =
                    true;

                await TripFusionAuth.logout();

            }
        );

    }

}


// =====================================================
// COMING SOON
// =====================================================

function setupComingSoonButtons() {

    document.addEventListener(
        "click",
        (event) => {

            const element =
                event.target.closest(
                    "[data-coming-soon]"
                );


            if (!element) {
                return;
            }


            event.preventDefault();


            showToast(
                "This section will be available soon.",
                "success"
            );

        }
    );

}


// =====================================================
// TOAST
// =====================================================

let toastTimer;


function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    const toastIcon =
        document.getElementById(
            "toastIcon"
        );


    if (!toast) {
        return;
    }


    toastMessage.textContent =
        message;


    toastIcon.textContent =
        type === "error"
            ? "!"
            : "✓";


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


// =====================================================
// FORMATTING
// =====================================================

function formatCurrency(
    value
) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(
        Number(value) || 0
    );

}


function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function formatStatus(
    value
) {

    if (!value) {
        return "Unknown";
    }


    return value
        .replace(
            /-/g,
            " "
        )
        .replace(
            /\b\w/g,
            (char) =>
                char.toUpperCase()
        );

}


function formatTripStatus(
    status
) {

    if (status === "planning") {
        return "UPCOMING";
    }

    if (status === "ongoing") {
        return "ONGOING";
    }

    if (status === "completed") {
        return "COMPLETED";
    }

    return formatStatus(
        status
    ).toUpperCase();

}


function getStatusClass(
    status
) {

    if (!status) {
        return "pending";
    }


    if (
        [
            "confirmed",
            "paid",
            "ongoing",
            "completed"
        ].includes(status)
    ) {

        return "confirmed";

    }


    if (
        status === "cancelled"
    ) {

        return "cancelled";

    }


    return "pending";

}


function getInitials(
    name
) {

    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (!parts.length) {
        return "T";
    }


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


// =====================================================
// SECURITY
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}