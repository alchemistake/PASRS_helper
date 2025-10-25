function injectScript(file: string): void {
	const s: HTMLScriptElement = document.createElement("script");
	s.src = chrome.runtime.getURL(file);
	s.onload = () => s.remove();
	(document.head || document.documentElement).append(s);
}

function injectStyle(file: string): void {
	const s: HTMLLinkElement = document.createElement("link");
	s.rel = "stylesheet";
	s.href = chrome.runtime.getURL(file);
	(document.head || document.documentElement).append(s);
}


injectScript("dist/lib-react.js");
injectScript("dist/react.js");
injectStyle("dist/react.css");
injectScript("dist/showdown.js");