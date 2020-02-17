import g from '../../imports/tools/log'
import { createServer } from 'net'
import { rstream } from '../../imports/api/streamers'


function serverNET(srv, portServer, hostServer = '0.0.0.0') {
    // VARIABLES
    let mobilesArray = new Map()
    const TIMER_SEND_MOBILES_TO_CLIENT = 1000 * 10  // 10 seconds
    const TIMER_GENERAL_TIMEOUT_SOCKET = 1000 * 60 * 2  // 120 seconds
    const TIMER_CHECK_READABLE_WRITABLE_SOCKET = 1000 * 5 // 5 seconds
    const TIMER_SERVER_RESTART_INTENT = 1000 * 2 // 2 seconds
    const TIMER_SEND_COMMAND_INIT = 1000 * 60 // 60 seconds
    const TIMER_TIMEOUT_NO_READABLE_WRITABLE_SOCK = 1000 * 4 // 4 seconds
    const COMMAND_INIT_TO_MOBILE = '>QID<'
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
    // ACTION FUNCTIONS
    function sendMobilesToClient(mobilesArray) {
        rstream.emit('getMobilesFromServer', mobilesArray)
    }
    // SEND MOBILES TO CLIENT
    setInterval(__ => sendMobilesToClient(Array.from(mobilesArray.values())), TIMER_SEND_MOBILES_TO_CLIENT)
    // SERVER NET
    const server = srv()
    // SERVER LISTEN
    server.listen(portServer, hostServer)
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
        // SET GENERAL TIMEOUT TO SOCKET
        socket.setTimeout(TIMER_GENERAL_TIMEOUT_SOCKET)
        // ONCE SEND SECOND COMMAND INIT
        setTimeout(__ => {
            if (socket.mobileID) socket.write(COMMAND_INIT_TO_MOBILE)
        }, TIMER_SEND_COMMAND_INIT)
        // LOOP CHECK READABLE & WRITEABLE
        setInterval(__ => {
            if (!socket.readable || !socket.writable) {
                if (socket.mobileID) {
                    function setMobileToMobilesArray(sock, container) {
                        const auxiliarContainer = container
                        auxiliarContainer.set(sock['mobileID'], {
                            mobileID: sock['mobileID'],
                            readableWritable: false
                        })
                        return auxiliarContainer
                    }
                    mobilesArray = setMobileToMobilesArray(socket, mobilesArray)
                    socket.setTimeout(TIMER_TIMEOUT_NO_READABLE_WRITABLE_SOCK)
                }
            }
        }, TIMER_CHECK_READABLE_WRITABLE_SOCKET)
        // STREAMER WRITE COMMAND FROM CLIENT
        rstream.on('writeCommand', (mobileIDFromClient, messageFromClient) => {
            if (socket.mobileID === mobileIDFromClient) {
                if (socket.readable && socket.writable) {
                    const writeCommandSuccess = socket.write(messageFromClient)
                    if (writeCommandSuccess) {
                        g(socket.mobileID, 'Mensaje ', messageFromClient, 'enviado!')
                    } else {
                        g(socket.mobileID, ' Error al enviar mensaje ', messageFromClient)
                    }
                } else {
                    g('Socket', mobileIDFromClient, 'No readable/writable')
                }
            } else {
                // g('MobileID', mobileIDFromClient, 'No registrado en server')
            }
        })
        // SOCKET ON DATA
        socket.on('data', rawData => {
            function setMobileToMobilesArray(sock, container) {
                const auxiliarContainer = container
                if (sock.readable && sock.writable) {
                    auxiliarContainer.set(sock['mobileID'], {
                        mobileID: sock['mobileID'],
                        readableWritable: true
                    })

                }
                if (!sock.readable || !sock.writable) {
                    auxiliarContainer.set(sock['mobileID'], {
                        mobileID: sock['mobileID'],
                        readableWritable: false
                    })
                }
                return auxiliarContainer
            }
            rawData.toString().includes('>RVR') ? g(rawData.toString()) : false
            const { mobileID } = parseData(rawData)
            if (mobileID) {
                // SEND ACK TO MOBILE
                socket.write(mobileID)
                socket.write(mobileID)
                // IS ONCE?
                if (!socket['mobileID']) {
                    socket['mobileID'] = mobileID
                    mobilesArray = setMobileToMobilesArray(socket, mobilesArray)
                } else {
                    mobilesArray = setMobileToMobilesArray(socket, mobilesArray)
                }
            } else {
                g('Trama desconocida o no tratada:', rawData.toString())
            }
        })
        // SOCKET ON TIMEOUT
        socket.on('timeout', __ => {
            g('socket timeout', socket.mobileID);
            // socket.end();
            // socket.destroy();
        });
        // SOCKET ON CLOSE
        socket.on('close', hadError => g('socket:close:', socket.mobileID, 'Error Tx:', hadError))
        // SOCKET ON ERROR
        socket.on('error', () => g('socket:error:', socket.mobileID))
        // SOCKET ON END
        socket.on('end', () => g('socket:end:', socket.mobileID))
    })

}

serverNET(createServer, 7100)