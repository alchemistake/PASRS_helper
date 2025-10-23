function injectScript(file: string) {
	const s: HTMLScriptElement = document.createElement("script");
	s.src = chrome.runtime.getURL(file);
	document.body.appendChild(s);
}

injectScript("dist/showdown.js");