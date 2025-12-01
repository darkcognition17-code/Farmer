import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';
import { colors } from '../themes/colors';
import CommonText from './CommonText';

interface ProfileProgressCardProps {
  progress?: number; // 0–1 (e.g. 0.4 = 40%)
  title?: string;
  stepText?: string;
  totalSteps?: number; // e.g. 3
  isFrom?: string;
}

const ProfileProgressCard: React.FC<ProfileProgressCardProps> = ({
  progress = 0.4,
  title = 'Add Address Details',
  stepText = '(2/3 Steps)',
  totalSteps = 3,
  isFrom = '',
}) => {
  // clamp progress between 0–1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.container}>
      {/* Top: Percentage */}
      <CommonText style={styles.percentText}>
        {`${Math.round(clampedProgress * 100)}% `}
        <CommonText style={styles.subText}>{isFrom}</CommonText>
      </CommonText>
      {/* </Text> */}

      {/* Title + Step count */}
      <View style={styles.row}>
        <CommonText style={styles.title}>{title}</CommonText>
        <CommonText style={styles.steps}>{stepText}</CommonText>
      </View>

      {/* Segmented Progress Bar */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          // Calculate fill for each segment
          const segmentProgress = clampedProgress * totalSteps - index;
          const fillPercent = Math.min(Math.max(segmentProgress, 0), 1) * 100;

          return (
            <View key={index} style={styles.segmentWrapper}>
              <View style={styles.segmentBackground}>
                <View
                  style={[styles.segmentFill, { width: `${fillPercent}%` }]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    shadowColor: colors.black,

    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
    height: moderateScale(125),
  },
  percentText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.black,
  },
  subText: {
    fontWeight: '400',
    color: colors.Neutrals300,
    fontSize: moderateScale(14),
  },
  subText2: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: moderateScale(16),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: moderateScale(12),
  },
  title: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.black,
  },
  steps: {
    fontSize: moderateScale(12),
    color: colors.Neutrals300,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(13),
  },
  segmentWrapper: {
    flex: 1,
    marginHorizontal: 2,
  },
  segmentBackground: {
    backgroundColor: colors.ButtonDisableColor,
    height: moderateScale(7),
    borderRadius: moderateScale(4),
    overflow: 'hidden',
  },
  segmentFill: {
    backgroundColor: colors.SegmentFill,
    height: '100%',
    borderRadius: moderateScale(4),
  },
});

export default ProfileProgressCard;
