(function() {
    // १. CSS Styles Injection (अनावश्यक प्याडिङ हटाइएको)
    const css = `
        :root { --p-orange: #ff5722; --glass: rgba(0, 0, 0, 0.8); }
        #nb-weather-trigger {
            width: 50px; height: 25px; background: #000; color: #fff;
            border-radius: 3px; display: inline-flex; align-items: center; justify-content: center;
            border: 1px solid #333; cursor: pointer; transition: 0.3s;
            position: relative; overflow: hidden; font-family: sans-serif;
            margin: 0; padding: 0; z-index: 999;
        }
        #nb-weather-trigger:hover { border-color: var(--p-orange); transform: scale(1.05); }
        #small-icon { width: 16px; height: 16px; margin-right: 2px; }
        #small-icon img { width: 100%; height: auto; display: block; }
        #mini-temp { font-size: 10px; font-weight: bold; color: var(--p-orange); }

        /* Full Screen Hub */
        #weather-hub {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 100000; justify-content: center; align-items: center; color: white;
        }
        #dynamic-bg-image {
            position: absolute; width: 100%; height: 100%; z-index: -1;
            background-size: cover; background-position: center; filter: brightness(0.5);
        }
        .hub-content {
            background: var(--glass); backdrop-filter: blur(10px);
            width: 90%; max-width: 380px; padding: 20px; border-radius: 15px;
            text-align: center; border: 1px solid rgba(255,255,255,0.1); position: relative;
        }
        .forecast-row {
            display: flex; align-items: center; justify-content: space-between;
            background: rgba(255,255,255,0.05); padding: 8px 15px; border-radius: 10px;
            margin-top: 8px; font-size: 13px;
        }
        .close-hub { position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 20px; }
    `;

    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    // २. HTML Structure Creation
    const widgetHTML = `
        <div id="nb-weather-trigger">
            <div id="small-icon"><img src="" id="mini-img"></div>
            <span id="mini-temp">--°</span>
        </div>
        <div id="weather-hub">
            <div id="dynamic-bg-image"></div>
            <div class="hub-content">
                <span class="close-hub">&times;</span>
                <div id="hub-main-data">
                    <h2 id="hub-city" style="margin:0">Birgunj</h2>
                    <h1 id="hub-temp" style="font-size:3rem; margin:10px 0; color:#ff5722">--°C</h1>
                    <p id="hub-desc" style="text-transform:capitalize">Loading...</p>
                </div>
                <div id="forecast-render"></div>
            </div>
        </div>
    `;

    // ३. Widget Logic
    const WeatherApp = {
        apiKey: "9c17c4095ee2a4042c26bbd4d4de1726",
        city: "Birgunj",
        bgImages: {
            "Clear": "https://images.unsplash.com/photo-1599385073111-e126ac5e2e88?w=600",
            "Rain": "https://images.unsplash.com/photo-1502472304192-140b9c3f443b?w=600",
            "Clouds": "https://images.unsplash.com/photo-1610444648792-50d4f13456bb?w=600"
        },

        init: function() {
            const container = document.createElement("div");
            container.innerHTML = widgetHTML;
            // वेबसाइटको सबैभन्दा माथि राख्न (Prepending to body)
            document.body.prepend(container);

            this.bindEvents();
            this.loadData();
        },

        bindEvents: function() {
            document.getElementById('nb-weather-trigger').onclick = () => this.openHub();
            document.querySelector('.close-hub').onclick = () => this.closeHub();
        },

        loadData: async function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    p => this.fetchWeather(`lat=${p.coords.latitude}&lon=${p.coords.longitude}`),
                    () => this.fetchWeather(`q=${this.city}`)
                );
            } else {
                this.fetchWeather(`q=${this.city}`);
            }
        },

        fetchWeather: async function(query) {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${this.apiKey}&lang=ne`);
                const data = await res.json();
                
                document.getElementById('mini-temp').innerText = Math.round(data.main.temp) + "°";
                document.getElementById('mini-img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
                document.getElementById('hub-city').innerText = data.name;
                document.getElementById('hub-temp').innerText = Math.round(data.main.temp) + "°C";
                document.getElementById('hub-desc').innerText = data.weather[0].description;
                
                const condition = data.weather[0].main;
                document.getElementById('dynamic-bg-image').style.backgroundImage = `url('${this.bgImages[condition] || this.bgImages.Clouds}')`;
            } catch (e) { console.error("Weather Error", e); }
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
        },

        closeHub: function() { document.getElementById('weather-hub').style.display = 'none'; }
    };

    WeatherApp.init();
})();
