/**
 * NeelamB Smart Weather Widget v5.0
 * Optimized for: Janawaaz Khabar & Education Nepal
 * Features: Auto-location, 5-Day Forecast, Animated BG, Hover Zoom
 */

(function() {
    "use strict";

    // १. CSS Styles (Zero Padding & Smooth Animations)
    const css = `
        #weather-widget {
            width: 50px !important; height: 25px !important;
            display: flex !important; align-items: center !important;
            cursor: pointer; overflow: hidden; background: #000;
            border-radius: 4px; border: 1px solid #333; padding: 0 4px !important;
            font-family: 'Segoe UI', Roboto, sans-serif; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative; z-index: 10;
        }
        #weather-widget:hover { border-color: #ff5722; transform: scale(1.1); box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        #weather-icon-box img { width: 18px !important; height: 18px !important; display: block; }
        #weather-temp { font-size: 11px !important; font-weight: bold; color: #ff5722; margin-left: 2px; line-height: 1; }
        #weather-loc { display: none; } 

        /* Full Screen Pop-up Hub */
        #weather-hub {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 999999; justify-content: center; align-items: center; color: white;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        #dynamic-bg-image {
            position: absolute; width: 100%; height: 100%; z-index: -1;
            background-size: cover; background-position: center; filter: brightness(0.5);
            transition: background-image 1s ease-in-out;
        }
        .hub-content {
            background: rgba(255,255,255,0.1); width: 90%; max-width: 380px;
            padding: 30px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2);
            text-align: center; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .hub-main h1 { font-size: 3.5rem; margin: 10px 0; color: #ff5722; }
        .hub-main h2 { font-size: 1.5rem; margin: 0; font-weight: 400; }
        .forecast-list { margin-top: 25px; display: flex; flex-direction: column; gap: 8px; }
        .forecast-row {
            display: flex; align-items: center; justify-content: space-between;
            background: rgba(255,255,255,0.08); padding: 10px 15px; border-radius: 12px;
            font-size: 14px; transition: 0.3s;
        }
        .forecast-row:hover { background: rgba(255,255,255,0.15); }
        .close-hub { position: absolute; top: 15px; right: 20px; cursor: pointer; font-size: 28px; opacity: 0.7; }
        .close-hub:hover { opacity: 1; color: #ff5722; }
    `;

    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    // २. Pop-up HTML Structure
    const hubHTML = `
        <div id="weather-hub">
            <div id="dynamic-bg-image"></div>
            <div class="hub-content">
                <span class="close-hub" onclick="document.getElementById('weather-hub').style.display='none'">&times;</span>
                <div class="hub-main">
                    <h2 id="hub-city">Birgunj</h2>
                    <h1 id="hub-temp">--°C</h1>
                    <p id="hub-desc" style="text-transform:capitalize; opacity:0.8;">Loading...</p>
                </div>
                <div class="forecast-list" id="forecast-render"></div>
            </div>
        </div>
    `;

    const WeatherApp = {
        apiKey: "9c17c4095ee2a4042c26bbd4d4de1726",
        defaultCity: "Birgunj",
        // मौसम अनुसारका ब्याकग्राउन्ड इमेजहरू
        bgMap: {
            "Clear": "https://images.unsplash.com/photo-1599385073111-e126ac5e2e88?w=800",
            "Rain": "https://images.unsplash.com/photo-1502472304192-140b9c3f443b?w=800",
            "Clouds": "https://images.unsplash.com/photo-1610444648792-50d4f13456bb?w=800",
            "Snow": "https://images.unsplash.com/photo-1547754980-3df97fed72a8?w=800"
        },

        init: function() {
            // पप-अप हबलाई body मा थप्ने
            const div = document.createElement('div');
            div.innerHTML = hubHTML;
            document.body.appendChild(div);

            // विजेटमा क्लिक इभेन्ट जोड्ने
            const trigger = document.getElementById('weather-widget');
            if (trigger) {
                trigger.onclick = () => this.openHub();
            }

            this.getLocation();
        },

        getLocation: function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    p => this.fetchData(`lat=${p.coords.latitude}&lon=${p.coords.longitude}`),
                    () => this.fetchData(`q=${this.defaultCity}`)
                );
            } else {
                this.fetchData(`q=${this.defaultCity}`);
            }
        },

        fetchData: async function(query) {
            try {
                // हालको मौसम
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${this.apiKey}&lang=ne`);
                const data = await res.json();
                this.updateUI(data);
            } catch (e) {
                console.error("Weather App: Error fetching data.");
            }
        },

        updateUI: function(data) {
            const temp = Math.round(data.main.temp);
            const icon = data.weather[0].icon;
            const condition = data.weather[0].main;

            // १. सानो विजेट अपडेट
            const tempEl = document.getElementById('weather-temp');
            const iconEl = document.getElementById('weather-icon-box');
            if (tempEl) tempEl.innerText = temp + "°";
            if (iconEl) iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png">`;

            // २. पप-अप हब अपडेट
            document.getElementById('hub-city').innerText = data.name;
            document.getElementById('hub-temp').innerText = temp + "°C";
            document.getElementById('hub-desc').innerText = data.weather[0].description;
            
            // ३. ब्याकग्राउन्ड इमेज परिवर्तन
            const bgUrl = this.bgMap[condition] || this.bgMap["Clouds"];
            document.getElementById('dynamic-bg-image').style.backgroundImage = `url('${bgUrl}')`;
        },

        openHub: async function() {
            const hub = document.getElementById('weather-hub');
            hub.style.display = 'flex';
            
            const city = document.getElementById('hub-city').innerText;
            const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}&lang=ne`);
            const data = await res.json();
            
            let html = '';
            // ५ दिनको रिपोर्ट (हरेक २४ घण्टाको डाटा निकाल्न ८ को स्टेप)
            for (let i = 0; i < data.list.length; i += 8) {
                const dayData = data.list[i];
                const date = new Date(dayData.dt * 1000);
                const dayName = date.toLocaleDateString('ne-NP', { weekday: 'long' });
                
                html += `
                    <div class="forecast-row">
                        <span style="font-weight:500">${dayName}</span>
                        <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" width="35">
                        <span style="font-weight:bold">${Math.round(dayData.main.temp)}°C</span>
                    </div>`;
            }
            document.getElementById('forecast-render').innerHTML = html;
        }
    };

    // लोडिङ म्यानेजमेन्ट
    if (document.readyState === "complete" || document.readyState === "interactive") {
        WeatherApp.init();
    } else {
        window.addEventListener('DOMContentLoaded', () => WeatherApp.init());
    }
})();
