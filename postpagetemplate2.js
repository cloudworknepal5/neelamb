/**
 * Name: postpagetemplate2.js
 * Version: 2.0
 * Features: English-to-Nepali Date (2082), Numeral Converter, Reading Time Calc
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // १. मिति र अंक रूपान्तरण (Multi-function Date Converter)
    const convertToNepaliBS = () => {
        const months = {
            'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
            'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
            'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
        };
        const nums = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};

        document.querySelectorAll('.location-date').forEach(el => {
            let text = el.innerText;
            if (text.includes('2026')) text = text.replace('2026', '2082');

            Object.keys(months).forEach(m => { text = text.replace(m, months[m]); });
            
            let final = '';
            for (let char of text) { final += nums[char] ? nums[char] : char; }
            el.innerText = final;
        });
    };

    // २. पढ्न लाग्ने समय गणना (Reading Time Estimator)
    const calculateReadingTime = () => {
        const content = document.querySelector('.rp-body-style');
        const display = document.querySelector('.reading-time');
        if (content && display) {
            const words = content.innerText.trim().split(/\s+/).length;
            const time = Math.ceil(words / 150); // औसत १५० शब्द प्रति मिनेट
            display.innerText = `पढ्न लाग्ने समय: ${time} मिनेट`;
        }
    };

    // Execution
    convertToNepaliBS();
    calculateReadingTime();
    console.log("PostPageTemplate2 JS Loaded: Optimized for 2082 B.S.");
});
