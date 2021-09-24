import React from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import countries from "../countries/countries";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
const WeatherView = ({ weather, changeWeather }) => {

    const countr = countries;

    function CountrySelect() {
        return (
          <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={countr}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="20"
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  alt=""
                />
                {option.label} ({option.code}) +{option.phone}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose a country"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />
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
    <div>
      <Typography>{weather.list[0].name}</Typography>
      <CountrySelect/>
    </div>
  );
};

export default WeatherView;
