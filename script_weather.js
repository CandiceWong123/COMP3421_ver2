// Global variables
let date = new Date();

const regions = [
    {"station": "King's Park", "district": "Yau Tsim Mong", "image_src": "./image/region/kingspark.jpg"},
    {"station": "Hong Kong Observatory", "district": "Yau Tsim Mong", "image_src": "./image/region/hongkongobservatory.jpg"},
    {"station": "Wong Chuk Hang", "district": "Southern District", "image_src": "./image/region/wongchukhang.jpg"},
    {"station": "Ta Kwu Ling", "district": "North District", "image_src": "./image/region/takwuling.jpg"},
    {"station": "Lau Fau Shan", "district": "Yuen Long", "image_src": "./image/region/laufaushan.jpg"},
    {"station": "Tai Po", "district": "Tai Po", "image_src": "./image/region/taipo.jpg"},
    {"station": "Sha Tin", "district": "Sha Tin", "image_src": "./image/region/shatin.jpg"},
    {"station": "Tuen Mun", "district": "Tuen Mun", "image_src": "./image/region/tuenmun.jpg"},
    {"station": "Tseung Kwan O", "district": "Sai Kung", "image_src": "./image/region/tseungkwano.jpg"},
    {"station": "Sai Kung", "district": "Sai Kung", "image_src": "./image/region/saikung.jpg"},
    {"station": "Cheung Chau", "district": "Islands District", "image_src": "./image/region/cheungchau.jpg"},
    {"station": "Chek Lap Kok", "district": "Islands District", "image_src": "./image/region/cheklapkok.jpg"},
    {"station": "Tsing Yi", "district": "Kwai Tsing", "image_src": "./image/region/tsingyi.jpg"},
    {"station": "Shek Kong", "district": "Yuen Long", "image_src": "./image/region/shekkong.jpg"},
    {"station": "Tsuen Wan Ho Koon", "district": "Tsuen Wan", "image_src": "./image/region/tsuenwanhokoon.jpg"},
    {"station": "Tsuen Wan Shing Mun Valley", "district": "Tsuen Wan", "image_src": "./image/region/tsuenwanshingmunvalley.jpg"},
    {"station": "Hong Kong Park", "district": "Central & Western District", "image_src": "./image/region/hongkongpark.jpg"},
    {"station": "Shau Kei Wan", "district": "Eastern District", "image_src": "./image/region/shaukeiwan.jpg"},
    {"station": "Kowloon City", "district": "Kowloon City", "image_src": "./image/region/kowlooncity.jpg"},
    {"station": "Happy Valley", "district": "Wan Chai", "image_src": "./image/region/happyvalley.jpg"},
    {"station": "Wong Tai Sin", "district": "Wong Tai Sin", "image_src": "./image/region/wongtaisin.jpg"},
    {"station": "Stanley", "district": "Southern District", "image_src": "./image/region/stanley.jpg"},
    {"station": "Kwun Tong", "district": "Kwun Tong", "image_src": "./image/region/kwuntong.jpg"},
    {"station": "Sham Shui Po", "district": "Sham Shui Po", "image_src": "./image/region/shamshuipo.jpg"},
    {"station": "Kai Tak Runway Park", "district": "Kowloon City", "image_src": "./image/region/kaitakrunwaypark.jpg"},
    {"station": "Yuen Long Park", "district": "Yuen Long", "image_src": "./image/region/yuenlongpark.jpg"},
    {"station": "Tai Mei Tuk", "district": "Tai Po", "image_src": "./image/region/taipo.jpg"}
]

// When the window loads, fetch the weather data
window.onload = function() {
    const fetchDateElement = document.getElementById('fetch_date');
    if (fetchDateElement) {
        const updateDate = () => {
            const now = date;
            now.setHours(now.getHours() + 8); // Adjust to Hong Kong timezone (UTC+8)
            const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
            fetchDateElement.textContent = "Last update on " + formattedDate;        };
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

    // // Update temperature, humidity, UV index, and max rainfall
    getRegionalWeather("Hong Kong Observatory","Yau Tsim Mong").then(data => {
        document.getElementById('c_humidity').innerText = data.humidity + " %";
        document.getElementById('c_uv').innerText = data.uvIndex;
        document.getElementById('c_temp').innerText = data.temperature + " °C";
        document.getElementById('c_rainfall').innerText = data.rainfall + " mm";
    })

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
    getVisibility('Central').then(data => {
        document.getElementById('c_visibility').innerText = data.visibility;
    }
    ).catch(error => {
        console.error("Error fetching visibility data:", error);
    });

    // Part 2: Fetch weather warning
    getWeatherWarning().then(data => {
        const warningList = document.getElementById('warning_list');
        if (warningList) {
            warningList.innerHTML = '';
    
            if (data && data.length > 0) {
                // Iterate through the data array and create unordered list
                data.forEach(item => {
                    const li = document.createElement('li'); 
                    const img = document.createElement('img');
                    img.src = getWarningImage(item.code);
                    img.alt = item.name;
                    img.id = `warn_icon`;
                    img.onclick = () => getWarningDetail(item.code, item.name);                    
                    li.appendChild(img);
                    warningList.appendChild(li);
                    document.getElementById('warn_name').style.display = "none";
                    document.getElementById('warn_statement').style.display = "none";
                });
            } else {
                // If no warnings, display a message
                document.getElementById('warn_statement').style.display = "block";
                document.getElementById('warn_statement').innerText = "No weather warning.";
            }
        }

    }).catch(error => {
        console.error("Error fetching weather warning data:", error);
    });


    // Part 3: Fetch regional weather data
    let station = "Sha Tin";
    let district = "Sha Tin";

    // Update regional rainfall
    getRegionalRainfall(station).then(data => {
        document.getElementById('r_rainfall').innerText = data.rainfall + " mm";
    }).catch(error => {
        console.error("Error fetching regional rainfall data:", error);
    });

    
    getRegionalWeather(station,district).then(data => {
        document.getElementById('r_humidity').innerText = data.humidity + " %";
        document.getElementById('r_uv').innerText = data.uvIndex;
        document.getElementById('r_temp').innerText = data.temperature + " °C";
        // document.getElementById('r_rainfall').innerText = data.rainfall + " mm";
    }).catch(error => {
        console.error("Error fetching regional weather data:", error);
    });

    getVisibility(station).then(data => {
        document.getElementById('r_visibility').innerText = data.visibility;
    }).catch(error => {
        console.error("Error fetching visibility data:", error);
    });

    // Initialize the search engine
    regionDropdown();




    // Part 4: Forecast
    getWeather('forecast').then(data => {
        let report = data.generalSituation;
        document.getElementById('forecast_report').innerText = report;

        console.log(data);

        let forecasts = data.weatherForecast;
        console.log(forecasts);
        // Generate the forecast list
        generateForecastList(forecasts);

    }).catch(error => {
        console.error("Error fetching forecast data:", error);
    });


};

// function generateForecastList(weatherForecast) {
//     const forecastList = document.getElementById("forecast_list");
//     forecastList.innerHTML = "";

//     weatherForecast.forEach((day, index) => {

//         const listItem = document.createElement("li");
//         listItem.id = `day${index + 1}`;

//         date = day.forecastDate;

//         console.log(day.forecastWeather);
//         console.log(determineWeather(day.forecastWeather));
        

//         const forecast_day = date.substring(6);
//         const dateObj = new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${forecast_day}`);
//         const monthAbbreviation = dateObj.toLocaleString('en-US', { month: 'short' });  

//         listItem.innerHTML = `
//         <span class = "f_day">${day.week.slice(0,3)}, ${forecast_day} ${monthAbbreviation}</span>
//         <span class="f_temp_range">
        
//             <img src=${getWeatherImage(determineWeather(day.forecastWeather))} alt="Weather Icon">

//             <span class="r_min_temp">${day.forecastMintemp.value}</span> | 
//             <span class="r_max_temp">${day.forecastMaxtemp.value}</span>°C
//         </span>
//         <img id="expand_button" src="image/open.png" alt="Click me to expand">
//     `;
//         forecastList.appendChild(listItem);
//     });
// }

function generateForecastList(weatherForecast) {
    const forecastList = document.getElementById("forecast_list");
    forecastList.innerHTML = ""; // Clear existing content

    weatherForecast.forEach((day, index) => {
        const listItem = document.createElement("li");
        listItem.id = `day${index + 1}`;
        listItem.classList.add("forecast-item"); // Add a class for styling

        const forecastDay = day.forecastDate.substring(6);
        const dateObj = new Date(`${day.forecastDate.slice(0, 4)}-${day.forecastDate.slice(4, 6)}-${forecastDay}`);
        const monthAbbreviation = dateObj.toLocaleString('en-US', { month: 'short' });

        // Main content of the list item
        listItem.innerHTML = `
            <div class="forecast-summary">
                <span class="f_day">${day.week.slice(0, 3)}, ${forecastDay} ${monthAbbreviation}</span>
                <span class="f_temp_range">
                    <img src=${getWeatherImage(determineWeather(day.forecastWeather))} alt="Weather Icon">
                    <span class="r_min_temp">${day.forecastMintemp.value}</span> | 
                    <span class="r_max_temp">${day.forecastMaxtemp.value}</span>°C
                </span>
                <img id="expand_button" src="image/open.png" alt="Click me to expand">
            </div>
            <div class="forecast-details" style="display: none;">
                <p><strong>Wind:</strong> ${day.forecastWind}</p>
                <p><strong>Weather:</strong> ${day.forecastWeather}</p>
                <p><strong>Max Humidity:</strong> ${day.forecastMaxrh.value}%</p>
                <p><strong>Min Humidity:</strong> ${day.forecastMinrh.value}%</p>
                <p><strong>PSR:</strong> ${day.PSR}</p>
            </div>
        `;

        // Add click event to the expand button
        const expandButton = listItem.querySelector("#expand_button");
        expandButton.addEventListener("click", () => {
            const details = listItem.querySelector(".forecast-details");

            // Toggle the visibility of the details
            if (details.style.display === "none") {
                // Collapse all other details
                document.querySelectorAll(".forecast-details").forEach(detail => {
                    detail.style.display = "none";
                });
                details.style.display = "block"; // Expand the clicked item
            } else {
                details.style.display = "none"; // Collapse the clicked item
            }
        });

        forecastList.appendChild(listItem);
    });
}


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

// Get regional weather condition
async function getRegionalWeather(placeName = "Hong Kong Observatory", district = "Yau Tsim Mong") {
    return getWeather('current').then(data => {
        let humidity = data.humidity?.data?.[0]?.value ?? "-";
        let uvIndex = data.uvindex?.data?.[0]?.value ?? data.uvindex ?? "-";        
        uvIndex = uvIndex === "" ? "-" : uvIndex;
        let temperature = data.temperature.data.find(item => item.place === placeName) || "-";
        let rainfall = data.rainfall.data.find(item => item.place === district) || "-";

        return {
            humidity: humidity,
            uvIndex: uvIndex,
            temperature: temperature.value,
            rainfall: rainfall.max
        };

    }).catch(error => {
        console.error("Error fetching current weather data:", error);
        return null; // Return null in case of an error
    });
}

// Get the weather warning
async function getWeatherWarning() {
    return getWeather('warningSummary').then(data => {

        // // Sample data for testing
        data = {
            "WFROST": {"name": "Frost Warning", "code": "WFROST", "actionCode": "ISSUE", "issueTime": "2020-09-24T11:15:00+08:00"},
            "WHOT": {"name": "Very Hot Weather Warning", "code": "WHOT", "actionCode": "ISSUE", "issueTime": "2020-09-24T07:00:00+08:00"},
            "WCOLD": {"name": "Cold Weather Warning", "code": "WCOLD", "actionCode": "ISSUE", "issueTime": "2020-09-24T11:15:00+08:00"},
            "WFNTSA": {"name": "Flooding Announcement in Northern New Territories", "code": "WFNTSA", "actionCode": "ISSUE", "issueTime": "2020-09-24T11:40:00+08:00"},
            "WMSGNL": {"name": "Strong Monsoon Signal", "code": "WMSGNL", "actionCode": "ISSUE", "issueTime": "2020-09-24T11:15:00+08:00"},
            "WL": {"name": "Landslip Warning", "code": "WL", "actionCode": "ISSUE", "issueTime": "2020-09-24T11:15:00+08:00"},
            "WRAIN": {"name": "Rainstorm Warning Signal", "code": "WRAINR", "type": "Red", "actionCode": "ISSUE", "issueTime": "2020-09-24T11:15:00+08:00"},
            "WTMW": {"name": "Tsunami Warning", "code": "WTMW", "actionCode": "ISSUE", "issueTime": "2020-09-24T11:15:00+08:00"},
            "WTS": {"name": "Thunderstorm Warning", "code": "WTS", "actionCode": "EXTEND", "issueTime": "2020-09-24T11:40:00+08:00", "expireTime": "2020-09-24T19:30:00+08:00"},
            "WTCSGNL": {"name": "Tropical Cyclone Warning Signal", "code": "TC3", "actionCode": "ISSUE", "type": "Strong Wind Signal No. 3", "issueTime": "2020-09-24T11:15:00+08:00"},
            "WFIRE": {"name": "Fire Danger Warning", "code": "WFIRER", "type": "Red", "actionCode": "ISSUE", "issueTime": "2020-09-24T11:15:00+08:00"}
        }
          
        if (Object.keys(data).length === 0){ 
            return null;
        }

        const filteredWarnings = Object.values(data).map(({ name, code }) => ({ name, code }));

        return filteredWarnings;

    }).catch(error => {
        console.error("Error fetching weather warning data:", error);
    }
    );
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
    return weatherImages[weather] || "unknown";
}

// Get the weather image path
function getWarningImage(warncode){
    const warningImages = {
        "WMSGNL": "./image/warning/cold.png",
        "WFIRER": "./image/warning/firered.png",
        "WFIREY": "./image/warning/fireyellow.png",
        "WFROST": "./image/warning/frost.png",
        "WHOT": "./image/warning/hot.png",
        "WCOLD": "./image/warning/cold.png",
        "WL": "./image/warning/ls.png",
        "WRAINA": "./image/warning/rainamber.png",
        "WRAINR": "./image/warning/rainred.png",
        "WRAINB": "./image/warning/rainblack.png",
        "WMSGNL": "./image/warning/sms.png",
        "TC1": "./image/warning/tc1.png",
        "TC3": "./image/warning/tc3.png",
        "TC8NE": "./image/warning/tc08ne.png",
        "TC8NW": "./image/warning/tc08nw.png",
        "TC8SE": "./image/warning/tc08se.png",
        "TC8SW": "./image/warning/tc08sw.png",
        "TC9": "./image/warning/tc09.png",
        "TC10": "./image/warning/tc10.png",
        "WTS": "./image/warning/ts.png",
        "WTMW": "./image/warning/tsunami.png",
        "WFNTSA": "./image/warning/northflood.png",
    };
    return warningImages[warncode] || console.log("unknown warning code ", warncode); // Return a default image or handle unknown codes
}

// Function to get warning details
async function getWarningDetail(warncode, warnName) {

    return getWeather('warningInfo').then(data => {
        // Sample data for testing
        data = {
            "details": [
              {
                "contents": [
                  "Thunderstorm Warning issued at 11:40 a.m. on 24 Sep 2020 has been extended until 7:30 p.m. today.",
                  "Thunderstorms are expected to occur over Hong Kong.",
                  "Members of the public are advised to take the following precautions when thunderstorms occur:",
                  "1. Stay indoors. Seek shelter in buildings if you are engaging in outdoor activities.",
                  "2. Do not stand on high grounds. Keep away from highly conductive objects, trees or masts."
                ],
                "warningStatementCode": "WTS",
                "updateTime": "2020-09-24T05:00:00+08:00"
              },
              {
                "contents": ["The Strong Monsoon Signal was issued at 11:15 a.m."],
                "warningStatementCode": "WMSGNL",
                "updateTime": "2020-09-24T11:15:00+08:00"
              },
              {
                "contents": ["Landslip Warning issued at 11:15 a.m."],
                "warningStatementCode": "WL",
                "updateTime": "2020-09-24T11:15:00+08:00"
              },
              {
                "contents": [
                  "The Very Hot Weather Warning has been issued by the Hong Kong Observatory at 07:00.",
                  "The Hong Kong Observatory is forecasting very hot weather with light winds in Hong Kong today. The risk of heatstroke is high.",
                  "When engaged in outdoor work or activities, drink plenty of water and avoid overexertion.",
                  "If not feeling well, take a rest in the shade or cooler place as soon as possible.",
                  "People staying indoors without air-conditioning should keep windows open as far as possible to ensure adequate ventilation.",
                  "Avoid prolonged exposure under sunlight. Loose clothing, suitable hats, and UV-blocking sunglasses can reduce the chance of sunburn by solar ultraviolet radiation.",
                  "Swimmers and those taking part in outdoor activities should use a sunscreen lotion of SPF 15 or above and reapply it frequently.",
                  "Beware of health and wellbeing of elderly or persons with chronic medical conditions. If you know of them, call or visit them occasionally to check if they need any assistance."
                ],
                "warningStatementCode": "WHOT",
                "updateTime": "2020-09-24T07:00:00+08:00"
              },
              {
                "contents": [
                  "The Cold Weather Warning has been issued by the Hong Kong Observatory at 11:15 a.m.",
                  "Cold weather is expected in Hong Kong in the morning and at night today and tomorrow.",
                  "The minimum temperatures in the urban areas overnight will be around 11 degrees or below. It will be a couple of degrees lower in the northern part of the New Territories and on high ground.",
                  "People are advised to put on warm clothes and ensure adequate indoor ventilation.",
                  "As it is very windy in parts of the territory, wind chill effect will be significant.",
                  "Prolonged exposure to wintry winds may lead to hypothermia.",
                  "If you know of elderly persons or persons with chronic medical conditions staying alone, please call or visit them occasionally to check if they need any assistance.",
                  "Owing to icing conditions in Tai Mo Shan, members of the public, motorists, and cyclists should be aware of the danger on slippery roads.",
                  "Make sure heaters are safe before use, and place them away from any combustibles.",
                  "Do not light fires indoors as a means to keep warm.",
                  "Ensure there is plenty of fresh air in your room when using an old-type gas water heater."
                ],
                "warningStatementCode": "WCOLD",
                "updateTime": "2020-09-24T11:15:00+08:00"
              }
            ]
        }

        const name = document.getElementById('warn_name');
        const statement = document.getElementById('warn_statement');
        
        name.style.display = "block";
        statement.style.display = "block";

        name.innerText = warnName;
        const warningInfo = data.details.find(item => item.warningStatementCode === warncode);
        statement.innerText = warningInfo ? warningInfo.contents.join(" ") : "No details available for this warning.";

    }).catch(error => {
        console.error("Error fetching warning details:", error);
    });
}

async function getRegionalRainfall(placeName = "Sha Tin") {
    return getWeather('rainfallPastHour').then(data => {
        if (!data || !data.hourlyRainfall) {
            throw new Error("Rainfall data is unavailable.");
        }

        // Find the station in the hourlyRainfall array
        const station = data.hourlyRainfall.find(station => station.automaticWeatherStation === placeName);

        if (!station || station.value === undefined) {
            console.log(`No rainfall data found for station: ${placeName}`);
            return { rainfall: "-" }; // Return fallback value
        }

        return {
            rainfall: station.value
        };

    }).catch(error => {
        console.error("Error fetching regional rainfall data:", error);
        return { rainfall: "N/A" }; // Return fallback value in case of error
    });
}

async function getVisibility(station = "Central") {
    return getWeather('visibility').then(data => {
        let visibility = data.data.find(entry => entry[1] === station) || "-";

        return {
            visibility: visibility[2] || "-"
        };

    }).catch(error => {
        console.error("Error fetching current weather data:", error);
    });
}

function regionDropdown(){
    const searchInput = document.querySelector('.search_input'); 
    const dropdownList = document.querySelector('.dropdown_list'); 

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        dropdownList.innerHTML = '';

        if (query) {
            // Filter regions based on the query
            const filteredRegions = regions.filter(region =>
                region.station.toLowerCase().includes(query) || region.district.toLowerCase().includes(query)
            );

            // Populate the dropdown list
            filteredRegions.forEach(region => {
                const li = document.createElement('li');
                li.textContent = `${region.station} (${region.district})`;
                li.classList.add('dropdown_item');

                // Populate the search bar with selected region
                li.addEventListener('click', () => {
                    searchInput.value = region.station;
                    dropdownList.innerHTML = '';
                });

                dropdownList.appendChild(li);
            });
        }
    });      
}

function searchRegion(){
    const searchInput = document.querySelector('.search_input'); 

    if (!searchInput.value) {
        console.log("The region field is null.");
        return;
    }

    const selectedRegion = regions.find(region => region.station === searchInput.value);
    searchInput.value = "";

    if (!selectedRegion){
        searchInput.placeholder = "No region found.";
        setTimeout(() => {searchInput.placeholder = "Search region";}, 1500);
        return;

    }else{
        let station = selectedRegion.station;
        let district = selectedRegion.district;
        document.getElementById('region_image').src = selectedRegion.image_src;
        document.getElementById('r_region').innerText = station;

        // Update regional rainfall
        getRegionalRainfall(station).then(data => {
            document.getElementById('r_rainfall').innerText = data.rainfall + " mm";
        }).catch(error => {
            console.error("Error fetching regional rainfall data:", error);
        });

        getRegionalWeather(station,district).then(data => {
            document.getElementById('r_humidity').innerText = data.humidity + " %";
            document.getElementById('r_uv').innerText = data.uvIndex;
            document.getElementById('r_temp').innerText = data.temperature + " °C";
        }).catch(error => {
            console.error("Error fetching regional weather data:", error);
        });

        getVisibility(station).then(data => {
            document.getElementById('r_visibility').innerText = data.visibility;
        }).catch(error => {
            console.error("Error fetching visibility data:", error);
        });

    }
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

