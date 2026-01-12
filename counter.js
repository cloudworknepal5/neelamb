/**
 * Advanced Multi-function Visitor Counter
 * Fix: [object Object] error resolved & Nepali Digit integration
 */

const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    // १. नेपाली अंकमा बदल्ने Function
    toNepali: function(num) {
        return num.toString().split('').map(char => this.config.numMap[char] || char).join('');
    },

    getPostId: function() {
        return window.location.pathname.replace(/[/.]/g, "_");
    },

    updateAndFetch: async function(elementId) {
        const postId = this.getPostId();
        const url = `${this.config.databaseURL}/views/${postId}.json`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            // डेटा 'Object' छ कि छैन चेक गर्ने र संख्या निकाल्ने
            let currentCount = 0;
            if (data !== null) {
                currentCount = (typeof data === 'object') ? (data.value || 0) : parseInt(data);
            }

            let newCount = currentCount + 1;

            // Firebase मा संख्या मात्र पठाउने (Object होइन)
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(newCount)
            });

            this.display(elementId, newCount);
        } catch (error) {
            console.error("Counter Error:", error);
        }
    },

    display: function(id, value) {
        const el = document.getElementById(id);
        if (el) {
            // नेपाली अंकमा कन्भर्ट गरेर देखाउने
            const nepaliValue = this.toNepali(value);
            el.innerHTML = `<span>${nepaliValue} पटक हेरियो</span>`;
        }
    }
};

// पेज लोड हुँदा रन गर्ने
document.addEventListener("DOMContentLoaded", function() {
    BloggerCounter.updateAndFetch("post-view-count");
});
