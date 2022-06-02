import React, { useEffect } from "react";
import "../assets/css/Loser.css";
import underTheSea from "../assets/sounds/underTheSea.mp3";
import useSound from "use-sound";

export default function Loser(submit) {
	const [gameOverMusic, { stop }] = useSound(underTheSea);

	useEffect(() => {
		gameOverMusic();

		return () => {
			stop();
		};
	}, [gameOverMusic, stop]);

	return (
		<div className="loser-wrapper">
			<div className="wave2">
				<h1 className="wave2-tag">YOU LOST</h1>
			</div>
		</div>
	);
}
