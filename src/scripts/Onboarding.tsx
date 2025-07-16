import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');


const guidelineBaseWidth = 390; 
const guidelineBaseHeight = 844; 

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor; 


type NavigationProp = StackNavigationProp<RootStackParamList>;

const Onboarding = () => {
  const navigation = useNavigation<NavigationProp>();
  const [screen, setScreen] = useState(1);

  const topAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  const waveTranslateY = useRef(new Animated.Value(0)).current;
  const waveScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(waveTranslateY, {
            toValue: verticalScale(-10), 
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
  }, []);

  const animateIn = () => {
    topAnim.setValue(0);
    bottomAnim.setValue(0);
    buttonAnim.setValue(0);

    Animated.stagger(200, [
      Animated.timing(topAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOutAndNext = () => {
    Animated.parallel([
      Animated.timing(topAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (screen < 4) {
        setScreen((prev) => prev + 1);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    });
  };

  useEffect(() => {
    animateIn();
  }, [screen]);

  const renderBottomImage = () => {
    switch (screen) {
      case 1: return require('../assets/onbord1.png');
      case 2: return require('../assets/onbord2.png');
      case 3: return require('../assets/onbord3.png');
      case 4: return require('../assets/onbord4.png');
      default: return require('../assets/onbord1.png');
    }
  };

  const renderButtonImage = () => {
    return screen === 1
      ? require('../assets/image_lets.png')
      : require('../assets/image_next.png');
  };

  return (
    <ImageBackground
      source={require('../assets/background_loading.png')}
      style={styles.background}
    >
      {}
      <Animated.View
        style={[
          styles.centerContainer,
          {
            opacity: topAnim,
            transform: [
              {
                translateY: topAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [verticalScale(-100), 0], 
                }),
              },
              {
                scale: topAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require('../assets/image_photoroom.png')}
          style={styles.photo}
          resizeMode="contain"
        />
      </Animated.View>

      {}
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

      {}
      <View style={styles.bottomSection}>
        {}
        <Animated.Image
          source={renderBottomImage()}
          style={[
            styles.bottomImage,
            {
              opacity: bottomAnim,
              transform: [
                {
                  translateY: bottomAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [verticalScale(100), 0], 
                  }),
                },
                {
                  scale: bottomAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
        />

        {}
        <Pressable onPress={animateOutAndNext}>
          <Animated.Image
            source={renderButtonImage()}
            style={[
              styles.button,
              {
                opacity: buttonAnim,
                transform: [
                  {
                    scale: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [verticalScale(60), 0], 
                    }),
                  },
                ],
              },
            ]}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  centerContainer: {
    position: 'absolute',
    top: height * 0.1, 
    width,
    alignItems: 'center',
    zIndex: 2,
  },
  photo: {
    width: scale(356), 
    height: scale(356), 
  },
  wave: {
    width,
    height: height * 0.65, 
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  bottomSection: {
    position: 'absolute',
    bottom: verticalScale(40), 
    width,
    alignItems: 'center',
    zIndex: 3,
  },
  bottomImage: {
    width: scale(352), 
    height: verticalScale(240), 
    marginBottom: verticalScale(16), 
  },
  button: {
    width: scale(180), 
    height: verticalScale(60), 
  },
});

export default Onboarding;