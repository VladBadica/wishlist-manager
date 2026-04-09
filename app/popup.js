const saveBtn = document.getElementById("saveBtn");
const linksList = document.getElementById("linksList");

saveBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  chrome.storage.local.get(["links"], (result) => {
    const links = result.links || [];
    links.push({ url, date: new Date().toISOString() });

    chrome.storage.local.set({ links }, renderLinks);
  });
});

function renderLinks() {
  chrome.storage.local.get(["links"], (result) => {
    const links = result.links || [];
    linksList.innerHTML = "";

    links.forEach(link => {
      const li = document.createElement("li");
      li.textContent = link.url;
      linksList.appendChild(li);
    });
  });
}

// Load existing links on open
renderLinks();