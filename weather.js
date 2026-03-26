(function() {
    // १. CSS Styles: तपाइँको वेबसाइटको डिजाइनसँग मिल्ने गरी
    const css = `
        #weather-widget {
            width: 50px !important; height: 25px !important;
            display: flex !important; align-items: center !important;
            cursor: pointer; overflow: hidden; background: #000;
            border-radius: 4px; border: 1px solid #333; padding: 0 4px !important;
            font-family: sans-serif; transition: 0.3s;
        }
        #weather-widget:hover { border-color: #ff5722; transform: scale(1.05); }
        #weather-icon-box img { width: 18px; height: 18px; display: block; }
        #weather-temp { font-size: 10px !important; font-weight: bold; color: #ff5722; margin-left: 2px; }
        #weather-loc { display: none; } /* सानो विजेटमा लोकेसन लुकाइएको */

        /* Full Screen Pop-up Hub */
        #weather-hub {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 100000; justify-content: center; align-items: center; color: white;
            background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
        }
        #dynamic-bg-image {
            position: absolute; width: 100%; height: 100%; z-index: -1;
            background-size: cover; background-position: center; filter: brightness(0.4);
        }
        .hub-content {
            background: rgba(255,255,255,0.1); width: 90%; max-width: 360px;
            padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2);
            text-align: center; position: relative;
        }
        .forecast-row {
            display: flex; align-items: center; justify-content: space-between;
            background: rgba(255,255,255,0.05); padding: 10px; border-radius: 12px;
            margin-top: 10px; font-size: 14px;
        }
        .close-hub { position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 24px; }
    `;

    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    // २. पप-अप स्ट्रक्चर (body मा थप्ने)
    const hubHTML = `
        <div id="weather-hub">
            <div id="dynamic-bg-image"></div>
            <div class="hub-content">
                <span class="close-hub" onclick="document.getElementById('weather-hub').style.display='none'">&times;</span>
                <div id="hub-main-data">
                    <h2 id="hub-city" style="margin:0">लोकेसन...</h2>
                    <h1 id="hub-temp" style="font-size:3rem; margin:10px 0; color:#ff5722">--°C</h1>
                    <p id="hub-desc" style="text-transform:capitalize; opacity:0.8">Loading...</p>
                </div>
                <div id="forecast-render"></div>
            </div>
        </div>
    `;

    const WeatherApp = {
        apiKey: "9c17c4095ee2a4042c26bbd4d4de1726",
        city: "Birgunj",

        init: function() {
            // पप-अप थप्ने
            const div = document.createElement('div');
            div.innerHTML = hubHTML;
            document.body.appendChild(div);

            // तपाइँको HTML विजेटमा क्लिक इभेन्ट जोड्ने
            const trigger = document.getElementById('weather-widget');
            if(trigger) {
                trigger.onclick = () => this.openHub();
            }

            this.loadData();
        },

        loadData: function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    p => this.fetchWeather(`lat=${p.coords.latitude}&lon=${p.coords.longitude}`),
                    () => this.fetchWeather(`q=${this.city}`)
                );
            } else { this.fetchWeather(`q=${this.city}`); }
        },

        fetchWeather: async function(query) {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${this.apiKey}&lang=ne`);
                const data = await res.json();
                
                // वेबसाइटमा भएको HTML अपडेट गर्ने
                if(document.getElementById('weather-temp')) 
                    document.getElementById('weather-temp').innerText = Math.round(data.main.temp) + "°";
                
                if(document.getElementById('weather-icon-box'))
                    document.getElementById('weather-icon-box').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`;

                // पप-अप डाटा अपडेट गर्ने
                document.getElementById('hub-city').innerText = data.name;
                document.getElementById('hub-temp').innerText = Math.round(data.main.temp) + "°C";
                document.getElementById('hub-desc').innerText = data.weather[0].description;
                
                // मौसम अनुसार ब्याकग्राउन्ड इमेज
                const conditions = { "Clear": "sun", "Rain": "rain", "Clouds": "clouds" };
                const bg = data.weather[0].main;
                document.getElementById('dynamic-bg-image').style.backgroundImage = `url('https://source.unsplash.com/600x800/?weather,${conditions[bg] || 'sky'}')`;
            } catch (e) { console.error("Weather update failed"); }
        },

        openHub: async function() {
            document.getElementById('weather-hub').style.display = 'flex';
            const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&units=metric&appid=${this.apiKey}&lang=ne`);
            const data = await res.json();
            let html = '';
            for(let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                const dateName = new Date(day.dt * 1000).toLocaleDateString('ne-NP', {weekday: 'long'});
                html += `
                    <div class="forecast-row">
                        <span>${dateName}</span>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" width="30">
                        <span style="font-weight:bold">${Math.round(day.main.temp)}°C</span>
                    </div>`;
            }
            document.getElementById('forecast-render').innerHTML = html;
        }
    };

    // विन्डो लोड भएपछि रन गर्ने
    window.addEventListener('load', () => WeatherApp.init());
})();
