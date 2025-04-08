import { isReachableURL, isValidURL } from "./uri.js"

if (chrome?.storage?.sync) {
   console.log("storage available")
}else{
console.error("chrome.storage.sync is not available.")
}


const shortcutSelect = document.getElementById("shortcutSelect");
const statusIcon = document.getElementById('statusIcon');
const settingsBtn = document.getElementById('settings');
const exportBtn = document.getElementById("exportbtn");
const importBtn = document.getElementById("importbtn");
const importFileInput = document.getElementById("importfile");
const editBtn = document.getElementById("editbtn");
const editSelect = document.getElementById("editSelect");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const searchInput = document.getElementById('search');

let selectedEntryIndex = null;

const ICONS = {
  correct: './assets/correct.png',
  wrong: './assets/wrong.png',
  wait: './assets/wait.png'
};

const AVAILABLE_SHORTCUTS = {
  "Alt+Shift+1": "shortcut_1",
  "Alt+Shift+2": "shortcut_2",
  "Alt+Shift+3": "shortcut_3",
  "Alt+Shift+4": "shortcut_4"
};

// Add the default "placeholder" option
const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "Select a shortcut";
defaultOption.disabled = true;
defaultOption.selected = true;
shortcutSelect.appendChild(defaultOption);

// Add options from AVAILABLE_SHORTCUTS
Object.entries(AVAILABLE_SHORTCUTS).forEach(([label, value]) => {
  const option = document.createElement("option");
  option.value = value;           // the command name like "shortcut_1"
  option.textContent = label;     // the display label like "Alt+Shift+1"
  shortcutSelect.appendChild(option);
});

//Save Url and Domain Name
function saveUrl(data) {
  chrome.storage.local.get({ entries: [] }, (stored) => {
    let entries = stored.entries;

    // Find any entry with the same shortcut (but not same name/url)
    const shortcutConflictIndex = entries.findIndex(
      (entry) => entry.shortcut === data.shortcut &&
        entry.name !== data.name &&
        entry.url !== data.url &&
        data.shortcut !== ""
    );

    if (shortcutConflictIndex !== -1) {
      console.log(`Shortcut '${data.shortcut}' reassigned from '${entries[shortcutConflictIndex].name}' to '${data.name}'`);
      entries[shortcutConflictIndex].shortcut = ""; // Clear old shortcut
    }

    // Check for duplicate name or URL
    const existingIndex = entries.findIndex(
      (entry) =>
        entry.name === data.name || entry.url === data.url
    );

    if (existingIndex !== -1) {
      const existing = entries[existingIndex];

      const confirmReplace = confirm(
        `An entry with the same ${existing.name === data.name ? "name" : "URL"} already exists:\n\n` +
        `Name: ${existing.name}\nURL: ${existing.url}\nShortcut: ${existing.shortcut || "None"}\n\n` +
        `Do you want to overwrite it?`
      );

      if (!confirmReplace) {
        console.warn("User canceled overwrite.");
        return;
      }

      entries[existingIndex] = data; // Replace existing
    } else {
      entries.push(data); // Add new
    }

    chrome.storage.local.set({ entries }, () => {
      console.log("Entry saved:", data);
      alert("Entry saved successfully!");
      loadURLList()
    });

    // Reset UI
    selectedEntryIndex = null;
    editSelect.style.display = "none";
    shortcutSelect.selectedIndex = 0;
    statusIcon.src = ICONS.wait;
    linkName.value = "";
    url.value = "";
  });
}


document.addEventListener("DOMContentLoaded", function () {

  // Get DOM Elements
  const linkName = document.getElementById("linkName");
  const url = document.getElementById("url")
  const saveButton = document.getElementById("savebtn")


  saveButton.addEventListener("click", async () => {
    const shortcut = shortcutSelect.value;
    const data = { name: linkName.value.trim(), url: url.value.trim(), shortcut: shortcut }

    console.log("name", data.name)
    console.log("url", data.url)
    console.log("shortcut", data.shortcut)

    if (!data.name || !data.url) {
      alert("Please fill all fields.");
      return;
    }

    statusIcon.src = ICONS.wait;

    const isValid = await isReachableURL(data.url);
    console.log(isValid)
    statusIcon.src = isValid ? ICONS.correct : ICONS.wrong;

    if (isValid) {
      saveUrl(data)
    } else {
      alert("Enter a Valid Url")
    }

  })
});


document.getElementById('fetchbtn').addEventListener('click', async () => {
  // Query current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    const fullUrl = tab.url;
    const domain = new URL(fullUrl).hostname;

    // Fill inputs
    document.getElementById('url').value = fullUrl;
    document.getElementById('linkName').value = domain;
  }
});

exportBtn.addEventListener("click", () => {

  chrome.storage.local.get({ entries: [] }, (result) => {
    const entries = result.entries;

    if (!entries || entries.length === 0) {
      alert("No entries available to export.");
      return;
    }

    // Only export name and url
    const stripped = entries.map(({ name, url, shortcut }) => ({
      name,
      url,
      shortcut
    }));
    
    const json = JSON.stringify(stripped, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "saved_urls.json";
    a.click();
    URL.revokeObjectURL(url);

    alert("Export successful!");
  });
});

// Trigger file picker when import button is clicked
importBtn.addEventListener("click", () => {
  importFileInput.click();
});

// Handle file selection and import
importFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (!Array.isArray(data)) throw new Error("Invalid format");

      const isValidFormat = data.every(
        (item) =>
          typeof item.name === "string" &&
          typeof item.url === "string" &&
          (typeof item.shortcut === "string" || item.shortcut === undefined)
      );
      
      if (!isValidFormat) throw new Error("Invalid entry structure");

      // Load existing entries
      chrome.storage.local.get({ entries: [] }, (result) => {
        const existing = result.entries;

        const existingNames = new Set(existing.map(e => e.name));
        const existingURLs = new Set(existing.map(e => e.url));

        const newEntries = [];
        let skipped = 0;

        data.forEach((entry) => {
          const { name, url, shortcut } = entry;
          if (existingNames.has(name) || existingURLs.has(url)) {
            skipped++;
            return;
          }
        
          newEntries.push({
            name,
            url,
            shortcut: shortcut || ""
          });
        });
        
        const updated = [...existing, ...newEntries];

        chrome.storage.local.set({ entries: updated }, () => {
          alert(`Import completed. Added: ${newEntries.length}, Skipped: ${skipped}`);
        });
      });
    } catch (err) {
      console.error(err);
      alert("Import failed: Invalid file format.");
    }

    importFileInput.value = "";
  };

  reader.readAsText(file);
});

//Edit button Events
editBtn.addEventListener("click", () => {
  chrome.storage.local.get({ entries: [] }, (result) => {
    const entries = result.entries;

    // Clear and show dropdown
    editSelect.innerHTML = "";
    editSelect.style.display = "inline";

    entries.forEach((entry, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = entry.name;
      editSelect.appendChild(option);
    });

    // Optionally select first by default
    if (entries.length > 0) {
      editSelect.selectedIndex = 0;
      const first = entries[0];
      linkName.value = first.name;
      url.value = first.url;
      selectedEntryIndex = 0;
    }
  });
});

// Handle dropdown change
editSelect.addEventListener("change", () => {
  const index = parseInt(editSelect.value);
  selectedEntryIndex = index;

  chrome.storage.local.get({ entries: [] }, (result) => {
    const entry = result.entries[index];
    linkName.value = entry.name;
    url.value = entry.url;
  });
});

settingsBtn.addEventListener("click", () => {
  document.getElementById("mainUI").style.display = "none";
  document.getElementById("settingsUI").style.display = "block";
});

closeSettingsBtn.addEventListener("click", () => {
  document.getElementById("settingsUI").style.display = "none";
  document.getElementById("mainUI").style.display = "block";
});

function loadURLList() {
  const container = document.getElementById("url-list-container");
  container.innerHTML = "";

  chrome.storage.local.get({ entries: [] }, ({ entries }) => {
    entries.forEach((entry, index) => {
      const item = document.createElement("div");
      item.className = "url-item";

      const name = document.createElement("div");
      name.className = "url-name";
      name.textContent = new URL(entry.url).hostname; // Show domain only

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = `<img src="./assets/delete.png" alt="Delete" />`;
      deleteBtn.addEventListener("click", () => {
        entries.splice(index, 1);
        chrome.storage.local.set({ entries }, loadURLList);
      });

      item.appendChild(name);
      item.appendChild(deleteBtn);
      container.appendChild(item);
    });
  });
}

document.addEventListener("DOMContentLoaded", loadURLList);

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const items = document.querySelectorAll('#url-list-container .url-item');

  items.forEach(item => {
    const text = item.querySelector('.url-name').textContent.toLowerCase();
    if (text.includes(query)) {
      item.style.display = 'flex'; // match found, show item
    } else {
      item.style.display = 'none'; // no match, hide item
    }
  });
});