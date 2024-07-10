document.getElementById('get-weather-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value.trim();
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }

    const weatherApiKey = '849566da8977ba37919229571ad78aa0'; // Replace with your OpenWeatherMap API key
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === 200) {
                updateWeatherInfo(data);
                getRainPrediction(data.coord.lat, data.coord.lon);
                getSunriseSunset(data.coord.lat, data.coord.lon);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            alert('Error fetching the weather data. Please check the console for more details.');
        });
});

function updateWeatherInfo(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
}

function getRainPrediction(lat, lon) {
    const weatherApiKey = '849566da8977ba37919229571ad78aa0'; // Replace with your OpenWeatherMap API key
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${weatherApiKey}`;

    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.alerts && data.alerts.length > 0) {
                document.getElementById('rain-prediction').textContent = `Rain Alert: ${data.alerts[0].description}`;
            } else {
                document.getElementById('rain-prediction').textContent = 'No rain alert.';
            }
        })
        .catch(error => {
            console.error('Error fetching rain prediction:', error);
            document.getElementById('rain-prediction').textContent = 'Error fetching rain prediction.';
        });
}

function getSunriseSunset(lat, lon) {
    const sunriseSunsetApiUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;

    fetch(sunriseSunsetApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'OK') {
                const sunrise = new Date(data.results.sunrise).toLocaleTimeString();
                const sunset = new Date(data.results.sunset).toLocaleTimeString();
                document.getElementById('sunrise').textContent = `Sunrise: ${sunrise}`;
                document.getElementById('sunset').textContent = `Sunset: ${sunset}`;
            } else {
                throw new Error('Sunrise-Sunset API returned an error.');
            }
        })
        .catch(error => {
            console.error('Error fetching sunrise-sunset data:', error);
            document.getElementById('sunrise').textContent = 'Error fetching sunrise time.';
            document.getElementById('sunset').textContent = 'Error fetching sunset time.';
        });
}
