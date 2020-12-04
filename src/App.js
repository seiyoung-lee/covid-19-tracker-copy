import React, {useState, useEffect} from "react";
import { MenuItem, Select, FormControl, Card, CardContent } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import InfoBox from './infoBox';
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from './util.js';
import LineGraph from './LineGraph';

import './App.css';
import "leaflet/dist/leaflet.css";



function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746,-40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [showMap, setShowMap] = useState(true);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    const wait = async () => {
      await new Promise((r) => setTimeout(r, 1));
      setShowMap(true);
    };
    setShowMap(false);
    wait();
  }, [mapCenter, casesType]);

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((c) => ({
            name: c.country,
            value: c.countryInfo.iso2,
          }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries)
      })
    }
    getCountries();
    changeValuesData("https://disease.sh/v3/covid-19/all", 'worldwide');
  }, []);

  const changeValuesData = async (url, countryCode) => {
    await fetch(url)
    .then(r => r.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      if(countryCode !== 'worldwide') {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      } else {
        setMapCenter({lat: 34.80746, lng: -40.4796});
        setMapZoom(3);
      }
    })
  }

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    changeValuesData(url, countryCode);
  }

  return (
    <div className="app">
      <div className = "app__left">
        <div className = "app__header">
          <h1>
            COVID-19 Tracker
          </h1>
          <FormControl className = "app__dropdown">
            <Select
            variant = "outlined"
            value = {country}
            onChange = {onCountryChange}
            focused = {false}
            >
              <MenuItem value = "worldwide"> WorldWide </MenuItem>
              {countries.map(c => (
                <MenuItem value = {c.value} key = {c.name}> {c.name} </MenuItem>
              ))}
            </Select>
          </FormControl>
          </div>

          <div className = "app__stats">
            <InfoBox
              isRed = {true} 
              onClick = {(e) => setCasesType('cases')} 
              active = {casesType === 'cases'}
              title = "Coronavirus Cases" 
              cases = {prettyPrintStat(countryInfo.todayCases)} 
              total = {prettyPrintStat(countryInfo.cases)} 
            />
            <InfoBox
              isRed = {false} 
              onClick = {(e) => setCasesType('recovered')} 
              title = "Recovered" 
              active = {casesType === 'recovered'}
              cases = {prettyPrintStat(countryInfo.todayRecovered)} 
              total = {prettyPrintStat(countryInfo.recovered)} 
            />
            <InfoBox
              isRed = {true} 
              onClick = {(e) => setCasesType('deaths')} 
              active = {casesType === 'deaths'}
              title = "Deaths" 
              cases = {prettyPrintStat(countryInfo.todayDeaths)} 
              total = {prettyPrintStat(countryInfo.deaths)} 
            />
          </div>
          {/* Title + select input dropdown field */}

          {/* InfoBoxes */}
          {/* InfoBoxes */}
          {/* InfoBoxes */}

          <Map countries = {tableData} casesType = {casesType} center = {mapCenter} zoom = {mapZoom} show = {showMap}/>
        </div>
        <Card className = "app__right">
          {/* Graph */}
          <CardContent>
            <h3>
              Live Cases by Country
            </h3>
            <Table countries = {tableData}/>
            <h3 style  ={{margin: " 15px 0px"}}>
              Worldwide new {casesType}
            </h3>
            <LineGraph casesType = {casesType}/>
          </CardContent>
        </Card>

    </div>
  );
}

export default App;
