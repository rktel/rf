import React, { useState, useEffect } from 'react'
import { rstream } from '../imports/api/streamers'

const App = () => {
    const [mobiles, setMobiles] = useState([])
    useEffect(() => {
        rstream.on('deliveryMobiles', (mobileArray) => {
            setMobiles(mobileArray)
        })
    }, [])
    return (
        <div>
            Main App
            <ul>
                {mobiles.map((mobil, index) => <li key={mobil}>{mobil}</li>)}
            </ul>
        </div>
    )
}

export default App