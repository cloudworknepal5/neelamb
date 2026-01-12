/**
 * Advanced Multi-function Visitor Counter
 * Developed for Blogger & Hosted on GitHub
 */

const BloggerCounter = {
    // १. कन्फिगरेशन सेट गर्ने (तपाईँको Firebase Details यहाँ राख्नुहोस्)
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com"
    },

    // २. युनिक आईडी बनाउने फङ्सन (Post URL बाट)
    getPostId: function() {
        return window.location.pathname.replace(/[/.]/g, "_");
    },

    // ३. भिजिटर संख्या बढाउने र ल्याउने (Main Function)
    updateAndFetch: async function(elementId) {
        const postId = this.getPostId();
        const url = `${this.config.databaseURL}/views/${postId}.json`;

        try {
            // कति भ्युज छ भनेर हेर्ने
            const response = await fetch(url);
            let count = await response.json();
            
            // यदि नयाँ पोस्ट हो भने ० बाट सुरु गर्ने, नत्र १ थप्ने
            count = (count === null) ? 1 : count + 1;

            // नयाँ संख्या डेटाबेसमा अपडेट गर्ने
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(count)
            });

            // स्क्रिनमा देखाउने
            this.display(elementId, count);
        } catch (error) {
            console.error("Counter Error:", error);
        }
    },

    // ४. डिस्प्ले गर्ने फङ्सन
    display: function(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = `<span>${value} पटक हेरियो</span>`;
        }
    }
};
