import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import {
  moderateScale,
  scaledFontSize,
  verticalScale,
} from '../utils/responsive';
import { fonts } from '../themes/fonts';
import { useTranslation } from 'react-i18next';
import CommonText from './CommonText'; // Import CommonText
import { colors } from '../themes/colors';

interface Props {
  length?: number;
  onChangeOtp: (otp: string) => void;
  error?: string;
  value?: string; 
}

const CommonOtpInput: React.FC<Props> = ({
  length = 6,
  onChangeOtp,
  error,
  value = '',
}) => {
 const inputs = useRef<TextInput[]>([]);
  const [otpArray, setOtpArray] = React.useState<string[]>(Array(length).fill(''));

  // ✅ Sync internal state when parent resets value
  React.useEffect(() => {
    if (value === '') {
      setOtpArray(Array(length).fill(''));
      inputs.current[0]?.focus(); // optional: move focus to first input
    }
  }, [value]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otpArray];
    newOtp[index] = text.replace(/[^0-9]/g, '');
    setOtpArray(newOtp);
    onChangeOtp(newOtp.join(''));
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
        <View>
      <View style={styles.row}>
        {otpArray.map((digit, index) => {
          const hasValue = digit !== '';
          const borderColor = error
            ? colors.error
            : hasValue
            ? colors.Secondary
            : colors.Neutrals900;
          const color = hasValue ? colors.black : colors.Neutrals900;

          return (
            <TextInput
              key={index}
              ref={el => (inputs.current[index] = el!)}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              style={[styles.input, { borderColor, color }]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default CommonOtpInput;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  input: {
    width: '15%',
    height: moderateScale(60),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.Neutrals700,
    textAlign: 'center',
    fontSize: scaledFontSize(14),
    backgroundColor: colors.white,
    color: colors.black
  },
  errorText: {
    color: colors.error,
    fontSize: scaledFontSize(10),
    marginTop: verticalScale(5),
    fontFamily: fonts.regular,
    textAlign: 'left',
    fontWeight: '400',
  },
});
