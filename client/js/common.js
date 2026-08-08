// =====================================================
// TripFusion AI - Common JavaScript
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const menuButton =
            document.getElementById(
                "mobileMenuBtn"
            );

        const mobileMenu =
            document.getElementById(
                "mobileMenu"
            );

        if (
            menuButton &&
            mobileMenu
        ) {

            menuButton.addEventListener(
                "click",
                () => {

                    mobileMenu.classList.toggle(
                        "active"
                    );

                }
            );

        }


        // Close mobile menu after clicking a link

        const mobileLinks =
            document.querySelectorAll(
                ".mobile-menu a"
            );

        mobileLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu?.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );


        // Navbar shadow while scrolling

        const navbar =
            document.querySelector(
                ".navbar"
            );

        window.addEventListener(
            "scroll",
            () => {

                if (!navbar) {
                    return;
                }

                if (
                    window.scrollY > 10
                ) {

                    navbar.style.boxShadow =
                        "0 8px 30px rgba(17, 24, 39, 0.06)";

                } else {

                    navbar.style.boxShadow =
                        "none";

                }

            }
        );

    }
);