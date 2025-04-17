// Provided JSON data
const data = {
    fields: ["YYYY-MM-DD", "RISE", "TRAN.", "SET"],
    data: [
        ["2025-04-16", "06:03", "12:23", "18:44"],
        ["2025-04-17", "06:02", "12:23", "18:44"],
        ["2025-04-18", "06:01", "12:23", "18:45"]
    ]
};

// Function to get sunrise and sunset time for today
function getSunTimes(jsonData) {

    
    // const today = new Date().toISOString().slice(0, 10); // Get system date in 'YYYY-MM-DD' format
    let today = new Date();
    today = new Date().toISOString().slice(0, 8) + today.getDate(); // Get system date in 'YYYY-MM-DD' format
    // console.log(today);


    const todayData = jsonData.data.find(entry => entry[0] === today);

    
    if (todayData) {
        return {
            sunrise: todayData[1],
            transit: todayData[2],
            sunset: todayData[3]
        };
    } else {
        return "Data not available for today.";
    }
}

// Get sunrise and sunset times for today
const sunTimes = getSunTimes(data);

console.log(sunTimes);
