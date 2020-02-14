import g from '../imports/tools/log'
import React, { useState, useEffect } from 'react'
import { rstream } from '../imports/api/streamers'

const App = () => {
    const [mobiles, setMobiles] = useState([])
    useEffect(() => {
        rstream.on('getMobilesFromServer', (mobileArray) => {
            g(mobileArray)
            g('true',mobileArray.filter(el => el.readableWritable == true).length)
            g('false', mobileArray.filter(el => el.readableWritable == false).length)
            setMobiles(mobileArray)
        })
    }, [])
    const sendCommand = (mobil) => {
        rstream.emit('writeCommand', mobil, '>QVR<')
    }
    return (
        <div>
            Main App Pepa
            <ul>
    {mobiles.map((mobil, index) => <li key={mobil.mobileID}> {index} - {mobil.mobileID} <button onClick={() => sendCommand(mobil.mobileID)}>Send</button> </li>)}
            </ul>
        </div>
    )
}

export default App