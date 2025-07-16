import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigator/types';

const { width, height } = Dimensions.get('window');

const Loader = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(1);

  const waveTranslateY = useRef(new Animated.Value(0)).current;
  const waveScale = useRef(new Animated.Value(1)).current;

  const photoTranslateY = useRef(new Animated.Value(80)).current;
  const photoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnim = Animated.loop(
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
    );

    loopAnim.start();

    const timer = setTimeout(() => {
      setStep(2);

      Animated.parallel([
        Animated.timing(photoTranslateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(photoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        navigation.navigate('Onboarding');
      }, 3000);
    }, 3000);

    return () => {
      loopAnim.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background_loading.png')}
        style={styles.container}
      >
        {}
        <Animated.Image
          source={
            step === 1
              ? require('../assets/image_lod1.png')
              : require('../assets/image_lod.png')
          }
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
        {step === 1 && (
          <View style={styles.webViewWrapper}>
            <View style={styles.webViewRounded}>
              <WebView
                originWhitelist={['*']}
                source={{ html: HTML_LOADER }}
                style={styles.webView}
                scrollEnabled={false}
              />
            </View>
          </View>
        )}

        {}
        {step === 2 && (
          <View style={styles.absoluteCenter}>
            <Animated.Image
              source={require('../assets/image_photoroom.png')}
              style={[
                styles.photo,
                {
                  transform: [{ translateY: photoTranslateY }],
                  opacity: photoOpacity,
                },
              ]}
              resizeMode="contain"
            />
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    width,
    height: height * 0.8,
    zIndex: 1,
  },
  webViewWrapper: {
    position: 'absolute',
    top: height * 0.52,
    alignSelf: 'center',
    zIndex: 3,
  },
  webViewRounded: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  absoluteCenter: {
    position: 'absolute',
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  photo: {
    width: 356,
    height: 356,
  },
});

const HTML_LOADER = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; background: transparent; }
    .orbital {
      width: 100px; height: 100px;
      position: relative; margin: 0 auto;
      border-radius: 110px;
    }
    .ringOne {
      position: absolute;
      top: -10px; right: -10px; bottom: -10px; left: -10px;
      border-radius: 200px;
      box-shadow: -5px -5px 15px rgba(15, 180, 231, 0.3);
    }
    .ringTwo {
      border: 1px solid #444;
      position: absolute;
      top: -25px; right: -25px; bottom: -25px; left: -25px;
      border-radius: 200px;
      background: linear-gradient(to bottom, #161616 0%, #3d3d3d 100%);
      animation: rotateClockwise 4s infinite linear;
    }
    .ringThree {
      background: radial-gradient(circle at center, #575b60 1%, #000 100%);
      position: absolute;
      top: -10px; left: -10px; right: -10px; bottom: -10px;
      z-index: -1;
      border-radius: 110px;
      box-shadow: -1px 0px 0px #333, 0px -1px 0px #333;
    }
    .core {
      background: radial-gradient(circle at center, #575b60 1%, #000 100%);
      position: absolute;
      top: 5px; left: 5px; right: 5px; bottom: 5px;
      z-index: 2;
      border-radius: 110px;
      box-shadow: -1px 0px 0px #666, 0px -1px 0px #666;
      animation: pulse 2s infinite ease-in-out;
    }
    .spin {
      background: radial-gradient(ellipse at 20% 20%, #91ffff 0%, #0fb4e7 24%, #000 100%);
      border-radius: 110px;
      padding: 10px;
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      animation: rotateAntiClockwise 6s infinite linear;
    }
    @keyframes rotateClockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes rotateAntiClockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 5px #666; }
      50% { transform: scale(1.1); box-shadow: 0 0 15px #0fb4e7; }
      100% { transform: scale(1); box-shadow: 0 0 5px #666; }
    }
  </style>
</head>
<body>
  <div class="orbital">
    <div class="ringOne"></div>
    <div class="ringTwo"></div>
    <div class="ringThree"></div>
    <div class="core"></div>
    <div class="spin"></div>
  </div>
</body>
</html>
`;

export default Loader;
