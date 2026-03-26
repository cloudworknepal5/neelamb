(function() {
    "use strict";

    // १. CSS: लेआउट र एनिमेसन
    const css = `
        #weather-widget {
            width: 50px !important; height: 25px !important;
            display: inline-flex !important; align-items: center !important;
            cursor: pointer; background: #000; border-radius: 4px;
            border: 1px solid #333; padding: 0 4px !important;
            font-family: sans-serif; transition: 0.3s;
        }
        #weather-icon-box img { width: 18px !important; height: 18px !important; }
        #weather-temp { font-size: 11px !important; font-weight: bold; color: #ff5722; margin-left: 2px; }
        
        /* Modal Popup: नयाँ ट्याब नखोली यही पेजमा देखिने */
        #weather-hub-overlay {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 999999; justify-content: center; align-items: center;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        #hub-bg-img {
            position: absolute; width: 100%; height: 100%; z-index: -1;
            background-size: cover; background-position: center; filter: brightness(0.4);
        }
        .hub-card {
            background: rgba(255,255,255,0.1); width: 90%; max-width: 360px;
            padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2);
            text-align: center; color: white; position: relative;
        }
        .forecast-item {
            display: flex; align-items: center; justify-content: space-between;
            background: rgba(255,255,255,0.05); padding: 10px; border-radius: 12px;
            margin-top: 8px; font-size: 14px;
        }
        .hub-close { position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 28px; color: #fff; }
    `;

    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    // २. HTML Structure (Overlay/Modal)
    const modalHTML = `
        <div id="weather-hub-overlay">
            <div id="hub-bg-img"></div>
            <div class="hub-card">
                <span class="hub-close" id="close-weather">&times;</span>
                <h2 id="hub-city-name">Birgunj</h2>
                <h1 id="hub-current-temp" style="font-size:3rem; color:#ff5722; margin:10px 0;">--°C</h1>
                <p id="hub-weather-desc" style="text-transform:capitalize; opacity:0.8;">Loading...</p>
                <div id="forecast-container"></div>
            </div>
        </div>
    `;

    const WeatherApp = {
        apiKey: "9c17c4095ee2a4042c26bbd4d4de1726",
        city: "Birgunj",

        init: function() {
            // पप-अप मोडलाई बडीमा जोड्ने
            const div = document.createElement('div');
            div.innerHTML = modalHTML;
            document.body.appendChild(div);

            // इभेन्टहरू बाइन्ड गर्ने
            const trigger = document.getElementById('weather-widget');
            if (trigger) { trigger.onclick = (e) => { e.preventDefault(); this.openModal(); }; }
            document.getElementById('close-weather').onclick = () => { document.getElementById('weather-hub-overlay').style.display = 'none'; };

            this.fetchCurrent();
        },

        fetchCurrent: async function() {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}&lang=ne`);
                const data = await res.json();
                
                // विजेट अपडेट
                if(document.getElementById('weather-temp')) document.getElementById('weather-temp').innerText = Math.round(data.main.temp) + "°";
                if(document.getElementById('weather-icon-box')) document.getElementById('weather-icon-box').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`;

                // पप-अप डाटा अपडेट
                document.getElementById('hub-city-name').innerText = data.name;
                document.getElementById('hub-current-temp').innerText = Math.round(data.main.temp) + "°C";
                document.getElementById('hub-weather-desc').innerText = data.weather[0].description;
                
                // ब्याकग्राउन्ड (Unsplash बाट मौसम अनुसार)
                const bgType = data.weather[0].main.toLowerCase();
                document.getElementById('hub-bg-img').style.backgroundImage = `url('https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800')`;
            } catch (e) { console.error("Weather failed"); }
        },

        openModal: async function() {
            document.getElementById('weather-hub-overlay').style.display = 'flex';
            const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&units=metric&appid=${this.apiKey}&lang=ne`);
            const data = await res.json();
            
            let html = '';
            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                const dayName = new Date(day.dt * 1000).toLocaleDateString('ne-NP', { weekday: 'long' });
                html += `
                    <div class="forecast-item">
                        <span>${dayName}</span>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" width="30">
                        <span style="font-weight:bold">${Math.round(day.main.temp)}°C</span>
                    </div>`;
            }
            document.getElementById('forecast-container').innerHTML = html;
        }
    };

    window.addEventListener('load', () => WeatherApp.init());
})();
