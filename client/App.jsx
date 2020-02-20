import g from '../imports/tools/log'
import React, { useState, useEffect, useRef } from 'react'
import { rstream } from '../imports/api/streamers'

const App = () => {
    const [mobiles, setMobiles] = useState([])
    const [countdown, setCountdown] = useState('')
    const [mobileTextFilter, setMobileTextFilter] = useState('')
    const [mobilesSelected, setMobilesSelected] = useState([])
    const [messageText, setMessageText] = useState('')

    const handleOnChangeMobileTextFilter = (event) => setMobileTextFilter(event.target.value)
    const handleOnClickCleanButton = () => setMobileTextFilter('')
    const handleOnClickAddButton = (mobil) => {
        if (mobilesSelected.indexOf(mobil) < 0) {
            setMobilesSelected([...mobilesSelected, mobil])
        } else {
            setMobilesSelected(mobilesSelected.filter(el => el != mobil))
        }
    }
    const handleOnChangeMessageText = (event) => setMessageText(event.target.value)
    const handleOnClickSendButton = () => {
        mobilesSelected.forEach(mobil => {
            rstream.emit('writeCommand', mobil, messageText)
        })
    }
    const handleOnClickCleanMessageButton = () => setMessageText('')


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
                    <td>{mobil.mobileID}</td>
                    <td><button onClick={() => handleOnClickAddButton(mobil.mobileID)}>ADD</button></td>
                </tr>))
    }
    const MobileSelectedItems = () => {
        return (mobilesSelected.map((mobil, index) =>
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{mobil}</td>
                <td><button onClick={() => handleOnClickAddButton(mobil)}>DEL</button></td>
            </tr>
        ))
    }
    const MessageDrywall = () => {
        return (
            <div>
                <h3>Message</h3>

            </div>
        )
    }
    const ScriptDrywall = () => {
        return (
            <div>
                <h3>Script</h3>
            </div>
        )
    }
    return (
        <div>
            <div className="flex-container">
                <div className="flex-item" style={{ 'background': 'gray' }}>
                    <h4>Countdown Time {countdown} </h4>
                    <input placeholder="Buscar IMEI" id="mobileTextFilter" type="text" onChange={handleOnChangeMobileTextFilter} value={mobileTextFilter} />
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
                <div className="flex-item" style={{ 'background': 'cornflowerblue' }}>
                    <h4>Selected devices</h4>
                    <table >
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>IMEI</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <MobileSelectedItems />
                        </tbody>
                    </table>
                    <br />

                </div>
                <div className="flex-item" style={{ 'background': 'goldenrod' }}>
                    <input placeholder="Message" type="text" id="messageText" onChange={handleOnChangeMessageText} value={messageText} />
                    <button onClick={handleOnClickCleanMessageButton}>CLEAN</button>
                    <button onClick={handleOnClickSendButton}>SEND</button>
                </div>
            </div>
        </div >
    )
}

export default App

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
