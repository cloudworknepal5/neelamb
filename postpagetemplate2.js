/**
 * Name: postpagetemplate2.js (Fixed Version)
 * Feature: 2026 -> 2082 & Accurate Month Translation
 */

document.addEventListener("DOMContentLoaded", function() {
    
    const applyFinalNepaliDate = () => {
        const monthMap = {
            'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
            'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
            'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
        };

        const numeralMap = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};

        const dateElements = document.querySelectorAll('.location-date');
        
        dateElements.forEach(el => {
            let text = el.innerText;

            // १. वर्ष परिवर्तन (२०२६ लाई २०८२ मा)
            text = text.replace(/2026/g, '2082');

            // २. महिना परिवर्तन (English Months to Nepali)
            Object.keys(monthMap).forEach(engMonth => {
                const regex = new RegExp(engMonth, 'g');
                text = text.replace(regex, monthMap[engMonth]);
            });

            // ३. हप्ताको नाम हटाउने वा बदल्ने (ऐच्छिक)
            text = text.replace(/Thursday|Friday|Saturday|Sunday|Monday|Tuesday|Wednesday/g, '');
            text = text.replace(/,/g, ''); // अल्पविराम हटाउने

            // ४. सबै बाँकी अंकहरूलाई नेपालीमा बदल्ने
            let convertedDate = '';
            for (let i = 0; i < text.length; i++) {
                let char = text[i];
                convertedDate += numeralMap[char] ? numeralMap[char] : char;
            }

            el.innerText = convertedDate.trim();
        });
    };

    applyFinalNepaliDate();
});
