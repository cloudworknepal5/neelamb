/**
 * Name: nepalidate-in-postpage.js
 * Version: 9.3 (Fix: Force Download PNG)
 * Today's Check: Feb 6, 2026 = Magh 23, 2082
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

    /** Function 1: Convert Numbers */
    const toNepNum = (n) => n.toString().split('').map(c => config.numMap[c] || c).join('');

    /** Function 2: Force Download PNG (Fixed Logic) */
    const saveAsPNG = (text) => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            
            // क्यानभासको साइज मिलाउने
            canvas.width = 600;
            canvas.height = 120;
            
            // पृष्ठभूमि (Background)
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // फन्ट र टेक्स्ट सेटिङ
            ctx.fillStyle = "#000000";
            ctx.font = "bold 32px Arial, sans-serif"; 
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            
            // डाउनलोड ट्रिगर गर्ने सुरक्षित तरिका
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.setAttribute('href', imgData);
            link.setAttribute('download', 'nepali-date-' + Date.now() + '.png');
            document.body.appendChild(link); // केही ब्राउजरका लागि अनिवार्य
            link.click();
            document.body.removeChild(link); // काम सकिएपछि हटाउने
            
        } catch (err) {
            console.error("PNG Download failed: ", err);
            alert("PNG डाउनलोड हुन सकेन। कृपया फेरि प्रयास गर्नुहोस्।");
        }
    };

    /** Function 3: BS Date Calculation Logic */
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

    /** Function 4: UI Renderer */
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
                
                el.innerHTML = finalDate;
                el.style.cursor = "pointer";
                el.title = "Click to download as PNG";
                
                // इभेन्ट अलि सुरक्षित तरिकाले थप्ने
                el.addEventListener('click', function(e) {
                    e.preventDefault();
                    saveAsPNG(finalDate);
                });
            }
        });
    };

    // DOM तयार भएपछि मात्र चलाउने
    if (document.readyState === 'loading') {
        window.addEventListener('load', renderNepaliDate);
    } else {
        renderNepaliDate();
    }
    // Dynamic content का लागि fallback
    setTimeout(renderNepaliDate, 2000);
})();
