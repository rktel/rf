import g from '../imports/tools/log'
import React, { useState, useEffect } from 'react'
import { rstream } from '../imports/api/streamers'

const App = () => {



    const [mobiles, setMobiles] = useState([])
    const [countdown, setCountdown] = useState('')
    const [countdownTimer, setCountdownTimer] = useState('')



    useEffect(() => {
        rstream.on('getMobilesFromServer', (mobileArray) => {
            setMobiles(mobileArray)
        })
        rstream.on('countdown', countdown_ => {
            setCountdown(countdown_.toISOString())
            //******************* */

            var countDownDate = countdown.getTime();

            // Update the count down every 1 second
            var x = setInterval(function () {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setCountdownTimer(minutes, ':', seconds)
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(x);
                    //document.getElementById("demo").innerHTML = "EXPIRED";
                }
            }, 1000);

            //********************************************* */
        })
    }, [])
    const sendCommand = (mobil) => {
        rstream.emit('writeCommand', mobil, '>QVR<')
    }
    return (
        <div>
            Main App Pepa
            <h4>Countdown Time {countdown} - {countdownTimer}</h4>
            <ul>
                {mobiles.map((mobil, index) => <li key={mobil.mobileID}> {index} - {mobil.mobileID} - {mobil.readableWritable.toString()}<button onClick={() => sendCommand(mobil.mobileID)}>Send</button> </li>)}
            </ul>
        </div>
    )
}

export default App

