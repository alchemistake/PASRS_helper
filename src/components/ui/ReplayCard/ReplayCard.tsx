import { ReplayRoomState, RoomReplay } from "../../../types/replay";
import './ReplayCard.scss';

export const ReplayCard: React.FC<{ roomReplay: RoomReplay }> = ({ roomReplay }) => {
	const isBattleCompleted = (): boolean => {
		return roomReplay.state === ReplayRoomState.Finished || roomReplay.state === ReplayRoomState.Recorded;
	}

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
				{
					roomReplay.url ? (
						<div className="replay-buttons">
							<i className="fa fa-clipboard" aria-hidden="true" onClick={() => copyToClipboard(roomReplay.url)}></i>
							<i className="fa fa-external-link" aria-hidden="true" onClick={() => window.open(roomReplay.url, "_blank")}></i>
						</div>
					) : null
				}
			</div>
		</div>
	);
}

const copyToClipboard = (url: string) => {
	if (!url) return;

	navigator.clipboard.writeText(url).catch((err) => {
		console.error('Failed to copy text to clipboard:', err);
	});
}