import React from 'react'
import "../assets/css/Victory.css"
import winner from "../assets/images/winner.gif"

export default function Victory() {
    return (
        <div className="wrapper">  
            <div className="victory-bg">
                <img src={winner} alt="" />
            </div>
        </div>
    )
}
