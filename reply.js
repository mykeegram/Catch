// reply.js

// Function to create a reply section
export function createReplySection(replyData) {
    try {
        console.log("Creating reply section"); // Debug log
        if (!replyData || !replyData.name || !replyData.text) {
            throw new Error("Invalid reply data");
        }

        const replySection = document.createElement("div");
        replySection.className = "reply-section";
        replySection.innerHTML = `
            <div class="reply-name">${replyData.name}</div>
            <div class="reply-text">${replyData.text}</div>
        `;
        return replySection;
    } catch (error) {
        console.error("Error creating reply section:", error);
        return null;
    }
}
