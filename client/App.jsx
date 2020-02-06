import g from '../imports/tools/log'
import React, { useState, useEffect } from 'react'
import { rstream } from '../imports/api/streamers'

const App = () => {
    const [mobiles, setMobiles] = useState([])
    useEffect(() => {
        rstream.on('deliveryMobiles', (mobileArray) => {
            g(mobileArray)
            setMobiles(mobileArray)
        })
    }, [])
    const sendCommand = (mobil) => {
        rstream.emit('command', mobil, '>QVR<')
    }
    return (
        <div>
            Main App Pepa
            <ul>
    {mobiles.map((mobil, index) => <li key={mobil}> {index} - {mobil} <button onClick={() => sendCommand(mobil)}>Send</button> </li>)}
            </ul>
        </div>
    )
}

export default App