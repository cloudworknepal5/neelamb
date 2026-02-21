/**
 * Birgunj News Tab Widget (Taja & Popular)
 * Multi-function logic included [2026-01-07]
 */
(function() {
    // १. विजेटको लागि रुट एलिमेन्ट सिर्जना गर्ने
    const rootId = 'birgunj-widget-root';
    if (!document.getElementById(rootId)) {
        document.write(`<div id="${rootId}"></div>`);
    }

    // २. CSS: डिजाइन र फ्लोटिङ सेटिङ
    const style = document.createElement('style');
    style.textContent = `
        #floating-wrapper {
            position: fixed;
            top: 150px;
            right: 15px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        .tabs-trigger { display: flex; gap: 8px; }
        .tab-btn {
            width: 55px; height: 55px;
            background: #bc1d22 !important;
            border-radius: 50% !important;
            border: 2px solid #fff !important;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white !important;
            font-size: 11px;
            font-weight: bold;
            transition: transform 0.2s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            text-align: center;
            line-height: 1.2;
            padding: 0;
        }
        .tab-btn:hover { transform: scale(1.1); }
        .tab-btn.active { background: #333 !important; }
        
        #news-content {
            width: 280px;
            background: #fff !important;
            border-radius: 12px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease-in-out;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        #news-content.show { max-height: 450px; border: 1px solid #ddd; }
        
        .content-area { overflow-y: auto; max-height: 400px; }
        .news-list { display: none; list-style: none; padding: 0; margin: 0; }
        .news-list.active { display: block; }
        
        .news-item { padding: 12px 15px; border-bottom: 1px solid #f0f0f0; }
        .news-item a { 
            text-decoration: none !important; 
            color: #222 !important; 
            font-size: 14px; 
            display: block; 
            line-height: 1.4; 
            font-weight: 500; 
        }
        .news-item a:hover { color: #bc1d22 !important; }
        .content-area::-webkit-scrollbar { width: 4px; }
        .content-area::-webkit-scrollbar-thumb { background: #bc1d22; border-radius: 10px; }
    `;
    document.head.appendChild(style);

    // ३. HTML Structure निर्माण
    const root = document.getElementById(rootId);
    root.innerHTML = `
        <div id="floating-wrapper">
            <div class="tabs-trigger">
                <button class="tab-btn" id="btn-taja">ताजा<br>खबर</button>
                <button class="tab-btn" id="btn-pop">धेरै<br>पढिएको</button>
            </div>
            <div id="news-content">
                <div class="content-area">
                    <div id="taja-list" class="news-list">लोडिङ ताजा समाचार...</div>
                    <div id="pop-list" class="news-list">लोडिङ लोकप्रिय समाचार...</div>
                </div>
            </div>
        </div>
    `;

    // ४. Multi-function Logic
    const content = document.getElementById('news-content');
    const tajaBtn = document.getElementById('btn-taja');
    const popBtn = document.getElementById('btn-pop');
    const tajaList = document.getElementById('taja-list');
    const popList = document.getElementById('pop-list');

    function toggle(type, btn) {
        const isActive = btn.classList.contains('active');
        [tajaBtn, popBtn].forEach(b => b.classList.remove('active'));
        [tajaList, popList].forEach(l => l.classList.remove('active'));
        
        if (!isActive) {
            btn.classList.add('active');
            content.classList.add('show');
            (type === 'taja' ? tajaList : popList).classList.add('active');
        } else {
            content.classList.remove('show');
        }
    }

    tajaBtn.onclick = () => toggle('taja', tajaBtn);
    popBtn.onclick = () => toggle('pop', popBtn);

    let tajaTitles = [];

    // JSONP Callbacks
    window.renderTaja = function(data) {
        let html = "";
        const entries = data.feed.entry || [];
        entries.forEach(e => {
            let t = e.title.$t; 
            tajaTitles.push(t);
            let l = e.link.find(x => x.rel==='alternate').href;
            html += `<div class="news-item"><a href="${l}" target="_parent">${t}</a></div>`;
        });
        tajaList.innerHTML = html || "समाचार भेटिएन।";
    };

    window.renderPop = function(data) {
        let html = "", count = 0;
        const entries = data.feed.entry || [];
        entries.forEach(e => {
            let t = e.title.$t;
            // ताजामा नभएका तर लोकप्रिय समाचार फिल्टर गर्ने
            if(!tajaTitles.includes(t) && count < 8) {
                let l = e.link.find(x => x.rel==='alternate').href;
                html += `<div class="news-item"><a href="${l}" target="_parent">${t}</a></div>`;
                count++;
            }
        });
        popList.innerHTML = html || "थप समाचार लोड हुँदैछ...";
    };

    // ५. फिड इन्जेक्सन
    function injectScript(url) {
        const s = document.createElement('script');
        s.src = url;
        document.body.appendChild(s);
    }

    // ताजा समाचार फिड
    injectScript("https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&max-results=10&callback=renderTaja");
    
    // लोकप्रियताको लागि फिड (समय ढिलो गरी ताकि ताजा टाइटल्स प्राप्त होस्)
    setTimeout(() => {
        injectScript("https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&orderby=updated&max-results=20&callback=renderPop");
    }, 1500);

})();
