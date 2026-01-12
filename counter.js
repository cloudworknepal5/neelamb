/**
 * counter.js - Multi-function Universal Fix
 */
const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

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
            // १. डेटाबेसबाट हालको डेटा तान्ने
            const response = await fetch(url);
            let count = await response.json();
            
            // यदि डाटाबेस खाली छ भने ० मान्ने
            count = (count === null || typeof count !== 'number') ? 0 : count;

            // २. यदि नयाँ सेसन हो भने मात्र १ थप्ने
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
                el.innerHTML = `<i class="fa fa-eye"></i> ${this.toNepali(count)} पटक हेरियो`;
            }
        } catch (e) { 
            console.error("Firebase Error:", e);
        }
    }
};

// तत्काल सुरु गर्ने
document.addEventListener("DOMContentLoaded", function() {
    BloggerCounter.updateAndFetch("visitor-count");
});
