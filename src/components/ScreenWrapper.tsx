import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { moderateScale, verticalScale } from '../utils/responsive';
import { colors } from '../themes/colors';

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  bgColor = colors.white,
}) => (
  <View style={[styles.safeArea, { backgroundColor: bgColor }]}>
    {Platform.OS === 'android' ? (
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </KeyboardAwareScrollView>
    ) : (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    )}
  </View>
);

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(0),
    paddingVertical: verticalScale(0),
  },
});
export default ScreenWrapper;
