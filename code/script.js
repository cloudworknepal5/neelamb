function renderRecentByLabel(json) {
    var entries = json.feed.entry;
    var html = '<div class="lp-container">';

    if (entries && entries.length > 0) {
        // --- SECTION 1: Top Two Large Posts (Posts 1 & 2) ---
        html += '<div class="lp-top-row">';
        for (var i = 0; i < 2; i++) {
            if (entries[i]) {
                var post = entries[i];
                var title = post.title.$t;
                var link = post.link.find(l => l.rel === 'alternate').href;
                var img = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/600x350';
                
                // Content Snippet - Updated to 10 words only
                var content = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
                var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).slice(0, 10).join(" ") + "...";

                html += '<div class="lp-big-item">';
                html += '<h2><a href="' + link + '">' + title + '</a></h2>';
                html += '<a href="' + link + '"><img src="' + img + '"/></a>';
                html += '<p class="lp-snippet">' + snippet + '</p>';
                html += '</div>';
            }
        }
        html += '</div>';

        // --- SECTION 2: Bottom Grid (Posts 3, 4, 5, 6) ---
        html += '<div class="lp-bottom-grid">';
        
        // Left Column (Posts 3 & 4)
        html += '<div class="lp-col">';
        for (var j = 2; j < 4; j++) {
            if (entries[j]) {
                var p = entries[j];
                var t = p.title.$t;
                var l = p.link.find(lr => lr.rel === 'alternate').href;
                var im = p.media$thumbnail ? p.media$thumbnail.url.replace('s72-c', 's600') : 'https://via.placeholder.com/300x200';
                html += '<div class="lp-small-card">';
                html += '<a href="' + l + '"><img src="' + im + '"/></a>';
                html += '<h3><a href="' + l + '">' + t + '</a></h3>';
                html += '</div>';
            }
        }
        html += '</div>';

        // Right Column (Posts 5 & 6 - List Style)
        html += '<div class="lp-col">';
        for (var k = 4; k < 6; k++) {
            if (entries[k]) {
                var pk = entries[k];
                var tk = pk.title.$t;
                var lk = pk.link.find(lrk => lrk.rel === 'alternate').href;
                var imk = pk.media$thumbnail ? pk.media$thumbnail.url.replace('s72-c', 's400') : 'https://via.placeholder.com/120x80';
                html += '<div class="lp-list-item">';
                html += '<div class="lp-list-img"><a href="' + lk + '"><img src="' + imk + '"/></a></div>';
                html += '<h3><a href="' + lk + '">' + tk + '</a></h3>';
                html += '</div>';
            }
        }
        html += '</div>';
        
        html += '</div>'; 
    }
    
    html += '</div>';
    document.getElementById('recent-posts-box').innerHTML = html;
}
