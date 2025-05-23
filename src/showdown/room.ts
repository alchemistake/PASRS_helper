// Original code comes from Showdex. Converted to typescript for maintainability.
// https://raw.githubusercontent.com/doshidak/showdex/045fad2c63fbd941a1bf6b17430e6f4259099b82/src/utils/host/createHtmlRoom.ts

export interface App {
	_addRoom: (id: string, type: string, hidden: boolean, title: string) => Room;
	rooms: Record<string, Room>;
	roomList: Room[];
	sideRoomList: Room[];
	topbar: {
		renderRoomTab: (room: Room | null, roomId: string) => string;
		updateTabbar: () => void;
	};
	focusRoomRight: (id: string) => void;
	focusRoom: (id: string) => void;
	receive: (data: string) => void;
	send: (data: string, room?: string) => void;
	// biome-ignore lint/suspicious/noExplicitAny: I'm not stubbing out the User object from Showdown.
	user: any;
}

interface Room {
	id: string;
	$el: JQuery;
	el: HTMLElement;
	isSideRoom: boolean;
	minWidth: number;
	maxWidth: number;
}

interface CreateHtmlRoomOptions {
	side?: boolean;
	icon?: string;
	focus?: boolean;
	minWidth?: number;
	maxWidth?: number;
}

declare const app: App;

export const createHtmlRoom = (
	id: string,
	title: string,
	options: CreateHtmlRoomOptions = {},
): Room | null => {
	if (typeof app?._addRoom !== "function") {
		return null;
	}

	const { side, icon, focus, minWidth = 320, maxWidth = 1024 } = options;

	let room: Room;

	if (id in app.rooms) {
		room = app.rooms[id];
	} else {
		// create a new room (will add the new room to the app.roomList array)
		room = app._addRoom(id, "html", true, title);

		// remove the initial "Page unavailable" HTML
		room.$el.html("");

		// if a side room, add the room to the sideRoomList (also in the app.rooms object)
		if (side) {
			room.isSideRoom = true;
			const sideRoom = app.roomList.pop();
			if (sideRoom) {
				app.sideRoomList.push(sideRoom);
			}
		}
	}

	if (!room?.el) {
		return null;
	}

	room.minWidth = minWidth;
	room.maxWidth = maxWidth;

	if (icon) {
		// hook directly into renderRoomTab(), which is hacky as hell, but necessary since it gets called pretty frequently
		// (using jQuery to edit the class names isn't viable since the icon will just get replaced again)
		const originalRenderer = app.topbar.renderRoomTab.bind(app.topbar);

		app.topbar.renderRoomTab = function renderCustomRoomTab(
			appRoom: Room | null,
			appRoomId: string,
		): string {
			const roomId = appRoom?.id || appRoomId;
			const buf = originalRenderer(appRoom, appRoomId);

			// set the custom icon for the current room only
			// (note: only HTMLRooms get the 'fa-file-text-o' [Font Awesome Outlined File Text] icon)
			if (roomId === id) {
				return buf.replace("fa-file-text-o", `fa-${icon}`);
			}

			return buf;
		};
	}

	if (focus) {
		app[side ? "focusRoomRight" : "focusRoom"](room.id);
	}

	app.topbar.updateTabbar();

	return room;
};
