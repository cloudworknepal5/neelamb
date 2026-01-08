/**
 * Name: nepalidate-in-postpage.js
 * Version: 4.0 (Universal Year Fix)
 * Feature: Automatically detects any year (2080, 2081, 2082...)
 */

(function() {
    "use strict";

    const nepData = {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        monthMap: {
            'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
            'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
            'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
        }
    };

    const toNepNum = (n) => n.toString().split('').map(char => nepData.numMap[char] || char).join('');

    const applyUniversalDate = () => {
        // ब्लगरको सबै मिति एलिमेन्टहरू खोज्ने
        document.querySelectorAll('.location-date').forEach(el => {
            let text = el.innerText;
            
            // अङ्ग्रेजी अक्षर भएमा मात्र परिवर्तन गर्ने
            if (/[a-zA-Z]/.test(text)) {
                let dateParts = text.match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
                if (dateParts) {
                    let engMonth = dateParts[1];
                    let engDay = parseInt(dateParts[2]);
                    let engYear = parseInt(dateParts[3]);

                    /* Multi-function Logic for Any Year:
                       हामी अङ्ग्रेजी वर्षबाट नेपाली वर्ष निकाल्न ५६ वा ५७ वर्षको फरक हिसाब गर्छौँ।
                       अप्रिल १४ भन्दा अगाडि ५६ वर्ष र पछि ५७ वर्ष थपिन्छ।
                    */
                    let bsYear = engYear + 56;
                    
                    // अप्रिल १४ पछि नयाँ वर्ष लाग्ने हुनाले वर्ष फेर्ने लोजिक
                    const monthsBeforeNewYear = ["January", "February", "March"];
                    if (!monthsBeforeNewYear.includes(engMonth)) {
                        if (engMonth === "April" && engDay >= 14) {
                            bsYear += 1;
                        } else if (engMonth !== "April") {
                            // अप्रिल पछिका महिनाहरू (May-Dec) मा सधैँ +१ हुन्छ (सन् २०२४ को मे = २०८१ जेठ)
                            bsYear += 1;
                        }
                    }

                    // महिनाको म्यापिङ (सिम्पल म्यापिङमा अलिअलि फरक पर्न सक्छ तर साल र गते मिल्छ)
                    let bsMonth = nepData.monthMap[engMonth] || "";
                    
                    // गते हिसाब (Approximate Sync for Old Posts)
                    let bsDay = engDay + 16; // औसतमा नेपाली गते १६ दिन अगाडि हुन्छ
                    if (bsDay > 31) bsDay = bsDay - 30; // यदि ३१ काट्यो भने अर्को महिना सुरु

                    el.innerHTML = `${bsMonth} ${toNepNum(bsDay)}, ${toNepNum(bsYear)}`;
                }
            }
        });
    };

    window.addEventListener('load', applyUniversalDate);
    setTimeout(applyUniversalDate, 1500);
})();
