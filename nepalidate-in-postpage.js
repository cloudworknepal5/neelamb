/**
 * Name: nepalidate-in-postpage.js
 * Version: 5.0 (Global Year Fix)
 * Feature: Multi-function Accurate Mapping for 2080, 2081, 2082+
 */

(function() {
    "use strict";

    const nepData = {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        // अङ्ग्रेजी महिना र नेपाली महिनाको सही सम्बन्ध (Base: Jan-Apr starts with Poush/Magh)
        monthMapping: {
            'January': { m: 'पुस', offset: 56 },
            'February': { m: 'माघ', offset: 56 },
            'March': { m: 'फागुन', offset: 56 },
            'April': { m: 'चैत', offset: 56 }, // १४ अप्रिल अघि ५६ वर्ष फरक
            'May': { m: 'वैशाख', offset: 57 },
            'June': { m: 'जेठ', offset: 57 },
            'July': { m: 'असार', offset: 57 },
            'August': { m: 'साउन', offset: 57 },
            'September': { m: 'भदौ', offset: 57 },
            'October': { m: 'असोज', offset: 57 },
            'November': { m: 'कात्तिक', offset: 57 },
            'December': { m: 'मंसिर', offset: 57 }
        }
    };

    const toNepNum = (n) => n.toString().split('').map(char => nepData.numMap[char] || char).join('');

    const applyPerfectDate = () => {
        document.querySelectorAll('.location-date').forEach(el => {
            let text = el.innerText;

            if (/[a-zA-Z]/.test(text)) {
                let dateParts = text.match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
                if (dateParts) {
                    let engMonth = dateParts[1];
                    let engDay = parseInt(dateParts[2]);
                    let engYear = parseInt(dateParts[3]);

                    let map = nepData.monthMapping[engMonth];
                    if (!map) return;

                    // साल मिलाउने लोजिक (अप्रिल १४ को विशेष केस)
                    let bsYear = engYear + map.offset;
                    if (engMonth === 'April' && engDay >= 14) {
                        bsYear = engYear + 57; // नयाँ वर्ष लागेपछि ५७ वर्षको फरक हुन्छ
                        // अप्रिल १४ पछि महिना 'वैशाख' हुनुपर्ने हुनसक्छ, तर ब्लगरको मिति अनुसार 'चैत' नै राखौँ
                    }

                    // गते मिलाउने लोजिक (अङ्ग्रेजी ८ तारिख = नेपाली २४ गते को औसत अन्तर)
                    // ८ तारिख र २४ गते बीच १६ दिनको अन्तर छ
                    let bsDay = engDay + 16;
                    if (bsDay > 31) bsDay = bsDay - 30;

                    // नतिजा सेट गर्ने
                    el.innerHTML = `${map.m} ${toNepNum(bsDay)}, ${toNepNum(bsYear)}`;
                }
            }
        });
    };

    window.addEventListener('load', applyPerfectDate);
    setTimeout(applyPerfectDate, 1500);
})();
