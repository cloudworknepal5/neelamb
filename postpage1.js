/**
 * Name: nepalidate-in-postpage.js
 * Version: 9.4 (Download Icon Only - Fixed)
 * Feature: Multi-function logic with Force PNG Download
 * Date: Feb 6, 2026 = Magh 23, 2082
 */

(function() {
    "use strict";

    const config = {
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
    };

    /** Function 1: Unicode Number Converter */
    const toNepNum = (n) => n.toString().split('').map(c => config.numMap[c] || c).join('');

    /** Function 2: Force PNG Download (Improved) */
    const saveAsPNG = (text) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 600;
        canvas.height = 120;

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text Styling
        ctx.fillStyle = "#2c3e50";
        ctx.font = "bold 32px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        // Secure Trigger Download
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = 'nepali-date-' + Date.now() + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /** Function 3: Precise Date Calculation */
    const getBSDateDetails = (engDay, engMonth) => {
        const data = config.monthData[engMonth];
        let bsDay, bsMonth = data.m;
        if (engDay >= data.start) {
            bsDay = (engDay - data.start) + 1;
        } else {
            const months = ['पुस','माघ','फागुन','चैत','वैशाख','जेठ','असार','साउन','भदौ','असोज','कात्तिक','मंसिर'];
            let idx = months.indexOf(data.m);
            bsMonth = idx === 0 ? months[11] : months[idx - 1];
            bsDay = data.prevDays + engDay; 
        }
        return { bsDay, bsMonth };
    };

    /** Function 4: UI Renderer with Icon */
    const renderNepaliDate = () => {
        document.querySelectorAll('.location-date').forEach(el => {
            const match = el.innerText.trim().match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
            if (match) {
                const [_, eMonth, eDay, eYear] = match;
                const dInt = parseInt(eDay);
                const yInt = parseInt(eYear);

                const { bsDay, bsMonth } = getBSDateDetails(dInt, eMonth);
                const bsYear = (eMonth === 'April' && dInt < 14) ? yInt + 56 : yInt + config.monthData[eMonth].offset;
                const weekday = config.weekdays[new Date(`${eMonth} ${eDay}, ${eYear}`).getDay()];

                const finalDate = `${weekday}, ${bsMonth} ${toNepNum(bsDay)}, ${toNepNum(bsYear)}`;
                
                // केवल आइकन थप्ने (No Text)
                el.innerHTML = `
                    <span style="vertical-align: middle;">${finalDate}</span>
                    <span id="dl-icon" style="margin-left: 10px; cursor: pointer; display: inline-flex; vertical-align: middle;" title="Download PNG">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </span>
                `;

                // आइकन क्लिक इभेन्ट
                const icon = el.querySelector('#dl-icon');
                if(icon) {
                    icon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        saveAsPNG(finalDate);
                    });
                }
            }
        });
    };

    window.addEventListener('load', renderNepaliDate);
    setTimeout(renderNepaliDate, 1500);
})();
