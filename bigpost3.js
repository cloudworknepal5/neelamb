/**
 * GitHub Feed Widget - Multi-function Version
 * Now with Automatic Feed Detection for Blogger
 */
class GHFeedWidget {
    constructor(options) {
        this.containerId = options.containerId;
        this.loadMoreBtnId = options.loadMoreBtnId;
        
        // AUTOMATIC DETECTION: Use provided URL or detect current Blogger domain
        this.feedUrl = options.feedUrl || this.detectBloggerFeed();
        
        this.postsPerPage = options.postsPerPage || 5;
        this.posts = [];
        this.displayedCount = 0;

        this.init();
    }

    /**
     * Function 1: Automatic Feed Discovery
     * Constructs the feed URL based on the current domain.
     */
    detectBloggerFeed() {
        const origin = window.location.origin;
        // Standard Blogger feed path
        return `${origin}/feeds/posts/default`;
    }

    init() {
        const script = document.createElement('script');
        const callbackName = `ghCB_${Math.random().toString(36).substr(2, 9)}`;
        window[callbackName] = (data) => this.handleData(data);
        
        // We use alt=json-in-script for cross-domain JSONP support
        script.src = `${this.feedUrl}?alt=json-in-script&callback=${callbackName}&max-results=50`;
        document.body.appendChild(script);

        const btn = document.getElementById(this.loadMoreBtnId);
        if (btn) {
            btn.onclick = () => this.renderChunk();
        }
    }

    /**
     * Function 2: Data Handling
     */
    handleData(data) {
        this.posts = data.feed.entry || [];
        if (this.posts.length > 0) {
            this.renderChunk();
        }
    }

    /**
     * Function 3: Image Optimization (HD)
     */
    getClearHDImage(url) {
        if (!url) return 'https://via.placeholder.com/1300x700';
        let hd = url.replace(/\/s[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
        hd = hd.replace(/\/w[0-9]+-h[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
        if (hd.indexOf('=s') > -1) hd = hd.split('=s')[0] + '=s1600';
        return hd;
    }

    /**
     * Function 4: Date Formatting (Nepali Locale)
     */
    formatDate(iso) {
        return new Date(iso).toLocaleDateString('ne-NP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Function 5: HTML Generation
     */
    createPostHTML(post) {
        const title = post.title.$t;
        const link = post.link.find(l => l.rel === 'alternate').href;
        const authorPic = post.author[0].gd$image.src.replace('/s35-c/', '/s100-c/');
        const thumb = post.media$thumbnail ? this.getClearHDImage(post.media$thumbnail.url) : 'https://via.placeholder.com/1300x700';
        const snip = (post.content.$t || post.summary.$t).replace(/<[^>]*>?/gm, '').trim().split(/\s+/).slice(0, 25).join(" ") + "...";
        const label = post.category ? post.category[0].term : "समाचार";

        return `
            <article class="gh-master-wrap">
                <a href="${link}" class="gh-headline-top">${title}</a>
                <div class="gh-meta-info">
                    <img src="${authorPic}" class="gh-author-img" alt="${post.author[0].name.$t}">
                    <span class="gh-author-name"><b>${post.author[0].name.$t}</b></span>
                    <span style="color:#ccc">|</span>
                    <span class="location-date">${this.formatDate(post.published.$t)}</span>
                </div>
                <div class="gh-img-frame">
                    <div class="gh-label-ribbon">${label}</div>
                    <div class="gh-social-overlay-center">
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="FB"></a>
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WA"></a>
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YT"></a>
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968771.png" alt="MS"></a>
                    </div>
                    <div class="gh-overlay-border"></div>
                    <a href="${link}"><img src="${thumb}" loading="lazy"></a>
                </div>
                <p class="gh-snippet">${snip}</p>
                <a href="${link}" class="gh-read-more">थप पढ्नुहोस्</a>
                <hr class="gh-post-divider">
            </article>
        `;
    }

    /**
     * Function 6: Rendering Pagination
     */
    renderChunk() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const chunk = this.posts.slice(this.displayedCount, this.displayedCount + this.postsPerPage);
        
        chunk.forEach(p => {
            container.insertAdjacentHTML('beforeend', this.createPostHTML(p));
        });

        this.displayedCount += chunk.length;

        if (this.displayedCount >= this.posts.length) {
            const btnContainer = document.getElementById('gh-load-more-container');
            if (btnContainer) btnContainer.style.display = 'none';
        }
    }
}

// Initialize the widget without needing to specify a URL
document.addEventListener('DOMContentLoaded', () => {
    new GHFeedWidget({
        containerId: 'gh-final-master-widget',
        loadMoreBtnId: 'loadMoreBtn',
        // feedUrl is now optional; it defaults to current site
        postsPerPage: 5
    });
});
