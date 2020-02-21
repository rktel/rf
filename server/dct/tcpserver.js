import g from '../../imports/tools/log'
import { createServer } from 'net'
import rstream from '../../imports/api/streamers'


function serverNET(srv, portServer, hostServer = '0.0.0.0') {
    // VARIABLES
    let mobilesArray = new Map()
    const TIMER_SEND_MOBILES_TO_CLIENT = 1000 * 10
    const TIMER_GENERAL_TIMEOUT_SOCKET = 1000 * 60 * 2
    const TIMER_SERVER_RESTART_INTENT = 1000 * 2
    const KEEP_ALIVE_SOCKET = 1000 * 30
    const COUNTDOWN_TIME = new Date().addMinutes(60) // 60 min
    // ACTION FUNCTIONS
    function sendMobilesToClient(mobilesArray) {
        rstream.emit('getMobilesFromServer', mobilesArray)
        rstream.emit('countdown', COUNTDOWN_TIME)
    }
    // SEND MOBILES TO CLIENT
    setInterval(__ => sendMobilesToClient(Array.from(mobilesArray.values())), TIMER_SEND_MOBILES_TO_CLIENT)
    // SERVER NET
    const server = srv()
    // SERVER LISTEN
    server.listen(portServer, hostServer, u => {
        g('Server TCP UP')
        rstream.emit('countdown', COUNTDOWN_TIME)
    })
    // ON CLOSE SERVER
    server.on('close', __ => g('Server TCP Close'))
    //ON ERROR SERVER
    server.on('error', serverError => {
        if (serverError.code == 'EADDRINUSE') {
            g('Address in use, retrying...')
            setTimeout(__ => {
                server.close();
                server.listen(portServer, hostServer);
            }, TIMER_SERVER_RESTART_INTENT);
        }
    })
    // ON CONNECTIONS SOCKETS ON SERVER
    server.on('connection', socket => {
        // KEEP ALIVE
        socket.setKeepAlive(true, KEEP_ALIVE_SOCKET)
        // SET GENERAL TIMEOUT TO SOCKET
        socket.setTimeout(TIMER_GENERAL_TIMEOUT_SOCKET)

        // STREAMER WRITE COMMAND FROM CLIENT
        rstream.on('writeCommand', (mobileIDFromClient, messageFromClient) => {
            if (socket.mobileID === mobileIDFromClient) {
                const writeCommandSuccess = socket.write(messageFromClient)
                if (writeCommandSuccess) {
                    g(socket.mobileID, 'Mensaje ', messageFromClient, 'enviado!')
                } else {
                    g(socket.mobileID, ' Error al enviar mensaje ', messageFromClient)
                }

            } else {
                // g('MobileID', mobileIDFromClient, 'No registrado en server')
            }
        })
        // SOCKET ON DATA
        socket.on('data', rawData => {

            !rawData.toString().includes('>REV') ? g(rawData.toString()) : false

            const { mobileID } = parseData(rawData)
            if (mobileID) {
                // SEND ACK TO MOBILE
                sendRafaga(socket, mobileID)
                // IS ONCE?
                if (!socket['mobileID']) socket['mobileID'] = mobileID
                mobilesArray = setMobileToMobilesArray(socket, mobilesArray)
            } else {
                g('Trama desconocida o no tratada:', rawData.toString())
            }
        })
        // SOCKET ON TIMEOUT
        socket.on('timeout', __ => { });
        // SOCKET ON CLOSE
        socket.on('close', hadError => g('socket:close:', socket.mobileID, 'Error Tx:', hadError))
        // SOCKET ON ERROR
        socket.on('error', () => g('socket:error:', socket.mobileID))
        // SOCKET ON END
        socket.on('end', () => g('socket:end:', socket.mobileID))
    })

}
// PARSER FUNCTION
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
// Support Functions

function setMobileToMobilesArray(sock, container) {
    const auxiliarContainer = container
    auxiliarContainer.set(sock['mobileID'], {
        mobileID: sock['mobileID']
    })
    return auxiliarContainer
}

Date.prototype.addMinutes = function (m) {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
}

// Server instance
serverNET(createServer, 7100)

function sendRafaga(sock, command) {
    for (let index = 0; index < 10; index++) {
        sock.write(command)
    }
}