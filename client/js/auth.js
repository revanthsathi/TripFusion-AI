// =====================================================
// TripFusion AI - Authentication
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRegisterForm();

        setupLoginForm();

    }
);


// =====================================================
// Register
// =====================================================

function setupRegisterForm() {

    const form =
        document.getElementById(
            "registerForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const fullName =
                document.getElementById(
                    "fullName"
                );

            const email =
                document.getElementById(
                    "email"
                );

            const phone =
                document.getElementById(
                    "phone"
                );

            const password =
                document.getElementById(
                    "password"
                );

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                );

            let valid = true;


            // Full name

            let error =
                TripFusionValidation
                    .validateFullName(
                        fullName.value
                    );

            if (error) {

                TripFusionValidation
                    .showFieldError(
                        fullName,
                        error
                    );

                valid = false;

            } else {

                TripFusionValidation
                    .clearFieldError(
                        fullName
                    );

            }


            // Email

            error =
                TripFusionValidation
                    .validateEmail(
                        email.value
                    );

            if (error) {

                TripFusionValidation
                    .showFieldError(
                        email,
                        error
                    );

                valid = false;

            } else {

                TripFusionValidation
                    .clearFieldError(
                        email
                    );

            }


            // Phone

            error =
                TripFusionValidation
                    .validatePhone(
                        phone.value
                    );

            if (error) {

                TripFusionValidation
                    .showFieldError(
                        phone,
                        error
                    );

                valid = false;

            } else {

                TripFusionValidation
                    .clearFieldError(
                        phone
                    );

            }


            // Password

            error =
                TripFusionValidation
                    .validatePassword(
                        password.value
                    );

            if (error) {

                TripFusionValidation
                    .showFieldError(
                        password,
                        error
                    );

                valid = false;

            } else {

                TripFusionValidation
                    .clearFieldError(
                        password
                    );

            }


            // Confirm password

            error =
                TripFusionValidation
                    .validateConfirmPassword(
                        password.value,
                        confirmPassword.value
                    );

            if (error) {

                TripFusionValidation
                    .showFieldError(
                        confirmPassword,
                        error
                    );

                valid = false;

            } else {

                TripFusionValidation
                    .clearFieldError(
                        confirmPassword
                    );

            }


            if (!valid) {
                return;
            }


            const button =
                form.querySelector(
                    "button[type='submit']"
                );

            setButtonLoading(
                button,
                true
            );


            try {

                const response =
                    await TripFusionAPI
                        .registerUser({

                            fullName:
                                fullName.value.trim(),

                            email:
                                email.value.trim(),

                            phone:
                                phone.value.trim(),

                            password:
                                password.value

                        });


                showAuthMessage(
                    form,
                    response.message ||
                    "Registration successful.",
                    "success"
                );


                form.reset();


                setTimeout(
                    () => {

                        window.location.href =
                            "login.html";

                    },
                    1200
                );


            } catch (error) {

                showAuthMessage(
                    form,
                    error.message,
                    "error"
                );

            } finally {

                setButtonLoading(
                    button,
                    false
                );

            }

        }
    );

}


// =====================================================
// Login
// =====================================================

function setupLoginForm() {

    const form =
        document.getElementById(
            "loginForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                document.getElementById(
                    "email"
                );

            const password =
                document.getElementById(
                    "password"
                );

            let valid = true;


            let error =
                TripFusionValidation
                    .validateEmail(
                        email.value
                    );

            if (error) {

                TripFusionValidation
                    .showFieldError(
                        email,
                        error
                    );

                valid = false;

            } else {

                TripFusionValidation
                    .clearFieldError(
                        email
                    );

            }


            error =
                TripFusionValidation
                    .validatePassword(
                        password.value
                    );

            if (error) {

                TripFusionValidation
                    .showFieldError(
                        password,
                        error
                    );

                valid = false;

            } else {

                TripFusionValidation
                    .clearFieldError(
                        password
                    );

            }


            if (!valid) {
                return;
            }


            const button =
                form.querySelector(
                    "button[type='submit']"
                );

            setButtonLoading(
                button,
                true
            );


            try {

                const response =
                    await TripFusionAPI
                        .loginUser(
                            email.value.trim(),
                            password.value
                        );


                const data =
                    response.data;


                if (
                    !data ||
                    !data.accessToken
                ) {

                    throw new Error(
                        "Login response did not contain an access token."
                    );

                }


                localStorage.setItem(
                    "accessToken",
                    data.accessToken
                );

                localStorage.setItem(
                    "refreshToken",
                    data.refreshToken
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );


                showAuthMessage(
                    form,
                    response.message ||
                    "Login successful.",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    700
                );


            } catch (error) {

                showAuthMessage(
                    form,
                    error.message,
                    "error"
                );

            } finally {

                setButtonLoading(
                    button,
                    false
                );

            }

        }
    );

}


// =====================================================
// Button Loading
// =====================================================

function setButtonLoading(
    button,
    loading
) {

    if (!button) {
        return;
    }

    if (loading) {

        button.dataset.originalText =
            button.innerHTML;

        button.disabled = true;

        button.innerHTML =
            `<span class="button-spinner"></span>
             Please wait...`;

    } else {

        button.disabled = false;

        button.innerHTML =
            button.dataset.originalText ||
            "Continue";

    }

}


// =====================================================
// Authentication Message
// =====================================================

function showAuthMessage(
    form,
    message,
    type
) {

    let element =
        form.querySelector(
            ".auth-message"
        );

    if (!element) {

        element =
            document.createElement(
                "div"
            );

        element.className =
            "auth-message";

        form.prepend(
            element
        );

    }

    element.textContent =
        message;

    element.className =
        `auth-message ${type}`;

}


// =====================================================
// Logout
// =====================================================

async function logout() {

    try {

        if (
            localStorage.getItem(
                "accessToken"
            )
        ) {

            await TripFusionAPI
                .logoutUser();

        }

    } catch (error) {

        console.warn(
            "Logout API failed:",
            error.message
        );

    } finally {

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "index.html";

    }

}


// =====================================================
// Protect Page
// =====================================================

function requireAuthentication() {

    const token =
        localStorage.getItem(
            "accessToken"
        );

    if (!token) {

        window.location.href =
            "login.html";

        return false;

    }

    return true;

}


window.TripFusionAuth = {

    logout,

    requireAuthentication

};