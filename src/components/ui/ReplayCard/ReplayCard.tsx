import { ReplayRoomState, type RoomReplay } from '../../../types/replay';
import './ReplayCard.scss';

export const ReplayCard: React.FC<{
	roomReplay: RoomReplay;
	onRemove?: () => void;
}> = ({ roomReplay, onRemove }) => {
	const isBattleCompleted = (): boolean => {
		return (
			roomReplay.state === ReplayRoomState.Finished ||
			roomReplay.state === ReplayRoomState.Recorded
		);
	};

	return (
		<div className="replay-card">
			<section className="replay-info">
				<span className="replay-format">{roomReplay?.format}</span>
				<span className="replay-players">
					{roomReplay.p1} vs {roomReplay.p2}
				</span>
			</section>

			<div className="replay-actions">
				<span className="replay-state">
					{isBattleCompleted() ? roomReplay.result : roomReplay.state}
				</span>
				<div className="replay-buttons">
					{onRemove && (
						<button
							type="button"
							className="fa fa-times"
							onClick={onRemove}
							aria-label="Remove replay"
						/>
					)}
					{roomReplay.url && (
						<>
							<button
								type="button"
								className="fa fa-clipboard"
								onClick={() => copyToClipboard(roomReplay.url)}
								aria-label="Copy replay URL"
							/>
							<a
								href={roomReplay.url}
								rel="noopener noreferrer"
								className="fa fa-external-link"
								aria-label="Open replay in new tab"
							>
								<span className="sr-only">Open replay</span>
							</a>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const copyToClipboard = (url: string) => {
	if (!url) return;

	navigator.clipboard.writeText(url).catch((err) => {
		console.error('Failed to copy text to clipboard:', err);
	});
};
