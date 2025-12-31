(function() {
    // 1. Configuration: In a real app, this data could come from an API
    const adData = {
        type: "video", // Options: "image" or "video"
        mediaUrl: "https://sample-videos.com/video123.mp4", // Replace with your file
        destinationUrl: "https://yourwebsite.com",
        width: "300",
        height: "250",
        fallbackImg: "https://via.placeholder.com/300x250?text=Click+Here"
    };

    // 2. Find the placeholder div on the host site
    const adSlot = document.querySelector('.custom-ad-provider');

    if (adSlot) {
        // Set up the container style
        adSlot.style.width = adData.width + "px";
        adSlot.style.height = adData.height + "px";
        adSlot.style.position = "relative";
        adSlot.style.overflow = "hidden";
        adSlot.style.display = "inline-block";
        adSlot.style.border = "1px solid #ccc";

        let adContent = "";

        if (adData.type === "video") {
            // Video Ad HTML
            adContent = `
                <video width="100%" height="100%" autoplay muted loop playsinline style="object-fit: cover;">
                    <source src="${adData.mediaUrl}" type="video/mp4">
                    <img src="${adData.fallbackImg}">
                </video>
                <a href="${adData.destinationUrl}" target="_blank" 
                   style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:1;">
                </a>`;
        } else {
            // Image Ad HTML
            adContent = `
                <a href="${adData.destinationUrl}" target="_blank">
                    <img src="${adData.mediaUrl}" style="width:100%; height:100%; object-fit: cover; border:none;">
                </a>`;
        }

        adSlot.innerHTML = adContent;
    }
})();