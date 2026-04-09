const saveBtn = document.getElementById("saveBtn");
const linksList = document.getElementById("linksList");

saveBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  chrome.storage.local.get(["links"], (result) => {
    const links = result.links || [];
    const duplicate = links.find(link => link.url === url);

    if (duplicate) {
      renderLinks(url);
      return;
    }

    links.push({ url, date: new Date().toISOString() });
    chrome.storage.local.set({ links }, () => renderLinks(url));
  });
});

function renderLinks(highlightUrl) {
  function createSpan(link, index) {
    const span = document.createElement("span");
    span.textContent = `${index + 1}. ${link.url}`;
    return span;
  }

  function createDeleteButton(links, link) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      const updated = links.filter(l => l.url !== link.url);
      chrome.storage.local.set({ links: updated }, renderLinks);
    });

    return deleteBtn;
  }

  chrome.storage.local.get(["links"], (result) => {
    const links = result.links || [];
    linksList.innerHTML = "";

    links.forEach((link, index) => {
      const li = document.createElement("li");
      const span = createSpan(link, index);

      li.appendChild(span);
      if (highlightUrl && link.url === highlightUrl) {
        li.classList.add("li-highlight");
      }

      const deleteBtn = createDeleteButton(links, link);

      li.appendChild(deleteBtn);
      linksList.appendChild(li);
    });
  });
}

// Load existing links on open
renderLinks();