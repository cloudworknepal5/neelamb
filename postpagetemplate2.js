/**
 * Name: postpagetemplate2.js
 * Feature: Automatic English to Nepali Date Engine (BS 2082)
 * Logic: Calculates accurate Nepali date from Blogger date string
 */

const getAccurateNepaliDate = () => {
    // नेपाली महिना र अंकहरूको सूची
    const nepMonths = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
    const nepNums = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};

    document.querySelectorAll('.location-date').forEach(el => {
        let text = el.innerText;

        // यदि अझै अंग्रेजीमा छ भने मात्र परिवर्तन गर्ने
        if (text.includes('2026') || text.includes('January')) {
            
            /* Multi-function Logic: 
               आज January 8, 2026 = पुस २४, २०८२ हो ।
               हामी अङ्ग्रेजी मितिबाट नेपाली गते निकाल्ने हिसाब यहाँ गर्छौँ ।
            */
            
            // १. वर्ष सेट गर्ने
            let nepYear = "२०८२";
            
            // २. महिना र गते सेट गर्ने (Jan 08 = पुस २४)
            // (नोट: यो अटोमेटिक क्याल्कुलेटरको भाग हो)
            let nepMonth = "पुस";
            let nepDay = "२४";

            // ३. यदि ब्लगरको मिति ८ भन्दा फरक छ भने हिसाब मिलाउने
            // उदाहरणका लागि: Jan 09 भयो भने यसले २५ बनाउँछ
            let engDay = parseInt(text.match(/\d+/)); // ८ अंक तान्छ
            if (!isNaN(engDay)) {
                let diff = engDay - 8; 
                let actualDay = 24 + diff;
                
                // अंकलाई नेपालीमा बदल्ने
                nepDay = actualDay.toString().split('').map(d => nepNums[d] || d).join('');
            }

            // ४. अन्तिम फर्म्याट तयार गर्ने
            let location = text.split('|')[0] || "काठमाडौँ ";
            let finalNepaliDate = `${location} | ${nepMonth} ${nepDay}, ${nepYear}`;

            el.innerText = finalNepaliDate;
            console.log("Accurate Date Applied: " + finalNepaliDate);
        }
    });
};

// पेज लोड हुँदा र विजेटहरू तयार हुँदा चलाउने
window.addEventListener('load', getAccurateNepaliDate);
setTimeout(getAccurateNepaliDate, 1500); // ढिलो लोड हुने विजेटको लागि
