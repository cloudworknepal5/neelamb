/**
 * Name: counter.js (The Perfect Refresh Fix)
 * Version: 12.0
 */

const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    // १. नेपाली अंकमा बदल्ने फङ्सन (Multi-function Helper)
    toNepali: function(num) {
        let n = parseInt(num) || 0;
        return n.toString().split('').map(char => this.config.numMap[char] || char).join('');
    },

    // २. मुख्य फङ्सन: डाटा ल्याउने र अपडेट गर्ने
    updateAndFetch: async function(elementId) {
        const el = document.getElementById(elementId);
        const postId = window.location.pathname.replace(/[/.]/g, "_");
        const url = `${this.config.databaseURL}/views/${postId}.json`;
        
        // सेसन चेक (रिफ्रेस गर्दा डाटाबेसमा संख्या नबढोस् भन्नका लागि)
        const hasVisited = sessionStorage.getItem("v_" + postId);

        try {
            // क) पहिले डाटाबेसबाट हालको डाटा तान्ने (यसले रिफ्रेस गर्दा ० देखिन दिँदैन)
            const response = await fetch(url);
            let count = await response.json();

            // डाटा शुद्धिकरण (यदि डाटाबेस खाली छ वा गलत छ भने ० मान्ने)
            if (count === null || typeof count !== 'number') {
                count = 0;
            }

            // ख) यदि यो नयाँ सेसन हो भने मात्र संख्या १ ले बढाउने
            if (!hasVisited) {
                count += 1;
                await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(count)
                });
                sessionStorage.setItem("v_" + postId, "true");
            }

            // ग) आइकनसहित सही संख्या प्रदर्शन गर्ने
            if (el) {
                const eyeIcon = `<svg style="width:18px; height:18px; margin-right:6px; fill:#ce1212; vertical-align:middle;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
                el.innerHTML = `${eyeIcon} <span style="font-weight:700;">${this.toNepali(count)} पटक हेरियो</span>`;
            }
        } catch (error) {
            console.error("Counter Error:", error);
            if (el) el.innerHTML = "० पटक हेरियो";
        }
    }
};
