// Global variables
let date = new Date();

// When the page loads, fetch the weather data
window.onload = function() {
    const fetchDateElement = document.getElementById('fetch_date');
    if (fetchDateElement) {
        const updateDate = () => {
            const now = date;
            const formattedDate = now.toISOString().slice(0, 16).replace('T', ' ');
            fetchDateElement.textContent = "Last update on "+formattedDate;
        };
        updateDate();
    }

    // Part 1: Fetch current weather data

    // Update weather image, condition, and report
    getWeather('local').then(data => {
        let report = data.forecastDesc;
        let weather = determineWeather(report);
        let weatherImage = getWeatherImage(weather);

        if (weatherImage !== "unknown") {
            document.getElementById('c_icon').src = weatherImage;
            document.getElementById('c_condition').innerText = weather;
            document.getElementById('c_report').innerText = report;
        }
    }).catch(error => {
        console.error("Error fetching local weather data:", error);
    });

    // Update weather values
    getWeather('current').then(data => {
        let placeName = "Hong Kong Observatory"; 
        let district = "Yau Tsim Mong";

        let humidity = data.humidity.data[0].value || 0;
        let uvIndex = data.uvindex.data[0].value|| data.uvindex || "-";
        let temperature = data.temperature.data.find(item => item.place === placeName) || "-";
        let rainfall = data.rainfall.data.find(item => item.place === district) || "-";

        document.getElementById('c_humidity').innerText = humidity + " %";
        document.getElementById('c_uv').innerText = uvIndex;
        document.getElementById('c_temp').innerText = temperature.value + " °C";
        document.getElementById('c_rainfall').innerText = rainfall.max + " mm";

    }).catch(error => {
        console.error("Error fetching current weather data:", error);
    });

    // Update sunrise and sunset times
    getWeather('sunriseSunset').then(data => {
        let today = date.toISOString().slice(0, 8) + date.getDate();

        const todayData = data.data.find(entry => entry[0] === today);

        if (todayData) {
            document.getElementById('c_sunrise').innerText = todayData[1];
            document.getElementById('c_sunset').innerText = todayData[3];
        }
        else {
            console.log("Data not available for today.");
        }

    }).catch(error => {
        console.error("Error fetching sunrise/sunset data:", error);
    });

    // Update moonrise and moonset times
    getWeather('moonriseMoonset').then(data => {
        let today = date.toISOString().slice(0, 8) + date.getDate();

        const todayData = data.data.find(entry => entry[0] === today);

        if (todayData) {
            document.getElementById('c_moonrise').innerText = todayData[1];
            document.getElementById('c_moonset').innerText = todayData[3];
        }
        else {
            console.log("Data not available for today.");
        }
    })
    .catch(error => {
        console.error("Error fetching moonrise/moonset data:", error);
    }
    );

    // Update visibility
    getWeather('visibility').then(data => {

        let visibility = data.data[0][2] || "-";
        document.getElementById('c_visibility').innerText = visibility;
    }).catch(error => {
        console.error("Error fetching visibility data:", error);
    }); 










};







// Determine the weather based on the forecast description
function determineWeather(forecast){
    const forecastArray = forecast.toLowerCase().split(/\s+/); 
    let isSunny = false, isCloudy = false, isRainny = false, isRainstorm = false;

    for (const word of forecastArray) {
        if (word.includes("sun") || word.includes("hot")){
            isSunny = true;
        } 
        else if (word.includes("cloud") || word.includes("mist")) {
            isCloudy = true;
        }
        else if (word.includes("rainstorm") || word.includes("thunder")) {
            isRainstorm = true;
        }
        else if (word.includes("rain") || word.includes("shower") || word.includes("drizzle")) {
            isRainny = true;
        } 
    }

    // Determine the weather based on boolean checks and return
    if (isSunny){
        if(isRainny){
            return "Drizzle";
        }else if(isCloudy){
            return "Partly cloudy";
        }
        return "Sunny";
    }
    else if (isRainstorm){
        return "Rainstorm";
    }
    else if (isRainny){
        return "Shower rain";
    }
    else if (isCloudy){
        return "Cloudy";
    }

    return "unknown"; // If no keywords match
}

// Get the weather image path
function getWeatherImage(weather){
    const weatherImages = {
        "Sunny": "./image/weather/sunny.png",
        "Cloudy": "./image/weather/cloudy.png",
        "Shower rain": "./image/weather/rainny.png",
        "Rainstorm": "./image/weather/rainstorm.png",
        "Partly cloudy": "./image/weather/sunny_cloudy.png",
        "Drizzle": "./image/weather/sunny_rainny.png",
    };
    return weatherImages[weather] || "unknown"; // Return a question mark for unknown weather
}






// Fetch data from HK Observatory API
async function getWeather(type) {
    return fetch(`http://localhost:3000/weather/${type}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("output").innerText = "Failed to load weather data!";
        });
}

function getWeatherIcon(statement){

}
