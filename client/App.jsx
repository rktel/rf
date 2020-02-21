import React, { useEffect, useState } from 'react';
import { App, View, Page } from 'framework7-react';
import g from '../imports/tools/log';
import rstream from '../imports/api/streamers'

{/*Components*/ }
import { Block, BlockTitle, Row, Col, List, ListItem, Searchbar, Button,Input } from 'framework7-react'

export default () => {
    {/* Use states */ }
    const [mobilesGroup, setMobilesGroup] = useState([])
    const [textFilterMobile, setTextFilterMobile] = useState('')
    const [mobilesSelected, setMobilesSelected] = useState([])
    const [textCommand, setTextCommand] = useState('')
    {/* Use Effect */ }
    useEffect(() => {
        rstream.on('getMobilesFromServer', (mobiles) => setMobilesGroup([...mobiles]))
    }, [])
    {/* Clean Text */ }
    const cleanTextFilterMobile = () => setTextFilterMobile('')
    const cleanTextCommand = () => setTextCommand('')
    {/* onChange */ }
    const onChangeTextFilterMobile = (event) => setTextFilterMobile(event.target.value)
    const onChangeTextCommand = (event) => setTextCommand(event.target.value)
    {/* onClick */ }
    const onClickSelectedMobile = (mobil) => mobilesSelected.indexOf(mobil) < 0 ? setMobilesSelected([...mobilesSelected, mobil]) : setMobilesSelected(mobilesSelected.filter(el => el != mobil))
    const onClickSendCommand = () => mobilesSelected.forEach(mobil => rstream.emit('writeCommand', mobil, textCommand))
    {/* Middle Components */ }

    {/* Main Render */ }
    return (<App params={{ theme: 'auto', name: 'My App', id: 'com.pe.rktel' }}>


        <View main>
            <Page>
                <Block>
                    <Row>
                        <Col width="25">
                            <BlockTitle>Devices</BlockTitle>
                            <Searchbar
                                placeholder="IMEI"
                                value={textFilterMobile}
                                onChange={onChangeTextFilterMobile}
                                onClickClear={cleanTextFilterMobile}
                            ></Searchbar>
                            <List simpleList>
                                {mobilesGroup
                                    .filter(item => item.mobileID.indexOf(textFilterMobile) >= 0)
                                    .map((mobil, index) => (
                                        <ListItem key={mobil.mobileID}>
                                            <strong>{index + 1}</strong> =>
                                        <span>{mobil.mobileID}</span>
                                            <Button onClick={() => onClickSelectedMobile(mobil.mobileID)} >Add</Button>
                                        </ListItem>
                                    ))}
                            </List>
                        </Col>
                        <Col width="25">
                            <BlockTitle>Selected devices</BlockTitle>
                            <List simpleList>
                                {mobilesSelected.map((mobileID, index) => (
                                    <ListItem key={mobileID}>
                                        <strong>{index + 1}</strong> =>
                                        <span>{mobileID}</span>
                                    </ListItem>
                                ))}
                            </List>
                        </Col>
                        <Col width="50">
                            <BlockTitle>Message</BlockTitle>
                            <Input
                                type="text"
                                placeholder="Message"
                                clearButton
                                onInputClear={cleanTextCommand}
                                value={textCommand}
                                onChange={onChangeTextCommand}
                            />
                        </Col>
                    </Row>
                </Block>
            </Page>
        </View>

    </App>)

}