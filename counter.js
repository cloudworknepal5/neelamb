/**
 * Advanced Multi-function Visitor Counter for Education Nepal
 * Features: Nepali Digit, SVG Eye Icon, Firebase Integration
 */

const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    // १. अंक परिवर्तन गर्ने फङ्सन
    toNepali: function(num) {
        return num.toString().split('').map(char => this.config.numMap[char] || char).join('');
    },

    // २. पोस्ट चिन्नका लागि आईडी बनाउने फङ्सन
    getPostId: function() {
        return window.location.pathname.replace(/[/.]/g, "_");
    },

    // ३. मुख्य अपडेट र डेटा ल्याउने फङ्सन
    updateAndFetch: async function(elementId) {
        const postId = this.getPostId();
        const url = `${this.config.databaseURL}/views/${postId}.json`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            // डेटा शुद्धिकरण (Object बाट Number मा)
            let currentCount = 0;
            if (data !== null) {
                currentCount = (typeof data === 'object') ? (data.value || 0) : parseInt(data);
            }

            let newCount = currentCount + 1;

            // डेटाबेसमा सुरक्षित गर्ने
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(newCount)
            });

            this.display(elementId, newCount);
        } catch (error) {
            console.error("Counter Error:", error);
        }
    },

    // ४. डिस्प्ले फङ्सन (Icon र Style सहित)
    display: function(id, value) {
        const el = document.getElementById(id);
        if (el) {
            const nepaliValue = this.toNepali(value);
            // SVG Eye Icon (रातो रङमा)
            const eyeIcon = `<svg style="width:16px; height:16px; margin-right:6px; fill:#ce1212; vertical-align:middle;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
            
            el.innerHTML = `${eyeIcon} <span style="font-weight:700; color:#444;">${nepaliValue} पटक हेरियो</span>`;
        }
    }
};
