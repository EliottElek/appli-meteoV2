import React, { useEffect, useState } from "react";
import WeatherView from "./components/WeatherView/WeatherView";

const App = () => {
  const [weather, setWeather] = useState("");
  const [url, setUrl] = useState(
    "http://api.openweathermap.org/data/2.5/find?lat=0&lon=0&appid=e2bf6ec9c5eebca89cab32a152fa33e2"
  );
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLongitude(position.coords.longitude.toFixed(3));
      setLatitude(position.coords.latitude.toFixed(3));
    });
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        setWeather(json);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [url]);
  const changeWeather = () => {
    setUrl(
      "https://api.openweathermap.org/data/2.5/find?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=e2bf6ec9c5eebca89cab32a152fa33e2"
    );
  };


  return (
    <div className="mainAppContainer">
      <div className="mainApp">
        <WeatherView weather={weather} changeWeather={changeWeather} />
      </div>
    </div>
  );
};

export default App;
