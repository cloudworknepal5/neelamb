(function() {
    "use strict";

    // CSS Injection (वेबसाइटको डिजाइन नबिग्रिने गरी)
    const style = document.createElement('style');
    style.textContent = `
        #weather-widget {
            width: 50px !important; height: 25px !important;
            display: inline-flex !important; align-items: center !important;
            cursor: pointer; background: #000; border-radius: 4px;
            border: 1px solid #333; padding: 0 4px !important;
            font-family: sans-serif; transition: 0.3s; position: relative;
        }
        #weather-icon-box img { width: 18px !important; height: 18px !important; display: block; }
        #weather-temp { font-size: 11px !important; font-weight: bold; color: #ff5722; margin-left: 2px; }
        #weather-loc { display: none; }

        /* Overlay Popup */
        #weather-hub-modal {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 999999; justify-content: center; align-items: center;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
        }
        .hub-body {
            background: rgba(255,255,255,0.1); width: 90%; max-width: 360px;
            padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2);
            text-align: center; color: white; position: relative;
        }
        .forecast-row {
            display: flex; align-items: center; justify-content: space-between;
            background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 10px;
            margin-top: 8px; font-size: 14px;
        }
        .close-hub { position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 28px; }
    `;
    document.head.appendChild(style);

    const WeatherApp = {
        apiKey: "9c17c4095ee2a4042c26bbd4d4de1726",
        city: "Birgunj",

        init: function() {
            // Modal Structure
            const modal = document.createElement('div');
            modal.id = "weather-hub-modal";
            modal.innerHTML = `
                <div class="hub-body">
                    <span class="close-hub" id="close-weather">&times;</span>
                    <h2 id="hub-city-name">Loading...</h2>
                    <h1 id="hub-current-temp" style="font-size:3rem; color:#ff5722; margin:10px 0;">--°C</h1>
                    <div id="forecast-container"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Click Events
            const trigger = document.getElementById('weather-widget');
            if (trigger) trigger.onclick = () => this.openHub();
            document.getElementById('close-weather').onclick = () => { modal.style.display = 'none'; };

            this.loadWeather();
        },

        loadWeather: function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    p => this.fetchData(`lat=${p.coords.latitude}&lon=${p.coords.longitude}`),
                    () => this.fetchData(`q=${this.city}`)
                );
            } else { this.fetchData(`q=${this.city}`); }
        },

        fetchData: async function(query) {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${this.apiKey}&lang=ne`);
                const data = await res.json();
                
                document.getElementById('weather-temp').innerText = Math.round(data.main.temp) + "°";
                document.getElementById('weather-icon-box').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`;
                document.getElementById('hub-city-name').innerText = data.name;
                document.getElementById('hub-current-temp').innerText = Math.round(data.main.temp) + "°C";
            } catch (e) { console.log("Weather error"); }
        },

        openHub: async function() {
            document.getElementById('weather-hub-modal').style.display = 'flex';
            const city = document.getElementById('hub-city-name').innerText;
            const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}&lang=ne`);
            const data = await res.json();
            
            let html = '';
            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                const dayName = new Date(day.dt * 1000).toLocaleDateString('ne-NP', { weekday: 'long' });
                html += `<div class="forecast-row"><span>${dayName}</span><img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" width="30"><b>${Math.round(day.main.temp)}°C</b></div>`;
            }
            document.getElementById('forecast-container').innerHTML = html;
        }
    };

    window.addEventListener('load', () => WeatherApp.init());
})();
