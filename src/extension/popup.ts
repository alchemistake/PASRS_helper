import { createPASRSRoom } from "../showdown/frontend";

//@ts-ignore
document.getElementById('settings').addEventListener('click', async () => {
    const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.scripting
        .executeScript({
            // @ts-ignore : createRoom is defined in the page context
            target: { tabId: currentTab.id },
            func: () => createPASRSRoom(),
        })
        .then(() => console.log("injected a function"));
});