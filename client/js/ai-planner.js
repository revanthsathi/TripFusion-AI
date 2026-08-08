// =====================================================
// TripFusion AI - AI Trip Planner
// =====================================================

let destinations = [];


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializePlanner
);


async function initializePlanner() {

    setupNavigation();

    setupForm();

    setMinimumDates();

    await loadUser();

    await loadDestinations();

}


// =====================================================
// LOAD DESTINATIONS
// =====================================================

async function loadDestinations() {

    const select =
        document.getElementById(
            "destinationId"
        );


    try {

        const response =
            await apiRequest(
                "/destinations"
            );


        destinations =
            Array.isArray(response.data)
                ? response.data
                : response.data?.destinations || [];


        if (!destinations.length) {

            select.innerHTML = `

                <option value="">
                    No destinations available
                </option>

            `;

            return;

        }


        select.innerHTML = `

            <option value="">
                Select a destination
            </option>

        `;


        destinations.forEach(
            destination => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    destination._id;


                option.textContent =
                    getDestinationLabel(
                        destination
                    );


                select.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Destination loading error:",
            error
        );


        select.innerHTML = `

            <option value="">
                Unable to load destinations
            </option>

        `;


        showToast(
            "Unable to load destinations."
        );

    }

}


// =====================================================
// DESTINATION LABEL
// =====================================================

function getDestinationLabel(
    destination
) {

    const parts = [
        destination.name,
        destination.state,
        destination.country
    ]
        .filter(Boolean);


    return parts.join(
        ", "
    );

}


// =====================================================
// FORM
// =====================================================

function setupForm() {

    const form =
        document.getElementById(
            "plannerForm"
        );


    form.addEventListener(
        "submit",
        handleSubmit
    );


    document
        .getElementById("startDate")
        .addEventListener(
            "change",
            updateSummary
        );


    document
        .getElementById("endDate")
        .addEventListener(
            "change",
            updateSummary
        );


    document
        .getElementById("title")
        .addEventListener(
            "input",
            updateSummary
        );


    document
        .getElementById("travelers")
        .addEventListener(
            "input",
            updateSummary
        );


    document
        .getElementById("minusTravelers")
        .addEventListener(
            "click",
            () => changeTravelers(-1)
        );


    document
        .getElementById("plusTravelers")
        .addEventListener(
            "click",
            () => changeTravelers(1)
        );


    document
        .getElementById("startDate")
        .addEventListener(
            "change",
            validateDates
        );


    document
        .getElementById("endDate")
        .addEventListener(
            "change",
            validateDates
        );

}


// =====================================================
// DATE LIMITS
// =====================================================

function setMinimumDates() {

    const today =
        new Date();


    const localDate =
        new Date(
            today.getTime() -
            today.getTimezoneOffset() *
            60000
        )
            .toISOString()
            .split("T")[0];


    const start =
        document.getElementById(
            "startDate"
        );


    const end =
        document.getElementById(
            "endDate"
        );


    start.min =
        localDate;


    end.min =
        localDate;

}


// =====================================================
// DATE VALIDATION
// =====================================================

function validateDates() {

    const startValue =
        document.getElementById(
            "startDate"
        ).value;


    const endValue =
        document.getElementById(
            "endDate"
        ).value;


    const error =
        document.getElementById(
            "dateError"
        );


    error.textContent = "";


    if (!startValue || !endValue) {

        updateSummary();

        return false;

    }


    const start =
        new Date(
            `${startValue}T00:00:00`
        );


    const end =
        new Date(
            `${endValue}T00:00:00`
        );


    if (end < start) {

        error.textContent =
            "End date must be after the start date.";

        updateSummary();

        return false;

    }


    updateSummary();

    return true;

}


// =====================================================
// CALCULATE DAYS
// =====================================================

function calculateDays() {

    const startValue =
        document.getElementById(
            "startDate"
        ).value;


    const endValue =
        document.getElementById(
            "endDate"
        ).value;


    if (!startValue || !endValue) {
        return 0;
    }


    const start =
        new Date(
            `${startValue}T00:00:00`
        );


    const end =
        new Date(
            `${endValue}T00:00:00`
        );


    const difference =
        end - start;


    if (difference < 0) {
        return 0;
    }


    return Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    ) + 1;

}


// =====================================================
// SUMMARY
// =====================================================

function updateSummary() {

    const title =
        document.getElementById(
            "title"
        ).value.trim();


    const days =
        calculateDays();


    document.getElementById(
        "summaryDays"
    ).textContent =
        days;


    document.getElementById(
        "summaryTitle"
    ).textContent =
        title ||
        "Your personalized journey";


    if (days > 0) {

        document.getElementById(
            "summaryText"
        ).textContent =
            `A ${days}-day journey designed around your preferences.`;

    } else {

        document.getElementById(
            "summaryText"
        ).textContent =
            "Choose your destination and dates to get started.";

    }

}


// =====================================================
// TRAVELERS
// =====================================================

function changeTravelers(
    amount
) {

    const input =
        document.getElementById(
            "travelers"
        );


    let value =
        Number(input.value) || 1;


    value += amount;


    value =
        Math.max(
            1,
            Math.min(
                20,
                value
            )
        );


    input.value =
        value;


    updateSummary();

}


// =====================================================
// SUBMIT
// =====================================================

async function handleSubmit(
    event
) {

    event.preventDefault();


    clearErrors();


    if (!validateForm()) {
        return;
    }


    const destinationId =
        document.getElementById(
            "destinationId"
        ).value;


    const title =
        document.getElementById(
            "title"
        ).value.trim();


    const startDate =
        document.getElementById(
            "startDate"
        ).value;


    const endDate =
        document.getElementById(
            "endDate"
        ).value;


    const totalDays =
        calculateDays();


    const travelers =
        Number(
            document.getElementById(
                "travelers"
            ).value
        );


    const tripType =
        document.getElementById(
            "tripType"
        ).value;


    const budgetLevel =
        document.getElementById(
            "budgetLevel"
        ).value;


    const estimatedBudget =
        Number(
            document.getElementById(
                "estimatedBudget"
            ).value
        );


    const interests =
        Array.from(
            document.querySelectorAll(
                "#interestGrid input:checked"
            )
        )
            .map(
                checkbox =>
                    checkbox.value
            );


    const tripData = {

        destinationId,

        title,

        startDate,

        endDate,

        totalDays,

        travelers,

        tripType,

        budgetLevel,

        estimatedBudget,

        interests

    };


    setGeneratingState(
        true
    );


    try {

        const response =
            await apiRequest(
                "/trips/generate",
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            tripData
                        )
                }
            );


        const trip =
            response.data;


        if (!trip?._id) {

            throw new Error(
                "Trip was created but no trip ID was returned."
            );

        }


        showGenerationOverlay();


        startGenerationAnimation();


        setTimeout(
            () => {

                window.location.href =
                    `trip-details.html?id=${trip._id}`;

            },
            1800
        );


    } catch (error) {

        console.error(
            "AI trip generation error:",
            error
        );


        setGeneratingState(
            false
        );


        hideGenerationOverlay();


        showFormError(
            error.message ||
            "Unable to generate your trip."
        );

    }

}


// =====================================================
// VALIDATION
// =====================================================

function validateForm() {

    let valid = true;


    const destination =
        document.getElementById(
            "destinationId"
        ).value;


    const title =
        document.getElementById(
            "title"
        ).value.trim();


    const startDate =
        document.getElementById(
            "startDate"
        ).value;


    const endDate =
        document.getElementById(
            "endDate"
        ).value;


    const budget =
        Number(
            document.getElementById(
                "estimatedBudget"
            ).value
        );


    if (!destination) {

        document.getElementById(
            "destinationError"
        ).textContent =
            "Please select a destination.";

        valid = false;

    }


    if (!title) {

        document.getElementById(
            "titleError"
        ).textContent =
            "Please enter a trip title.";

        valid = false;

    }


    if (!startDate || !endDate) {

        document.getElementById(
            "dateError"
        ).textContent =
            "Please select both travel dates.";

        valid = false;

    } else if (!validateDates()) {

        valid = false;

    }


    if (!budget || budget <= 0) {

        showFormError(
            "Please enter a valid estimated budget."
        );

        valid = false;

    }


    return valid;

}


// =====================================================
// GENERATING STATE
// =====================================================

function setGeneratingState(
    loading
) {

    const button =
        document.getElementById(
            "generateButton"
        );


    button.disabled =
        loading;


    button.classList.toggle(
        "loading",
        loading
    );

}


function showGenerationOverlay() {

    document
        .getElementById(
            "generationOverlay"
        )
        .classList.add(
            "show"
        );

}


function hideGenerationOverlay() {

    document
        .getElementById(
            "generationOverlay"
        )
        .classList.remove(
            "show"
        );

}


// =====================================================
// GENERATION ANIMATION
// =====================================================

function startGenerationAnimation() {

    const steps =
        document.querySelectorAll(
            ".generation-step"
        );


    let current =
        0;


    steps.forEach(
        (step, index) => {

            step.classList.toggle(
                "active",
                index === 0
            );

        }
    );


    const interval =
        setInterval(
            () => {

                if (
                    current >=
                    steps.length - 1
                ) {

                    clearInterval(
                        interval
                    );

                    return;

                }


                steps[current]
                    .classList.remove(
                        "active"
                    );


                steps[current]
                    .querySelector(
                        "span"
                    )
                    .textContent =
                    "✓";


                current++;


                steps[current]
                    .classList.add(
                        "active"
                    );


                steps[current]
                    .querySelector(
                        "span"
                    )
                    .textContent =
                    "●";

            },
            650
        );

}


// =====================================================
// USER
// =====================================================

async function loadUser() {

    try {

        const response =
            await apiRequest(
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
            getInitials(
                name
            );

    } catch (error) {

        console.error(
            "User loading error:",
            error
        );

    }

}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {

    document
        .getElementById(
            "logoutButton"
        )
        .addEventListener(
            "click",
            async () => {

                if (
                    window.TripFusionAuth &&
                    typeof TripFusionAuth.logout ===
                    "function"
                ) {

                    await TripFusionAuth.logout();

                }

            }
        );


    document
        .querySelectorAll(
            ".coming-soon"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        showToast(
                            "This section will be available soon."
                        );

                    }
                );

            }
        );


    const menu =
        document.getElementById(
            "menuButton"
        );


    if (menu) {

        menu.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "sidebar"
                    )
                    .classList.toggle(
                        "open"
                    );

            }
        );

    }

}


// =====================================================
// ERRORS
// =====================================================

function clearErrors() {

    document.getElementById(
        "destinationError"
    ).textContent = "";


    document.getElementById(
        "titleError"
    ).textContent = "";


    document.getElementById(
        "dateError"
    ).textContent = "";


    document
        .getElementById(
            "formError"
        )
        .classList.remove(
            "show"
        );

}


function showFormError(
    message
) {

    const error =
        document.getElementById(
            "formError"
        );


    error.textContent =
        message;


    error.classList.add(
        "show"
    );


    error.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =====================================================
// HELPERS
// =====================================================

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