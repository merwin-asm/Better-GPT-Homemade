let currentMode = "Default"; // Set default mode

// Function to toggle dropdown visibility
function toggleDropdown() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.classList.toggle("hidden");
}

// Function to set mode based on dropdown selection
function setMode(mode) {
  const modeBtn = document.getElementById("modes-button");
  currentMode = mode;
  modeBtn.innerHTML = `${mode} <i class="fas fa-chevron-down ml-2"></i>`;
  toggleDropdown();
}

// Event listeners for each mode
document.getElementById("humanize").onclick = () => setMode("Humanize Mode");
document.getElementById("pdf").onclick = () => setMode("PDF Generator");
document.getElementById("default").onclick = () => setMode("Default Mode");

// Send Message function that adapts to the selected mode
function sendMessage() {
  const chatOutput = document.getElementById("chat-output");
  const chatInput = document.getElementById("chat-input");
  const prompt = chatInput.value.trim();

  if (prompt) {
    let apiUrl = "http://localhost:8000/assistant";

    if (currentMode === "PDF Generator") {
      apiUrl = "http://localhost:8000/pdf_ai";
    } else if (currentMode === "Humanize Mode") {
      // Modify the API URL or add parameters if needed for Humanize Mode
      apiUrl = "http://localhost:8000/humanize_assistant";
    }

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-key": localStorage.getItem("authToken"),
        prompt: prompt,
      },
    })
      .then((response) => {
        if (currentMode === "PDF Generator") {
          if (!response.ok) throw new Error("Failed to fetch PDF");
          return response.blob();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (currentMode === "PDF Generator") {
          const url = window.URL.createObjectURL(data);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${prompt}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          const messageItem = document.createElement("li");
          messageItem.textContent = prompt;
          messageItem.classList.add("user-message");

          const replyItem = document.createElement("li");
          replyItem.textContent = data.res;
          replyItem.classList.add("chat-output");

          chatOutput.insertBefore(messageItem, chatOutput.firstChild);
          chatOutput.insertBefore(replyItem, chatOutput.firstChild);
        }

        chatInput.value = ""; // Clear input field
      })
      .catch((error) => console.error("Error:", error));
  }
}
