import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { moderateScale } from '../utils/responsive';
import { fonts } from '../themes/fonts';
import { colors } from '../themes/colors';

interface CommonTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'label' | 'body' | 'link';
}

const CommonText: React.FC<CommonTextProps> = ({
  variant = 'body',
  style,
  children,
  ...props
}) => {
  return (
    <Text style={[styles[variant], style]} {...props}>
      {children}
    </Text>
  );
};

export default CommonText;

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    fontSize: moderateScale(32),
    fontFamily: fonts.bold,
    color: colors.Neutrals010,
    marginBottom: moderateScale(8),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: colors.Neutrals500,
    fontFamily: fonts.medium,
    marginBottom: moderateScale(24),
  },
  label: {
    fontSize: moderateScale(14),
    color: colors.Neutrals010,
    marginBottom: moderateScale(6),
  },
  body: {
    fontSize: moderateScale(14),
    color: colors.Neutrals100,
  },
  link: {
    fontSize: moderateScale(14),
    color: colors.ButtonColor,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    lineHeight: moderateScale(20),
  },
});
