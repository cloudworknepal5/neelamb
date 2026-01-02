function renderRecentVerticalPosts(json) {
    var entries = json.feed.entry;
    var html = '<div class="vertical-recent-container">';

    if (!entries) return;

    for (var i = 0; i < 3; i++) {
        if (entries[i]) {
            var post = entries[i];
            var title = post.title.$t;
            var link = post.link.find(l => l.rel === 'alternate').href;
            
            // Image Processing (1200px size)
            var img = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's1200') : 'https://via.placeholder.com/1200x630';
            
            // Meta Info
            var authorName = post.author[0].name.$t;
            var authorImg = post.author[0].gd$image.src;
            var pubDate = new Date(post.published.$t).toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' });

            // Snippet (60 Words)
            var content = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
            var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).slice(0, 60).join(" ") + "...";

            html += '<article class="vr-post">';
            
            // १. हेडलाइन (६० पिक्सेल बोल्ड)
            html += '<h2 class="vr-title"><a href="' + link + '">' + title + '</a></h2>';
            
            // २. मेटा इन्फो (लेखकको फोटो र घडी आइकनसहितको मिति)
            html += '<div class="vr-meta">';
            html += '<img class="vr-author-img" src="' + authorImg + '" alt="' + authorName + '"/>';
            html += '<div class="vr-meta-info">';
            html += '<strong>' + authorName + '</strong>';
            html += '<div class="vr-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + pubDate + '</div>';
            html += '</div></div>';

            // ३. फिचर इमेज (१२०० पिक्सेल)
            html += '<div class="vr-image"><a href="' + link + '"><img src="' + img + '"/></a></div>';

            // ४. स्निपेट (६० शब्द)
            html += '<div class="vr-snippet">' + snippet + '</div>';

            // ५. विस्तृतमा पढ्नुहोस् बटन
            html += '<a href="' + link + '" class="vr-btn">विस्तृतमा पढ्नुहोस्</a>';

            html += '</article>';
        }
    }
    html += '</div>';
    document.getElementById('recent-vertical-box').innerHTML = html;
}
