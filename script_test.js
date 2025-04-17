function getWeather(type) {
    fetch(`http://localhost:3000/weather/${type}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("output").innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("output").innerText = "Failed to load weather data!";
        });
}

