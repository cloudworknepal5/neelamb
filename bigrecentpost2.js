function renderRecentVerticalPosts(json) {
    var entries = json.feed.entry;
    var html = '<div class="vertical-recent-container">';

    if (!entries) return;

    /* Function 1: Advanced Resolution Booster */
    function getHighResImage(url) {
        if (!url) return 'https://via.placeholder.com/1200x630';
        // Comprehensive regex to catch all Blogger sizing variations
        return url.replace(/\/s[0-9]+(-[cp])?/, "/s1600")
                  .replace(/\/w[0-9]+-h[0-9]+-p-k-no-nu/, "/s1600")
                  .replace(/\/w[0-9]+-h[0-9]+-c/, "/s1600");
    }

    /* Function 2: Snippet Generator */
    function createSnippet(content, wordCount) {
        if (!content) return "";
        return content.replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML
                      .split(/\s+/)
                      .slice(0, wordCount)
                      .join(" ") + "...";
    }

    for (var i = 0; i < 3; i++) {
        if (entries[i]) {
            var post = entries[i];
            var title = post.title.$t;
            var link = post.link.find(l => l.rel === 'alternate').href;
            
            // Apply High-Res Fix
            var originalThumb = post.media$thumbnail ? post.media$thumbnail.url : null;
            var img = getHighResImage(originalThumb);
            
            var authorName = post.author[0].name.$t;
            var authorImg = post.author[0].gd$image.src.replace('/s512-c/', '/s80-c/'); 
            var pubDate = new Date(post.published.$t).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            var content = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
            var snippet = createSnippet(content, 45);

            // HTML Structure
            html += '<article class="vr-post">';
            html += '<h2 class="vr-title"><a href="' + link + '">' + title + '</a></h2>';
            
            html += '<div class="vr-meta">';
            html += '<img class="vr-author-img" src="' + authorImg + '" alt="' + authorName + '"/>';
            html += '<div class="vr-meta-info">';
            html += '<strong>' + authorName + '</strong>';
            html += '<span class="vr-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' + pubDate + '</span>';
            html += '</div></div>';

            html += '<div class="vr-image"><a href="' + link + '"><img src="' + img + '" alt="' + title + '" style="width:100%; height:auto; display:block;"/></a></div>';
            html += '<div class="vr-snippet">' + snippet + '</div>';
            html += '<a href="' + link + '" class="vr-btn">Read More</a>';
            html += '</article>';
        }
    }
    html += '</div>';
    document.getElementById('recent-vertical-box').innerHTML = html;
}
