import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { moderateScale } from "../utils/responsive";
import { screenNames } from "../navigation/screenNames";
import { colors } from "../themes/colors";
import CommonText from "./CommonText"; // Import CommonText

// Types for navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList, any>;

interface CommonSuccessScreenProps {
  title?: string;
  subtitle?: string;
  Icon?: React.ComponentType<any>; // pass component like <Verify />
  iconSize?: number;
  showButton?: boolean;
  buttonText?: string;
  onButtonPress?: () => void;
  showBack?: boolean;
}

const CommonSuccessScreen: React.FC<CommonSuccessScreenProps> = ({
  title = "Verified Successfully",
  subtitle = "Set your User ID and password now. It will make logging in simple for you in the future.",
  Icon,
  iconSize = 64,
  showButton = true,
  buttonText = "Continue",
  onButtonPress,
  showBack = true,
}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      {showBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <CommonText style={styles.backArrow}>←</CommonText>
        </TouchableOpacity>
      )}

      {/* Icon */}
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon width={iconSize} height={iconSize} />
        </View>
      )}

      {/* Title */}
      {title ? <CommonText style={styles.title}>{title}</CommonText> : null}

      {/* Subtitle */}
      {subtitle ? (
        <CommonText style={styles.subtitle}>{subtitle}</CommonText>
      ) : null}

      {/* Continue Button */}
      {showButton && (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <CommonText style={styles.buttonText}>{buttonText}</CommonText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommonSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Primary950,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backArrow: {
    fontSize: 22,
    color: colors.Neutrals010,
  },
  iconWrapper: {
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.Neutrals010,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.Neutrals300,
    textAlign: "center",
    marginHorizontal: 30,
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.Primary010,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.Primary950,
    fontSize: 16,
    fontWeight: "600",
  },
});
