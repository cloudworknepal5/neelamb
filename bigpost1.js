/**
 * Multi-function logic: HD Filter, Date Formatting, 3-Post Injection
 * Maintains original .location-date class structure.
 */

const BLOG_SETTINGS = {
    url: "https://www.birgunj.eu.org",
    postsToShow: 3,
    location: "वीरगञ्ज"
};

function getClearHDImage(url) {
    if (!url) return 'https://via.placeholder.com/1300x700?text=No+Image';
    let hd = url.replace(/\/s[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
    hd = hd.replace(/\/w[0-9]+-h[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
    return hd;
}

function formatDate(iso) { 
    return new Date(iso).toLocaleDateString('ne-NP', {year:'numeric', month:'long', day:'numeric'}); 
}

function createPostHTML(post) {
    const title = post.title.$t;
    const link = post.link.find(l => l.rel === 'alternate').href;
    const authorName = post.author[0].name.$t;
    const authorPic = post.author[0].gd$image.src.replace('/s35-c/','/s120-c/');
    const thumb = post.media$thumbnail ? getClearHDImage(post.media$thumbnail.url) : 'https://via.placeholder.com/1300x700?text=Update';
    
    let contentStr = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
    const snip = contentStr.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).slice(0, 25).join(" ") + "...";

    return `
        <article class="gh-master-wrap">
            <a href="${link}" class="gh-headline-top">${title}</a>
            
            <div class="gh-meta-info">
                <img src="${authorPic}" class="gh-author-img" alt="${authorName}">
                <span><b>${authorName}</b></span>
                <span style="color:#ddd">|</span>
                <span class="location-date">${BLOG_SETTINGS.location}</span>
                <span style="color:#ddd">|</span>
                <span class="gh-pub-date">${formatDate(post.published.$t)}</span>
            </div>

            <div class="gh-img-frame">
                <div class="gh-overlay-border"></div>
                <a href="${link}"><img src="${thumb}" alt="${title}"></a>
            </div>

            <p class="gh-snippet" style="font-size:22px; color:#333; line-height:1.6;">${snip}</p>
            <a href="${link}" class="gh-read-more" style="background:#002e5b; color:#fff; padding:10px 45px; text-decoration:none; font-weight:800; border-radius:4px; display:inline-block; font-size:18px;">पूरा पढ्नुहोस्</a>
            <hr style="border:0; border-top:1px solid #ddd; margin:30px auto; max-width:600px;">
        </article>
    `;
}

window.ghFeedCallback = function(json) { 
    const container = document.getElementById('gh-final-master-widget');
    const posts = json.feed.entry || []; 
    let htmlBuffer = "";
    posts.forEach(p => htmlBuffer += createPostHTML(p));
    container.innerHTML = htmlBuffer;
};

(function() {
    const script = document.createElement('script');
    script.src = `${BLOG_SETTINGS.url}/feeds/posts/default?alt=json-in-script&callback=ghFeedCallback&max-results=${BLOG_SETTINGS.postsToShow}`;
    document.body.appendChild(script);
})();
