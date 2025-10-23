import { createPASRSRoom } from "./frontend";
import { App } from "./room";
import { autoPlaySettings } from "./storage";

declare const app: App;

enum RoomState {
	OnGoing = "ongoing",
	Finished = "finished",
	Recorded = "recorded",
}
const rooms: Map<string, RoomState> = new Map();
const appReceive = app.receive.bind(app);
const appSend = app.send.bind(app);

app.receive = (data: string) => {
	if (!autoPlaySettings.active) {
		appReceive(data);
		return;
	}

	if (data.includes("|popup||html|<p>Your replay has been uploaded!")) {
		const url = data.slice(data.indexOf("https://"), data.indexOf('" target='));
		const parts = url.split("/");

		const roomId = `battle-${parts[parts.length - 1]}`;
		if (rooms.get(roomId) === RoomState.Finished) {
			if (autoPlaySettings.use_clipboard) {
				setTimeout(function clipboardFunction() {
					navigator.clipboard
						.writeText(url)
						.then(() => {
							if (autoPlaySettings.notifications)
								new Notification("Your replay has been uploaded!");
						})
						.catch(() => {
							setTimeout(clipboardFunction, 250);
						});
				}, 0);
			}

			$("#pasrs_games").append(
				`<li><a href="${url}" target="_blank">${url}</a></li>`,
			);
			rooms.set(roomId, RoomState.Recorded);
		} else {
			appReceive(data);
		}
	} else {
		appReceive(data);

		let receivedRoom = data.startsWith(">");
		const data_split = data.split("-");

		// VGC only filter
		if (
			autoPlaySettings.vgc_only &&
			data_split &&
			data_split.length > 1 &&
			!data_split[1].includes("vgc")
		) {
			receivedRoom = false;
		}

		// Custom replay filter
		if (
			autoPlaySettings.use_custom_replay_filter &&
			data_split &&
			data_split.length > 1 &&
			!data_split[1].includes(autoPlaySettings.custom_replay_filter)
		) {
			receivedRoom = false;
		}

		if (receivedRoom) {
			const roomId = data.slice(1, data.indexOf("\n"));
			if (!rooms.has(roomId) || rooms.get(roomId) !== RoomState.Recorded) {
				if (data.includes("|init|battle")) {
					const lines = data.split("\n");
					if (lines[2].includes(app.user.attributes.name)) {
						rooms.set(roomId, RoomState.OnGoing);
					}
				}
				if (data.includes("|win|") && rooms.get(roomId) === RoomState.OnGoing) {
					app.send("/savereplay", roomId);
					rooms.set(roomId, RoomState.Finished);
				}
			}
		}
	}
};

app.send = (data: string, roomId?: string) => {
	appSend(data, roomId);
	if (
		autoPlaySettings.active &&
		data === "/forfeit" &&
		roomId &&
		rooms.get(roomId) === "ongoing"
	) {
		appSend("/savereplay", roomId);
		rooms.set(roomId, RoomState.Finished);
	}
	// if (data.includes("/noreply /leave view-pasrs-helper")) {
	// 	setTimeout(createPASRSRoom, 0);
	// }
};

// poor mans await.
let roomTimer = setTimeout(function roomCreator() {
	// @ts-ignore : window.app exists within the actual page
	if (window.app) {
		clearTimeout(roomTimer);
		createPASRSRoom();
	} else {
		roomTimer = setTimeout(roomCreator, 250);
	}
}, 0);

// @ts-ignore : window.app exists within the actual page
window.PASRS = {
	createPASRSRoom: createPASRSRoom,
}