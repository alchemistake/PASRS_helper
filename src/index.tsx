import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

function startReactRender() {
const rootEl = document.getElementById('react-root');
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}
}

startReactRender();

// @ts-ignore : window.app exists within the actual page
window.PASRS = {
	startReactRender,
};