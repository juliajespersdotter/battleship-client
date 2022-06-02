import React, { useEffect } from "react";
import "../assets/css/Victory.css";
import winner from "../assets/images/winner.gif";
import underTheSea from "../assets/sounds/underTheSea.mp3";
import useSound from "use-sound";

export default function Victory() {
	const [gameOverMusic, { stop }] = useSound(underTheSea);

	useEffect(() => {
		gameOverMusic();

		return () => {
			stop();
		};
	}, [gameOverMusic, stop]);

	return (
		<div className="wrapper">
			<div className="victory-bg">
				<img src={winner} alt="" />
			</div>
		</div>
	);
}
