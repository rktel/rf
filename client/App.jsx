import g from '../imports/tools/log'
import React, { useState, useEffect } from 'react'
import { rstream } from '../imports/api/streamers'

const App = () => {
    const [mobiles, setMobiles] = useState([])
    const [countdown, setCountdown] = useState('')

    const [mobileTextFilter, setMobileTextFilter] = useState('')

    const handleOnChangeMobileTextFilter = (event) => {
        setMobileTextFilter(event.target.value)
    }

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
        <div>
            <div className="flex-container">
                <div className="flex-item" style={{ 'background': 'gray' }}>
                    <h4>Countdown Time {countdown} </h4>
                    <input type="text" onChange={handleOnChangeMobileTextFilter} value={mobileTextFilter}/>
                    <table >
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
                                    <td><button onClick={() => sendCommand(mobil.mobileID)}>Send</button></td>
                                </tr>)}
                        </tbody>
                    </table>
                    <br />
                </div>
                <div className="flex-item" style={{ 'background': 'peru' }}> <h4>demo</h4> </div>
            </div>
        </div >
    )
}

export default App

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
