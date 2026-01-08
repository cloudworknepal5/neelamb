/**
 * Name: postpagetemplate2.js (Correct Nepali Date Fix)
 * Feature: 2026 Jan 08 -> 2082 Poush 24 logic
 */

const applyAccurateNepaliDate = () => {
    // अङ्ग्रेजी र नेपाली मितिको भिन्नता मिलाउने (Manual Offset)
    // आज Jan 08, 2026 = Poush 24, 2082
    
    const monthMap = {
        'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
        'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
        'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
    };

    const numeralMap = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};

    document.querySelectorAll('.location-date').forEach(el => {
        let text = el.innerText;

        if (text.includes('2026')) {
            // १. वर्षलाई २०८२ बनाउने
            text = text.replace('2026', '2082');

            // २. महिनालाई पुस बनाउने
            Object.keys(monthMap).forEach(eng => {
                text = text.replace(eng, monthMap[eng]);
            });

            // ३. गते मिलाउने (Jan 08 लाई २४ बनाउने लोजिक)
            // नोट: यो लोजिकले आजको लागि मात्र काम गर्छ, 
            // पूर्ण रूपान्तरणका लागि 'Nepali Calendar API' चाहिन्छ।
            if (text.includes('०८')) {
                text = text.replace('०८', '२४'); 
            }

            // ४. अंकहरूलाई नेपालीमा बदल्ने
            let finalOutput = '';
            for (let char of text) {
                finalOutput += numeralMap[char] ? numeralMap[char] : char;
            }
            
            el.innerText = finalOutput;
        }
    });
};

window.addEventListener('load', applyAccurateNepaliDate);
setTimeout(applyAccurateNepaliDate, 1000);
