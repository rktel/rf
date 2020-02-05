import g from '../../imports/tools/log'
import { createServer } from 'net'
import { rstream } from '../../imports/api/streamers'

function serverTCP(srv, port, host = '0.0.0.0') {
    //variables and constants
    const mobiles = new Map()
    const sendMobilesToWebTimer = 10 * 1000
    // Send mobiles to Web Client
    setInterval(() => {
        deliveryMobiles(Array.from(mobiles.keys()))
    }, sendMobilesToWebTimer)
    //server 
    const server = srv()
    server.listen(port, host)
    server.on('close', () => {
        g('Server TCP Close')
    })
    server.on('error', (serverError) => {
        if (serverError.code == 'EADDRINUSE') {
            g('Address in use, retrying...')
            setTimeout(() => {
                server.close();
                server.listen(port, host);
            }, 1000);
        }
    })
    server.on('connection', (socket) => {
        socket.on('data', (rawData) => {
            const { mobileID } = parseData(rawData)
            if (mobileID) {
                socket.write(mobileID)
                if (!socket['mobileID']) {
                    socket['mobileID'] = mobileID
                    mobiles.set(socket['mobileID'], mobileID)
                }
            }
        })
        socket.on('close', (hadError) => {
            log('socket:close:', socket.mobileID, 'Error Tx:', hadError)
            if (hadError && socket.mobileID) mobiles.delete(socket.mobileID)
        })
        socket.on('error', () => log('socket:error:', socket.mobileID)
        )
        socket.on('end', () => log('socket:end:', socket.mobileID))
    })

    // Process Data
    function parseData(data) {
        let unit = data.toString()
        if (unit.includes('ID=')) {
            unit = unit.split('\r\n')[0]
            unit = unit.split(';')[unit.split(';').length - 1]
            unit = unit.includes('ID=') ? unit.match(/(\d+)/)[0] : undefined
            return {
                mobileID: unit
            }
        }
        return false
    }
    // Stream
    function deliveryMobiles(mobileArray) {
        rstream.emit('deliveryMobiles', mobileArray)
    }
}

serverTCP(createServer, 7100)