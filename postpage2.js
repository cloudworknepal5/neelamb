/**
 * Blogger Universal Multi-Function Script
 * Components: 1. Firebase View Counter | 2. Nepali Date Converter & Exporter
 * Refactored: 2026-02-06 (Magh 23, 2082)
 */

const BloggerToolbox = {
    config: {
        // १. काउन्टर सेटिङ
        databaseURL: "https://counter-3ff08-default-rtdb.asia-southeast1.firebasedatabase.app",
        // २. नेपाली भाषा सेटिङ
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        monthData: {
            'January':   { m: 'माघ', offset: 56, start: 15, prevDays: 16 }, 
            'February':  { m: 'फागुन', offset: 56, start: 13, prevDays: 17 },
            'March':     { m: 'चैत', offset: 56, start: 15, prevDays: 14 },
            'April':     { m: 'वैशाख', offset: 57, start: 14, prevDays: 17 },
            'May':       { m: 'जेठ', offset: 57, start: 15, prevDays: 17 },
            'June':      { m: 'असार', offset: 57, start: 15, prevDays: 16 },
            'July':      { m: 'साउन', offset: 57, start: 17, prevDays: 16 },
            'August':    { m: 'भदौ', offset: 57, start: 17, prevDays: 16 },
            'September': { m: 'असोज', offset: 57, start: 17, prevDays: 15 },
            'October':   { m: 'कात्तिक', offset: 57, start: 18, prevDays: 14 },
            'November':  { m: 'मंसिर', offset: 57, start: 17, prevDays: 14 },
            'December':  { m: 'पुस', offset: 57, start: 16, prevDays: 15 }
        }
    },

    // साझा उपयोगिता (Shared Utility)
    toNepaliNum: function(num) {
        return num.toString().split('').map(char => this.config.numMap[char] || char).join('');
    },

    // --- फङ्सन १: भ्यु काउन्टर (View Counter) ---
    viewCounter: {
        run: async function(elementId) {
            const el = document.getElementById(elementId);
            const postId = window.location.pathname.replace(/[\/\.#\$\[\]]/g, "_") || "home";
            const url = `${BloggerToolbox.config.databaseURL}/views/${postId}.json`;
            const hasVisited = sessionStorage.getItem("v_" + postId);

            try {
                const res = await fetch(url);
                let count = await res.json() || 0;

                if (!hasVisited) {
                    count += 1;
                    await fetch(url, { method: 'PUT', body: JSON.stringify(count) });
                    sessionStorage.setItem("v_" + postId, "true");
                }

                if (el) {
                    const eyeIcon = `<svg style="width:19px; height:19px; margin-right:7px; fill:#ce1212; vertical-align:middle; display:inline-block;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
                    el.innerHTML = `<div style="display:flex; align-items:center; color:#ce1212; font-weight:bold;">${eyeIcon} <span>${BloggerToolbox.toNepaliNum(count)} पटक हेरियो</span></div>`;
                }
            } catch (e) { console.error("Counter Error:", e); }
        }
    },

    // --- फङ्सन २: मिति कन्भर्टर (Date Toolkit) ---
    dateToolkit: {
        saveAsPNG: function(text) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 600; canvas.height = 120;
            ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#2c3e50"; ctx.font = "bold 32px Arial, sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'nepali-date-' + Date.now() + '.png';
                link.click();
                URL.revokeObjectURL(url);
            }, 'image/png');
        },

        render: function(selector) {
            document.querySelectorAll(selector).forEach(el => {
                const rawText = el.innerText.trim();
                const match = rawText.match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
                if (match) {
                    const [_, eMonth, eDay, eYear] = match;
                    const dInt = parseInt(eDay);
                    const yInt = parseInt(eYear);

                    // मिति गणना
                    const data = BloggerToolbox.config.monthData[eMonth];
                    let bsDay, bsMonth = data.m;
                    if (dInt >= data.start) {
                        bsDay = (dInt - data.start) + 1;
                    } else {
                        const months = ['पुस','माघ','फागुन','चैत','वैशाख','जेठ','असार','साउन','भदौ','असोज','कात्तिक','मंसिर'];
                        let idx = months.indexOf(data.m);
                        bsMonth = idx === 0 ? months[11] : months[idx - 1];
                        bsDay = data.prevDays + dInt; 
                    }
                    const bsYear = (eMonth === 'April' && dInt < 14) ? yInt + 56 : yInt + data.offset;
                    const weekday = BloggerToolbox.config.weekdays[new Date(`${eMonth} ${eDay}, ${eYear}`).getDay()];

                    const finalDate = `${weekday}, ${bsMonth} ${BloggerToolbox.toNepaliNum(bsDay)}, ${BloggerToolbox.toNepaliNum(bsYear)}`;
                    
                    el.innerHTML = `
                        <span style="vertical-align: middle;">${finalDate}</span>
                        <span id="date-dl-btn" style="margin-left: 10px; cursor: pointer; display: inline-flex; vertical-align: middle;" title="Download PNG">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </span>
                    `;

                    el.querySelector('#date-dl-btn').addEventListener('click', () => this.saveAsPNG(finalDate));
                }
            });
        }
    },

    // सबै सुविधाहरू सुरु गर्ने मास्टर फङ्सन
    init: function() {
        this.viewCounter.run("visitor-count");
        this.dateToolkit.render(".location-date");
    }
};

// पेज लोड हुँदा कार्यान्वयन गर्ने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BloggerToolbox.init());
} else {
    BloggerToolbox.init();
}

// केही थिमहरूमा ढिलो लोड हुने भएकोले ब्याकअपको लागि
setTimeout(() => BloggerToolbox.init(), 2000);
