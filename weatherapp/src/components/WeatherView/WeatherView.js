import React, { useEffect, useState } from "react";
import { CircularProgress, Typography, Button } from "@material-ui/core";
import countries from "country-region-data";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ModalBox from "./ModalBox/ModalBox";
import wind from "../../assets/images/wind.png";

const WeatherView = () => {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [weather, setWeather] = useState("");
  const [url, setUrl] = useState(
    `https://api.openweathermap.org/data/2.5/find?lat=0&lon=0&appid=${process.env.REACT_APP_WEATHER__API_KEY}`
  );
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [around, setAround] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangeCountry = (event) => {
    setCountry(event.target.value);
  };

  const handleChangeRegion = (event) => {
    setRegion(event.target.value);
    setAround(false);
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLongitude(position.coords.longitude.toFixed(3));
      setLatitude(position.coords.latitude.toFixed(3));
    });
    const fetchData = async () => {
      try {
        updateData();
        if (
          url !==
          `https://api.openweathermap.org/data/2.5/weather?q=&appid=${process.env.REACT_APP_WEATHER__API_KEY}`
        ) {
          const response = await fetch(url);
          const json = await response.json();
          console.log(json);
          setWeather(json);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    const updateData = () => {
      if (around) {
        setUrl(
          `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER__API_KEY}`
        );
      } else {
        setUrl(
          `https://api.openweathermap.org/data/2.5/weather?q=${region}&appid=${process.env.REACT_APP_WEATHER__API_KEY}`
        );
      }
    };
    fetchData();
  }, [around, latitude, longitude, region, url]);

  const DisplayByInput = () => {
    return (
      <>
        {!weather.name ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <div className="infosContainer">
            <img
              className="weather-icon"
              alt={weather.weather[0].icon}
              src={
                "https://openweathermap.org/img/w/" +
                weather.weather[0].icon +
                ".png"
              }
            ></img>
            <Typography variant="h5">{weather.name}, {weather.sys.country}</Typography>
            <Typography variant="h3">
              {(weather.main.temp - 273.15).toFixed(1)} ??C
            </Typography>
          </div>
        )}
      </>
    );
  };
  const MoreInfoByInput = () => {
    return (
      <>
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
        <Typography>
          Feels like : {(weather.main.feels_like - 273.15).toFixed(1)} ??C
        </Typography>
        <Typography>
          Min ?? : {(weather.main.temp_min - 273.15).toFixed(1)} ??C
        </Typography>
        <Typography>
          Max ?? : {(weather.main.temp_max - 273.15).toFixed(1)} ??C
        </Typography>
        <Typography>
          Weather : {weather.weather[0].description} 
        </Typography>
      </>
    );
  };
  const MoreInfoByPosition = () => {
    return (
      <>
        <Typography
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <img className="wind-icon" alt={"wind"} src={wind}></img>:
          {weather.list[0].wind.speed} mph
        </Typography>
        <Typography>
        Feels like : {(weather.list[0].main.feels_like - 273.15).toFixed(1)} ??C
        </Typography>
        <Typography>
          Min ?? : {(weather.list[0].main.temp_min - 273.15).toFixed(1)} ??C
        </Typography>
        <Typography>
          Max ?? : {(weather.list[0].main.temp_max - 273.15).toFixed(1)} ??C
        </Typography>
        <Typography>
          Weather : {weather.list[0].weather[0].description} 
        </Typography>
      </>
    );
  };
  const displayAllInfos = () => {
    return (
      <>
        {weather && !around && weather.name !== undefined && (
          <>
            <DisplayByInput /> <MoreInfoByInput />
          </>
        )}
        {weather.list && around && weather.list[0].name !== undefined && (
          <>
            <DisplayByPosition /> <MoreInfoByPosition />
          </>
        )}
      </>
    );
  };
  const DisplayByPosition = () => {
    return (
      <>
        {!weather.list[0].name ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <div className="infosContainer">
            <img
              className="weather-icon"
              alt={weather.list[0].weather[0].icon}
              src={
                "https://openweathermap.org/img/w/" +
                weather.list[0].weather[0].icon +
                ".png"
              }
            ></img>
            <Typography variant="h5">{weather.list[0].name}, {weather.list[0].sys.country}</Typography>
            <Typography variant="h3">
              {(weather.list[0].main.temp - 273.15).toFixed(1)} ??C
            </Typography>
          </div>
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
      {weather && !around && weather.name !== undefined && DisplayByInput()}
      {weather.list &&
        around &&
        weather.list[0].name !== undefined &&
        DisplayByPosition()}
      <Button variant="outlined" onClick={handleOpen}>
        More info
      </Button>

      {!around && weather.name === undefined && region !== "" && (
        <Typography>
          Sorry... could not find any info on this region :(
        </Typography>
      )}
      {around && weather === undefined && (
        <Typography>Sorry... Could not locate you accuratly...</Typography>
      )}
      {!around && weather.name === undefined && region === "" && (
        <Typography>Select a region to view weather !</Typography>
      )}
      <CountrySelect />
      <Button
        variant="outlined"
        onClick={() => {
          setAround(true);
        }}
      >
        View weather around me
      </Button>
      <ModalBox handleClose={handleClose} open={open}>
        {displayAllInfos()}
      </ModalBox>
    </div>
  );
};

export default WeatherView;
