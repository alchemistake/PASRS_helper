import { ReplayRoomResult, ReplayRoomState, RoomReplay } from "../../types/replay";
import { getRoomIdFromData, getUserFromCookies } from "../../utils/showdown-data-utils";
import { dispatchReplaysUpdated, onReplaysUpdated } from "../events";

const replaysStorageKey = 'pasrs_helper_replays';

export class ReplaysManager {
	replays: RoomReplay[] = [];
    private removeReplayUpdateListener?: () => void;
	
	constructor() {
		this.removeReplayUpdateListener = onReplaysUpdated((replays) => {
			this.replays = replays;
		});
	}

	destroy(): void {
		if (this.removeReplayUpdateListener) {
			this.removeReplayUpdateListener();
		}
	}

	getReplays(): RoomReplay[] {
		const stored = sessionStorage.getItem(replaysStorageKey);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch (error) {
				console.warn('Failed to parse stored replays');
			}
		}
		return [];
	}

	getReplay(roomId: string): RoomReplay | undefined {
		const replays = this.getReplays();
		return replays.find(r => r.id === roomId);
	}

	clearReplays(): void {
		sessionStorage.removeItem(replaysStorageKey);
	}

	getRoomState(roomId: string): ReplayRoomState | undefined {
		const replays = this.getReplays();
		const replay = replays.find(r => r.id === roomId);
		return replay ? replay.state : undefined;
	}

	setRoomState(roomId: string, state: ReplayRoomState): void {
		const replays = this.getReplays();
		const index = replays.findIndex(r => r.id === roomId && r.state !== ReplayRoomState.Ignored);
		if (index !== -1) {
			const replay = replays[index];
			if (replay.state === state) return;

			replays[index].state = state;
			this.saveReplays(replays);
		}
	}

	setRoomResult(roomId: string, data: string): void {
		const replays = this.getReplays();
		const index = replays.findIndex(r => r.id === roomId && r.state !== ReplayRoomState.Ignored);
		if (index !== -1) {
			var replay = replays[index];
			replay.state = ReplayRoomState.Finished;

			const lines = data.split('\n');
			const winPrefix = '|win|';
			var winLine = lines.find(line => line.startsWith(winPrefix));
			if (winLine) {
				const winner = winLine.slice(winPrefix.length).trim();
				if (winner === getUserFromCookies()) {
					replay.result = ReplayRoomResult.Win;
				} else {
					replay.result = ReplayRoomResult.Loss;
				}
			}

			this.saveReplays(replays);
		}
	}

	hasRoom(roomId: string): boolean {
		const replays = this.getReplays();
		return replays.some(r => r.id === roomId);
	}

	isRoomIgnored(roomId: string): boolean {
		const replays = this.getReplays();
		const replay = replays.find(r => r.id === roomId);
		return replay ? replay.state === ReplayRoomState.Ignored : false;
	}

	addReplay(data: string): void {
		const replay = this.initReplay(data);
		if (!replay) return;

		const replays = this.getReplays();
		if (replays.some(r => r.id === replay.id)) return; // Avoid duplicates

		replays.push(replay);
		this.saveReplays(replays);
	}

	updateFormatReplay(data: string): void {
		const roomId = getRoomIdFromData(data);
		if (!roomId) return;
		if (!this.hasRoom(roomId)) return;


		const replays = this.getReplays();
		const replay = replays.find(r => r.id === roomId && r.state !== ReplayRoomState.Ignored);
		if (replay && !replay.format) {
			const lines = data.split('\n');
			const tierPrefix = '|tier|';
			const formatLine = lines.find(line => line.startsWith(tierPrefix));

			if (formatLine) {
				const format = formatLine.slice(tierPrefix.length).trim();
				replay.format = format.replace('(Bo3)', '').trim();
				replay.state = ReplayRoomState.OnGoing;
				this.saveReplays(replays);
			}
		}
	}

	updateReplayUrl(roomId: string, url: string): void {
		if (!this.hasRoom(roomId)) return;
		const replays = this.getReplays();
		const replay = replays.find(r => r.id === roomId && r.state !== ReplayRoomState.Ignored);
		if (replay) {
			replay.url = url;
			this.saveReplays(replays);
		}
	}

	private initReplay(data: string): RoomReplay | null {
		if (!data) return null;

		let id = getRoomIdFromData(data);
		if (!id) return null;

		let p1 = '';
		let p2 = '';
		const lines = data.split('\n');
		const titlePrefix = '|title|';
		
		for (const line of lines) {
			if (line.startsWith(titlePrefix)) {
				const title = line.slice(titlePrefix.length).trim();
				const players = title.split(' vs. ');
				if (players.length === 2) {
					p1 = players[0].trim();
					p2 = players[1].trim();
				}
			}
		}

		var user = getUserFromCookies();
		if (!user) return null;
		if (user && p1.toLowerCase() !== user.toLowerCase() && p2.toLowerCase() !== user.toLowerCase()) {
			return null;
		}

		return {
			id: id,
			state: ReplayRoomState.Initialized,
			p1: p1,
			p2: p2,
			result: ReplayRoomResult.Unknown
		} as RoomReplay;
	}

	private saveReplays(replays: RoomReplay[]): void {
		this.replays = replays;
		sessionStorage.setItem(replaysStorageKey, JSON.stringify(replays));
		dispatchReplaysUpdated(replays);
	}
}