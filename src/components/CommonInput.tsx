import React, { useState, useEffect, ReactNode } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  FocusEvent,
  Platform,
  ViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { moderateScale } from '../utils/responsive';
import { colors } from '../themes/colors';
import { useTranslation } from 'react-i18next';
import CommonText from './CommonText';

interface CommonInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowedCharsRegex?: RegExp;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: ViewStyle;
  value: number | string;
}

const CommonInput: React.FC<CommonInputProps> = ({
  label,
  required,
  error,
  style,
  minLength,
  maxLength,
  pattern,
  value,
  onChangeText,
  containerStyle,
  onBlur,
  onFocus,
  leftIcon,
  rightIcon,
  allowedCharsRegex,
  ...props
}) => {
  const { t } = useTranslation();
  const [internalError, setInternalError] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  // ✅ Validation logic
  const validate = (val: string) => {
    if (required && !val) {
      return t('commonInput.requiredField');
    }
    if (pattern && val && !pattern.test(val)) {
      return t('commonInput.invalidFormat');
    }
    return '';
  };

  useEffect(() => {
    if (isTouched || value) {
      setInternalError(validate(value));
    } else {
      setInternalError('');
    }
  }, [value, minLength, maxLength, pattern, required, isTouched]);

  const handleFocus = (e: NativeSyntheticEvent<FocusEvent>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<FocusEvent>) => {
    setIsFocused(false);
    setIsTouched(true);
    setInternalError(validate(value));
    onBlur?.(e);
  };

  const handleTextChange = (text: string) => {
    if (allowedCharsRegex) {
      const filteredText = text.replace(allowedCharsRegex, '');
      onChangeText?.(filteredText);
    } else {
      onChangeText?.(text);
    }
  };

  // ✅ Dynamic border color
  const getBorderColor = () => {
    if (error || (isTouched && internalError)) {
      return colors.error;
    } else if (isFocused) {
      return colors.Secondary;
    } else {
      return colors.Neutrals700;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label ? (
        <CommonText style={styles.label}>
          {label}
          {required && <CommonText style={styles.required}> *</CommonText>}
        </CommonText>
      ) : null}

      {/* Input + icons */}
      <View style={styles.inputWrapper}>
        {/* ✅ Use pointerEvents to prevent crash when both icons exist */}
        {leftIcon && (
          <View
            style={styles.leftIcon}
            pointerEvents={Platform.OS === 'android' ? 'box-none' : 'auto'}
          >
            {leftIcon}
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            { borderColor: getBorderColor() },
            leftIcon ? { paddingLeft: moderateScale(42) } : null,
            rightIcon ? { paddingRight: moderateScale(42) } : null,
            style,
          ]}
          placeholderTextColor={colors.Neutral}
          value={value}
          maxLength={maxLength}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          {...props}
        />

        {rightIcon && (
          <View
            style={styles.rightIcon}
            pointerEvents={Platform.OS === 'android' ? 'box-none' : 'auto'}
          >
            {rightIcon}
          </View>
        )}
      </View>

      {/* Error text */}
      {error ? (
        <CommonText style={styles.errorText}>{error}</CommonText>
      ) : isTouched && internalError ? (
        <CommonText style={styles.errorText}>{internalError}</CommonText>
      ) : null}
    </View>
  );
};

export default CommonInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateScale(20),
  },
  label: {
    fontSize: moderateScale(14),
    color: colors.Neutrals010,
    marginBottom: moderateScale(6),
  },
  required: {
    color: colors.error,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.Neutrals700,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    fontSize: moderateScale(14),
    backgroundColor: colors.white,
    color: colors.black,
  },
  leftIcon: {
    position: 'absolute',
    left: moderateScale(10),
    zIndex: 2,
    justifyContent: 'center',
    height: '100%',
  },
  rightIcon: {
    position: 'absolute',
    right: moderateScale(10),
    zIndex: 2,
    justifyContent: 'center',
    height: '100%',
  },
  errorText: {
    fontSize: moderateScale(12),
    color: colors.error,
    marginTop: moderateScale(4),
  },
});
