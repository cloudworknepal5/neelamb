/**
 * Birgunj EU FM Multi-function Player
 * Height: 90px | Responsive | Auto News Ticker
 */
(function() {
    var playerHTML = `
    <div id="bj-container" style="width: 100%; max-width: 790px; height: 90px; margin: 10px auto; background: radial-gradient(circle at center, #1b2735 0%, #090a0f 100%); border-radius: 12px; box-shadow: 0 0 25px rgba(0,210,255,0.6); font-family: 'Segoe UI', Arial, sans-serif; overflow: hidden; border: 2px solid #00d2ff; position: relative; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box; color: #fff;">
        
        <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; display: flex; justify-content: space-around; align-items: flex-end; opacity: 0.1; pointer-events: none;">
            <div class="bj-bar" style="width:5px; background:#00d2ff; height: 10%; animation: bjWave 0.8s infinite alternate; animation-play-state: paused;"></div>
            <div class="bj-bar" style="width:5px; background:#ff0080; height: 10%; animation: bjWave 1.2s infinite alternate; animation-delay: 0.2s; animation-play-state: paused;"></div>
            <div class="bj-bar" style="width:5px; background:#00ff87; height: 10%; animation: bjWave 0.7s infinite alternate; animation-delay: 0.4s; animation-play-state: paused;"></div>
            <div class="bj-bar" style="width:5px; background:#ff8c00; height: 10%; animation: bjWave 1.1s infinite alternate; animation-delay: 0.6s; animation-play-state: paused;"></div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; flex-shrink: 0; width: 80px; line-height: 1;">
            <div style="color: #fff; font-size: 10px; font-weight: 900; text-shadow: 0 0 5px #00d2ff; margin-bottom: 2px;">BIRGUNJ</div>
            <div id="bj-logo" style="width: 42px; height: 42px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px #00d2ff; overflow: hidden; animation: bjRotate 5s linear infinite; animation-play-state: paused;">
                <img src="https://blogger.googleusercontent.com/img/a/AVvXsEiBnC4hcDiMC18QrERnMrE8HTsMkzJDQqBmgeGvMpw_MA8NcKTPX3jUdY-byqu7K7iXUR9uByo0VBeiYdx5UXPJQHoslvzt6z-EprS-I-bg-L-w9hC_n2AUfIXuq5Nr5R1jZF5txT9r3_g5zq6FE1O8KcpaTVzrrhTWEIFv2PsjwJTSuLyHWRcjtzKRLnI=s100" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div id="bj-status" style="color: #00ff87; font-size: 9px; font-weight: 900; margin-top: 2px;">EU FM</div>
        </div>

        <div style="flex: 1; margin: 0 10px; z-index: 5; display: flex; flex-direction: column; gap: 4px; overflow: hidden;">
            <div style="background: rgba(0, 0, 0, 0.4); border-radius: 4px; padding: 4px 8px; border: 1px solid rgba(0,210,255,0.2);">
                <marquee id="bj-marquee" onmouseover="this.stop();" onmouseout="this.start();" scrollamount="4" style="color: #00ff87; font-size: 12px; font-weight: bold; display: block;">
                    <span id="bj-ticker-content">ताजा हेडलाइन लोड हुँदैछ...</span>
                </marquee>
            </div>
            <div style="background: rgba(255, 234, 0, 0.05); border-radius: 4px; padding: 2px 8px; border: 1px dashed rgba(255, 234, 0, 0.3);">
                <marquee scrollamount="3" style="color: #ffea00; font-size: 10px; font-weight: bold; display: block;">
                    ✨ विज्ञापन: बिरगंज इन्टरटेन्मेन्टमा स्वागत छ! सम्पर्क: 98XXXXXXXX ✨
                </marquee>
            </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 5; flex-shrink: 0;">
            <div style="display: flex; gap: 6px;">
                <button id="bj-fm-btn" style="width: 38px; height: 38px; border-radius: 50%; border: none; background: #00d2ff; color: #000; cursor: pointer; font-size: 18px; box-shadow: 0 0 10px #00d2ff; display: flex; align-items: center; justify-content: center;">🎵</button>
                <button id="bj-news-btn" style="width: 38px; height: 38px; border-radius: 50%; border: none; background: #27ae60; color: white; cursor: pointer; font-size: 18px; box-shadow: 0 0 10px #27ae60; display: flex; align-items: center; justify-content: center;">🎙️</button>
            </div>
            <div style="display: flex; align-items: center; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
                <span style="font-size: 10px; color: white; margin-right: 4px;">🔊</span>
                <input type="range" id="bj-vol" min="0" max="1" step="0.1" value="1" style="width: 50px; cursor: pointer; accent-color: #00ff87; height: 4px;" />
            </div>
        </div>

        <audio id="bj-audio"></audio>

        <style>
            @keyframes bjRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes bjWave { 0% { height: 10%; } 100% { height: 90%; } }
            #bj-ticker-content a { color: #00ff87; text-decoration: none; font-weight: bold; }
            #bj-vol { -webkit-appearance: none; background: rgba(255,255,255,0.3); border-radius: 5px; }
            @media (max-width: 480px) {
                #bj-container div[style*="width: 80px"] { width: 60px !important; }
                #bj-logo { width: 35px !important; height: 35px !important; }
                button { width: 34px !important; height: 34px !important; font-size: 16px !important; }
                #bj-vol { width: 40px !important; }
            }
        </style>
    </div>
    `;

    // Inject HTML into the page
    document.write(playerHTML);

    // Initializing Elements
    var audio = document.getElementById('bj-audio');
    var logo = document.getElementById('bj-logo');
    var bars = document.querySelectorAll('.bj-bar');
    var fmBtn = document.getElementById('bj-fm-btn');
    var newsBtn = document.getElementById('bj-news-btn');
    var statusText = document.getElementById('bj-status');
    var volRange = document.getElementById('bj-vol');
    var mode = '';

    // News Ticker Handler
    window.ticker_headlines = function(json) {
        var html = "";
        if (json.feed.entry) {
            for (var i = 0; i < json.feed.entry.length; i++) {
                var entry = json.feed.entry[i];
                var title = entry.title.$t;
                var url = "";
                for (var j = 0; j < entry.link.length; j++) {
                    if (entry.link[j].rel == 'alternate') { url = entry.link[j].href; break; }
                }
                html += "<span> &nbsp; • &nbsp; <a href='" + url + "'>" + title + "</a></span>";
            }
            document.getElementById("bj-ticker-content").innerHTML = html;
        }
    };

    // Play/Pause Function
    function toggle(type) {
        var links = {
            fm: "https://stream-151.zeno.fm/tdfnrjbmb8gtv",
            news: "https://educationnepal.eu.org/todaynews.mp3"
        };

        if (mode === type && !audio.paused) {
            audio.pause();
            statusText.innerText = "EU FM";
            logo.style.animationPlayState = 'paused';
            bars.forEach(b => b.style.animationPlayState = 'paused');
            mode = '';
        } else {
            audio.src = links[type];
            audio.play();
            mode = type;
            statusText.innerText = (type === 'fm') ? "LIVE FM" : "LIVE NEWS";
            logo.style.animationPlayState = 'running';
            bars.forEach(b => b.style.animationPlayState = 'running');
        }
        fmBtn.innerHTML = (mode === 'fm' && !audio.paused) ? "⏸" : "🎵";
        newsBtn.innerHTML = (mode === 'news' && !audio.paused) ? "⏸" : "🎙️";
    }

    // Event Listeners
    fmBtn.onclick = function() { toggle('fm'); };
    newsBtn.onclick = function() { toggle('news'); };
    volRange.oninput = function() { audio.volume = this.value; };

    // Load Blogger Feed
    (function() {
        var s = document.createElement('script');
        s.src = 'https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&callback=ticker_headlines&max-results=8';
        document.body.appendChild(s);
    })();
})();
