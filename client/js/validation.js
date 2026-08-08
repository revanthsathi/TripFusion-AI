// =====================================================
// TripFusion AI - Form Validation
// =====================================================

function showFieldError(
    input,
    message
) {

    clearFieldError(input);

    input.classList.add(
        "input-error"
    );

    const error =
        document.createElement(
            "small"
        );

    error.className =
        "field-error";

    error.textContent =
        message;

    input.parentElement.appendChild(
        error
    );
}


function clearFieldError(input) {

    input.classList.remove(
        "input-error"
    );

    const existing =
        input.parentElement.querySelector(
            ".field-error"
        );

    if (existing) {

        existing.remove();

    }

}


function validateFullName(
    value
) {

    const name =
        value.trim();

    if (!name) {

        return "Full name is required.";

    }

    if (name.length < 3) {

        return "Full name must be at least 3 characters.";

    }

    return "";

}


function validateEmail(
    value
) {

    const email =
        value.trim();

    if (!email) {

        return "Email is required.";

    }

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(email)) {

        return "Please enter a valid email address.";

    }

    return "";

}


function validatePhone(
    value
) {

    const phone =
        value.trim();

    if (!phone) {

        return "Phone number is required.";

    }

    return "";

}


function validatePassword(
    value
) {

    if (!value) {

        return "Password is required.";

    }

    if (value.length < 8) {

        return "Password must be at least 8 characters.";

    }

    return "";

}


function validateConfirmPassword(
    password,
    confirmPassword
) {

    if (!confirmPassword) {

        return "Please confirm your password.";

    }

    if (
        password !==
        confirmPassword
    ) {

        return "Passwords do not match.";

    }

    return "";

}


window.TripFusionValidation = {

    showFieldError,

    clearFieldError,

    validateFullName,

    validateEmail,

    validatePhone,

    validatePassword,

    validateConfirmPassword

};