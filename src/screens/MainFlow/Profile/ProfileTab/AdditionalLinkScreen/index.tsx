import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { styles } from './style.js';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import WebView from 'react-native-webview';
import { AppStackParamList } from '../../../../../navigation/appNavigator.js';
import { RootState } from '../../../../../redux/store.js';
import { fetchStaticContent } from '../../../../../redux/slices/contentSlice';
import ScreenWrapper from '../../../../../components/ScreenWrapper';
import { colors } from '../../../../../themes/colors';
import CommonText from '../../../../../components/CommonText';
import { Images } from '../../../../../assets/images/index';
import {
  BackButton,
  ContactUsBanner,
  DownBlack,
  UpBlack,
} from '../../../../../assets/icons/index';
import { moderateScale } from '../../../../../utils/responsive';
import { GradientBackground } from '../../../../../components';

// Enable layout animation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AdditionalLinksRouteProp = RouteProp<AppStackParamList, 'AdditionalLinks'>;
type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'AdditionalLinks'
>;

const AdditionalLinks = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AdditionalLinksRouteProp>();
  const { title, slug } = route.params;

  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { staticContent, loading, error } = useSelector(
    (state: RootState) => state.content,
  );
  //console.log(staticContent);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (slug && accessToken) {
      dispatch(
        fetchStaticContent({
          slug,
          headers: { Authorization: `Bearer ${accessToken}`, language: 'en' },
        }),
      );
    }
  }, [slug, accessToken, dispatch]);

  const htmlContent = `
  <html>
    <head>
      <style>
        body {
          // font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
        }
      body {
        line-height: 1.5;
        font-family: sans-serif;

      }
      h2, h3 {
        font-size: 54px;
        text-align: center;
      }
      p, li {
        font-size: 50px;
        text-align: left;
        color:#797979
      }
      strong{
      color:#000000
      }
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        td {
          font-size: 46px;
          font-weight:500
          text-align: center;
        }
        td strong {
          display: block;
          font-size: 38px;
          color: #666;
          font-weight: 400;

        }
        td span {
          display: block;
          font-weight: 700;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      ${staticContent?.data?.description || ''}
    </body>
  </html>
  `;

  const faqs: [] =
    staticContent?.data?.slug === 'faq'
      ? JSON.parse(staticContent?.data?.description)
      : [];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const renderFAQItem = ({ item, index }: { item: any; index: number }) => {
    const isExpanded = expandedIndex === index;
    return (
      <View>
        <TouchableOpacity
          style={styles.questionContainer}
          onPress={() => toggleExpand(index)}
          activeOpacity={0.8}
        >
          <CommonText style={styles.questionText}>{item.question}</CommonText>
          {/* <CommonText style={styles.icon}>{isExpanded ? '−' : '+'}</CommonText> */}
          {isExpanded ? (
            <UpBlack height={moderateScale(20)} width={moderateScale(20)} />
          ) : (
            <DownBlack height={moderateScale(20)} width={moderateScale(20)} />
          )}
        </TouchableOpacity>
        {isExpanded && (
          <CommonText style={styles.answerText}>{item.answer}</CommonText>
        )}
        {faqs.length - 1 !== index && <View style={styles.divider} />}
      </View>
    );
  };

  return (
    <ScreenWrapper bgColor={colors.transparent}>
      <GradientBackground style={styles.progressHeader}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.bell}
          >
            <BackButton width={moderateScale(10)} height={moderateScale(15)} />
          </TouchableOpacity>
          <CommonText style={styles.headerTitle}>{title}</CommonText>
        </View>
      </GradientBackground>

      {loading ? (
        <ActivityIndicator color={colors.ButtonColor} />
      ) : error ? (
        <CommonText>{error}</CommonText>
      ) : staticContent?.data?.description ? (
        staticContent?.data?.slug === 'faq' ? (
          <FlatList
            data={faqs}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderFAQItem}
            contentContainerStyle={styles.faqContainer}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.webViewContainer}>
            {staticContent?.data?.slug === 'contact-us' && (
              <View style={styles.imageContainer}>
                <ContactUsBanner width={'100%'} height={moderateScale(170)} />
              </View>
            )}
            <WebView
              source={{ html: htmlContent }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )
      ) : (
        <View />
      )}
    </ScreenWrapper>
  );
};

export default AdditionalLinks;
