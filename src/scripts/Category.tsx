import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  Animated,
  ImageBackground,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App'; 

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 390; 
const guidelineBaseHeight = 844; 

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor; 

const categoryLabels = [
  'Tidal Laughs',
  'Salty Banter',
  'Deep Sea Chuckles',
  'Captain’s Quips',
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const Category = () => {
  const navigation = useNavigation<NavigationProp>();

  const [showResult, setShowResult] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const waveTranslateY = useRef(new Animated.Value(0)).current;
  const waveScale = useRef(new Animated.Value(1)).current;

  const pHAnim = useRef(new Animated.Value(1)).current; 
  const lHAnim = useRef(new Animated.Value(1)).current; 
  const imageAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const letAnim = useRef(new Animated.Value(0)).current;

  const categoryAnims = useRef(categoryLabels.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(waveTranslateY, {
            toValue: -10,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(waveTranslateY, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(waveScale, {
            toValue: 1.04,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(waveScale, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pHAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pHAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(4200), 
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(lHAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(lHAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(4200),
      ])
    ).start();

    Animated.timing(imageAnim, {
      toValue: 1,
      duration: 700,
      delay: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 800,
      delay: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (showResult) {
      categoryAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: index * 150,
          useNativeDriver: true,
        }).start();
      });

      Animated.timing(letAnim, {
        toValue: 1,
        duration: 500,
        delay: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [showResult]);

  const handleCategoryPress = (label: string) => {
    setSelectedCategory(label);
  };

  const handleNext = () => {
    if (selectedCategory) {
      navigation.navigate('LaughStart', { selectedCategory });
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_loading.png')}
      style={styles.background}
    >
      <Animated.Image
        source={require('../assets/image_lod.png')}
        style={[
          styles.wave,
          {
            transform: [
              { translateY: waveTranslateY },
              { scale: waveScale },
            ],
          },
        ]}
        resizeMode="stretch"
      />

      <View style={styles.content}>
        {showResult ? (
          <View style={styles.resultContainer}>
            <View style={styles.buttonGroup}>
              {categoryLabels.map((label, index) => (
                <Animated.View
                  key={label}
                  style={{
                    opacity: categoryAnims[index],
                    transform: [
                      {
                        translateY: categoryAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [verticalScale(20), 0], 
                        }),
                      },
                    ],
                  }}
                >
                  <Pressable
                    onPress={() => handleCategoryPress(label)}
                    style={[
                      styles.categoryButton,
                      selectedCategory === label && styles.categoryButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === label && styles.categoryButtonTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>

            <Animated.View
              style={[
                styles.letButtonWrapper,
                {
                  opacity: letAnim,
                  transform: [
                    {
                      scale: letAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Pressable
                onPress={handleNext}
                disabled={!selectedCategory}
                style={{ width: '100%', height: '100%' }}
              >
                <LinearGradient
                  colors={['#EF0F00', '#FED800']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.letButton,
                    {
                      opacity: selectedCategory ? 1 : 0.4,
                      borderWidth: scale(2), 
                      borderColor: '#000',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.letText,
                      {
                        opacity: selectedCategory ? 1 : 0.5,
                      },
                    ]}
                  >
                    Let’s Laugh!
                  </Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>
        ) : (
          <>
            <Animated.Image
              source={require('../assets/l_h.png')}
              style={[styles.lH, { transform: [{ scale: lHAnim }] }]}
              resizeMode="contain"
            />

            <Animated.Image
              source={require('../assets/categ_image.png')}
              style={[
                styles.categoryImage,
                {
                  opacity: imageAnim,
                  transform: [{ scale: imageAnim }],
                },
              ]}
              resizeMode="contain"
            />

            <Animated.View
              style={[
                styles.chooseButtonWrapper,
                {
                  opacity: buttonAnim,
                  transform: [{ scale: buttonAnim }],
                },
              ]}
            >
              <Pressable onPress={() => setShowResult(true)}>
                <Image
                  source={require('../assets/choose_category.png')}
                  style={styles.chooseButton}
                  resizeMode="contain"
                />
              </Pressable>
            </Animated.View>

            <Animated.Image
              source={require('../assets/p_h.png')}
              style={[styles.pH, { transform: [{ scale: pHAnim }] }]}
              resizeMode="contain"
            />
          </>
        )}
      </View>
    </ImageBackground>
  );
};

export default Category;

const styles = StyleSheet.create({
  background: { flex: 1, width, height },
  content: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', zIndex: 2, paddingTop: verticalScale(height * 0.06) }, 
  wave: { width: width, height: verticalScale(height * 0.65), position: 'absolute', bottom: 0, zIndex: 1 }, 
  categoryImage: {
    width: scale(443), 
    height: scale(443), 
    marginTop: verticalScale(100), 
    marginBottom: verticalScale(-25), 
    zIndex: 2,
  },
  chooseButtonWrapper: { marginTop: verticalScale(-50), zIndex: 3 }, 
  chooseButton: {
    width: scale(280), 
    height: verticalScale(70), 
  },
  lH: {
    width: scale(121), 
    height: scale(121), 
    position: 'absolute',
    left: scale(25), 
    top: verticalScale(height * 0.1), 
    zIndex: 4,
  },
  pH: {
    width: scale(121), 
    height: scale(121), 
    position: 'absolute',
    right: scale(15), 
    bottom: verticalScale(height * 0.45), 
    zIndex: 5,
  },
  resultContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: verticalScale(25) }, 
  buttonGroup: { gap: verticalScale(16) }, 
  categoryButton: {
    width: scale(332), 
    height: verticalScale(72), 
    borderRadius: moderateScale(18), 
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(2), 
    borderColor: '#000',
  },
  categoryButtonSelected: { backgroundColor: '#ffffff' },
  categoryButtonText: { fontSize: moderateScale(18), fontWeight: 'bold', color: '#000' }, 
  categoryButtonTextSelected: { color: '#000' },
  letButtonWrapper: {
    marginTop: verticalScale(24), 
    width: scale(332), 
    height: verticalScale(72), 
    borderRadius: moderateScale(18), 
    overflow: 'hidden',
  },
  letButton: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: moderateScale(18) }, 
  letText: { fontSize: moderateScale(20), fontWeight: 'bold', color: '#000' }, 
});