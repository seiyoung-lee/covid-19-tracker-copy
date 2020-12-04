import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from "react-leaflet";

export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a,b) => {
        if(a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    })
    return sortedData;
}

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        // rgb: "rgb(204,16,52)",
        // half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 500
    },
    recovered: {
        hex: "#7dd71d",
        // rgb: "rgb(125,215,29)",
        // half_op: "rgba(125,215,29,0.5)",
        multiplier: 600
    },
    deaths: {
        hex: "#fb4443",
        // rgb: "rgb(251,68,67)",
        // half_op: "rgba(251,68,67, 0.5)",
        multiplier: 1500
    },
    
}

///Draw circles on the map with interactive tooltop
export const showDataOnMap = (data, casesType) => (
    data.map(country => (
        <Circle
            center = {[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity = {0.4}
            color  = {casesTypeColors[casesType].hex}
            fillColor  = {casesTypeColors[casesType].hex}
            radius = {
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className = "info-container" style = {{backgroundColor: "#f3f2f8"}}>
                    <div style = {{
                        width:"100%", 
                        height: "80px", 
                        backgroundImage: `url(${country.countryInfo.flag})`,
                        backgroundSize: "cover",
                        borderRadius: "8px",
                        backgroundPosition: "center",
                        
                    }} />
                    <div>{country.country}</div>
                    <div> Cases: {numeral(country.cases).format("0,0")} </div>
                    <div> Recovered: {numeral(country.recovered).format("0,0")} </div>
                    <div> Deaths: {numeral(country.deaths).format("0,0")} </div>
                </div>
            </Popup>
        </Circle>
    ))
)

export const prettyPrintStat = (stat)  =>  (
    stat ? `+${numeral(stat).format("0.0a")}` : 'No cases of Corona Virus detected'
)