import { useReplays } from '../../hooks/useReplays';
import { ReplayCard } from '../ui/ReplayCard/ReplayCard';
import './ReplayList.scss';
import { ReplayRoomState } from '../../types/replay';

const ReplayList = () => {
	const { replays, clearAllReplays, copyAllReplays } = useReplays();
	const shownReplays = replays.filter(
		(replay) => replay.state !== ReplayRoomState.Ignored,
	);

	return (
		<section className="replay-container">
			<div className="replay-header">
				<h3>Replay List</h3>
			</div>

			<section className="replays">
				<section className="replay-list">
					{shownReplays.length === 0 ? (
						<p>No replays available</p>
					) : (
						shownReplays.map((replay) => (
							<ReplayCard key={replay.id} roomReplay={replay} />
						))
					)}
				</section>

				<footer className="replay-footer">
					<button type="button" className="clear-all" onClick={clearAllReplays}>
						Clear All Replays
					</button>
					<div className="divider" />
					<button type="button" className="copy-all" onClick={copyAllReplays}>
						Copy All Replays
					</button>
				</footer>
			</section>
		</section>
	);
};

export default ReplayList;
