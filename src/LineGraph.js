import React, {useEffect, useState} from 'react';
import { Line } from "react-chartjs-2";
import numeral from 'numeral';



const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
};

function LineGraph( {casesType = 'cases'} ) {
    const [data, setData] = useState([]);

    useEffect(()=> {
        const fetchData = async () => {
           await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(r => r.json())
            .then(data => {
                const chartData = buildChartData(data);
                setData(chartData);
            })
        }
        fetchData();
    }, [casesType])

    const buildChartData  = (data) => {
        const chartData = [];
        let lastDataPoint;
        for(let date in data[casesType]) {
            if(lastDataPoint) {
                const newPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

    return (
        <div style = {{flexGrow: 1}}>
            <Line 
            options = {options}
            data = {{
                datasets: [
                    {
                        backgroundColor:"rgba(204, 16, 52, 0.5)",
                        borderColor: "#CC1034",
                        data: data,
                    },
                ],
            }}
            />
        </div>
    )
}

export default LineGraph
