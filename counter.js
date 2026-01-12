/**
 * Advanced Multi-function Visitor Counter for Education Nepal
 * Features: 
 * 1. Firebase Integration
 * 2. Automatic Nepali Digit Conversion
 * 3. SVG Eye Icon Support
 * 4. Unique ID per Post URL
 */

const BloggerCounter = {
    // १. कन्फिगरेशन
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    // २. अङ्ग्रेजी अंकलाई नेपालीमा बदल्ने फङ्सन (Multi-function Helper)
    toNepali: function(num) {
        return num.toString().split('').map(char => this.config.numMap[char] || char).join('');
    },

    // ३. पोस्टको URL बाट युनिक आईडी निकाल्ने फङ्सन
    getPostId: function() {
        return window.location.pathname.replace(/[/.]/g, "_");
    },

    // ४. भ्युज बढाउने र डेटा ल्याउने मुख्य फङ्सन
    updateAndFetch: async function(elementId) {
        const postId = this.getPostId();
        const url = `${this.config.databaseURL}/views/${postId}.json`;

        try {
            // डेटाबेसबाट पुरानो भ्युज ल्याउने
            const response = await fetch(url);
            const data = await response.json();
            
            // डेटा चेक गर्ने र संख्या निकाल्ने
            let currentCount = 0;
            if (data !== null) {
                currentCount = (typeof data === 'object') ? (data.value || 0) : parseInt(data);
            }

            // एक भ्यु बढाउने
            let newCount = currentCount + 1;

            // डेटाबेसमा नयाँ संख्या अपडेट गर्ने
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(newCount)
            });

            // स्क्रिनमा देखाउने
            this.display(elementId, newCount);
        } catch (error) {
            console.error("Counter Error:", error);
        }
    },

    // ५. आइकनसहितको डिस्प्ले फङ्सन
    display: function(id, value) {
        const el = document.getElementById(id);
        if (el) {
            const nepaliValue = this.toNepali(value);
            // सुन्दर SVG Eye Icon
            const eyeIcon = `<svg style="width:16px; height:16px; margin-right:6px; fill:#ce1212; vertical-align:middle;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
            
            el.innerHTML = `${eyeIcon} <span style="font-weight:700;">${nepaliValue} पटक हेरियो</span>`;
        }
    }
};
