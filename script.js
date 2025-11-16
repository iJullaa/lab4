document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');
    const currentWeatherContainer = document.getElementById('current-weather-container');
    const forecastContainer = document.getElementById('forecast-container');

    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';

    getWeatherBtn.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            getCurrentWeather(city);
            getForecast(city);
        } else {
            alert('Proszę wpisać nazwę miejscowości.');
        }
    });

    function getCurrentWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = function() {
            if (this.status === 200) {
                const data = JSON.parse(this.responseText);
                
                //console.log('Odpowiedź z Current Weather API:', data); 
                
                displayCurrentWeather(data);
            } else {
                currentWeatherContainer.innerHTML = `<p>Nie udało się pobrać aktualnej pogody. Sprawdź nazwę miasta lub klucz API.</p>`;
            }
        };

        xhr.onerror = function() {
            console.error('Błąd sieciowy XMLHttpRequest.');
        };

        xhr.send();
    }

    function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Problem z odpowiedzią sieciową.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Odpowiedź z Forecast API:', data);

            displayForecast(data);
        })
        .catch(error => {
            console.error('Błąd podczas pobierania prognozy:', error);
            forecastContainer.innerHTML = `<p>Nie udało się pobrać prognozy pogody.</p>`;
        });
    }

    function displayCurrentWeather(data) {
        const { name, main, weather, wind } = data;
        const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        const html = `
            <div class="weather-card">
                <h2>Pogoda teraz w: ${name}</h2>
                <p><img src="${iconUrl}" alt="Ikona pogody" class="weather-icon"> ${weather[0].description}</p>
                <p><strong>Temperatura:</strong> ${main.temp.toFixed(1)}°C (Odczuwalna: ${main.feels_like.toFixed(1)}°C)</p>
                <p><strong>Wilgotność:</strong> ${main.humidity}%</p>
                <p><strong>Wiatr:</strong> ${wind.speed.toFixed(1)} m/s</p>
            </div>
        `;
        currentWeatherContainer.innerHTML = html;
    }

    function displayForecast(data) {
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        let html = `
            <div class="weather-card">
                <h2>Prognoza 5-dniowa</h2>
                <div class="forecast-grid">
        `;

        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('pl-PL', { weekday: 'short' });
            const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

            html += `
                <div class="forecast-day">
                    <p><strong>${day}</strong></p>
                    <p>${date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })}</p>
                    <img src="${iconUrl}" alt="Ikona prognozy">
                    <p>${forecast.main.temp.toFixed(1)}°C</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
        forecastContainer.innerHTML = html;
    }
});