// =====================================================
// TRIPFUSION AI — TRIP DETAILS
// =====================================================

let currentTrip = null;


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


async function initialize() {

    if (
        window.TripFusionAuth &&
        typeof TripFusionAuth.requireAuthentication === "function"
    ) {

        if (
            !TripFusionAuth.requireAuthentication()
        ) {
            return;
        }

    }


    setupNavigation();

    await loadUser();

    await loadTrip();

}


// =====================================================
// LOAD TRIP
// =====================================================

async function loadTrip() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const tripId =
        params.get("id");


    if (!tripId) {

        showError(
            "No trip ID was provided."
        );

        return;

    }


    try {

        const response =
            await request(
                `/trips/${tripId}`
            );


        currentTrip =
            response.data;


        if (!currentTrip) {

            throw new Error(
                "Trip not found."
            );

        }


        renderTrip(
            currentTrip
        );


        document
            .getElementById("loading")
            .classList.add("hidden");


        document
            .getElementById("tripContent")
            .classList.remove("hidden");


    } catch (error) {

        console.error(
            "Trip details error:",
            error
        );


        showError(
            error.message ||
            "Unable to load trip."
        );

    }

}


// =====================================================
// RENDER
// =====================================================

function renderTrip(trip) {

    const destination =
        trip.destination || {};


    const ai =
        trip.aiResponse || {};


    const destinationName =
        destination.name ||
        ai.destination ||
        "Unknown destination";


    const location =
        [
            destination.state,
            destination.country
        ]
            .filter(Boolean)
            .join(", ");


    const title =
        trip.title ||
        destinationName;


    document.getElementById(
        "tripTitle"
    ).textContent =
        title;


    document.getElementById(
        "destination"
    ).textContent =
        location
            ? `${destinationName} · ${location}`
            : destinationName;


    document.getElementById(
        "heroDates"
    ).textContent =
        `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`;


    document.getElementById(
        "heroDuration"
    ).textContent =
        `${trip.totalDays || ai.numberOfDays || 0} days`;


    document.getElementById(
        "heroTravelers"
    ).textContent =
        `${trip.travelers || ai.travelers || 1} travelers`;


    document.getElementById(
        "startDate"
    ).textContent =
        formatDate(trip.startDate);


    document.getElementById(
        "endDate"
    ).textContent =
        formatDate(trip.endDate);


    document.getElementById(
        "totalDays"
    ).textContent =
        `${trip.totalDays || 0} days`;


    document.getElementById(
        "travelers"
    ).textContent =
        trip.travelers || 1;


    document.getElementById(
        "tripType"
    ).textContent =
        formatText(
            trip.tripType ||
            "solo"
        );


    const status =
        document.getElementById(
            "status"
        );


    status.textContent =
        formatText(
            trip.status ||
            "planning"
        );


    status.className =
        `status-pill ${trip.status || ""}`;


    renderInterests(
        trip.interests
    );


    renderItinerary(
        ai.days ||
        trip.itinerary ||
        []
    );


    renderBudget(
        ai.budgetBreakdown ||
        {}
    );


    document.getElementById(
        "estimatedBudget"
    ).textContent =
        formatCurrency(
            trip.estimatedBudget ||
            ai.budget ||
            0
        );


    document.getElementById(
        "weatherAdvice"
    ).textContent =
        ai.weatherAdvice ||
        "No weather advice available.";


    renderHotels(
        ai.recommendedHotels ||
        []
    );


    renderRestaurants(
        ai.recommendedRestaurants ||
        []
    );


    renderPackingTips(
        ai.packingTips ||
        []
    );


    if (!trip.isAITrip) {

        document.getElementById(
            "aiLabel"
        ).textContent =
            "TRIP DETAILS";

    }

}


// =====================================================
// INTERESTS
// =====================================================

function renderInterests(
    interests
) {

    const section =
        document.getElementById(
            "interestsSection"
        );


    const container =
        document.getElementById(
            "interests"
        );


    if (
        !Array.isArray(interests) ||
        !interests.length
    ) {

        section.classList.add(
            "hidden"
        );

        return;

    }


    section.classList.remove(
        "hidden"
    );


    container.innerHTML =
        interests
            .map(
                item => `
                    <span class="chip">
                        ${escapeHtml(item)}
                    </span>
                `
            )
            .join("");

}


// =====================================================
// ITINERARY
// =====================================================

function renderItinerary(
    days
) {

    const container =
        document.getElementById(
            "itinerary"
        );


    if (
        !Array.isArray(days) ||
        !days.length
    ) {

        container.innerHTML = `

            <div class="weather-card">
                No itinerary available for this trip.
            </div>

        `;

        return;

    }


    container.innerHTML =
        days
            .map(
                (day, index) => {

                    const dayNumber =
                        day.day ||
                        index + 1;


                    const morning =
                        day.morning ||
                        getActivity(
                            day,
                            "morning"
                        );


                    const afternoon =
                        day.afternoon ||
                        getActivity(
                            day,
                            "afternoon"
                        );


                    const evening =
                        day.evening ||
                        getActivity(
                            day,
                            "evening"
                        );


                    return `

                        <article class="day-card">

                            <div class="day-header">

                                <div class="day-number">
                                    ${dayNumber}
                                </div>

                                <h3>
                                    Day ${dayNumber}
                                </h3>

                            </div>


                            <div class="day-content">


                                <div class="activity">

                                    <span class="activity-label">
                                        MORNING
                                    </span>

                                    <p>
                                        ${escapeHtml(
                                            morning ||
                                            "No activity planned."
                                        )}
                                    </p>

                                </div>


                                <div class="activity">

                                    <span class="activity-label">
                                        AFTERNOON
                                    </span>

                                    <p>
                                        ${escapeHtml(
                                            afternoon ||
                                            "No activity planned."
                                        )}
                                    </p>

                                </div>


                                <div class="activity">

                                    <span class="activity-label">
                                        EVENING
                                    </span>

                                    <p>
                                        ${escapeHtml(
                                            evening ||
                                            "No activity planned."
                                        )}
                                    </p>

                                </div>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


// =====================================================
// BUDGET
// =====================================================

function renderBudget(
    budget
) {

    const container =
        document.getElementById(
            "budgetBreakdown"
        );


    const categories = [

        ["Hotel", budget.hotel],

        ["Food", budget.food],

        ["Transport", budget.transport],

        ["Activities", budget.activities],

        ["Shopping", budget.shopping]

    ];


    const available =
        categories.filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== ""
        );


    if (!available.length) {

        container.innerHTML = `

            <div class="budget-row">
                <span>No breakdown available</span>
            </div>

        `;

        return;

    }


    container.innerHTML =
        available
            .map(
                ([name, value]) => `

                    <div class="budget-row">

                        <span>
                            ${name}
                        </span>

                        <strong>
                            ${escapeHtml(
                                formatBudgetValue(
                                    value
                                )
                            )}
                        </strong>

                    </div>

                `
            )
            .join("");

}


// =====================================================
// HOTELS
// =====================================================

function renderHotels(
    hotels
) {

    const container =
        document.getElementById(
            "hotels"
        );


    if (
        !Array.isArray(hotels) ||
        !hotels.length
    ) {

        container.innerHTML = `

            <div class="recommendation">

                <div>

                    <h3>
                        No recommendations available
                    </h3>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =
        hotels
            .map(
                hotel => `

                    <div class="recommendation">

                        <div class="recommendation-icon">
                            ⌂
                        </div>

                        <div>

                            <h3>
                                ${escapeHtml(
                                    hotel.name ||
                                    "Hotel"
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    hotel.reason ||
                                    "Recommended for your trip."
                                )}
                            </p>

                        </div>

                    </div>

                `
            )
            .join("");

}


// =====================================================
// RESTAURANTS
// =====================================================

function renderRestaurants(
    restaurants
) {

    const container =
        document.getElementById(
            "restaurants"
        );


    if (
        !Array.isArray(restaurants) ||
        !restaurants.length
    ) {

        container.innerHTML = `

            <div class="recommendation">

                <div>

                    <h3>
                        No recommendations available
                    </h3>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =
        restaurants
            .map(
                restaurant => `

                    <div class="recommendation">

                        <div class="recommendation-icon">
                            ◉
                        </div>

                        <div>

                            <h3>
                                ${escapeHtml(
                                    restaurant.name ||
                                    "Restaurant"
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    restaurant.speciality ||
                                    "Recommended dining option."
                                )}
                            </p>

                        </div>

                    </div>

                `
            )
            .join("");

}


// =====================================================
// PACKING
// =====================================================

function renderPackingTips(
    tips
) {

    const section =
        document.getElementById(
            "packingSection"
        );


    const container =
        document.getElementById(
            "packingTips"
        );


    if (
        !Array.isArray(tips) ||
        !tips.length
    ) {

        section.classList.add(
            "hidden"
        );

        return;

    }


    section.classList.remove(
        "hidden"
    );


    container.innerHTML =
        tips
            .map(
                tip => `

                    <div class="packing-item">

                        ${escapeHtml(tip)}

                    </div>

                `
            )
            .join("");

}


// =====================================================
// USER
// =====================================================

async function loadUser() {

    try {

        const response =
            await request(
                "/auth/me"
            );


        const user =
            response.data;


        if (!user) {
            return;
        }


        const name =
            user.fullName ||
            "Traveler";


        document.getElementById(
            "topUserName"
        ).textContent =
            name;


        document.getElementById(
            "topUserEmail"
        ).textContent =
            user.email ||
            "";


        document.getElementById(
            "topAvatar"
        ).textContent =
            getInitials(name);

    } catch (error) {

        console.error(
            error
        );

    }

}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {

    document.getElementById(
        "backButton"
    ).addEventListener(
        "click",
        () => {

            window.location.href =
                "my-trips.html";

        }
    );


    document.getElementById(
        "logoutButton"
    ).addEventListener(
        "click",
        async () => {

            if (
                window.TripFusionAuth &&
                typeof TripFusionAuth.logout === "function"
            ) {

                await TripFusionAuth.logout();

            }

        }
    );


    document.getElementById(
        "deleteButton"
    ).addEventListener(
        "click",
        () => {

            document.getElementById(
                "deleteModal"
            ).classList.add(
                "show"
            );

        }
    );


    document.getElementById(
        "cancelDelete"
    ).addEventListener(
        "click",
        () => {

            document.getElementById(
                "deleteModal"
            ).classList.remove(
                "show"
            );

        }
    );


    document.getElementById(
        "confirmDelete"
    ).addEventListener(
        "click",
        deleteTrip
    );


    document.getElementById(
        "pdfButton"
    ).addEventListener(
        "click",
        () => {

            showToast(
                "PDF download will be connected next."
            );

        }
    );


    const menu =
        document.getElementById(
            "menuButton"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    menu.addEventListener(
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


    document.getElementById(
        "closeSidebar"
    ).addEventListener(
        "click",
        closeSidebar
    );


    overlay.addEventListener(
        "click",
        closeSidebar
    );


    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    "[data-coming-soon]"
                );


            if (link) {

                event.preventDefault();

                showToast(
                    "This section will be available soon."
                );

            }

        }
    );


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
// DELETE
// =====================================================

async function deleteTrip() {

    if (!currentTrip?._id) {
        return;
    }


    const button =
        document.getElementById(
            "confirmDelete"
        );


    button.disabled = true;

    button.textContent =
        "Deleting...";


    try {

        await request(
            `/trips/${currentTrip._id}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Trip deleted successfully."
        );


        setTimeout(
            () => {

                window.location.href =
                    "my-trips.html";

            },
            700
        );


    } catch (error) {

        showToast(
            error.message ||
            "Unable to delete trip."
        );


        button.disabled =
            false;

        button.textContent =
            "Delete Trip";

    }

}


// =====================================================
// API REQUEST
// =====================================================

async function request(
    endpoint,
    options = {}
) {

    if (
        window.TripFusionAPI &&
        typeof TripFusionAPI.apiRequest === "function"
    ) {

        return TripFusionAPI.apiRequest(
            endpoint,
            options
        );

    }


    const token =
        localStorage.getItem(
            "accessToken"
        );


    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {})

    };


    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    const response =
        await fetch(
            `http://localhost:5000/api${endpoint}`,
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
            "Request failed."
        );

    }


    return data;

}


// =====================================================
// ERROR
// =====================================================

function showError(
    message
) {

    document
        .getElementById("loading")
        .classList.add("hidden");


    document
        .getElementById("tripContent")
        .classList.add("hidden");


    document
        .getElementById("errorState")
        .classList.remove("hidden");


    document.getElementById(
        "errorMessage"
    ).textContent =
        message;

}


// =====================================================
// HELPERS
// =====================================================

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


function formatBudgetValue(
    value
) {

    if (
        typeof value === "number"
    ) {

        return formatCurrency(
            value
        );

    }


    return String(value);

}


function formatText(
    value
) {

    return String(value || "")
        .replace(
            /-/g,
            " "
        )
        .replace(
            /\b\w/g,
            char =>
                char.toUpperCase()
        );

}


function getActivity(
    day,
    key
) {

    if (
        Array.isArray(
            day.activities
        )
    ) {

        const index = {
            morning: 0,
            afternoon: 1,
            evening: 2
        }[key];


        return day.activities[index] || "";

    }


    return "";

}


function getInitials(
    name
) {

    const parts =
        String(name)
            .trim()
            .split(/\s+/);


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


let toastTimer;


function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


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
            2500
        );

}