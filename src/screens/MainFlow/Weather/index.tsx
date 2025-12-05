import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/appNavigator';
import { styles } from './style';
import { CommonText, ScreenWrapper } from '../../../components'; // Import ScreenWrapper
import { colors } from '../../../themes/colors';

type HomeNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'Weather'
>;

const WeatherScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState<string>('');
  const [weatherIcon, setWeatherIcon] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const API_KEY = Config.ACCUWEATER_API_KEY; // Replace with your API key
  const LAT = 23.0225; // Example: Ahmedabad
  const LON = 72.5714;

  const fetchWeather = async () => {
    try {
      // Step 1: Get location key from lat/long
      const locationRes = await axios.get(
        `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search`,
        {
          params: {
            apikey: API_KEY,
            q: `${LAT},${LON}`,
          },
        },
      );

      setCity(locationRes.data.LocalizedName); // city name
      const locationKey = locationRes.data.Key;

      const weatherRes = await axios.get(
        `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}`,
        {
          params: { apikey: API_KEY },
        },
      );

      const weatherData = weatherRes.data[0];
      setWeather(weatherData);
      setWeatherIcon(
        `https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/${
          weatherData?.WeatherIcon < 10
            ? '0' + weatherData?.WeatherIcon
            : weatherData?.WeatherIcon
        }-s.png`,
      );
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <ScreenWrapper style={styles.center}>
        <ActivityIndicator color={colors.ButtonColor} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.center}>
      <CommonText style={styles.city}>{city}</CommonText>
      <CommonText style={styles.date}>
        {weather?.LocalObservationDateTime}
      </CommonText>
      <Image source={{ uri: weatherIcon }} style={styles.icon} />
      <CommonText style={styles.temp}>
        {weather?.Temperature.Metric.Value}°C
      </CommonText>
      <CommonText style={styles.desc}>{weather?.WeatherText}</CommonText>
    </ScreenWrapper>
  );
};

export default WeatherScreen;
