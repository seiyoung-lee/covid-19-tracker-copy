import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";

import './infoBox.css'

function infoBox({ title, cases, active, isRed, total, ...props }) {
    return (
        <Card className = {`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--selected-red'}`} onClick = {props.onClick}>
            <CardContent>
                <Typography className = "infoBox__title" color = "textSecondary">
                    {title}
                </Typography>

                <h2 className = {`infoBox__cases ${!isRed && 'cases--green'}`}> {cases} </h2>

                <Typography className = "infoBox__total" color = "textSecondary" >
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default infoBox
