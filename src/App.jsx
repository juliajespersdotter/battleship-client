import { useEffect, useState } from "react";
import socketio from "socket.io-client";

import Login from "./pages/Login";
import "./App.css";

function App() {
	return (
		<div id="App">
			<Login />
		</div>
	);
}

export default App;
