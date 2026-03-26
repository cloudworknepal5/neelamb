/**
 * Firebase Post View Counter v1.0
 * Features: 
 * 1. Real-time Firebase Sync
 * 2. Session-based unique view counting
 * 3. Support for Nepali Number formatting (Multi-function)
 */

const PostCounter = {
    config: {
        // तपाईँको फायरबेस URL यहाँ छ
        databaseURL: "https://counter-3ff08-default-rtdb.asia-southeast1.firebasedatabase.app",
        // अंकलाई नेपालीमा बदल्न प्रयोग गरिने म्याप
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    /**
     * नम्बरलाई नेपाली फन्टमा परिवर्तन गर्ने फङ्सन
     */
    convertToNepali: function(n) {
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    /**
     * भ्यु काउन्टर सुरु गर्ने मुख्य फङ्सन
     */
    init: async function() {
        const displayElement = document.getElementById("visitor-count");
        if (!displayElement) return;

        // URL बाट विशेष ID निकाल्ने (Blogger Post Path)
        const pathId = window.location.pathname.replace(/[\/\.#\$\[\]]/g, "_") || "home";
        
        try {
            const apiURL = `${this.config.databaseURL}/views/${pathId}.json`;
            
            // डेटाबेसबाट पुरानो भ्यु तान्ने
            let response = await fetch(apiURL);
            let count = (await response.json()) || 0;

            // यदि यो सेसनमा पहिले भ्यु गरिएको छैन भने मात्र काउन्ट बढाउने
            if (!sessionStorage.getItem("viewed_" + pathId)) {
                count++;
                await fetch(apiURL, { 
                    method: 'PUT', 
                    body: JSON.stringify(count) 
                });
                sessionStorage.setItem("viewed_" + pathId, "true");
            }
            
            // SVG आइकन र नेपाली नम्बर सहित डिस्प्ले गर्ने
            const eyeIcon = `<svg style="width:16px;height:16px;margin-right:5px;fill:#ce1212;vertical-align:middle;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
            
            displayElement.innerHTML = `${eyeIcon} <span style="color:#ce1212;font-weight:bold;">${this.convertToNepali(count)}</span>`;
            
        } catch (error) { 
            console.error("Counter update failed:", error); 
        }
    }
};

// पेज लोड भएपछि रन गर्ने
window.addEventListener('DOMContentLoaded', () => PostCounter.init());
