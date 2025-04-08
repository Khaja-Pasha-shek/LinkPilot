export function debugListEntries() {
    chrome.storage.local.get({ entries: [] }, (result) => {
        const entries = result.entries;

        if (entries.length === 0) {
            console.log("🔍 No entries found in storage.");
            return;
        }

        console.log(`${entries.length} Saved Entr${entries.length === 1 ? "y" : "ies"}:\n`);

        entries.forEach((entry, index) => {
            console.log(
                `#${index + 1}\n` +
                `  🏷️ Name    : ${entry.name}\n` +
                `  🔗 URL     : ${entry.url}\n` +
                `  ⌨️ Shortcut: ${entry.shortcut}\n`
            );
        });
    });
}

export function clearEntries() {
    chrome.storage.local.set({ entries: [] }, () => {
        console.log("All entries cleared.");
        alert("All saved entries have been deleted.");
    });
}


export function logStorageEntries() {
    chrome.storage.local.get({ entries: [] }, (result) => {
        console.log("🔍 Current Entries:", result.entries);
    });
}

export function addDummyEntries() {
    const dummy = [
        { name: "Google", url: "https://www.google.com", shortcut: "shortcut_1" },
        { name: "GitHub", url: "https://github.com", shortcut: "shortcut_2" },
        { name: "YouTube", url: "https://youtube.com", shortcut: "shortcut_3" }
    ];

    chrome.storage.local.set({ entries: dummy }, () => {
        console.log("🐒 Dummy entries added.");
    });
}

export function getShortcutCommandMapping() {
    chrome.commands.getAll((commands) => {
        console.log("⌨️ Shortcut Commands Registered:");
        commands.forEach((cmd) => {
            console.log(`${cmd.name}: ${cmd.shortcut}`);
        });
    });
}

export function simulateShortcut(commandName) {
    chrome.storage.local.get({ entries: [] }, ({ entries }) => {
        const found = entries.find(entry => entry.shortcut === commandName);
        if (found) {
            console.log(`🧪 Simulating: Opening "${found.name}" => ${found.url}`);
            chrome.tabs.create({ url: found.url });
        } else {
            console.warn(`⚠️ No entry found for shortcut "${commandName}"`);
        }
    });
}


// Expose to console
window.clearEntries = clearEntries;
window.debugListEntries = debugListEntries;
window.logStorageEntries = logStorageEntries
window.simulateShortcut = simulateShortcut
window.getShortcutCommandMapping = getShortcutCommandMapping
window.addDummyEntries = addDummyEntries