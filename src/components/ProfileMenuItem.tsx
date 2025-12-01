import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import CommonText from '../components/CommonText';
import { colors } from '../themes/colors';
import { moderateScale, verticalScale } from '../utils/responsive';
import { fonts } from '../themes/fonts';

interface ProfileMenuItemProps {
  color?: string;
  onPress?: () => void;
  Icon?: React.FC<any>;
  label?: string;
  label1?: string;
  Icon1?: React.FC<any>;
  onPress1?: () => void;
  label2?: string;
  Icon2?: React.FC<any>;
  onPress2?: () => void;
  row?: boolean;
  style?: ViewStyle;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  label,
  color = colors.ButtonColor,
  Icon,
  onPress,
  row = false,
  label1,
  Icon1,
  onPress1,
  label2,
  Icon2,
  onPress2,
  style,
}) => {
  return row ? (
    <View style={styles.main}>
      <TouchableOpacity
        style={[styles.container, styles.containerExtraStyling]}
        activeOpacity={0.8}
        onPress={onPress1}
      >
        {Icon1 && (
          <Icon1
            height={moderateScale(24)}
            width={moderateScale(24)}
            color={color}
          />
        )}

        <CommonText style={[styles.label, styles.labelExtraStyling]}>
          {label1}
        </CommonText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.container, styles.containerExtraStyling]}
        activeOpacity={0.8}
        onPress={onPress2}
      >
        {Icon2 && (
          <Icon2
            height={moderateScale(24)}
            width={moderateScale(24)}
            color={color}
          />
        )}

        <CommonText style={[styles.label, styles.labelExtraStyling]}>
          {label2}
        </CommonText>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, style]}
      onPress={onPress}
    >
      {Icon && (
        <Icon
          height={moderateScale(24)}
          width={moderateScale(24)}
          color={color}
        />
      )}

      <CommonText
        style={[
          styles.label,
          label == 'Logout' || label == 'Delete Account' ? styles.logOut : null,
        ]}
      >
        {label}
      </CommonText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: { flexDirection: 'row', gap: 10 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(16),
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    gap: moderateScale(12),
    // borderWidth: 1,
    // borderColor: colors.Neutrals900,
    // elevation: 1,
  },
  containerExtraStyling: { flex: 1, paddingVertical: verticalScale(15) },
  labelExtraStyling: { width: moderateScale(100), lineHeight: 20 },
  logOut: { color: colors.error },
  iconContainer: {
    marginRight: moderateScale(12),
  },
  label: {
    fontSize: moderateScale(16),
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.Neutrals100,
  },
});

export default ProfileMenuItem;
