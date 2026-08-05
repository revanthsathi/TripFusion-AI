const {

    getDashboardData

} = require("../services/dashboardService");

const {

    sendSuccess,

    sendError

} = require("../utils/apiResponse");

// =======================
// Dashboard
// =======================
const fetchDashboard = async (

    req,

    res

) => {

    try {

        const dashboard =
            await getDashboardData();

        return sendSuccess(

            res,

            200,

            "Dashboard fetched successfully.",

            dashboard

        );

    }

    catch (error) {

        console.error(error);

        return sendError(

            res,

            400,

            error.message

        );

    }

};

module.exports = {

    fetchDashboard

};