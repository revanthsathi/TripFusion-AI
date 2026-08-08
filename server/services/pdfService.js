const PDFDocument = require("pdfkit");

// =====================================================
// COLORS
// =====================================================

const COLORS = {
    primary: "#4F46E5",
    primaryDark: "#3730A3",
    purple: "#7C3AED",
    lightPurple: "#EEF2FF",

    dark: "#111827",
    text: "#374151",
    gray: "#6B7280",

    light: "#F8FAFC",
    card: "#F3F4F6",
    border: "#E5E7EB",

    white: "#FFFFFF",

    green: "#059669",
    greenLight: "#ECFDF5",

    orange: "#EA580C",
    orangeLight: "#FFF7ED",

    blue: "#2563EB",
    blueLight: "#EFF6FF"
};

// =====================================================
// CONSTANTS
// =====================================================

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const MARGIN = 42;

const CONTENT_WIDTH =
    PAGE_WIDTH - MARGIN * 2;

// =====================================================
// HELPERS
// =====================================================

const safeText = (value) => {

    if (
        value === undefined ||
        value === null
    ) {
        return "";

    }

    return String(value);

};

// =====================================================
// DATE FORMAT
// =====================================================

const formatDate = (date) => {

    if (!date) {
        return "N/A";
    }

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

};

// =====================================================
// CURRENCY
// =====================================================

const formatCurrency = (amount) => {

    if (
        amount === undefined ||
        amount === null
    ) {
        return "₹0";
    }

    return `₹${Number(amount).toLocaleString(
        "en-IN"
    )}`;

};

// =====================================================
// PARSE AI RESPONSE
// =====================================================

const parseAIResponse = (
    aiResponse
) => {

    if (!aiResponse) {

        return {};

    }

    if (
        typeof aiResponse ===
        "object"
    ) {

        return aiResponse;

    }

    try {

        return JSON.parse(
            aiResponse
        );

    } catch (error) {

        return {
            rawText:
                String(aiResponse)
        };

    }

};

// =====================================================
// CHECK PAGE SPACE
// =====================================================

const ensureSpace = (
    doc,
    requiredHeight
) => {

    const bottom =
        PAGE_HEIGHT - 55;

    if (
        doc.y + requiredHeight >
        bottom
    ) {

        doc.addPage();

        return true;

    }

    return false;

};

// =====================================================
// MAIN HEADER
// =====================================================

const drawMainHeader = (
    doc,
    destination
) => {

    // Purple header
    doc
        .rect(
            0,
            0,
            PAGE_WIDTH,
            118
        )
        .fill(
            COLORS.primaryDark
        );

    // Decorative purple block
    doc
        .rect(
            390,
            0,
            205,
            118
        )
        .fill(
            COLORS.primary
        );

    // Brand
    doc
        .fillColor(
            COLORS.white
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(24)
        .text(
            "✈ TripFusion AI",
            MARGIN,
            27
        );

    doc
        .font(
            "Helvetica"
        )
        .fontSize(9)
        .text(
            "Smart Travel Planning Platform",
            MARGIN,
            58
        );

    // Title
    doc
        .font(
            "Helvetica-Bold"
        )
        .fontSize(19)
        .text(
            "AI TRAVEL ITINERARY",
            MARGIN,
            77
        );

    // Destination card
    doc
        .roundedRect(
            430,
            31,
            120,
            58,
            8
        )
        .fill(
            COLORS.white
        );

    doc
        .fillColor(
            COLORS.gray
        )
        .fontSize(7)
        .font(
            "Helvetica-Bold"
        )
        .text(
            "DESTINATION",
            443,
            43
        );

    doc
        .fillColor(
            COLORS.primaryDark
        )
        .fontSize(12)
        .font(
            "Helvetica-Bold"
        )
        .text(
            safeText(
                destination
            ),
            443,
            59,
            {
                width: 95
            }
        );

};

// =====================================================
// PAGE HEADER FOR ADDITIONAL PAGES
// =====================================================

const drawSmallHeader = (
    doc
) => {

    doc
        .rect(
            0,
            0,
            PAGE_WIDTH,
            55
        )
        .fill(
            COLORS.primaryDark
        );

    doc
        .fillColor(
            COLORS.white
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(16)
        .text(
            "✈ TripFusion AI",
            MARGIN,
            19
        );

    doc
        .font(
            "Helvetica"
        )
        .fontSize(8)
        .text(
            "AI Travel Itinerary",
            430,
            22,
            {
                width: 120,
                align: "right"
            }
        );

    doc.y = 78;

};

// =====================================================
// FOOTER
// =====================================================

const drawFooter = (
    doc,
    pageNumber,
    totalPages
) => {

    const y =
        PAGE_HEIGHT - 30;

    doc
        .moveTo(
            MARGIN,
            y - 8
        )
        .lineTo(
            PAGE_WIDTH - MARGIN,
            y - 8
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .fillColor(
            COLORS.gray
        )
        .font(
            "Helvetica"
        )
        .fontSize(7.5)
        .text(
            "TripFusion AI • Smart Travel Planning",
            MARGIN,
            y
        );

    doc
        .text(
            `Page ${pageNumber} of ${totalPages}`,
            440,
            y,
            {
                width: 113,
                align: "right"
            }
        );

};

// =====================================================
// SECTION TITLE
// =====================================================

const sectionTitle = (
    doc,
    title
) => {

    doc
        .fillColor(
            COLORS.primaryDark
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(13)
        .text(
            title,
            MARGIN,
            doc.y
        );

    doc
        .moveTo(
            MARGIN,
            doc.y + 6
        )
        .lineTo(
            PAGE_WIDTH - MARGIN,
            doc.y + 6
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc.y += 18;

};

// =====================================================
// INFO CARD
// =====================================================

const drawInfoCard = (
    doc,
    x,
    y,
    width,
    height,
    label,
    value
) => {

    doc
        .roundedRect(
            x,
            y,
            width,
            height,
            7
        )
        .fill(
            COLORS.card
        );

    doc
        .fillColor(
            COLORS.gray
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(7)
        .text(
            label.toUpperCase(),
            x + 10,
            y + 10,
            {
                width:
                    width - 20
            }
        );

    doc
        .fillColor(
            COLORS.dark
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(10)
        .text(
            safeText(value),
            x + 10,
            y + 27,
            {
                width:
                    width - 20
            }
        );

};

// =====================================================
// TWO COLUMN CARD
// =====================================================

const drawTwoColumnCard = (
    doc,
    x,
    y,
    width,
    height,
    title,
    content,
    icon
) => {

    doc
        .roundedRect(
            x,
            y,
            width,
            height,
            8
        )
        .fill(
            COLORS.white
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .fillColor(
            COLORS.primary
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(11)
        .text(
            `${icon}  ${title}`,
            x + 14,
            y + 14,
            {
                width:
                    width - 28
            }
        );

    doc
        .fillColor(
            COLORS.text
        )
        .font(
            "Helvetica"
        )
        .fontSize(8.5)
        .text(
            safeText(content),
            x + 14,
            y + 38,
            {
                width:
                    width - 28,
                lineGap: 3
            }
        );

};

// =====================================================
// DAY CARD
// =====================================================

const drawDayCard = (
    doc,
    day
) => {

    const x =
        MARGIN;

    const y =
        doc.y;

    const width =
        CONTENT_WIDTH;

    const height =
        154;

    // Outer card
    doc
        .roundedRect(
            x,
            y,
            width,
            height,
            8
        )
        .fill(
            COLORS.white
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    // Day block
    doc
        .roundedRect(
            x + 8,
            y + 8,
            54,
            height - 16,
            7
        )
        .fill(
            COLORS.primary
        );

    doc
        .fillColor(
            COLORS.white
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(9)
        .text(
            "DAY",
            x + 8,
            y + 25,
            {
                width: 54,
                align: "center"
            }
        );

    doc
        .fontSize(24)
        .text(
            safeText(
                day.day
            ),
            x + 8,
            y + 43,
            {
                width: 54,
                align: "center"
            }
        );

    // Column positions
    const contentX =
        x + 75;

    const colWidth =
        130;

    const colGap =
        10;

    const secondX =
        contentX +
        colWidth +
        colGap;

    const thirdX =
        secondX +
        colWidth +
        colGap;

    const detailsX =
        thirdX +
        colWidth +
        colGap;

    // Vertical dividers
    doc
        .moveTo(
            contentX - 8,
            y + 15
        )
        .lineTo(
            contentX - 8,
            y + height - 15
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .moveTo(
            secondX - 5,
            y + 15
        )
        .lineTo(
            secondX - 5,
            y + height - 15
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .moveTo(
            thirdX - 5,
            y + 15
        )
        .lineTo(
            thirdX - 5,
            y + height - 15
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .moveTo(
            detailsX - 5,
            y + 15
        )
        .lineTo(
            detailsX - 5,
            y + height - 15
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    // Morning
    doc
        .fillColor(
            COLORS.orange
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(8)
        .text(
            "☀ MORNING",
            contentX,
            y + 18
        );

    doc
        .fillColor(
            COLORS.text
        )
        .font(
            "Helvetica"
        )
        .fontSize(7.8)
        .text(
            safeText(
                day.morning
            ),
            contentX,
            y + 37,
            {
                width: colWidth,
                height: 85,
                lineGap: 3
            }
        );

    // Afternoon
    doc
        .fillColor(
            COLORS.primary
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(8)
        .text(
            "☀ AFTERNOON",
            secondX,
            y + 18
        );

    doc
        .fillColor(
            COLORS.text
        )
        .font(
            "Helvetica"
        )
        .fontSize(7.8)
        .text(
            safeText(
                day.afternoon
            ),
            secondX,
            y + 37,
            {
                width: colWidth,
                height: 85,
                lineGap: 3
            }
        );

    // Evening
    doc
        .fillColor(
            COLORS.purple
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(8)
        .text(
            "☾ EVENING",
            thirdX,
            y + 18
        );

    doc
        .fillColor(
            COLORS.text
        )
        .font(
            "Helvetica"
        )
        .fontSize(7.8)
        .text(
            safeText(
                day.evening
            ),
            thirdX,
            y + 37,
            {
                width: colWidth,
                height: 85,
                lineGap: 3
            }
        );

    // Details
    doc
        .fillColor(
            COLORS.green
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(7.5)
        .text(
            `₹ ${safeText(
                day.estimatedCost
            )}`,
            detailsX,
            y + 22,
            {
                width: 80
            }
        );

    doc
        .fillColor(
            COLORS.blue
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(7.2)
        .text(
            "WEATHER",
            detailsX,
            y + 47
        );

    doc
        .fillColor(
            COLORS.text
        )
        .font(
            "Helvetica"
        )
        .fontSize(7.2)
        .text(
            safeText(
                day.weather
            ),
            detailsX,
            y + 59,
            {
                width: 70
            }
        );

    doc
        .fillColor(
            COLORS.orange
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(7.2)
        .text(
            "TRANSPORT",
            detailsX,
            y + 84
        );

    doc
        .fillColor(
            COLORS.text
        )
        .font(
            "Helvetica"
        )
        .fontSize(7.2)
        .text(
            safeText(
                day.recommendedTransport
            ),
            detailsX,
            y + 96,
            {
                width: 72
            }
        );

    doc.y =
        y + height + 12;

};

// =====================================================
// BUDGET CARD
// =====================================================

const drawBudgetCard = (
    doc,
    budget
) => {

    const x =
        MARGIN;

    const y =
        doc.y;

    const width =
        160;

    const height =
        170;

    doc
        .roundedRect(
            x,
            y,
            width,
            height,
            8
        )
        .fill(
            COLORS.white
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .fillColor(
            COLORS.primary
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(11)
        .text(
            "◔  BUDGET BREAKDOWN",
            x + 12,
            y + 14
        );

    const rows = [

        [
            "Hotel",
            budget.hotel
        ],

        [
            "Food",
            budget.food
        ],

        [
            "Transport",
            budget.transport
        ],

        [
            "Activities",
            budget.activities
        ],

        [
            "Shopping",
            budget.shopping
        ]

    ];

    let rowY =
        y + 42;

    rows.forEach(
        ([label, value]) => {

            doc
                .fillColor(
                    COLORS.text
                )
                .font(
                    "Helvetica"
                )
                .fontSize(8)
                .text(
                    label,
                    x + 12,
                    rowY
                );

            doc
                .font(
                    "Helvetica-Bold"
                )
                .text(
                    safeText(
                        value
                    ),
                    x + 82,
                    rowY,
                    {
                        width: 65,
                        align: "right"
                    }
                );

            rowY += 20;

        }
    );

    doc
        .moveTo(
            x + 10,
            y + 140
        )
        .lineTo(
            x + width - 10,
            y + 140
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .fillColor(
            COLORS.primaryDark
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(8)
        .text(
            "TOTAL",
            x + 12,
            y + 150
        );

    const total =
        Object.values(
            budget
        )
        .filter(
            value =>
                typeof value ===
                "string"
        )
        .join("");

    doc
        .text(
            total || "",
            x + 70,
            y + 150,
            {
                width: 78,
                align: "right"
            }
        );

};

// =====================================================
// RECOMMENDATION CARD
// =====================================================

const drawRecommendationCard = (
    doc,
    x,
    y,
    width,
    height,
    title,
    items,
    type
) => {

    doc
        .roundedRect(
            x,
            y,
            width,
            height,
            8
        )
        .fill(
            COLORS.white
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .fillColor(
            COLORS.primary
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(10)
        .text(
            title,
            x + 12,
            y + 13
        );

    let currentY =
        y + 36;

    items
        .slice(0, 3)
        .forEach(
            item => {

                const name =
                    safeText(
                        item.name
                    );

                const description =
                    type ===
                    "hotel"
                        ? safeText(
                            item.reason
                        )
                        : safeText(
                            item.speciality
                        );

                doc
                    .fillColor(
                        COLORS.dark
                    )
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(7.5)
                    .text(
                        `• ${name}`,
                        x + 12,
                        currentY,
                        {
                            width:
                                width - 24
                        }
                    );

                currentY += 12;

                doc
                    .fillColor(
                        COLORS.gray
                    )
                    .font(
                        "Helvetica"
                    )
                    .fontSize(7)
                    .text(
                        description,
                        x + 21,
                        currentY,
                        {
                            width:
                                width - 33,
                            height: 25,
                            lineGap: 2
                        }
                    );

                currentY += 28;

            }
        );

};

// =====================================================
// PACKING CARD
// =====================================================

const drawPackingCard = (
    doc,
    x,
    y,
    width,
    height,
    tips
) => {

    doc
        .roundedRect(
            x,
            y,
            width,
            height,
            8
        )
        .fill(
            COLORS.greenLight
        )
        .strokeColor(
            "#D1FAE5"
        )
        .stroke();

    doc
        .fillColor(
            COLORS.green
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(10)
        .text(
            "✓  PACKING CHECKLIST",
            x + 12,
            y + 12
        );

    const columns = 2;

    const columnWidth =
        (width - 30) /
        columns;

    tips.forEach(
        (tip, index) => {

            const column =
                index % columns;

            const row =
                Math.floor(
                    index / columns
                );

            const itemX =
                x +
                12 +
                column *
                    columnWidth;

            const itemY =
                y +
                35 +
                row * 18;

            doc
                .fillColor(
                    COLORS.green
                )
                .fontSize(7)
                .text(
                    "●",
                    itemX,
                    itemY
                );

            doc
                .fillColor(
                    COLORS.text
                )
                .font(
                    "Helvetica"
                )
                .fontSize(7)
                .text(
                    safeText(tip),
                    itemX + 8,
                    itemY,
                    {
                        width:
                            columnWidth -
                            12
                    }
                );

        }
    );

};

// =====================================================
// GENERATE TRIP PDF
// =====================================================

const generateTripPDF = (
    trip,
    res
) => {

    const doc =
        new PDFDocument({

            size: "A4",

            margin: MARGIN,

            bufferPages: true

        });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="TripFusion-${trip._id}.pdf"`
    );

    doc.pipe(res);

    const ai =
        parseAIResponse(
            trip.aiResponse
        );

    // =================================================
    // PAGE 1 HEADER
    // =================================================

    drawMainHeader(
        doc,
        trip.destination?.name ||
            ai.destination ||
            "Travel"
    );

    doc.y = 140;

    // =================================================
    // OVERVIEW
    // =================================================

    sectionTitle(
        doc,
        "Trip Overview"
    );

    const cardGap = 7;

    const cardWidth =
        (
            CONTENT_WIDTH -
            cardGap * 4
        ) / 5;

    const cardHeight =
        62;

    const overviewY =
        doc.y;

    drawInfoCard(
        doc,
        MARGIN,
        overviewY,
        cardWidth,
        cardHeight,
        "Destination",
        trip.destination?.name ||
            ai.destination ||
            "N/A"
    );

    drawInfoCard(
        doc,
        MARGIN +
            (cardWidth + cardGap),
        overviewY,
        cardWidth,
        cardHeight,
        "Start Date",
        formatDate(
            trip.startDate
        )
    );

    drawInfoCard(
        doc,
        MARGIN +
            (cardWidth + cardGap) * 2,
        overviewY,
        cardWidth,
        cardHeight,
        "End Date",
        formatDate(
            trip.endDate
        )
    );

    drawInfoCard(
        doc,
        MARGIN +
            (cardWidth + cardGap) * 3,
        overviewY,
        cardWidth,
        cardHeight,
        "Duration",
        `${trip.totalDays || ai.numberOfDays || 0} Days`
    );

    drawInfoCard(
        doc,
        MARGIN +
            (cardWidth + cardGap) * 4,
        overviewY,
        cardWidth,
        cardHeight,
        "Travelers",
        trip.travelers ||
            ai.travelers ||
            0
    );

    doc.y =
        overviewY +
        cardHeight +
        16;

    // =================================================
    // BUDGET SECOND ROW
    // =================================================

    const budgetX =
        MARGIN +
        (cardWidth + cardGap) * 4;

    drawInfoCard(
        doc,
        budgetX,
        doc.y,
        cardWidth,
        cardHeight,
        "Estimated Budget",
        formatCurrency(
            trip.estimatedBudget ||
                ai.budget ||
                0
        )
    );

    doc.y +=
        cardHeight +
        16;

    // =================================================
    // INTERESTS + WEATHER
    // =================================================

    const halfWidth =
        (
            CONTENT_WIDTH -
            10
        ) / 2;

    const interestText =
        trip.interests &&
        trip.interests.length
            ? trip.interests.join(
                "  •  "
            )
            : "General travel";

    const weatherText =
        ai.weatherAdvice ||
        trip.aiResponse?.weather ||
        "Weather information unavailable.";

    const interestsHeight = 82;

    drawTwoColumnCard(
        doc,
        MARGIN,
        doc.y,
        halfWidth,
        interestsHeight,
        "TRAVEL INTERESTS",
        interestText,
        "★"
    );

    drawTwoColumnCard(
        doc,
        MARGIN +
            halfWidth +
            10,
        doc.y,
        halfWidth,
        interestsHeight,
        "WEATHER ADVICE",
        weatherText,
        "☁"
    );

    doc.y +=
        interestsHeight +
        20;

    // =================================================
    // DAY ITINERARY
    // =================================================

    if (
        Array.isArray(
            ai.days
        ) &&
        ai.days.length
    ) {

        sectionTitle(
            doc,
            "Day-by-Day Itinerary"
        );

        ai.days.forEach(
            (day) => {

                // Each card requires approximately 170px
                if (
                    doc.y + 170 >
                    PAGE_HEIGHT - 55
                ) {

                    doc.addPage();

                    drawSmallHeader(
                        doc
                    );

                    sectionTitle(
                        doc,
                        "Day-by-Day Itinerary"
                    );

                }

                drawDayCard(
                    doc,
                    day
                );

            }
        );

    }

    // =================================================
    // BUDGET + RECOMMENDATIONS
    // =================================================

    if (
        doc.y + 200 >
        PAGE_HEIGHT - 55
    ) {

        doc.addPage();

        drawSmallHeader(
            doc
        );

    }

    sectionTitle(
        doc,
        "Trip Recommendations"
    );

    const recommendationY =
        doc.y;

    if (
        ai.budgetBreakdown
    ) {

        drawBudgetCard(
            doc,
            ai.budgetBreakdown
        );

    }

    const recommendationX =
        MARGIN + 170;

    const recommendationWidth =
        (
            CONTENT_WIDTH -
            180
        ) / 2;

    if (
        Array.isArray(
            ai.recommendedHotels
        )
    ) {

        drawRecommendationCard(
            doc,
            recommendationX,
            recommendationY,
            recommendationWidth,
            170,
            "RECOMMENDED HOTELS",
            ai.recommendedHotels,
            "hotel"
        );

    }

    if (
        Array.isArray(
            ai.recommendedRestaurants
        )
    ) {

        drawRecommendationCard(
            doc,
            recommendationX +
                recommendationWidth +
                10,
            recommendationY,
            recommendationWidth,
            170,
            "RECOMMENDED RESTAURANTS",
            ai.recommendedRestaurants,
            "restaurant"
        );

    }

    doc.y =
        recommendationY +
        185;

    // =================================================
    // PACKING
    // =================================================

    if (
        Array.isArray(
            ai.packingTips
        ) &&
        ai.packingTips.length
    ) {

        if (
            doc.y + 100 >
            PAGE_HEIGHT - 55
        ) {

            doc.addPage();

            drawSmallHeader(
                doc
            );

        }

        drawPackingCard(
            doc,
            MARGIN,
            doc.y,
            CONTENT_WIDTH,
            80,
            ai.packingTips
        );

        doc.y += 95;

    }

    // =================================================
    // FINAL MESSAGE
    // =================================================

    if (
        doc.y + 70 >
        PAGE_HEIGHT - 55
    ) {

        doc.addPage();

        drawSmallHeader(
            doc
        );

    }

    doc
        .roundedRect(
            MARGIN,
            doc.y,
            CONTENT_WIDTH,
            55,
            8
        )
        .fill(
            COLORS.lightPurple
        );

    doc
        .fillColor(
            COLORS.primaryDark
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(10)
        .text(
            "Enjoy your trip!",
            MARGIN + 15,
            doc.y + 13
        );

    doc
        .fillColor(
            COLORS.gray
        )
        .font(
            "Helvetica"
        )
        .fontSize(8)
        .text(
            `Have a wonderful journey through ${
                trip.destination?.name ||
                ai.destination ||
                "your destination"
            }.`,
            MARGIN + 15,
            doc.y + 30
        );

    // =================================================
    // FOOTERS
    // =================================================

    const range =
        doc.bufferedPageRange();

    const totalPages =
        range.count;

    for (
        let i = 0;
        i < totalPages;
        i++
    ) {

        doc.switchToPage(
            i
        );

        drawFooter(
            doc,
            i + 1,
            totalPages
        );

    }

    doc.end();

};

// =====================================================
// BOOKING INVOICE PDF
// =====================================================

const generateBookingPDF = (
    booking,
    res
) => {

    const doc =
        new PDFDocument({

            margin: MARGIN,

            size: "A4",

            bufferPages: true

        });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="TripFusion-Invoice-${booking._id}.pdf"`
    );

    doc.pipe(res);

    // =================================================
    // HEADER
    // =================================================

    doc
        .rect(
            0,
            0,
            PAGE_WIDTH,
            105
        )
        .fill(
            COLORS.primaryDark
        );

    doc
        .fillColor(
            COLORS.white
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(24)
        .text(
            "✈ TripFusion AI",
            MARGIN,
            25
        );

    doc
        .font(
            "Helvetica"
        )
        .fontSize(9)
        .text(
            "Smart Travel Planning Platform",
            MARGIN,
            56
        );

    doc
        .font(
            "Helvetica-Bold"
        )
        .fontSize(19)
        .text(
            "BOOKING INVOICE",
            330,
            38,
            {
                width: 215,
                align: "right"
            }
        );

    doc.y =
        130;

    // =================================================
    // BOOKING ID
    // =================================================

    doc
        .fillColor(
            COLORS.gray
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(7)
        .text(
            "BOOKING ID"
        );

    doc
        .fillColor(
            COLORS.dark
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(9)
        .text(
            safeText(
                booking._id
            )
        );

    doc.moveDown(1.5);

    // =================================================
    // HOTEL
    // =================================================

    sectionTitle(
        doc,
        "Hotel"
    );

    doc
        .roundedRect(
            MARGIN,
            doc.y,
            CONTENT_WIDTH,
            78,
            8
        )
        .fill(
            COLORS.card
        );

    const hotelY =
        doc.y;

    doc
        .fillColor(
            COLORS.gray
        )
        .fontSize(7)
        .font(
            "Helvetica-Bold"
        )
        .text(
            "HOTEL",
            MARGIN + 14,
            hotelY + 12
        );

    doc
        .fillColor(
            COLORS.dark
        )
        .fontSize(16)
        .font(
            "Helvetica-Bold"
        )
        .text(
            booking.hotel?.name ||
                "Hotel",
            MARGIN + 14,
            hotelY + 29
        );

    doc
        .fillColor(
            COLORS.gray
        )
        .fontSize(8)
        .font(
            "Helvetica"
        )
        .text(
            `Room Type: ${
                booking.roomType ||
                "N/A"
            }`,
            MARGIN + 14,
            hotelY + 55
        );

    doc.y =
        hotelY +
        96;

    // =================================================
    // STAY INFORMATION
    // =================================================

    sectionTitle(
        doc,
        "Stay Information"
    );

    const infoY =
        doc.y;

    const threeWidth =
        (
            CONTENT_WIDTH -
            14
        ) / 3;

    drawInfoCard(
        doc,
        MARGIN,
        infoY,
        threeWidth,
        70,
        "Check-in",
        formatDate(
            booking.checkIn
        )
    );

    drawInfoCard(
        doc,
        MARGIN +
            threeWidth +
            7,
        infoY,
        threeWidth,
        70,
        "Check-out",
        formatDate(
            booking.checkOut
        )
    );

    drawInfoCard(
        doc,
        MARGIN +
            (threeWidth + 7) * 2,
        infoY,
        threeWidth,
        70,
        "Guests",
        booking.numberOfGuests
    );

    doc.y =
        infoY +
        85;

    const twoWidth =
        (
            CONTENT_WIDTH -
            7
        ) / 2;

    drawInfoCard(
        doc,
        MARGIN,
        doc.y,
        twoWidth,
        70,
        "Rooms Booked",
        booking.roomsBooked
    );

    drawInfoCard(
        doc,
        MARGIN +
            twoWidth +
            7,
        doc.y,
        twoWidth,
        70,
        "Booking Status",
        booking.bookingStatus
    );

    doc.y +=
        85;

    // =================================================
    // PAYMENT
    // =================================================

    sectionTitle(
        doc,
        "Payment Details"
    );

    const paymentY =
        doc.y;

    drawInfoCard(
        doc,
        MARGIN,
        paymentY,
        twoWidth,
        70,
        "Payment Method",
        booking.paymentMethod
    );

    drawInfoCard(
        doc,
        MARGIN +
            twoWidth +
            7,
        paymentY,
        twoWidth,
        70,
        "Payment Status",
        booking.paymentStatus
    );

    doc.y =
        paymentY +
        85;

    // =================================================
    // PRICE SUMMARY
    // =================================================

    sectionTitle(
        doc,
        "Price Summary"
    );

    const tableY =
        doc.y;

    doc
        .rect(
            MARGIN,
            tableY,
            CONTENT_WIDTH,
            30
        )
        .fill(
            COLORS.primary
        );

    doc
        .fillColor(
            COLORS.white
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(8)
        .text(
            "DESCRIPTION",
            MARGIN + 12,
            tableY + 10
        );

    doc
        .text(
            "AMOUNT",
            MARGIN + 350,
            tableY + 10,
            {
                width: 125,
                align: "right"
            }
        );

    doc.y =
        tableY +
        45;

    doc
        .fillColor(
            COLORS.text
        )
        .font(
            "Helvetica"
        )
        .fontSize(9)
        .text(
            `Room Charges (${booking.roomsBooked || 1} Room × Stay)`,
            MARGIN + 12,
            doc.y
        );

    doc
        .font(
            "Helvetica-Bold"
        )
        .text(
            formatCurrency(
                booking.totalPrice
            ),
            MARGIN + 350,
            doc.y,
            {
                width: 125,
                align: "right"
            }
        );

    doc.y += 30;

    doc
        .moveTo(
            MARGIN,
            doc.y
        )
        .lineTo(
            PAGE_WIDTH - MARGIN,
            doc.y
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc.y += 15;

    doc
        .roundedRect(
            MARGIN,
            doc.y,
            CONTENT_WIDTH,
            52,
            8
        )
        .fill(
            COLORS.lightPurple
        );

    const totalY =
        doc.y;

    doc
        .fillColor(
            COLORS.primaryDark
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(11)
        .text(
            "TOTAL AMOUNT",
            MARGIN + 14,
            totalY + 18
        );

    doc
        .fontSize(18)
        .text(
            formatCurrency(
                booking.totalPrice
            ),
            MARGIN + 350,
            totalY + 15,
            {
                width: 125,
                align: "right"
            }
        );

    doc.y += 75;

    // =================================================
    // PAYMENT STATUS
    // =================================================

    const isPaid =
        booking.paymentStatus ===
        "paid";

    doc
        .roundedRect(
            MARGIN,
            doc.y,
            CONTENT_WIDTH,
            48,
            8
        )
        .fill(
            isPaid
                ? COLORS.greenLight
                : COLORS.orangeLight
        );

    doc
        .fillColor(
            isPaid
                ? COLORS.green
                : COLORS.orange
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(10)
        .text(
            isPaid
                ? "✓ PAYMENT COMPLETED"
                : "⚠ PAYMENT PENDING",
            MARGIN + 14,
            doc.y + 12
        );

    doc
        .fillColor(
            COLORS.gray
        )
        .font(
            "Helvetica"
        )
        .fontSize(7.5)
        .text(
            isPaid
                ? "Your payment has been successfully received."
                : "Please complete payment to confirm your booking.",
            MARGIN + 14,
            doc.y + 28
        );

    doc.y += 70;

    // =================================================
    // SPECIAL REQUEST
    // =================================================

    if (
        booking.specialRequest
    ) {

        sectionTitle(
            doc,
            "Special Request"
        );

        doc
            .roundedRect(
                MARGIN,
                doc.y,
                CONTENT_WIDTH,
                55,
                8
            )
            .fill(
                COLORS.card
            );

        doc
            .fillColor(
                COLORS.text
            )
            .font(
                "Helvetica"
            )
            .fontSize(9)
            .text(
                booking.specialRequest,
                MARGIN + 14,
                doc.y + 19,
                {
                    width:
                        CONTENT_WIDTH -
                        28
                }
            );

        doc.y += 72;

    }

    // =================================================
    // THANK YOU
    // =================================================

    doc
        .roundedRect(
            MARGIN,
            doc.y,
            CONTENT_WIDTH,
            65,
            8
        )
        .fill(
            COLORS.lightPurple
        );

    doc
        .fillColor(
            COLORS.primaryDark
        )
        .font(
            "Helvetica-Bold"
        )
        .fontSize(11)
        .text(
            "Thank you for booking with TripFusion AI!",
            MARGIN + 14,
            doc.y + 14
        );

    doc
        .fillColor(
            COLORS.gray
        )
        .font(
            "Helvetica"
        )
        .fontSize(8)
        .text(
            "We hope you have a wonderful journey.",
            MARGIN + 14,
            doc.y + 35
        );

    // =================================================
    // FOOTER
    // =================================================

    const range =
        doc.bufferedPageRange();

    const totalPages =
        range.count;

    for (
        let i = 0;
        i < totalPages;
        i++
    ) {

        doc.switchToPage(
            i
        );

        drawFooter(
            doc,
            i + 1,
            totalPages
        );

    }

    doc.end();

};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    generateTripPDF,

    generateBookingPDF

};