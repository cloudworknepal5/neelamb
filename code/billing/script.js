const posts = [
    {
        title: "The Future of Digital Content Design",
        author: "John Doe",
        authorImg: "https://i.pravatar.cc/100?img=1",
        date: "Oct 24, 2023",
        img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
        snippet: "This is a sample snippet designed to be at least 60 words. It provides a brief overview of the blog content, engaging the reader to click further. Modern layouts rely on white space and typography to deliver a premium experience. This design ensures that your content remains the hero across all devices, from desktops to mobile phones.",
        link: "#"
    },
    {
        title: "Mastering Minimalist Web Architectures",
        author: "Jane Smith",
        authorImg: "https://i.pravatar.cc/100?img=5",
        date: "Oct 25, 2023",
        img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200",
        snippet: "Minimalism is not just about less content; it is about providing more value with fewer distractions. By using a clean 60px bold header and a thin border divider, we create a visual rhythm that guides the reader effortlessly. This secondary post follows the same structural integrity as the first, maintaining a professional brand image throughout.",
        link: "#"
    },
    {
        title: "Responsive Design in the Age of AI",
        author: "Alex Reed",
        authorImg: "https://i.pravatar.cc/100?img=8",
        date: "Oct 26, 2023",
        img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
        snippet: "Artificial intelligence is changing how we code, but the fundamentals of good design remain the same. Accessibility, speed, and responsiveness are the three pillars of modern web development. This snippet serves as the final placeholder for our three-post layout, demonstrating how 1200px featured images provide maximum impact for your photography.",
        link: "#"
    }
];

const container = document.getElementById('post-container');

function renderPosts() {
    container.innerHTML = posts.map(post => `
        <article class="post-card">
            <h1 class="post-title">${post.title}</h1>
            
            <div class="post-meta">
                <img src="${post.authorImg}" class="author-thumb" alt="Author">
                <span>By <strong>${post.author}</strong></span>
                <span><i class="fa-regular fa-clock date-icon"></i>${post.date}</span>
            </div>

            <div class="feature-img-box">
                <img src="${post.img}" alt="Featured Image">
            </div>

            <p class="post-snippet">${post.snippet}</p>

            <a href="${post.link}" class="btn-read-more">READ MORE</a>
        </article>
    `).join('');
}

renderPosts();
