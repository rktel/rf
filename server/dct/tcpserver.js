import g from '../../imports/tools/log'
import { createServer } from 'net'
import { rstream } from '../../imports/api/streamers'


const servidor = createServer()
servidor.on('connection', soq => {
    soq.readable;
    soq.writable
})

function serverTCP(srv, port, host = '0.0.0.0') {
    //variables and constants
    const mobiles = new Map()
    const toWebTimer = 1000 * 10
    const socketTimeout = 1000 * 60 * 5
    const checkReadableWritableTimer = 1000 * 60 * 2
    const CMD_INIT = '>QID<'
    // Send mobiles to Web Client
    setInterval(() => {
        deliveryMobiles(Array.from(mobiles.keys()))
    }, toWebTimer)
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
        socket.setTimeout(socketTimeout);
        setInterval(() => {
            if (socket.readable && socket.writable) {
                //  g(socket.mobileID, 'readable and writable')
            } else {
                socket.setTimeout(1000)
            }
        }, checkReadableWritableTimer)
        rstream.on('command', (cmdMobileID, cmdMessage) => {
            if (socket.mobileID === cmdMobileID) {
                const sendSuccess = socket.write(cmdMessage)
                g('Writable:', socket.writable, 'Readable:', socket.readable, 'Envio de comando ', cmdMessage, 'de ', cmdMobileID, ':', sendSuccess)
            }
        })
        socket.on('data', (rawData) => {
            const { mobileID } = parseData(rawData)
            rawData.toString().includes('>RVR') ? g(rawData.toString()) : false
            if (mobileID) {
                // g(mobileID)
                socket.write(mobileID)
                if (!socket['mobileID']) {
                    socket['mobileID'] = mobileID
                    mobiles.set(socket['mobileID'], mobileID)
                    socket.write(CMD_INIT)
                }
            }
        })
        socket.on('timeout', () => {
            // g('socket timeout', socket.mobileID);
            socket.end();
            socket.destroy();
            mobiles.delete(socket.mobileID)
        });
        socket.on('close', (hadError) => {
            g('socket:close:', socket.mobileID, 'Error Tx:', hadError)
            // if (hadError && socket.mobileID) mobiles.delete(socket.mobileID)
        })
        socket.on('error', () => g('socket:error:', socket.mobileID)
        )
        socket.on('end', () => g('socket:end:', socket.mobileID))
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