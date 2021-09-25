import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Button } from "@material-ui/core";
import countries from "country-region-data";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import wind from "../../assets/images/wind.png";
const WeatherView = () => {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [weather, setWeather] = useState("");
  const [url, setUrl] = useState(
    `http://api.openweathermap.org/data/2.5/find?lat=0&lon=0&appid=${process.env.REACT_APP_WEATHER__API_KEY}`
  );
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [around, setAround] = useState(false);
  const handleChangeCountry = (event) => {
    setCountry(event.target.value);
  };

  const handleChangeRegion = (event) => {
    setRegion(event.target.value);
    setAround(false);
  };
  console.log(weather);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLongitude(position.coords.longitude.toFixed(3));
      setLatitude(position.coords.latitude.toFixed(3));
    });
    const setWeatherAround = () => {
      setUrl(
        `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER__API_KEY}`
      );
    };
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log("fetched");
        setWeather(json);
      } catch (error) {
        console.log("error", error);
      }
    };
    const updateData = () => {
      if (!around) {
        setUrl(
          `https://api.openweathermap.org/data/2.5/weather?q=${region}&appid=${process.env.REACT_APP_WEATHER__API_KEY}`
        );
      } else {
        setWeatherAround();
      }
    };
    fetchData();
    updateData();
  }, [around, latitude, longitude, region, url]);

  const displayInfos = (weather) => {
    return (
      <>
        {!around ? (
          <div className="infosContainer">
            <img
              className="weather-icon"
              alt={weather.weather[0].icon}
              src={
                "http://openweathermap.org/img/w/" +
                weather.weather[0].icon +
                ".png"
              }
            ></img>
            <Typography variant="h5">{weather.name}</Typography>
            <Typography variant="h3">
              {(weather.main.temp - 273.15).toFixed(1)} °C
            </Typography>
            <Typography
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <img className="wind-icon" alt={"wind"} src={wind}></img>:
              {weather.wind.speed} mph
            </Typography>
          </div>
        ) : (
          <div></div>
        )}
      </>
    );
  };
  function CountrySelect() {
    return (
      <div>
        <FormControl style={{ margin: 12, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Country</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Country"
            value={country}
            onChange={handleChangeCountry}
          >
            {countries.map((country) => (
              <MenuItem
                value={country.countryName}
                key={country.countryShortCode}
              >
                {country.countryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ margin: 12, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Region</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Region"
            value={region}
            onChange={handleChangeRegion}
            disabled={!country}
          >
            {country
              ? countries
                  .find(({ countryName }) => countryName === country)
                  .regions.map((region) => (
                    <MenuItem value={region.name} key={region.shortCode}>
                      {region.name}
                    </MenuItem>
                  ))
              : []}
          </Select>
        </FormControl>
      </div>
    );
  }
  if (!weather) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="panelContainer">
      {weather.name !== undefined && displayInfos(weather)}
      {weather.name === undefined && region !== "" && (
        <Typography>
          Sorry... could not find any info on this region :(
        </Typography>
      )}
      {weather.name === undefined && region === "" && (
        <Typography>Select a region to view weather !</Typography>
      )}
      <CountrySelect />
      <Button
        onClick={() => {
          setAround(true);
        }}
      >
        View weather around me
      </Button>
    </div>
  );
};

export default WeatherView;
