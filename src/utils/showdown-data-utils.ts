/**
 * Extract the room ID from the raw data string.
 * @param data - The raw data string from Showdown
 * @returns The extracted room ID	
 */
export function getRoomIdFromData(data: string): string {
	const lines = data.split('\n');
	const roomRecievedPrefix = '>';
	const battlePrefix = 'battle-';
	const battleLine = lines.find(line => line.startsWith(roomRecievedPrefix + battlePrefix));
	if (!battleLine) return '';
	return battleLine.replace(roomRecievedPrefix, '').trim();
}

/**
 * Extracts the room ID from a given replay URL.
 * @param url - The replay URL string
 * @returns The extracted room ID, or an empty string if the URL format is invalid
 */
export function getRoomIdFromURL(url: string): string {
	const urlPrefix = 'https://replay.pokemonshowdown.com/';
	if (!url.startsWith(urlPrefix)) return '';
	var id = url.replace(urlPrefix, '').trim();

	return 'battle-' + id;
}

/**
 * Extracts a URL starting with "https://" from the given string data.
 * The URL is expected to end before the substring '" target='.
 *
 * @param data - The string containing the URL to extract.
 * @returns The extracted URL, or an empty string if not found.
 */
export function getUrlFromData(data: string): string {
	return data.slice(data.indexOf("https://"), data.indexOf('" target='));
}

/**
 * Extracts format names from a given Showdown data string.
 *
 * The function searches for a line containing "|formats|" and then parses the data,
 * extracting format names from segments that contain a comma and are enclosed in square brackets.
 *
 * @param data - The raw Showdown data string to parse.
 * @returns An array of format names extracted from the data. Returns an empty array if no formats are found.
 */
export function getFormatFromData(data: string): string[] {
	if (!data) return [];

	const formatsLine = data.split("\n").find(line => line.includes("|formats|"));
	if (!formatsLine) return [];

	const parts = data.split('|');

	const formats: string[] = [];

	for (const part of parts) {
		// Skip empty parts or parts that are just numbers
		if (!part || /^\d+$/.test(part)) continue;

		// Look for parts that contain a comma and are enclosed in square brackets
		if (part.includes(',') && part.includes('[') && part.includes(']')) {
			const [name] = part.split(',');
			formats.push(name.trim());
		}
	}

	return formats;
}

/**
 * Retrieves the username of the logged-in user from browser cookies.
 * @returns The username if found, otherwise null.
 */
export function getUserFromCookies(): string | null {
	const match = document.cookie.match(new RegExp('(^| )showdown_username=([^;]+)'));
	if (match) {
		return decodeURIComponent(match[2]);
	}
	return null;
}