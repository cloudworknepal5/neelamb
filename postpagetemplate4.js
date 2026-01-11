/**
 * Name: postpagetemplate2.js
 * Features: 
 * 1. English to Nepali Date (Accurate 2082 Poush 24)
 * 2. Reading Time Calculation (Word Counter)
 * 3. English to Nepali Digit Converter
 * 4. Dynamic Facebook Open Graph (OG) Tag Generator
 */

(function() {
    "use strict";

    // configuration र Map हरू
    const config = {
        location: "काठमाडौँ",
        yearBS: "२०८२",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        monthMap: {
            'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
            'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
            'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
        }
    };

    // Helper: अंक परिवर्तन गर्ने Function
    const toNepaliNum = (num) => {
        return num.toString().split('').map(char => config.numMap[char] || char).join('');
    };

    // १. मिति परिवर्तन गर्ने मुख्य फङ्सन (Date Engine)
    const updateNepaliDate = () => {
        const dateElements = document.querySelectorAll('.location-date');
        dateElements.forEach(el => {
            let rawText = el.innerText;
            if (/[a-zA-Z]/.test(rawText)) {
                let engDayMatch = rawText.match(/\d+/);
                if (engDayMatch) {
                    let engDay = parseInt(engDayMatch[0]);
                    let baseEngDay = 8;
                    let baseNepDay = 24;
                    let calculatedDay = baseNepDay + (engDay - baseEngDay);
                    let finalNepDay = toNepaliNum(calculatedDay);
                    let nepMonth = "";
                    Object.keys(config.monthMap).forEach(m => {
                        if (rawText.includes(m)) nepMonth = config.monthMap[m];
                    });
                    el.innerHTML = `${config.location} | ${nepMonth} ${finalNepDay}, ${config.yearBS}`;
                }
            }
        });
    };

    // २. पढ्न लाग्ने समय गणना गर्ने (Reading Time)
    const initReadingTime = () => {
        const postBody = document.querySelector('.post-body, .rp-body-style');
        const timeDisplay = document.querySelector('.reading-time');
        if (postBody && timeDisplay) {
            const text = postBody.innerText.trim();
            const wordCount = text.split(/\s+/).length;
            const wordsPerMinute = 150;
            const minutes = Math.ceil(wordCount / wordsPerMinute);
            timeDisplay.innerText = `पढ्न लाग्ने समय: ${toNepaliNum(minutes)} मिनेट`;
        }
    };

    // ३. Facebook Open Graph (OG) Manager
    const setupOpenGraph = () => {
        const postTitle = document.title;
        const postUrl = window.location.href;
        // First paragraph as description, or fallback text
        const postDesc = document.querySelector('.post-body p')?.innerText.substring(0, 160) || "नेपाली समाचार र जानकारी";
        const postImg = document.querySelector('.post-body img')?.src || "";

        const ogTags = {
            'og:title': postTitle,
            'og:type': 'article',
            'og:url': postUrl,
            'og:description': postDesc,
            'og:image': postImg,
            'og:site_name': 'Your Site Name'
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            if (!content) return;
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.getElementsByTagName('head')[0].appendChild(meta);
            }
            meta.setAttribute('content', content);
        });
    };

    // सबै कार्यहरू एकैसाथ सुरु गर्ने (Execution)
    const runAll = () => {
        updateNepaliDate();
        initReadingTime();
        setupOpenGraph();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAll);
    } else {
        runAll();
    }
    window.addEventListener('load', runAll);
    setTimeout(runAll, 2000);

})();
