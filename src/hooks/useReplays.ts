import { useState, useCallback, useEffect } from 'react';
import { ReplaysManager } from '../lib/storage/replays-manager';
import { RoomReplay, ReplayRoomState } from '../types/replay';
import { onReplaysUpdated } from '../lib/events';

export const useReplays = () => {
	const replaysManager = new ReplaysManager();

	const [replays, setReplays] = useState<RoomReplay[]>(() =>
		replaysManager.getReplays()
	);

	const refreshReplays = useCallback(() => {
		setReplays(replaysManager.getReplays());
	}, []);

	const updateRoomState = useCallback((roomId: string, state: ReplayRoomState) => {
		replaysManager.setRoomState(roomId, state);
		refreshReplays();
	}, [refreshReplays]);

	const clearAllReplays = useCallback(() => {
		replaysManager.clearReplays();
		setReplays([]);
	}, []);

	const copyAllReplays = useCallback(() => {
		const allReplays = replaysManager.getReplays();
		if (allReplays.length === 0) return;
		const replayUrls = allReplays.map(replay => replay.url).join('\n');
		navigator.clipboard.writeText(replayUrls).then(() => {
			console.log('Replays copied to clipboard');
		}).catch(err => {
			console.error('Failed to copy replays: ', err);
		});
	}, [replaysManager]);

	useEffect(() => {
		const removeReplaysListener = onReplaysUpdated((updatedReplays) => {
			setReplays([...updatedReplays]);
		});

		return () => {
			removeReplaysListener();
		};
	}, [replaysManager]);

	return {
		replays,
		updateRoomState,
		clearAllReplays,
		copyAllReplays,
	};
};