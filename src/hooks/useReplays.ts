import { useCallback, useEffect, useState } from 'react';
import { onReplaysUpdated } from '../lib/events';
import { ReplaysManager } from '../lib/storage/replays-manager';
import type { ReplayRoomState, RoomReplay } from '../types/replay';
import { useSettings } from './useSettings';

export const useReplays = () => {
	const replaysManager = new ReplaysManager();
	const { settings } = useSettings();

	const [replays, setReplays] = useState<RoomReplay[]>(() =>
		replaysManager.getReplays(),
	);

	const refreshReplays = useCallback(() => {
		setReplays(replaysManager.getReplays());
	}, [replaysManager]);

	const updateRoomState = useCallback(
		(roomId: string, state: ReplayRoomState) => {
			replaysManager.setRoomState(roomId, state);
			refreshReplays();
		},
		[refreshReplays, replaysManager],
	);

	const clearAllReplays = useCallback(() => {
		replaysManager.clearReplays();
		setReplays([]);
	}, [replaysManager]);

	const removeReplay = useCallback(
		(roomId: string) => {
			replaysManager.removeReplay(roomId);
		},
		[replaysManager],
	);

	const copyAllReplays = useCallback(() => {
		const allReplays = replaysManager.getReplays();
		if (allReplays.length === 0) return;
		const replayUrls = allReplays.map((replay) => replay.url).join('\n');
		navigator.clipboard
			.writeText(replayUrls)
			.then(() => {
				console.log('Replays copied to clipboard');
				if (settings.clear_on_copy) {
					clearAllReplays();
				}
			})
			.catch((err) => {
				console.error('Failed to copy replays: ', err);
			});
	}, [replaysManager, clearAllReplays, settings.clear_on_copy]);

	useEffect(() => {
		const removeReplaysListener = onReplaysUpdated((updatedReplays) => {
			setReplays([...updatedReplays]);
		});

		return () => {
			removeReplaysListener();
		};
	}, []);

	return {
		replays,
		updateRoomState,
		clearAllReplays,
		copyAllReplays,
		removeReplay,
	};
};
