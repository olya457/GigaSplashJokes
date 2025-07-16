import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  ImageBackground,
  Pressable,
  Image,
  Platform,
  Easing, 
  Alert, 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 390; 
const guidelineBaseHeight = 844;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LaughStart'>;
type RouteProps = RouteProp<RootStackParamList, 'LaughStart'>;

const laughTexts: Record<string, string[]> = {
  'Tidal Laughs': [
    'Why did the fish blush? It saw the ocean’s bottom.',
    'What do sea monsters eat? Fish and ships.',
    'I’m reading a book about anti-gravity in the ocean. It’s impossible to put down.',
    'Shellfish jokes are just too clamming.',
    'Don’t make waves unless you’re ready to surf them.',
    'I told my anchor a joke. It didn’t sink in.',
    'What do you call a lazy crayfish? A slobster.',
    'That boat was a huge oar-deal.',
    'What’s a sea creature’s favorite instrument? The bass guitar.',
    'My ship puns are just plain sail-icious.',
    'The tide said it was coming back. It’s a man of its word.',
    'What’s a whale’s favorite app? WhaleTok.',
    'I asked the ocean for advice. It waved back.',
    'The starfish started a band. It had five arms and no talent.',
    'What’s a pirate’s favorite shape? Arrrr-gon.',
    'I sea what you did there.',
    'What do you call a nervous squid? Ink-secure.',
    'Never trust shallow people. Dive deeper.',
    'I tried to hold water… it slipped through my puns.',
    'Why do fish hate computers? Too many nets.',
    "I'm shore you'll love this joke.",
    'What’s a sailor’s least favorite vegetable? Leeks.',
    'Ocean jokes? I’ve got a tide-full.',
    'Fish are smart. They always go to school.',
    'If you’re drowning in puns, you’re in the right place.',
  ],
  'Salty Banter': [
    'Oh great, another deep thinker who can’t swim.',
    'You bring nothing to the ship — not even snacks.',
    'You’re the reason sea cucumbers give up.',
    'If sarcasm were a compass, you’d still be lost.',
    'That joke was so dry, even the Sahara called.',
    'Congrats, you made a ripple… in a kiddie pool.',
    'I’d agree with you, but then we’d both be wrong.',
    'You talk like sea foam — loud and gone in 2 seconds.',
    'Your intelligence is like low tide — barely present.',
    'You’re about as useful as a waterproof teabag.',
    'If brains were barnacles, you’d be smooth.',
    'Nice ship. Shame about the captain.',
    'You’re the reason the kraken sleeps in.',
    'Sorry, I only respond to sonar-level intelligence.',
    'You couldn’t navigate a puddle.',
    'Wow, a joke? Did it wash up with the trash?',
    'You float because you’re full of hot air.',
    'You must be a buoy — always in the way.',
    'Even driftwood has more direction.',
    'You’ve got the charisma of wet kelp.',
    'You’re one wave short of a tsunami.',
    'Sarcasm is free. Just like your last three thoughts.',
    'You tried. You failed. Classic tide behavior.',
    'You bring seaweed to a swordfight.',
    'You call that wit? I’ve heard smarter fish burps.',
  ],
  'Deep Sea Chuckles': [
    'A jellyfish just ghosted me. Literally.',
    'I had a conversation with a coral. It was branching.',
    'A crab told me to shell out more jokes.',
    'My pet plankton left a note: “I need space.”',
    'I married a squid. Now I have eight in-laws.',
    'My thoughts are deeper than the Mariana Trench. Scary.',
    'I caught a fish that quoted Nietzsche.',
    'I found a clam with anxiety. It just clams up.',
    'My bathtub thinks it’s a submarine.',
    'A shrimp tried to sell me insurance.',
    'I once lost a staring contest with a seal.',
    'A dolphin winked at me. I panicked and apologized.',
    'I spilled tea on a sea sponge. It started gossiping.',
    'I joined a sea cult. The password was “blub.”',
    'I saw a fish texting. Technology has gone too far.',
    'The moon controls tides. I can’t even control my coffee.',
    'A starfish tried stand-up comedy. Tough crowd.',
    'I got chased by an existential eel.',
    'A turtle gave me life advice… then disappeared for 7 hours.',
    'My seaweed started writing poetry.',
    'A crab hired me as its life coach.',
    'I hugged a stingray. Still processing that.',
    'I swear that rock blinked at me.',
    'The ocean whispered: “Get it together.”',
    'A sea urchin judged my outfit. Rude but fair.',
  ],
  'Captain’s Quips': [
    'The sea teaches patience — or swallows you whole.',
    'A true captain knows when to row and when to roast.',
    'I’ve sailed through worse… mostly conversations.',
    'If you\'re lost, follow the sarcasm — it’s always right.',
    'Weathered sails make the best stories.',
    'The ocean’s honest — unlike your resume.',
    'Never argue with the tide. It doesn’t care.',
    'I don’t retire. I drift with style.',
    'A calm sea never made a funny sailor.',
    'Experience: when you’ve already sunk three ships.',
    'Let others ride waves — I make them.',
    'If you can’t steer, don’t hold the wheel.',
    'Don’t trust a quiet sea. It’s thinking.',
    'I gave up land life. Too many meetings.',
    'If the compass spins — it’s party time.',
    'Life’s better in storms with a laugh.',
    'Saltwater heals everything — except your bad choices.',
    'The sea gave me wrinkles and wisdom. Mostly wrinkles.',
    'I told the storm to calm down. It didn’t.',
    'Captain’s tip: Don’t fish with fools.',
    'I talk to my ship. It listens better than you.',
    'Not all treasure is gold. Some of it is sarcasm.',
    'The map lied. Again.',
    'A real sailor brings rum and punchlines.',
    'I navigate by stars, instinct, and petty revenge.',
  ],
};

const LaughStartScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const category = route.params?.selectedCategory || 'Tidal Laughs';

  const [jokeText, setJokeText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const textTranslateY = useRef(new Animated.Value(0)).current; 
  const contentTranslateY = useRef(new Animated.Value(verticalScale(100))).current; 
  const lHTranslateX = useRef(new Animated.Value(0)).current; 
  const pHTranslateX = useRef(new Animated.Value(0)).current;
  const centerScale = useRef(new Animated.Value(0)).current; 

  const waveTranslateY = useRef(new Animated.Value(0)).current;
  const waveScale = useRef(new Animated.Value(1)).current;

  const checkIfFavorite = async (cat: string, text: string) => {
    try {
      const all = await AsyncStorage.getItem('saved_jokes');
      const allParsed = all ? JSON.parse(all) : [];
      const found = allParsed.some(
        (j: { category: string; text: string }) => j.category === cat && j.text === text
      );
      setIsFavorite(found);
    } catch (error) {
      console.error('Failed to check favorite status from saved_jokes:', error);
      setIsFavorite(false);
    }
  };

  useEffect(() => {
    const initialRandomText =
      laughTexts[category]?.[Math.floor(Math.random() * laughTexts[category].length)] || '';
    setJokeText(initialRandomText.trim());
    textTranslateY.setValue(0); 
  }, [category]);

  useEffect(() => {
    if (jokeText) {
      checkIfFavorite(category, jokeText);
    }
  }, [jokeText, category]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(centerScale, {
        toValue: 1,
        bounciness: 12,
        speed: 6,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(contentTranslateY, {
        toValue: 0,
        delay: 500,
        bounciness: 12,
        useNativeDriver: true,
      }),
    ]).start();

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

    let lhPhTimer: NodeJS.Timeout;

    const startLhPhAnimation = () => {
      lHTranslateX.setValue(0);
      pHTranslateX.setValue(0);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(lHTranslateX, {
            toValue: scale(-20), 
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(lHTranslateX, {
            toValue: 0, 
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pHTranslateX, {
            toValue: scale(20), 
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pHTranslateX, {
            toValue: 0, 
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    setTimeout(() => {
      startLhPhAnimation();

      lhPhTimer = setInterval(() => {
        startLhPhAnimation();
      }, 5000); 
    }, 2000); 

    return () => {
      if (lhPhTimer) clearInterval(lhPhTimer);
    };
 
  }, []); 

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    if (!jokeText) return;
    try {
      const result = await Share.open({
        message: `${category}: ${jokeText}`,
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
      console.error('Error sharing:', error);
    }
  };

  const handleToggleFavorite = async () => {
    const currentJoke = { category, text: jokeText };
    try {
      const all = await AsyncStorage.getItem('saved_jokes');
      let allParsed = all ? JSON.parse(all) : [];

      const isCurrentlyFavorite = allParsed.some(
        (j: { category: string; text: string }) =>
          j.category === currentJoke.category && j.text === currentJoke.text
      );

      if (isCurrentlyFavorite) {
        const updated = allParsed.filter(
          (j: { category: string; text: string }) =>
            !(j.category === currentJoke.category && j.text === currentJoke.text)
        );
        await AsyncStorage.setItem('saved_jokes', JSON.stringify(updated));
        setIsFavorite(false);
        console.log('Joke removed from favorites:', jokeText);
      } else {
        allParsed.push(currentJoke);
        await AsyncStorage.setItem('saved_jokes', JSON.stringify(allParsed));
        setIsFavorite(true);
        console.log('Joke added to favorites:', jokeText);
      }
    } catch (error) {
      console.error('Failed to toggle favorite status:', error);
    }
  };

  const handleNextJoke = () => {
   
    Animated.timing(textTranslateY, {
      toValue: verticalScale(-200), 
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      const randomText =
        laughTexts[category]?.[Math.floor(Math.random() * laughTexts[category].length)] || '';
      setJokeText(randomText.trim());
      textTranslateY.setValue(verticalScale(200)); 
      Animated.timing(textTranslateY, {
        toValue: 0, 
        duration: 400,
        easing: Easing.out(Easing.ease), 
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <ImageBackground
      source={require('../assets/background_loading.png')}
      style={styles.background}
    >
      {}
      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>

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
      <View style={styles.content}>
        {}
        <Animated.Image
          source={require('../assets/l_h.png')}
          style={[styles.lH, { transform: [{ translateX: lHTranslateX }] }]}
          resizeMode="contain"
        />

        {}
        <Animated.Image
          source={require('../assets/p_h.png')}
          style={[styles.pH, { transform: [{ translateX: pHTranslateX }] }]}
          resizeMode="contain"
        />

        {}
        <Animated.Image
          source={require('../assets/categ_image.png')}
          style={[styles.centerImage, { transform: [{ scale: centerScale }] }]}
          resizeMode="contain"
        />

        {}
        <AnimatedImageBackground
          source={require('../assets/text_laugh.png')}
          style={styles.textContainer}
          imageStyle={{ resizeMode: 'contain' }}
        >
          <Text style={styles.categoryInImage}>{category}</Text>
          <Animated.Text
            style={[
              styles.jokeText,
              {
                transform: [{ translateY: textTranslateY }], 
              },
            ]}
          >
            {jokeText}
          </Animated.Text>
        </AnimatedImageBackground>

        {}
        <View style={styles.buttonWrapper}>
          <Pressable onPress={() => navigation.navigate('MainTabs')}>
            <LinearGradient
              colors={['#EF0F00', '#FED800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>BACK TO HOME</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {}
        <Animated.View
          style={[
            styles.bottomControls,
            { transform: [{ translateY: contentTranslateY }] },
          ]}
        >
          {}
          <Pressable onPress={handleToggleFavorite}>
            {isFavorite ? (
              <LinearGradient
                colors={['#EF0F00', '#FED800']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconButton}
              >
                <Image
                  source={require('../assets/material_symbols_bookmark.png')}
                  style={[styles.iconImage, { tintColor: '#000' }]} 
                />
              </LinearGradient>
            ) : (
              <View style={styles.iconButton}>
                <Image
                  source={require('../assets/material_symbols_bookmark.png')}
                  style={[styles.iconImage, { tintColor: '#381401' }]} 
                />
              </View>
            )}
          </Pressable>

          {}
          <Pressable onPress={handleNextJoke} style={styles.nextButtonContainer}>
            <LinearGradient
              colors={['#EF0F00', '#FED800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Next Joke</Text>
            </LinearGradient>
          </Pressable>

          {}
          <Pressable onPress={handleShare}>
            <View style={styles.iconButton}>
              <Image
                source={require('../assets/share_icon.png')}
                style={[styles.iconImage, { tintColor: '#381401' }]} 
              />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default LaughStartScreen;


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#3069F1',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(40),
    zIndex: 2,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(30),
    left: scale(20), 
    zIndex: 10,
    padding: scale(5), 
  },
  backButtonText: {
    fontSize: scale(40), 
    color: 'white',
    fontWeight: 'bold',
  },
  wave: {
    width: width,
    height: height * 0.7,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  lH: {
    width: scale(90), 
    height: scale(90), 
    position: 'absolute',
    left: scale(10), 
    bottom: verticalScale(460), 
    zIndex: 3,
  },
  pH: {
    width: scale(90), 
    height: scale(90), 
    position: 'absolute',
    right: scale(25), 
    top: verticalScale(40), 
    zIndex: 3,
  },
  centerImage: {
    width: scale(340), 
    height: scale(340), 
  },
  textContainer: {
    width: scale(320), 
    minHeight: verticalScale(240), 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20), 
    paddingVertical: verticalScale(16), 
    position: 'absolute',
    top: verticalScale(380),
    zIndex: 4,
  },
  categoryInImage: {
    fontSize: scale(26), 
    fontWeight: 'bold',
    color: '#FFBA91',
    textAlign: 'center',
    marginBottom: verticalScale(40), 
  },
  jokeText: {
    fontSize: scale(18), 
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: verticalScale(22), 
    paddingHorizontal: scale(8), 
    width: '100%',
  },
  buttonWrapper: {
    marginTop: verticalScale(490), 
    width: scale(280), 
    height: verticalScale(64), 
    borderRadius: scale(18), 
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    borderRadius: scale(22), 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, 
    borderColor: '#000',
  },
  buttonText: {
    fontSize: scale(20), 
    fontWeight: 'bold',
    color: '#000',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(32), 
    width: '100%',
    position: 'absolute',
    bottom: verticalScale(96), 
    zIndex: 5,
  },
  iconButton: {
    width: scale(54), 
    height: scale(54), 
    borderRadius: scale(27), 
    borderWidth: 2,
    borderColor: '#381401',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: scale(27), 
    height: scale(27), 
  },
  nextButtonContainer: {
    width: scale(202), 
    height: verticalScale(72), 
    borderRadius: scale(36), 
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000',
  },
  nextButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#000',
    fontSize: scale(18), 
    fontWeight: 'bold',
  },
});