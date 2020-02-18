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
            setCountdown(new Date(countdown_).addHours(-5).toISOString().split('T')[1])
        })
    }, [])
    const sendCommand = (mobil) => {
        rstream.emit('writeCommand', mobil, '>QVR<')
    }
    return (
        <div style={{ 'maxHeight': '500px' }}>
            <div className="pure-g">
                <div className="pure-u-1-3" style={{ 'background': 'gray' }}>
                    <h4>Countdown Time {countdown} </h4>
                    <table className="pure-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>IMEI</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {mobiles.map((mobil, index) =>
                                <tr key={mobil.mobileID}>
                                    <td>{index + 1} </td>
                                    <td>{mobil.mobileID}</td>
                                    <td><button className="pure-button button-xsmall" onClick={() => sendCommand(mobil.mobileID)}>Send</button></td>
                                </tr>)}
                        </tbody>
                    </table>
                    <br />
                </div>
                <div className="pure-u-2-3" style={{ 'background': 'peru' }}> <h2>demo</h2> </div>
            </div>
        </div >
    )
}

export default App

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
