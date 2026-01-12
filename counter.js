/**
 * Name: counter.js (Final Fix for Loading Issue)
 * Features: Multi-function, Refresh Guard, Error Handling
 */
const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    // नेपाली अंकमा बदल्ने फङ्सन
    toNepali: function(num) {
        let n = parseInt(num) || 0;
        return n.toString().split('').map(char => this.config.numMap[char] || char).join('');
    },

    updateAndFetch: async function(elementId) {
        const el = document.getElementById(elementId);
        const postId = window.location.pathname.replace(/[/.]/g, "_");
        const url = `${this.config.databaseURL}/views/${postId}.json`;
        const hasVisited = sessionStorage.getItem("v_" + postId);

        try {
            // १. डेटाबेसबाट डेटा तान्ने
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network Error');
            
            let count = await response.json();
            count = (count === null || typeof count !== 'number') ? 0 : count;

            // २. नयाँ भिजिटर भएमा १ थप्ने
            if (!hasVisited) {
                count += 1;
                await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(count)
                });
                sessionStorage.setItem("v_" + postId, "true");
            }

            // ३. डिस्प्ले गर्ने
            if (el) {
                const nepNum = this.toNepali(count);
                el.innerHTML = `<span style="display:flex; align-items:center; gap:5px; color:#ce1212; font-weight:bold;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    ${nepNum} पटक हेरियो</span>`;
            }
        } catch (error) {
            console.error("Counter Error:", error);
            if (el) el.innerHTML = "० पटक हेरियो"; // एरर आएमा ० देखाउने
        }
    }
};

// पेज लोड भएपछि चलाउने
document.addEventListener("DOMContentLoaded", function() {
    BloggerCounter.updateAndFetch("visitor-count");
});
