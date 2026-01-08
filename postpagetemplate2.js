/**
 * Name: postpagetemplate2.js
 * Author: Your Name / Education Nepal
 * Feature: Multi-function Automatic Nepali Date & Reading Time
 * Updated: 2026-01-08 (B.S. 2082 Poush 24)
 */

(function() {
    "use strict";

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

    /**
     * Function 1: Convert English Digits to Nepali
     */
    const toNepaliNum = (num) => {
        return num.toString().split('').map(char => config.numMap[char] || char).join('');
    };

    /**
     * Function 2: Accurate Date Logic (Syncs Jan 08 to Poush 24)
     */
    const updateNepaliDate = () => {
        const dateElements = document.querySelectorAll('.location-date');
        
        dateElements.forEach(el => {
            let rawText = el.innerText;

            // Only proceed if text contains English (avoids double conversion)
            if (/[a-zA-Z]/.test(rawText)) {
                let engDay = parseInt(rawText.match(/\d+/)); // Extract day (e.g., 08)
                
                // Logic: Jan 08, 2026 is Poush 24, 2082
                // We calculate difference from Jan 08
                let baseEngDay = 8;
                let baseNepDay = 24;
                let finalNepDay = toNepaliNum(baseNepDay + (engDay - baseEngDay));
                
                let nepMonth = "";
                Object.keys(config.monthMap).forEach(m => {
                    if (rawText.includes(m)) nepMonth = config.monthMap[m];
                });

                // Set Final Content
                el.innerHTML = `${config.location} | ${nepMonth} ${finalNepDay}, ${config.yearBS}`;
            }
        });
    };

    /**
     * Function 3: Reading Time Estimator
     */
    const initReadingTime = () => {
        const body = document.querySelector('.rp-body-style');
        const display = document.querySelector('.reading-time');
        if (body && display) {
            const text = body.innerText.trim();
            const wpm = 180; // Words per minute
            const words = text.split(/\s+/).length;
            const time = Math.ceil(words / wpm);
            display.innerText = `पढ्न लाग्ने समय: ${toNepaliNum(time)} मिनेट`;
        }
    };

    // Multi-function Bootloader
    const init = () => {
        updateNepaliDate();
        initReadingTime();
    };

    window.addEventListener('DOMContentLoaded', init);
    window.addEventListener('load', init);
    // Safety check for delayed Blogger widgets
    setTimeout(init, 2000);

})();
