import { useEffect } from 'react';
import socketio from 'socket.io-client'
import Battleboard from './components/Battleboard';
import './App.css';

const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL)

function App() {
  return (
    <div className="App">
      <p>App</p>

      <Battleboard socket={socket}/>
    </div>
  );
}

export default App;
