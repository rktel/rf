import g from '../imports/tools/log'
import React, { useState, useEffect, useRef } from 'react'
import { rstream } from '../imports/api/streamers'

const App = () => {
    const [mobiles, setMobiles] = useState([])
    const [countdown, setCountdown] = useState('')
    const [mobileTextFilter, setMobileTextFilter] = useState('')

    const [mobilesSelected, setMobilesSelected] = useState([])

    const handleOnChangeMobileTextFilter = (event) => setMobileTextFilter(event.target.value)
    const handleOnClickCleanButton = () => setMobileTextFilter('')
    const handleOnClickAddButton = (mobil) => {
        if (mobilesSelected.indexOf(mobil) < 0) {
            setMobilesSelected([...mobilesSelected, mobil])
        } else {
            setMobilesSelected(mobilesSelected.filter(el => el != mobil))
        }
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
    const MobilesItems = () => {
        return (mobiles.filter(el => el.mobileID.indexOf(mobileTextFilter) >= 0)
            .map((mobil, index) =>
                <tr key={mobil.mobileID}>
                    <td>{index + 1} </td>
                    <td><label><input type="checkbox" name={mobil.mobileID} id={mobil.mobileID} value={mobil.mobileID} />{mobil.mobileID}</label></td>
                    <td><button onClick={() => sendCommand(mobil.mobileID)}>Send</button></td>
                    <td><button onClick={() => handleOnClickAddButton(mobil.mobileID)}>Add</button></td>
                </tr>))
    }
    const MobileSelectedItems = () => {
        return (mobilesSelected.map((mobil, index) =>
            <li key={index}>
                {index + 1} - {mobil}
            </li>
        ))
    }
    return (
        <div>
            <div className="flex-container">
                <div className="flex-item" style={{ 'background': 'gray' }}>
                    <h4>Countdown Time {countdown} </h4>
                    <input placeholder="Buscar IMEI" type="text" onChange={handleOnChangeMobileTextFilter} value={mobileTextFilter} />
                    <button onClick={handleOnClickCleanButton}>CLEAN</button>
                    <table >
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>IMEI</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <MobilesItems />
                        </tbody>
                    </table>
                    <br />
                </div>
                <div className="flex-item" style={{ 'background': 'blue' }}>
                    <h4>Selected</h4>
                    <MobileSelectedItems />
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
