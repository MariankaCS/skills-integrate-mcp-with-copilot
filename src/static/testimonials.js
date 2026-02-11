document.addEventListener("DOMContentLoaded", () => {
  const listDiv = document.getElementById("testimonials-list");
  const form = document.getElementById("testimonial-form");
  const messageDiv = document.getElementById("testimonial-message");

  async function loadTestimonials() {
    try {
      const res = await fetch("/testimonials");
      const items = await res.json();
      if (!Array.isArray(items) || items.length === 0) {
        listDiv.innerHTML = "<p><em>No testimonials yet.</em></p>";
        return;
      }

      listDiv.innerHTML = "";
      items.forEach((t) => {
        const card = document.createElement("div");
        card.className = "activity-card";
        card.innerHTML = `
          <p><strong>${escapeHtml(t.author)}</strong></p>
          <p>${escapeHtml(t.text)}</p>
        `;
        listDiv.appendChild(card);
      });
    } catch (err) {
      listDiv.innerHTML = "<p>Failed to load testimonials.</p>";
      console.error(err);
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const author = document.getElementById("author").value.trim();
    const text = document.getElementById("text").value.trim();
    if (!author || !text) return;

    try {
      const res = await fetch("/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text }),
      });
      const result = await res.json();
      if (res.ok) {
        messageDiv.textContent = "Thanks — your testimonial is submitted for review.";
        messageDiv.className = "message info";
        form.reset();
      } else {
        messageDiv.textContent = result.detail || "Submission failed";
        messageDiv.className = "message error";
      }
    } catch (err) {
      messageDiv.textContent = "Submission failed";
      messageDiv.className = "message error";
      console.error(err);
    }

    messageDiv.classList.remove("hidden");
    setTimeout(() => messageDiv.classList.add("hidden"), 5000);
  });

  loadTestimonials();
});
