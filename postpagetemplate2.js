/**
 * Name: postpagetemplate2.js (Final Fix)
 * Feature: Forced Nepali Date Conversion (2026 -> 2082)
 */

const applyNepaliDateFinal = () => {
    const monthMap = {
        'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
        'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
        'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
    };

    const numeralMap = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};

    const dateElements = document.querySelectorAll('.location-date');
    
    dateElements.forEach(el => {
        let text = el.innerText;

        // यदि अझै अंग्रेजीमै छ भने मात्र कन्भर्ट गर्ने
        if (text.includes('2026') || /January|February|March|April|May|June|July|August|September|October|November|December/.test(text)) {
            
            // १. वर्ष २०२६ लाई २०८२ मा
            text = text.replace(/2026/g, '2082');

            // २. महिना परिवर्तन
            Object.keys(monthMap).forEach(engMonth => {
                text = text.replace(new RegExp(engMonth, 'g'), monthMap[engMonth]);
            });

            // ३. अंक परिवर्तन
            let converted = '';
            for (let char of text) {
                converted += numeralMap[char] ? numeralMap[char] : char;
            }

            el.innerText = converted;
            console.log("Date converted to Nepali: " + converted);
        }
    });
};

// Multi-function Execution: पेज लोड हुँदा र लोड भएको २ सेकेन्डपछि पनि चेक गर्ने
window.addEventListener('load', applyNepaliDateFinal);
setTimeout(applyNepaliDateFinal, 1000); // १ सेकेन्डको ढिलाइमा फेरि चलाउने
setTimeout(applyNepaliDateFinal, 3000); // ३ सेकेन्डमा फेरि चलाउने (सुरक्षाको लागि)
