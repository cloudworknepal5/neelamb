const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

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
            
            let currentCount = (data === null) ? 0 : (typeof data === 'object' ? (data.value || 0) : parseInt(data));
            let newCount = currentCount + 1;

            await fetch(url, { method: 'PUT', body: JSON.stringify(newCount) });
            this.display(elementId, newCount);
        } catch (error) { console.error("Counter Error:", error); }
    },

    display: function(id, value) {
        const el = document.getElementById(id);
        if (el) {
            const nepaliValue = this.toNepali(value);
            const eyeIcon = `<svg style="width:18px; height:18px; vertical-align:middle; margin-right:5px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            el.innerHTML = `${eyeIcon} <span>${nepaliValue} पटक हेरियो</span>`;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => BloggerCounter.updateAndFetch("post-view-count"));
