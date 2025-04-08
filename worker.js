chrome.runtime.onInstalled.addListener(() => {
    console.log("LinkPilot: ", "Extension Installed")
})

chrome.runtime.onInstalled.addListener(() => {
    console.log("LinkPilot background worker installed.");
  });
  
  chrome.commands.onCommand.addListener((command) => {
    console.log("Shortcut triggered:", command);
  
    chrome.storage.local.get({ entries: [] }, ({ entries }) => {
      const entry = entries.find(e => e.shortcut === command);
  
      if (entry && entry.url) {
        chrome.tabs.create({ url: entry.url });
        console.log(`Opening URL for ${entry.name}: ${entry.url}`);
      } else {
        console.warn(`No URL found for shortcut: ${command}`);
      }
    });
  });
  