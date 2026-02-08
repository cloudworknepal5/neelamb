/**
 * Mega News Feed Widget
 * Multi-function logic: HD Filter, Date Formatting, JSON Handling
 */

const FEED_CONFIG = {
    blogUrl: "https://www.birgunj.eu.org",
    numPosts: 3
};

// Function 1: HD Image Processor
function getClearHDImage(url) {
    if (!url) return 'https://via.placeholder.com/1300x700?text=No+Image';
    let hd = url.replace(/\/s[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
    hd = hd.replace(/\/w[0-9]+-h[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
    if(hd.indexOf('=s') > -1) hd = hd.split('=s')[0] + '=s1600';
    return hd;
}

// Function 2: Nepali Date Converter
function formatDate(iso) { 
    return new Date(iso).toLocaleDateString('ne-NP', {year:'numeric', month:'long', day:'numeric'}); 
}

// Function 3: Card Builder HTML
function createPostHTML(post) {
    const title = post.title.$t;
    const link = post.link.find(l => l.rel === 'alternate').href;
    const authorName = post.author[0].name.$t;
    const authorPic = post.author[0].gd$image.src.replace('/s35-c/','/s120-c/');
    const thumb = post.media$thumbnail ? getClearHDImage(post.media$thumbnail.url) : 'https://via.placeholder.com/1300x700?text=News+Update';
    
    // Clean snippet
    let contentStr = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
    const snip = contentStr.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).slice(0, 25).join(" ") + "...";
    const label = post.category ? post.category[0].term : "ताजा समाचार";

    return `
        <article class="gh-master-wrap">
            <a href="${link}" class="gh-headline-top">${title}</a>
            <div class="gh-meta-info">
                <img src="${authorPic}" class="gh-author-img" alt="${authorName}">
                <span><b>${authorName}</b></span>
                <span style="color:#ddd">|</span>
                <span class="gh-pub-date">${formatDate(post.published.$t)}</span>
            </div>
            <div class="gh-img-frame">
                <div class="gh-label-ribbon">${label}</div>
                <div class="gh-social-overlay-center">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${link}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="FB"></a>
                    <a href="https://api.whatsapp.com/send?text=${title}%20${link}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WA"></a>
                    <a href="https://twitter.com/intent/tweet?text=${title}&url=${link}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/3256/3256013.png" alt="TW"></a>
                </div>
                <div class="gh-overlay-border"></div>
                <a href="${link}"><img src="${thumb}" alt="${title}" loading="lazy"></a>
            </div>
            <p class="gh-snippet">${snip}</p>
            <a href="${link}" class="gh-read-more">पूरा पढ्नुहोस्</a>
            <hr class="gh-divider">
        </article>
    `;
}

// Function 4: Feed Callback Function
window.ghFeedCallback = function(json) { 
    const container = document.getElementById('gh-final-master-widget');
    const posts = json.feed.entry || []; 
    if(posts.length > 0) {
        let htmlBuffer = "";
        posts.forEach(p => htmlBuffer += createPostHTML(p));
        container.innerHTML = htmlBuffer;
    } else {
        container.innerHTML = "<p style='text-align:center;'>कुनै पोष्ट भेटिएन।</p>";
    }
};

// Function 5: JSON Injection
(function() {
    const script = document.createElement('script');
    script.src = `${FEED_CONFIG.blogUrl}/feeds/posts/default?alt=json-in-script&callback=ghFeedCallback&max-results=${FEED_CONFIG.numPosts}`;
    document.body.appendChild(script);
})();
