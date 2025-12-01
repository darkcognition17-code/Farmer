import { StyleSheet } from 'react-native';
import { colors } from '../../../themes/colors';

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WeatherBackground,
    padding: 20,
  },
  city: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.DarkGray,
  },
  date: {
    fontSize: 14,
    color: colors.MediumGray,
    marginVertical: 4,
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.OrangeRed,
    marginVertical: 6,
  },
  desc: {
    fontSize: 20,
    color: colors.DarkGray,
    textTransform: 'capitalize',
  },
  icon: {
    width: 60,
    height: 60,
    marginVertical: 6,
  },
});
