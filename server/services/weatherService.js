const axios = require("axios");

const {
    searchLocation
} = require("./mapsService");

const BASE_URL =
    "https://api.openweathermap.org/data/2.5";

// =======================
// Current Weather
// =======================
const getCurrentWeather = async (
    place
) => {

    const location =
        await searchLocation(place);

    console.log(process.env.OPENWEATHER_API_KEY);
    const response =
        await axios.get(
            `${BASE_URL}/weather`,
            {
                params: {
                    lat: location.latitude,
                    lon: location.longitude,
                    appid: process.env.OPENWEATHER_API_KEY,
                    units: "metric"
                }
            }
        );

    const data = response.data;

    return {

        location,

        temperature: data.main.temp,

        feelsLike: data.main.feels_like,

        humidity: data.main.humidity,

        pressure: data.main.pressure,

        weather:
            data.weather[0].main,

        description:
            data.weather[0].description,

        windSpeed:
            data.wind.speed

    };

};

// =======================
// 5 Day Forecast
// =======================
const getForecast = async (
    place
) => {

    const location =
        await searchLocation(place);

    const response =
        await axios.get(
            `${BASE_URL}/forecast`,
            {
                params: {
                    lat: location.latitude,
                    lon: location.longitude,
                    appid: process.env.OPENWEATHER_API_KEY,
                    units: "metric"
                }
            }
        );

    return {

        location,

        forecast:
            response.data.list.slice(0,8).map(item => ({

                date:
                    item.dt_txt,

                temperature:
                    item.main.temp,

                weather:
                    item.weather[0].main,

                description:
                    item.weather[0].description,

                humidity:
                    item.main.humidity

            }))

    };

};

module.exports = {

    getCurrentWeather,

    getForecast

};