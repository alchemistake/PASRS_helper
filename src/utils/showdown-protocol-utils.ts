// Message type detection
export function isRoomMessage(data: string): boolean {
	return data.startsWith(">");
}

export function isReplayUploadedMessage(data: string): boolean {
	return data.includes("|popup||html|<p>Your replay has been uploaded!");
}

export function isBattleInitMessage(data: string): boolean {
	return data.includes("|init|battle");
}

export function isWinMessage(data: string): boolean {
	return data.includes("|win|");
}

export function isFormatMessage(data: string): boolean {
	return data.startsWith("|formats|");
}

export function isLoginMessage(data: string): boolean {
	return data.startsWith("|updateuser|");
}

export function isSearchingMessage(data: string): boolean {
	return data.includes("|updatesearch|");
}

export function isBattleFormatMessage(data: string): boolean {
	return data.includes("|tier|");
}

// Command detection
export function isForfeitCommand(data: string): boolean {
	return data === "/forfeit";
}

export function isLeaveViewCommand(data: string): boolean {
	return data.includes("/noreply /leave view-pasrs-helper");
}
