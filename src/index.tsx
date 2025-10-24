import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { App as ShowdownRoomApp } from './lib/showdown/room';

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

window.PASRS = {
	startReactRender,
};

declare global {
	interface Window {
		PASRS: {
			startReactRender: () => void;
		};
		app: ShowdownRoomApp
	}
}