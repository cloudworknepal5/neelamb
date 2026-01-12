/**
 * Multi-function Blogger Loop Script
 * GitHub Hostable Version
 */

function renderBloggerLoop(json) {
    var entries = json.feed.entry;
    var html = '';
    var containerId = "image-loop-container"; // HTML मा भएको ID सँग मेल खानुपर्छ

    if (entries) {
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var title = entry.title.$t;
            var link = "";
            var imgUrl = "";
            var authorName = entry.author[0].name.$t;
            var authorImg = entry.author[0].gd$image.src;
            
            // मितिलाई नेपाली ढाँचामा ढाल्ने (Optional)
            var date = new Date(entry.published.$t).toLocaleDateString('ne-NP');

            // पोष्ट लिङ्क निकाल्ने
            for (var j = 0; j < entry.link.length; j++) {
                if (entry.link[j].rel == 'alternate') {
                    link = entry.link[j].href;
                    break;
                }
            }

            // इमेज लजिक: ठूलो साइजको इमेज लिने
            if ("media$thumbnail" in entry) {
                imgUrl = entry.media$thumbnail.url.replace('s72-c', 's1600');
            } else {
                imgUrl = "https://via.placeholder.com/800x450?text=No+Image";
            }

            // HTML स्ट्रक्चर निर्माण
            html += `
                <div class="featured-loop-item">
                    <span class="tag-label">ताजा समाचार</span>
                    <h2 class="featured-title"><a href="${link}">${title}</a></h2>
                    <div class="featured-meta">
                        <img src="${authorImg}" alt="${authorName}"> 
                        <span>${authorName}</span> | <span>${date}</span>
                    </div>
                    <div class="featured-img-wrap">
                        <a href="${link}"><img class="featured-img" src="${imgUrl}" alt="${title}"></a>
                    </div>
                </div>`;
        }
    } else {
        html = '<p>कुनै डाटा फेला परेन।</p>';
    }
    
    document.getElementById(containerId).innerHTML = html;
}

/**
 * फङ्सन कल गर्ने तरिका
 * @param {string} blogUrl - तपाईंको ब्लगको URL
 * @param {string} filter - 'recent' वा 'Label Name'
 * @param {number} limit - कतिवटा पोष्ट देखाउने
 */
function initBloggerLoop(blogUrl, filter, limit) {
    var script = document.createElement('script');
    var feedPath = blogUrl.replace(/\/$/, "") + '/feeds/posts/default';
    
    if (filter !== 'recent') {
        feedPath += '/-/' + encodeURIComponent(filter);
    }
    
    script.src = `${feedPath}?alt=json-in-script&callback=renderBloggerLoop&max-results=${limit}`;
    document.body.appendChild(script);
}
