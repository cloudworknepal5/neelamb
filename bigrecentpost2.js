/**
 * Advanced Multi-Function News Loop
 * Optimized for: High-Resolution Images, Nepali Date Formatting, and Error Recovery
 */
const BloggerEngine = {
    
    /* Function 1: Image Clarity & Resolution Logic */
    processImage: function(entry) {
        let imgUrl = "https://via.placeholder.com/1200x630?text=No+Featured+Image";
        
        if (entry.media$thumbnail) {
            // Replace any Blogger sizing (s72-c, s320, etc) with high-res s1600
            imgUrl = entry.media$thumbnail.url.replace(/\/s[0-9]+(-[cp])?/, "/s1600");
        } else if (entry.content && entry.content.$t.includes("<img")) {
            // Fallback: Scraping image from content if thumbnail is missing
            const regex = /<img.*?src="(.*?)"/;
            const match = regex.exec(entry.content.$t);
            if (match) imgUrl = match[1];
        }
        return imgUrl;
    },

    /* Function 2: Nepali Date Formatter */
    formatNepaliDate: function(dateStr) {
        return new Date(dateStr).toLocaleDateString('ne-NP', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
    },

    /* Function 3: Main UI Renderer */
    render: function(json) {
        const entries = json.feed.entry;
        let html = '';
        const target = document.getElementById('image-loop-container');

        if (!entries) {
            if (target) target.innerHTML = '<p>डाटा फेला परेन।</p>';
            return;
        }

        for (let entry of entries) {
            const title = entry.title.$t;
            const link = entry.link.find(l => l.rel === 'alternate').href;
            const imgUrl = this.processImage(entry);
            const author = entry.author[0];
            const authorImg = author.gd$image.src.replace('s113', 's200');
            const date = this.formatNepaliDate(entry.published.$t);

            html += `
                <div class="featured-loop-item">
                    <span class="tag-label">विशेष समाचार</span>
                    <h2 class="featured-title"><a href="${link}">${title}</a></h2>
                    
                    <div class="featured-meta">
                        <img src="${authorImg}" class="author-thumb" onerror="this.src='https://www.blogger.com/img/profile_mask.png'">
                        <span>${author.name.$t}</span> 
                        <span class="meta-sep">|</span>
                        <span>${date}</span>
                    </div>

                    <div class="featured-img-wrap">
                        <a href="${link}">
                            <img src="${imgUrl}" alt="${title}" class="high-res-img" loading="lazy">
                        </a>
                    </div>
                </div>`;
        }
        if (target) target.innerHTML = html;
    },

    /* Function 4: Feed Fetcher */
    fetch: function(label, count) {
        const script = document.createElement('script');
        let feedUrl = `${window.location.origin}/feeds/posts/default`;
        if (label !== 'recent') feedUrl += `/-/${encodeURIComponent(label)}`;
        
        script.src = `${feedUrl}?alt=json-in-script&callback=BloggerEngine.render&max-results=${count}`;
        document.body.appendChild(script);
    }
};

// Usage: Call this to load 5 recent posts
// BloggerEngine.fetch('recent', 5);
