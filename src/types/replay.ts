export interface RoomReplay {
	id: string;
	state: ReplayRoomState;
	url: string;
	format?: string;
	p1: string;
	p2: string;
	result: ReplayRoomResult;	
}

export enum ReplayRoomState {
	Initialized = "initialized",
	Ignored = "ignored",
	OnGoing = "ongoing",
	Finished = "finished",
	Forfeited = "forfeited",
	Recorded = "recorded",
}

export enum ReplayRoomResult {
	Unknown = "unknown",
	Win = "win",
	Loss = "loss",
	Draw = "draw",
}