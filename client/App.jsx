import g from '../imports/tools/log'
import React, { useState, useEffect } from 'react'
import { rstream } from '../imports/api/streamers'

const App = () => {



    const [mobiles, setMobiles] = useState([])
    const [countdown, setCountdown] = useState('')




    useEffect(() => {
        rstream.on('getMobilesFromServer', (mobileArray) => {
            setMobiles(mobileArray)
        })
        rstream.on('countdown', countdown_ => {
            setCountdown(new Date(countdown_).addHours(-5).toISOString())
        })
    }, [])
    const sendCommand = (mobil) => {
        rstream.emit('writeCommand', mobil, '>QVR<')
    }
    return (
        <div>
            Main App Pepa
            <h4>Countdown Time {countdown} </h4>
            <ul>
                {mobiles.map((mobil, index) => <li key={mobil.mobileID}> {index} - {mobil.mobileID} - {mobil.readableWritable.toString()}<button onClick={() => sendCommand(mobil.mobileID)}>Send</button> </li>)}
            </ul>
        </div>
    )
}

export default App

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
