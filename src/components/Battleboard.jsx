import Gameboard from "./Gameboard";
import Loser from "../components/Loser";
import Victory from "../components/Victory";
import { useEffect, useState } from "react";
import { useGameContext } from "../contexts/GameContextProvider";
import { useParams } from "react-router-dom";
// import { click } from "@testing-library/user-event/dist/click";
// import { render } from "@testing-library/react";
// import { click } from "@testing-library/user-event/dist/click";

const Battleboard = ({ yourName, enemy, WhoseTurn }) => {
	const { socket, gameUsername } = useGameContext();
	const { game_id } = useParams();
	const [turn, setTurn] = useState();
	const [disabled, setDisabled] = useState(true);

	const whoEnemy = enemy;
	const youName = yourName;

	const [board, setBoard] = useState(Array(100).fill(null));
	const [shipTwo, setShipTwo] = useState([]);
	const [shipTwoSecond, setShipTwoSecond] = useState([]);
	const [shipThree, setShipThree] = useState([]);
	const [shipFour, setShipFour] = useState([]);
	const [shipRemain, setShipRemain] = useState([]);
	const [winner, setWinner] = useState(false);

	const [boardEnemy, setBoardEnemy] = useState(Array(100).fill(null));
	const [shipTwoEnemy, setShipTwoEnemy] = useState([]);
	const [shipTwoSecondEnemy, setShipTwoSecondEnemy] = useState([]);
	const [shipThreeEnemy, setShipThreeEnemy] = useState([]);
	const [shipFourEnemy, setShipFourEnemy] = useState([]);
	const [shipRemainEnemy, setShipRemainEnemy] = useState([]);
	const [winnerEnemy, setWinnerEnemy] = useState(false);
	const [renderBoards, setRenderBoards] = useState(false);

	const [startGame, setStartGame] = useState(false);

	useEffect(() => {
		if (startGame === false) {
			setShips();
		}

		if (startGame === true) {
			socket.emit("ship-data", {
				id: game_id,
				shipTwo: shipTwo,
				shipTwoSecond: shipTwoSecond,
				shipThree: shipThree,
				shipFour: shipFour,
			});
			setTurn(WhoseTurn);
			if (WhoseTurn === yourName) {
				setDisabled(false);
			}
			setRenderBoards(true);
			setStartGame(null);
		}
		// need to fix dependency array
	}, [startGame]);

	const getRandomPosition = (array) => {
		let random = Math.floor(Math.random() * 100);
		if (array.length === 10) {
			if (array.indexOf(random) !== -1) {
				return ++random;
			} else {
				return random;
			}
		}
		if (array.length === 20) {
			if (array.indexOf(random) !== -1) {
				random++;
				if (array.indexOf(random) !== -1) {
					return ++random;
				}
			} else {
				return random;
			}
		}
		if (array.length === 30) {
			if (array.indexOf(random) !== -1) {
				random++;
				if (array.indexOf(random) !== -1) {
					random++;
				}
				if (array.indexOf(random) !== -1) {
					return ++random;
				}
			} else {
				return random;
			}
		}
	};

	const ship2 = () => {
		const startPos = getRandomPosition([
			9, 19, 29, 39, 49, 59, 69, 79, 89, 99,
		]);
		return [startPos, startPos + 1];
	};
	const ship3 = () => {
		const startPos = getRandomPosition([
			8, 9, 18, 19, 28, 29, 38, 39, 48, 49, 58, 59, 68, 69, 78, 79, 88,
			89, 98, 99,
		]);
		return [startPos, startPos + 1, startPos + 2];
	};
	const ship4 = () => {
		const startPos = getRandomPosition([
			7, 8, 9, 17, 18, 19, 27, 28, 29, 37, 38, 39, 47, 48, 49, 57, 58, 59,
			67, 68, 69, 77, 78, 79, 87, 88, 89, 97, 98, 99,
		]);
		return [startPos, startPos + 1, startPos + 2, startPos + 3];
	};

	const setShips = () => {
		setShipRemain([1, 2, 3, 4]);
		setShipRemainEnemy([1, 2, 3, 4]);
		let isReady = true;
		while (isReady) {
			let boardCopy = [...board];
			const randomShip2 = ship2();
			if (
				boardCopy[randomShip2[0]] === null &&
				boardCopy[randomShip2[1]] === null
			) {
				boardCopy[randomShip2[0]] = "ship2";
				boardCopy[randomShip2[1]] = "ship2";
			}

			let randomShip2Second = ship2();
			if (
				boardCopy[randomShip2Second[0]] === null &&
				boardCopy[randomShip2Second[1]] === null
			) {
				boardCopy[randomShip2Second[0]] = "ship2Second";
				boardCopy[randomShip2Second[1]] = "ship2Second";
			}

			let randomShip3 = ship3();
			if (
				boardCopy[randomShip3[0]] === null &&
				boardCopy[randomShip3[1]] === null &&
				boardCopy[randomShip3[2]] === null
			) {
				boardCopy[randomShip3[0]] = "ship3";
				boardCopy[randomShip3[1]] = "ship3";
				boardCopy[randomShip3[2]] = "ship3";
			}

			let randomShip4 = ship4();
			if (
				boardCopy[randomShip4[0]] === null &&
				boardCopy[randomShip4[1]] === null &&
				boardCopy[randomShip4[2]] === null &&
				boardCopy[randomShip4[3]] === null
			) {
				boardCopy[randomShip4[0]] = "ship4";
				boardCopy[randomShip4[1]] = "ship4";
				boardCopy[randomShip4[2]] = "ship4";
				boardCopy[randomShip4[3]] = "ship4";
			}

			if (
				boardCopy[randomShip3[0]] === "ship3" &&
				boardCopy[randomShip2Second[0]] === "ship2Second" &&
				boardCopy[randomShip4[0]] === "ship4"
			) {
				setShipTwo([randomShip2[0], randomShip2[1]]);
				setShipTwoSecond([randomShip2Second[0], randomShip2Second[1]]);
				setShipThree([randomShip3[0], randomShip3[1], randomShip3[2]]);
				setShipFour([
					randomShip4[0],
					randomShip4[1],
					randomShip4[2],
					randomShip4[3],
				]);
				setBoard(boardCopy);
				setStartGame(true);
				isReady = false;
			}
		}
	};

	const shipsRemaining = (shipArray, square, totalShips) => {
		if (shipArray.indexOf(square) !== -1) {
			const shipIndex = shipArray.indexOf(square);
			shipArray.splice(shipIndex, 1);
			if (shipArray.length === 0) {
				totalShips.pop();
			}
		}
	};

	const handleWhoseTurn = (whoTurn) => {
		setTurn(whoTurn);
		console.log("whose turn from emit", whoTurn);
		if (whoTurn === youName) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const handleClick = (clickedSquare) => {
		socket.emit("click-data-hit", game_id, clickedSquare, whoEnemy);
		const boardCopy = [...boardEnemy];
		const clickedShip = boardCopy[clickedSquare];

		if (
			clickedShip !== null &&
			clickedShip !== "missShip" &&
			clickedShip !== "hitShip"
		) {
			boardCopy[clickedSquare] = "hitShip";

			if (clickedShip === "ship3Enemy") {
				shipsRemaining(shipThreeEnemy, clickedSquare, shipRemainEnemy);
				console.log("ship 3 enemy:", shipThreeEnemy);
				console.log("ship remain enemy:", shipRemainEnemy);
			}
			if (clickedShip === "ship4Enemy") {
				shipsRemaining(shipFourEnemy, clickedSquare, shipRemainEnemy);
			}
			if (clickedShip === "ship2Enemy") {
				shipsRemaining(shipTwoEnemy, clickedSquare, shipRemainEnemy);
			}
			if (clickedShip === "ship2SecondEnemy") {
				shipsRemaining(
					shipTwoSecondEnemy,
					clickedSquare,
					shipRemainEnemy
				);
			}
			if (shipRemainEnemy.length === 0) {
				// emit the winner to server
				socket.emit("game-over", gameUsername, game_id);
			}
		} else if (clickedShip === null) {
			boardCopy[clickedSquare] = "missShip";
		}

		setBoardEnemy(boardCopy);
		// setTurn(whoEnemy);
		// setDisabled(true);
		// socket.emit("whose-turn", whoEnemy, game_id);
	};

	socket.on("get-whose-turn", handleWhoseTurn);

	socket.on("get-enemy-click", (attackClick) => {
		let boardCopy = [...board];
		const clickedShip = boardCopy[attackClick];

		if (
			clickedShip !== null &&
			clickedShip !== "missShip" &&
			clickedShip !== "hitShip"
		) {
			boardCopy[attackClick] = "hitShip";
			console.log("hit ship", clickedShip);
			if (clickedShip === "ship3") {
				shipsRemaining(shipThree, attackClick, shipRemain);
			}
			if (clickedShip === "ship4") {
				shipsRemaining(shipFour, attackClick, shipRemain);
			}
			if (clickedShip === "ship2") {
				shipsRemaining(shipTwo, attackClick, shipRemain);
			}
			if (clickedShip === "ship2Second") {
				shipsRemaining(shipTwoSecond, attackClick, shipRemain);
			}
			if (shipRemain.length === 0) {
				setWinnerEnemy(true);
			}
		} else if (clickedShip === null) {
			boardCopy[attackClick] = "missShip";
		}

		setBoard(boardCopy);
		// setTurn(youName);
		// setDisabled(true);
		// socket.emit("whose-turn", youName, game_id);
	});

	socket.on("get-ship-data", (shipData) => {
		let boardCopyEnemy = [...boardEnemy];
		setShipTwoEnemy(shipData.shipTwo);
		boardCopyEnemy[shipData.shipTwo[0]] = "ship2Enemy";
		boardCopyEnemy[shipData.shipTwo[1]] = "ship2Enemy";
		setShipTwoSecondEnemy(shipData.shipTwoSecond);
		boardCopyEnemy[shipData.shipTwoSecond[0]] = "ship2SecondEnemy";
		boardCopyEnemy[shipData.shipTwoSecond[1]] = "ship2SecondEnemy";
		setShipThreeEnemy(shipData.shipThree);
		boardCopyEnemy[shipData.shipThree[0]] = "ship3Enemy";
		boardCopyEnemy[shipData.shipThree[1]] = "ship3Enemy";
		boardCopyEnemy[shipData.shipThree[2]] = "ship3Enemy";
		setShipFourEnemy(shipData.shipFour);
		boardCopyEnemy[shipData.shipFour[0]] = "ship4Enemy";
		boardCopyEnemy[shipData.shipFour[1]] = "ship4Enemy";
		boardCopyEnemy[shipData.shipFour[2]] = "ship4Enemy";
		boardCopyEnemy[shipData.shipFour[3]] = "ship4Enemy";
		setBoardEnemy(boardCopyEnemy);
	});

	socket.on("winner", (username) => {
		if (username === gameUsername) {
			setWinner(true);
		} else if (username !== gameUsername) {
			setWinnerEnemy(true);
		}
	});

	return (
		<>
			{renderBoards && (
				<>
					<div className="turn-tag">
						<h2 className="whose-turn">Whose turn?</h2>{" "}
						<span className="whose-turn-name">{turn}</span>
					</div>

					<div className="game-container">
						<div className="game-board game-board-you">
							<div className="username">
								<span className="game-title">You: </span>
								<span className="game-title-you">
									{gameUsername}
								</span>
							</div>

							<p className="ships-remain-text">
								Ships remaining:{" "}
								<span className="ships-remain-text-bold">
									{shipRemain.length}
								</span>
							</p>
							{!winner && !winnerEnemy && (
								<div className="game-wrapper game-wrapper-you">
									<Gameboard squares={board} />
								</div>
							)}
						</div>

						<div className="game-board game-board-enemy">
							<div className="username">
								<span className="game-title">Enemy: </span>
								<span className="game-title-you">
									{whoEnemy}
								</span>
							</div>

							<p className="ships-remain-text">
								Ships remaining:{" "}
								<span className="ships-remain-text-bold">
									{shipRemainEnemy.length}
								</span>
							</p>
							{!winner && !winnerEnemy && (
								<div className="game-wrapper game-wrapper-enemy">
									<Gameboard
										squares={boardEnemy}
										onClick={disabled ? true : handleClick}
									/>
								</div>
							)}
						</div>
						{winner && <Victory />}
						{winnerEnemy && <Loser />}
					</div>
				</>
			)}
		</>
	);
};

export default Battleboard;
