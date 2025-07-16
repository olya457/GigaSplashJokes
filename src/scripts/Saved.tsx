import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  Image,
  Dimensions,
  FlatList, 
  Pressable,
  Alert, 
  Platform, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 390; 
const guidelineBaseHeight = 844; 

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor; 


const Saved = () => {
  const waveTranslateY = useRef(new Animated.Value(0)).current;
  const waveScale = useRef(new Animated.Value(1)).current;


  const [savedJokes, setSavedJokes] = useState<{ category: string; text: string }[]>([]);

  const titleTranslateY = useRef(new Animated.Value(verticalScale(-100))).current; 
  const cardsOpacity = useRef(new Animated.Value(0)).current; 

  useFocusEffect(
    useCallback(() => {
      const fetchJokes = async () => {
        try {
          const data = await AsyncStorage.getItem('saved_jokes');
          if (data) {
            setSavedJokes(JSON.parse(data));
          } else {
            setSavedJokes([]);
          }
        } catch (error) {
          console.error('Failed to fetch saved jokes:', error);
          setSavedJokes([]);
        }
      };
      fetchJokes();

      titleTranslateY.setValue(verticalScale(-100)); 
      cardsOpacity.setValue(0);  

      Animated.sequence([
        Animated.timing(titleTranslateY, {
          toValue: 0, 
          duration: 800,
          delay: 200, 
          useNativeDriver: true,
        }),
        Animated.timing(cardsOpacity, {
          toValue: 1, 
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, [titleTranslateY, cardsOpacity]) 
  );

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
  }, [waveTranslateY, waveScale]); 

  const handleUnsave = async (category: string, text: string) => {
    try {
      const stored = await AsyncStorage.getItem('saved_jokes');
      const parsed = stored ? JSON.parse(stored) : [];
      const updated = parsed.filter(
        (j: { category: string; text: string }) =>
          !(j.category === category && j.text === text)
      );
      await AsyncStorage.setItem('saved_jokes', JSON.stringify(updated));
      setSavedJokes(updated); 
    } catch (error) {
      console.error('Error removing joke:', error);
      Alert.alert('Error', 'Failed to remove joke from favorites.');
    }
  };

  const handleShare = async (category: string, text: string) => {
    try {
      const result = await Share.open({
        message: `${category}: ${text}`,
      });
      if (result.success) {
        console.log('Joke shared successfully!');
      }
    } catch (error: any) {
      if (error?.message === 'User did not share') {
        console.log('Share canceled by user.');
        return;
      }
      Alert.alert('Sharing Failed', error.message || 'An unknown error occurred during sharing.');
      console.error('Share error:', error);
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
        {}
        <Animated.View style={{ transform: [{ translateY: titleTranslateY }] }}>
          <Image
            source={require('../assets/saved_text.png')}
            style={styles.titleImage}
          />
        </Animated.View>

        {}
        {savedJokes.length > 0 ? (
          <FlatList
            data={savedJokes}
            keyExtractor={(item, index) => `${item.category}-${item.text}-${index}`}
            contentContainerStyle={styles.scrollContent}
            renderItem={({ item, index }: { item: { category: string; text: string }; index: number }) => (
              <Animated.View style={{ opacity: cardsOpacity }}>
                <AnimatedImageBackground 
                  source={require('../assets/text_laugh.png')}
                  style={styles.jokeCard}
                  imageStyle={{ resizeMode: 'contain' }}
                >
                  <Text style={styles.jokeCategory}>{item.category}</Text>
                  <Text style={styles.jokeText}>{item.text}</Text>

                  {}
                  <View style={styles.bottomControls}>
                    {}
                    <Pressable onPress={() => handleUnsave(item.category, item.text)}>
                      <LinearGradient
                        colors={['#EF0F00', '#FED800']} 
                        start={{ x: 0, y: 0 }} 
                        end={{ x: 1, y: 1 }} 
                        style={styles.favoriteButtonGradient} 
                      >
                        <Image
                          source={require('../assets/material_symbols_bookmark.png')}
                          style={styles.iconImageActive} 
                        />
                      </LinearGradient>
                    </Pressable>

                    {}
                    <Pressable
                      onPress={() => handleShare(item.category, item.text)}
                      style={styles.iconButton} 
                    >
                      <Image
                        source={require('../assets/share_icon.png')}
                        style={styles.iconImage} 
                      />
                    </Pressable>
                  </View>
                </AnimatedImageBackground>
              </Animated.View>
            )}
          />
        ) : (
          <Text style={styles.noJokesText}>No saved jokes yet. Go laugh! 😂</Text>
        )}
      </View>
    </ImageBackground>
  );
};

export default Saved;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(60),
    alignItems: 'center',
    zIndex: 2,
  },
  titleImage: {
    width: scale(280), 
    height: verticalScale(80), 
    resizeMode: 'contain',
    marginBottom: verticalScale(20), 
  },
  scrollContent: {
    paddingBottom: verticalScale(60), 
    width: width * 0.9, 
    alignSelf: 'center',
  },
  jokeCard: {
    width: scale(353), 
    minHeight: verticalScale(260), 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20), 
    paddingVertical: verticalScale(16), 
    marginBottom: verticalScale(20), 
    alignSelf: 'center',
  },
  jokeCategory: {
    fontSize: moderateScale(20), 
    fontWeight: 'bold',
    color: '#FFBA91',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  jokeText: {
    fontSize: moderateScale(16), 
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: verticalScale(22), 
    paddingHorizontal: scale(8), 
    width: '100%',
  },
  noJokesText: {
    fontSize: moderateScale(18), 
    color: '#3E1A00',
    textAlign: 'center',
    marginTop: verticalScale(50), 
  },
  wave: {
    width: width,
    height: height * 0.65, 
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: scale(140), 
    marginTop: verticalScale(16), 
  },
  favoriteButtonGradient: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27),
    borderWidth: 2,
    borderColor: '#381401',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: scale(54), 
    height: scale(54), 
    borderRadius: scale(27), 
    borderWidth: 2,
    borderColor: '#381401',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
    marginHorizontal: scale(5),
  },
  iconImage: {
    width: scale(27), 
    height: scale(27),
    tintColor: '#381401',
  },
  iconImageActive: { 
    width: scale(27),
    height: scale(27),
    tintColor: '#000', 
  },
});