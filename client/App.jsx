import React, { useEffect, useState } from 'react';
import { App, View, Page } from 'framework7-react';
import g from '../imports/tools/log';
import rstream from '../imports/api/streamers'

import { Block, BlockTitle, Row, Col, List, ListItem, Toggle } from 'framework7-react'

export default () => {
    {/* Use states */ }
    const [mobilesGroup, setMobilesGroup] = useState([])
    const [textFilterMobile, setTextFilterMobile] = useState('')
    const [mobilesSelected, setMobilesSelected] = useState([])
    const [textCommand, setTextCommand] = useState('')
    {/* Use Effect */ }
    useEffect(() => {
        rstream.on('getMobilesFromServer', (mobiles) => {
            g(mobiles)
            setMobilesGroup(mobiles)
        })
    })
    {/* Clean Text */ }
    const cleanTextFilterMobile = () => setTextFilterMobile('')
    const cleanTextCommand = () => setTextCommand('')
    {/* onChange */ }
    const onChangeTextFilterMobile = (event) => setTextFilterMobile(event.target.value)
    const onChangeTextCommand = (event) => setTextCommand(event.target.value)
    {/* onClick */ }
    const onClickSendCommand = () => mobilesSelected.forEach(mobil => rstream.emit('writeCommand', mobil, textCommand))
    const onClickToggleSelectedMobile = () => mobilesSelected.indexOf(mobil) < 0 ? setMobilesSelected([...mobilesSelected, mobil]) : setMobilesSelected(mobilesSelected.filter(el => el != mobil))
    {/* Middle Components */ }

    {/* Main Render */ }
    return (<App params={{ theme: 'auto', name: 'My App', id: 'com.pe.rktel' }}>


        <View main>
            <Page>
                <Block>
                    <Row>
                        <Col width="25">
                            <BlockTitle>Super Heroes</BlockTitle>
                            <List simpleList>
                                {mobilesGroup.forEach((mobil, index) => (
                                    <ListItem>
                                        <span>{mobil.mobileID}</span>
                                        <Toggle color="green" />
                                    </ListItem>
                                ))}
                            </List>
                        </Col>
                        <Col width="25">25% (.col-25)</Col>
                        <Col width="50">50% (.col-50)</Col>
                    </Row>
                </Block>
            </Page>
        </View>

    </App>)

}