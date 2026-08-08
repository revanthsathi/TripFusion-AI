const {
    getUserDashboardData
} = require("../services/userDashboardService");

const {
    sendSuccess,
    sendError
} = require("../utils/apiResponse");


// =======================
// User Dashboard
// =======================

const fetchUserDashboard = async (
    req,
    res
) => {

    try {

        const dashboard =
            await getUserDashboardData(
                req.user._id
            );

        return sendSuccess(

            res,

            200,

            "User dashboard fetched successfully.",

            dashboard

        );

    } catch (error) {

        console.error(error);

        return sendError(

            res,

            400,

            error.message

        );

    }

};


module.exports = {

    fetchUserDashboard

};