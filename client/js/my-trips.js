// =====================================================
// TRIPFUSION AI — MY TRIPS
// =====================================================

let allTrips = [];

let currentFilter = "all";

let selectedTripId = null;

let toastTimer;


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTrips();

    }
);


async function initializeTrips() {

    if (
        !TripFusionAuth.requireAuthentication()
    ) {

        return;

    }


    setupSidebar();

    setupFilters();

    setupSearch();

    setupActions();

    await loadTrips();

}


// =====================================================
// LOAD TRIPS
// =====================================================

async function loadTrips() {

    try {

        const response =
            await TripFusionAPI.apiRequest(
                "/trips",
                {
                    method: "GET"
                }
            );


        allTrips =
            Array.isArray(response.data)
                ? response.data
                : [];


        await loadUser();

        updateCounts();

        renderTrips();


    } catch (error) {

        console.error(
            "Trips error:",
            error
        );


        document.getElementById(
            "tripsContainer"
        ).innerHTML = "";


        showToast(
            error.message ||
            "Unable to load trips.",
            "error"
        );

    }

}


// =====================================================
// LOAD USER
// =====================================================

async function loadUser() {

    try {

        const response =
            await TripFusionAPI.apiRequest(
                "/auth/me",
                {
                    method: "GET"
                }
            );


        const user =
            response.data;


        if (!user) {
            return;
        }


        const name =
            user.fullName ||
            "Traveler";


        const email =
            user.email ||
            "";


        document.getElementById(
            "topUserName"
        ).textContent = name;


        document.getElementById(
            "topUserEmail"
        ).textContent = email;


        document.getElementById(
            "topAvatar"
        ).textContent =
            getInitials(name);


    } catch (error) {

        console.error(
            "User loading error:",
            error
        );

    }

}


// =====================================================
// FILTERS
// =====================================================

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-tab"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        (item) =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    renderTrips();

                }
            );

        }
    );

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    searchInput.addEventListener(
        "input",
        () => {

            renderTrips();

        }
    );

}


// =====================================================
// FILTER + SEARCH
// =====================================================

function getFilteredTrips() {

    const search =
        document.getElementById(
            "searchInput"
        )
            .value
            .trim()
            .toLowerCase();


    return allTrips.filter(
        (trip) => {

            const statusMatch =
                currentFilter === "all" ||
                trip.status === currentFilter;


            if (!statusMatch) {
                return false;
            }


            if (!search) {
                return true;
            }


            const destination =
                trip.destination?.name ||
                "";


            const country =
                trip.destination?.country ||
                "";


            const title =
                trip.title ||
                "";


            return (

                title
                    .toLowerCase()
                    .includes(search)

                ||

                destination
                    .toLowerCase()
                    .includes(search)

                ||

                country
                    .toLowerCase()
                    .includes(search)

            );

        }
    );

}


// =====================================================
// RENDER TRIPS
// =====================================================

function renderTrips() {

    const container =
        document.getElementById(
            "tripsContainer"
        );


    const noResults =
        document.getElementById(
            "noResults"
        );


    const trips =
        getFilteredTrips();


    if (!trips.length) {

        container.innerHTML = "";

        noResults.classList.remove(
            "hidden"
        );

        return;

    }


    noResults.classList.add(
        "hidden"
    );


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


    const destinationName =
        destination?.name ||
        "Unknown destination";


    const country =
        destination?.country ||
        "";


    const state =
        destination?.state ||
        "";


    const location =
        [destinationName, state || country]
            .filter(Boolean)
            .join(", ");


    const status =
        trip.status ||
        "planning";


    const title =
        trip.title ||
        destinationName;


    const tripType =
        formatStatus(
            trip.tripType ||
            "solo"
        );


    const budget =
        formatCurrency(
            trip.estimatedBudget || 0
        );


    return `

        <article class="trip-card">

            <div class="trip-visual">

                <div class="trip-visual-content">

                    <span class="trip-status">

                        ${escapeHtml(
                            formatStatus(
                                status
                            ).toUpperCase()
                        )}

                    </span>


                    <h2>
                        ${escapeHtml(
                            destinationName
                        )}
                    </h2>


                    <p>
                        ${escapeHtml(
                            location
                        )}
                    </p>

                </div>

            </div>


            <div class="trip-card-body">

                <div class="trip-title-row">

                    <h3>
                        ${escapeHtml(title)}
                    </h3>

                    ${
                        trip.isAITrip
                            ? `
                                <span class="ai-badge">
                                    ✦ AI TRIP
                                </span>
                              `
                            : ""
                    }

                </div>


                <div class="trip-info-grid">


                    <div class="info-item">

                        <span>
                            Dates
                        </span>

                        <strong>
                            ${escapeHtml(
                                formatDate(
                                    trip.startDate
                                )
                            )}

                            –

                            ${escapeHtml(
                                formatDate(
                                    trip.endDate
                                )
                            )}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            Duration
                        </span>

                        <strong>
                            ${trip.totalDays || 0}
                            day${trip.totalDays === 1 ? "" : "s"}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            Travelers
                        </span>

                        <strong>
                            ${trip.travelers || 1}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            Budget
                        </span>

                        <strong>
                            ${escapeHtml(
                                budget
                            )}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            Trip Type
                        </span>

                        <strong>
                            ${escapeHtml(
                                tripType
                            )}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            Budget Level
                        </span>

                        <strong>
                            ${escapeHtml(
                                formatStatus(
                                    trip.budgetLevel ||
                                    "medium"
                                )
                            )}
                        </strong>

                    </div>

                </div>


                <div class="trip-card-footer">

                    <button
                        class="view-button"
                        type="button"
                        data-view-trip="${trip._id}"
                    >
                        View trip details →
                    </button>


                    <button
                        class="delete-button-small"
                        type="button"
                        title="Delete trip"
                        data-delete-trip="${trip._id}"
                    >
                        ×
                    </button>

                </div>

            </div>

        </article>

    `;

}


// =====================================================
// COUNTS
// =====================================================

function updateCounts() {

    setText(
        "countAll",
        allTrips.length
    );


    setText(
        "countPlanning",
        countStatus("planning")
    );


    setText(
        "countOngoing",
        countStatus("ongoing")
    );


    setText(
        "countCompleted",
        countStatus("completed")
    );


    setText(
        "countCancelled",
        countStatus("cancelled")
    );

}


function countStatus(
    status
) {

    return allTrips.filter(
        (trip) =>
            trip.status === status
    ).length;

}


// =====================================================
// ACTIONS
// =====================================================

function setupActions() {

    const createButton =
        document.getElementById(
            "createTripButton"
        );


    if (createButton) {

        createButton.addEventListener(
            "click",
            () => {

                showToast(
                    "AI Trip Planner is coming next.",
                    "success"
                );

            }
        );

    }


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                await TripFusionAuth.logout();

            }
        );

    }


    document.addEventListener(
        "click",
        (event) => {

            const viewButton =
                event.target.closest(
                    "[data-view-trip]"
                );


            if (viewButton) {

                window.location.href =`trip-details.html?id=${viewButton.dataset.viewTrip}`;

                return;

            }


            const deleteButton =
                event.target.closest(
                    "[data-delete-trip]"
                );


            if (deleteButton) {

                openDeleteModal(
                    deleteButton.dataset.deleteTrip
                );

            }


            const comingSoon =
                event.target.closest(
                    "[data-coming-soon]"
                );


            if (comingSoon) {

                event.preventDefault();

                showToast(
                    "This section will be available soon.",
                    "success"
                );

            }

        }
    );


    document.getElementById(
        "closeModal"
    ).addEventListener(
        "click",
        closeTripModal
    );


    document.getElementById(
        "tripModal"
    ).addEventListener(
        "click",
        (event) => {

            if (
                event.target.id ===
                "tripModal"
            ) {

                closeTripModal();

            }

        }
    );


    document.getElementById(
        "cancelDelete"
    ).addEventListener(
        "click",
        closeDeleteModal
    );


    document.getElementById(
        "confirmDelete"
    ).addEventListener(
        "click",
        deleteSelectedTrip
    );

}


// =====================================================
// VIEW TRIP DETAILS
// =====================================================

async function openTripDetails(
    tripId
) {

    const modal =
        document.getElementById(
            "tripModal"
        );


    const content =
        document.getElementById(
            "modalContent"
        );


    modal.classList.add(
        "show"
    );


    content.innerHTML = `

        <div class="empty-state">

            <div class="loading-card"
                 style="
                    width:100%;
                    height:180px;
                 ">
            </div>

        </div>

    `;


    try {

        const response =
            await TripFusionAPI.apiRequest(
                `/trips/${tripId}`,
                {
                    method: "GET"
                }
            );


        const trip =
            response.data;


        if (!trip) {

            throw new Error(
                "Trip not found."
            );

        }


        renderTripModal(
            trip
        );


    } catch (error) {

        content.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    !
                </div>

                <h2>
                    Unable to load trip
                </h2>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// =====================================================
// TRIP MODAL CONTENT
// =====================================================

function renderTripModal(
    trip
) {

    const destination =
        trip.destination;


    const destinationName =
        destination?.name ||
        "Unknown destination";


    const location =
        [
            destination?.state,
            destination?.country
        ]
            .filter(Boolean)
            .join(", ");


    const interests =
        Array.isArray(
            trip.interests
        )
            ? trip.interests
            : [];


    document.getElementById(
        "modalContent"
    ).innerHTML = `

        <div class="modal-header">

            <p class="eyebrow">
                ${trip.isAITrip ? "AI PLANNED TRIP" : "TRIP DETAILS"}
            </p>

            <h2>
                ${escapeHtml(
                    trip.title ||
                    destinationName
                )}
            </h2>

            <p>
                ${escapeHtml(
                    destinationName
                )}

                ${
                    location
                        ? ` · ${escapeHtml(location)}`
                        : ""
                }
            </p>

        </div>


        <div class="modal-section">

            <h3>
                Trip overview
            </h3>


            <div class="modal-details">

                <div class="modal-detail">

                    <span>
                        Start date
                    </span>

                    <strong>
                        ${escapeHtml(
                            formatDate(
                                trip.startDate
                            )
                        )}
                    </strong>

                </div>


                <div class="modal-detail">

                    <span>
                        End date
                    </span>

                    <strong>
                        ${escapeHtml(
                            formatDate(
                                trip.endDate
                            )
                        )}
                    </strong>

                </div>


                <div class="modal-detail">

                    <span>
                        Duration
                    </span>

                    <strong>
                        ${trip.totalDays || 0} days
                    </strong>

                </div>


                <div class="modal-detail">

                    <span>
                        Travelers
                    </span>

                    <strong>
                        ${trip.travelers || 1}
                    </strong>

                </div>


                <div class="modal-detail">

                    <span>
                        Trip type
                    </span>

                    <strong>
                        ${escapeHtml(
                            formatStatus(
                                trip.tripType ||
                                "solo"
                            )
                        )}
                    </strong>

                </div>


                <div class="modal-detail">

                    <span>
                        Budget
                    </span>

                    <strong>
                        ${escapeHtml(
                            formatCurrency(
                                trip.estimatedBudget ||
                                0
                            )
                        )}
                    </strong>

                </div>

            </div>

        </div>


        ${
            interests.length
                ? `

                    <div class="modal-section">

                        <h3>
                            Interests
                        </h3>

                        <div class="interests">

                            ${interests
                                .map(
                                    (interest) => `
                                        <span class="interest">
                                            ${escapeHtml(
                                                interest
                                            )}
                                        </span>
                                    `
                                )
                                .join("")
                            }

                        </div>

                    </div>

                  `
                : ""
        }


        ${
            trip.notes
                ? `

                    <div class="modal-section">

                        <h3>
                            Notes
                        </h3>

                        <p class="notes">
                            ${escapeHtml(
                                trip.notes
                            )}
                        </p>

                    </div>

                  `
                : ""
        }


        <div class="modal-section">

            <h3>
                Status
            </h3>

            <span class="status-pill ${getStatusClass(trip.status)}">

                ${escapeHtml(
                    formatStatus(
                        trip.status ||
                        "planning"
                    )
                )}

            </span>

        </div>

    `;

}


// =====================================================
// DELETE
// =====================================================

function openDeleteModal(
    tripId
) {

    selectedTripId =
        tripId;


    document.getElementById(
        "deleteModal"
    ).classList.add(
        "show"
    );

}


function closeDeleteModal() {

    selectedTripId = null;

    document.getElementById(
        "deleteModal"
    ).classList.remove(
        "show"
    );

}


async function deleteSelectedTrip() {

    if (!selectedTripId) {
        return;
    }


    const button =
        document.getElementById(
            "confirmDelete"
        );


    button.disabled =
        true;


    button.textContent =
        "Deleting...";


    try {

        await TripFusionAPI.apiRequest(
            `/trips/${selectedTripId}`,
            {
                method: "DELETE"
            }
        );


        allTrips =
            allTrips.filter(
                (trip) =>
                    trip._id !==
                    selectedTripId
            );


        updateCounts();

        renderTrips();

        closeDeleteModal();


        showToast(
            "Trip deleted successfully.",
            "success"
        );


    } catch (error) {

        showToast(
            error.message ||
            "Unable to delete trip.",
            "error"
        );

    } finally {

        button.disabled =
            false;

        button.textContent =
            "Delete Trip";

    }

}


// =====================================================
// MODAL CLOSE
// =====================================================

function closeTripModal() {

    document.getElementById(
        "tripModal"
    ).classList.remove(
        "show"
    );

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


    closeButton.addEventListener(
        "click",
        closeSidebar
    );


    overlay.addEventListener(
        "click",
        closeSidebar
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
// TOAST
// =====================================================

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const icon =
        document.getElementById(
            "toastIcon"
        );


    const messageElement =
        document.getElementById(
            "toastMessage"
        );


    messageElement.textContent =
        message;


    icon.textContent =
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
// HELPERS
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


    return String(value)
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


function getStatusClass(
    status
) {

    if (
        [
            "planning",
            "ongoing",
            "completed",
            "cancelled"
        ].includes(status)
    ) {

        return status;

    }


    return "planning";

}


function getInitials(
    name
) {

    const parts =
        String(name)
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


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

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