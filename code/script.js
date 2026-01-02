function renderAdvancedLayout(json) {
    var entries = json.feed.entry;
    var html = '<div class="news-box">';
    
    if (!entries) return;

    // --- Top Section (Posts 1 & 2) ---
    html += '<div class="top-grid">';
    for (var i = 0; i < 2; i++) {
        if (entries[i]) {
            var post = entries[i];
            var title = post.title.$t;
            var link = post.link.find(l => l.rel === 'alternate').href;
            var img = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's600') : 'https://via.placeholder.com/400x250';
            var snippet = post.content ? post.content.$t.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).slice(0, 60).join(" ") + "..." : "";
            
            html += '<div class="big-post">';
            html += '<h2><a href="'+link+'">'+title+'</a></h2>';
            html += '<a href="'+link+'"><img src="'+img+'"/></a>';
            html += '<p class="big-snippet">'+snippet+'</p>';
            html += '</div>';
        }
    }
    html += '</div>';

    // --- Bottom Section (Posts 3, 4, 5, 6) ---
    html += '<div class="bottom-grid">';
    
    // Bottom Left (Post 3 & 4)
    html += '<div class="bottom-left">';
    for (var j = 2; j < 4; j++) {
        if (entries[j]) {
            var p = entries[j];
            var t = p.title.$t;
            var l = p.link.find(lr => lr.rel === 'alternate').href;
            var im = p.media$thumbnail ? p.media$thumbnail.url.replace('s72-c', 's400') : 'https://via.placeholder.com/200x120';
            html += '<div class="small-item">';
            html += '<a href="'+l+'"><img src="'+im+'"/></a>';
            html += '<h3><a href="'+l+'">'+t+'</a></h3>';
            html += '</div>';
        }
    }
    html += '</div>';

    // Bottom Right (Post 5 & 6 - List Style)
    html += '<div class="bottom-right">';
    for (var k = 4; k < 6; k++) {
        if (entries[k]) {
            var pk = entries[k];
            var tk = pk.title.$t;
            var lk = pk.link.find(lrk => lrk.rel === 'alternate').href;
            var imk = pk.media$thumbnail ? pk.media$thumbnail.url.replace('s72-c', 's400') : 'https://via.placeholder.com/120x80';
            html += '<div class="small-item list-style">';
            html += '<a href="'+lk+'"><img src="'+imk+'"/></a>';
            html += '<h3><a href="'+lk+'">'+tk+'</a></h3>';
            html += '</div>';
        }
    }
    html += '</div>';

    html += '</div></div>';
    document.getElementById('label-news-container').innerHTML = html;
}
