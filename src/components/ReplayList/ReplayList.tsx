import { ReplayCard } from "../ui/ReplayCard/ReplayCard";
import { useReplays } from "../../hooks/useReplays";
import './ReplayList.scss';
import { ReplayRoomState } from "../../types/replay";

const ReplayList = () => {
	const { replays, clearAllReplays, copyAllReplays } = useReplays();
	var shownReplays = replays.filter(replay => replay.state !== ReplayRoomState.Ignored);

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
							<ReplayCard roomReplay={replay} />
						))
					)}
				</section>

				<footer className="replay-footer">
					<div className="clear-all" onClick={clearAllReplays}>Clear All Replays</div>
					<div className="divider"></div>
					<div className="copy-all" onClick={copyAllReplays}>Copy All Replays</div>
				</footer>
			</section>
		</section>
	)
}

export default ReplayList;