import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface WeatherInfo {
  temperature: number;
  description: string;
  icon: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface WeatherHook {
  getGeolocation: () => void;
  getWeatherByLocation: (location: LocationData) => void;
  weatherInfo: WeatherInfo | null;
  loading: boolean;
}

const useWeather = (): WeatherHook => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = React.useState({
    lat: 0,
    long: 0,
  });

  const getGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData({ lat: latitude, long: longitude });
        },
        (error) => {
          toast.error("Geolocation Error, please reload!.");
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      toast.error("Geolocation not available");
      console.error("Geolocation not available");
    }
  };

  const getWeatherByLocation = async () => {
    const { lat, long } = locationData;
    setLoading(true);
    try {
      //   const apiKey = "f3470b3eb557433a95c22231232308";
      const apiKey2 = "c9a1504ee3d9c57e2e1a75831056e20a";
      //   const url = `http://api.weatherapi.com/v1/current.json?q=${lat},${long}&key=${apiKey}`;
      const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey2}&units=metric`;

      const res = await fetch(url2);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        const weather: WeatherInfo = {
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        };
        setWeatherInfo(weather);
      } else {
        console.error("Weather API request failed");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGeolocation();
    getWeatherByLocation();
  }, []);

  return {
    getGeolocation,
    getWeatherByLocation,
    weatherInfo,
    loading,
  };
};

export default useWeather;
