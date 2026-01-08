/**
 * Name: nepalidate-in-postpage.js
 * Feature: Automatic English to Nepali Date Conversion (No Location)
 * Logic: Base 2082 Poush 24
 */

(function() {
    "use strict";

    const dateConfig = {
        yearBS: "२०८२",
        nepNums: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        nepMonths: {
            'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
            'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
            'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
        }
    };

    // Multi-function digit converter
    const convertDigits = (num) => {
        return num.toString().split('').map(d => dateConfig.nepNums[d] || d).join('');
    };

    const applyNepaliDate = () => {
        const targetElements = document.querySelectorAll('.location-date');
        
        targetElements.forEach(el => {
            let engText = el.innerText;

            if (/[a-zA-Z]/.test(engText)) {
                let dayMatch = engText.match(/\d+/);
                
                if (dayMatch) {
                    let engDay = parseInt(dayMatch[0]);
                    
                    // Logic: Jan 08, 2026 is Poush 24, 2082
                    let baseEngDay = 8;
                    let baseNepDay = 24;
                    let calculatedDay = baseNepDay + (engDay - baseEngDay);
                    let finalDay = convertDigits(calculatedDay);
                    
                    let finalMonth = "";
                    Object.keys(dateConfig.nepMonths).forEach(m => {
                        if (engText.includes(m)) finalMonth = dateConfig.nepMonths[m];
                    });

                    // Location हटाइएको छ - केवल मिति मात्र
                    el.innerHTML = `${finalMonth} ${finalDay}, ${dateConfig.yearBS}`;
                }
            }
        });
    };

    // Execution
    window.addEventListener('load', applyNepaliDate);
    document.addEventListener('DOMContentLoaded', applyNepaliDate);
    setTimeout(applyNepaliDate, 1500);

})();
