const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.firebaseio.com",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    updateAndFetch: async function(elementId) {
        const postId = window.location.pathname.replace(/[/.]/g, "_");
        const url = `${this.config.databaseURL}/views/${postId}.json`;
        const hasVisited = sessionStorage.getItem("v_" + postId);

        try {
            const response = await fetch(url);
            let count = await response.json() || 0;

            if (!hasVisited) {
                // Rules अनुसार हामीले १ मात्र थप्न पाउँछौँ
                let newCount = count + 1;
                const updateRes = await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(newCount)
                });
                
                if(updateRes.ok) {
                    sessionStorage.setItem("v_" + postId, "true");
                    count = newCount;
                }
            }
            this.display(elementId, count);
        } catch (e) { console.error("Security/Network Error", e); }
    },

    display: function(id, value) {
        const el = document.getElementById(id);
        if (el) {
            const nepVal = value.toString().split('').map(c => this.config.numMap[c] || c).join('');
            el.innerHTML = `<i class="fa fa-eye"></i> ${nepVal} पटक हेरियो`;
        }
    }
};
