/**
 * Name: counter.js (Ultimate Fix v8.0)
 */
const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    toNepali: function(num) {
        return num.toString().split('').map(char => this.config.numMap[char] || char).join('');
    },

    updateAndFetch: async function(elementId) {
        const el = document.getElementById(elementId);
        const postId = window.location.pathname.replace(/[/.]/g, "_");
        const url = `${this.config.databaseURL}/views/${postId}.json`;
        const lastVisit = localStorage.getItem("v_" + postId);

        try {
            const res = await fetch(url);
            const data = await res.json();
            
            // डेटा शुद्धिकरण (यो सबैभन्दा महत्त्वपूर्ण छ)
            let count = 0;
            if (data !== null) {
                // यदि डाटा नम्बर होइन भने पनि त्यसलाई नम्बरमा बदल्ने
                count = (typeof data === 'number') ? data : parseInt(data) || 0;
            }

            if (!lastVisit) {
                count += 1;
                await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(count) // केवल शुद्ध नम्बर पठाउने
                });
                localStorage.setItem("v_" + postId, Date.now());
            }

            if (el) {
                const eyeIcon = `<svg style="width:16px; height:16px; margin-right:5px; fill:#ce1212; vertical-align:middle;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
                el.innerHTML = `${eyeIcon} <span>${this.toNepali(count)} पटक हेरियो</span>`;
            }
        } catch (e) { console.error(e); }
