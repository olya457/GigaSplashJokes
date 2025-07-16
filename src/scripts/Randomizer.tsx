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
import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 390; 
const guidelineBaseHeight = 844; 

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

const SMALL_SCREEN_THRESHOLD = guidelineBaseWidth * 0.9; 
const TINY_SCREEN_THRESHOLD = 330; 

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

const allJokes = Object.entries(laughTexts).flatMap(([category, jokes]) =>
  jokes.map((text) => ({ category, text }))
);

const Randomizer = () => {
  const [joke, setJoke] = useState<{ category: string; text: string } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const textTranslateY = useRef(new Animated.Value(0)).current;
  const waveTranslateY = useRef(new Animated.Value(0)).current;
  const waveScale = useRef(new Animated.Value(1)).current;

  const centerScale = useRef(new Animated.Value(0)).current;
  const textFadeIn = useRef(new Animated.Value(0)).current;
  const controlsTranslateY = useRef(new Animated.Value(verticalScale(80))).current;

  useEffect(() => {
    showRandomJoke();

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

    Animated.parallel([
      Animated.spring(centerScale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 10,
      }),
      Animated.timing(textFadeIn, {
        toValue: 1,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(controlsTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkIfFavorite = async (currentJoke: { category: string; text: string }) => {
    try {
      const saved = await AsyncStorage.getItem('saved_jokes');
      const savedParsed = saved ? JSON.parse(saved) : [];
      const exists = savedParsed.some(
        (j: { category: string; text: string }) =>
          j.category === currentJoke.category && j.text === currentJoke.text
      );
      setIsFavorite(exists);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const showRandomJoke = () => {
    const newJoke = allJokes[Math.floor(Math.random() * allJokes.length)];
    Animated.timing(textTranslateY, {
      toValue: verticalScale(-200),
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setJoke(newJoke);
      textTranslateY.setValue(verticalScale(200));
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
      checkIfFavorite(newJoke);
    });
  };

  const toggleFavorite = async () => {
    if (!joke) return;
    try {
      const saved = await AsyncStorage.getItem('saved_jokes');
      const savedParsed = saved ? JSON.parse(saved) : [];

      const exists = savedParsed.some(
        (j: { category: string; text: string }) =>
          j.category === joke.category && j.text === joke.text
      );

      let updated;
      if (exists) {
        updated = savedParsed.filter(
          (j: { category: string; text: string }) =>
            !(j.category === joke.category && j.text === joke.text)
        );
        setIsFavorite(false);
      } else {
        updated = [...savedParsed, joke];
        setIsFavorite(true);
      }

      await AsyncStorage.setItem('saved_jokes', JSON.stringify(updated));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  const handleShare = async () => {
    if (!joke) {
      console.log('No joke to share.');
      return;
    }
    try {
      const result = await Share.open({
        message: `${joke.category}: ${joke.text}`,
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
        <Animated.Image
          source={require('../assets/categ_image.png')}
          style={[styles.centerImage, { transform: [{ scale: centerScale }] }]}
          resizeMode="contain"
        />

        {}
        <AnimatedImageBackground
          source={require('../assets/text_laugh.png')}
          style={[styles.textContainer, { opacity: textFadeIn }]}
          imageStyle={{ resizeMode: 'contain' }}
        >
          <Text
            style={styles.categoryInImage}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {joke?.category}
          </Text>
          <Animated.Text
            style={[
              styles.jokeText,
              { transform: [{ translateY: textTranslateY }] },
            ]}
            adjustsFontSizeToFit
            numberOfLines={6}
          >
            {joke?.text}
          </Animated.Text>
        </AnimatedImageBackground>

        {}
        <Animated.View style={[styles.bottomControls, { transform: [{ translateY: controlsTranslateY }] }]}>
          <Pressable onPress={toggleFavorite}>
            {isFavorite ? (
              <LinearGradient
                colors={['#EF0F00', '#FED800']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconButton}
              >
                <Image
                  source={require('../assets/material_symbols_bookmark.png')}
                  style={[styles.icon, { tintColor: '#000' }]}
                />
              </LinearGradient>
            ) : (
              <View style={styles.iconButton}>
                <Image
                  source={require('../assets/material_symbols_bookmark.png')}
                  style={[styles.icon, { tintColor: '#381401' }]}
                />
              </View>
            )}
          </Pressable>

          <Pressable onPress={showRandomJoke}>
            <LinearGradient
              colors={['#EF0F00', '#FED800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>Next Joke</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleShare}>
            <View style={styles.iconButton}>
              <Image
                source={require('../assets/share_icon.png')}
                style={[styles.icon, { tintColor: '#381401' }]}
              />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default Randomizer;


const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
    width,
    height,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   
    paddingTop: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(40),
    paddingBottom: verticalScale(Platform.OS === 'ios' ? 40 : 24), 
  },
  wave: {
    position: 'absolute',
    width,
 
    height: width < TINY_SCREEN_THRESHOLD
      ? height * 0.5
      : width < SMALL_SCREEN_THRESHOLD
        ? height * 0.55
        : height * 0.6,
    bottom: 0,
    zIndex: 0,
  },
  centerImage: {
   
    width: width < TINY_SCREEN_THRESHOLD
      ? scale(260) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(320)
        : scale(360),
    height: width < TINY_SCREEN_THRESHOLD
      ? scale(260) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(320)
        : scale(360),
    marginBottom: width < TINY_SCREEN_THRESHOLD
      ? verticalScale(5)
      : width < SMALL_SCREEN_THRESHOLD
        ? verticalScale(10)
        : verticalScale(12),
   
    marginTop: width < TINY_SCREEN_THRESHOLD
      ? verticalScale(-100) 
      : width < SMALL_SCREEN_THRESHOLD
        ? verticalScale(-120) 
        : verticalScale(-140), 
  },
  textContainer: {
    width: width < TINY_SCREEN_THRESHOLD
      ? scale(240) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(300)
        : scale(320),
    aspectRatio: 320 / 240,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width < TINY_SCREEN_THRESHOLD
      ? scale(8) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(12)
        : scale(14),
   
    marginTop: width < TINY_SCREEN_THRESHOLD
      ? verticalScale(-80) 
      : width < SMALL_SCREEN_THRESHOLD
        ? verticalScale(-100) 
        : verticalScale(-120), 
  },
  categoryInImage: {
    fontSize: width < TINY_SCREEN_THRESHOLD
      ? scale(16) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(20)
        : scale(22),
    fontWeight: 'bold',
    color: '#FFBA91',
    marginBottom: width < TINY_SCREEN_THRESHOLD
      ? verticalScale(5) 
      : width < SMALL_SCREEN_THRESHOLD
        ? verticalScale(10)
        : verticalScale(12),
    textAlign: 'center',
  },
  jokeText: {
    fontSize: width < TINY_SCREEN_THRESHOLD
      ? scale(12) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(15)
        : scale(16),
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: width < TINY_SCREEN_THRESHOLD
      ? verticalScale(16) 
      : width < SMALL_SCREEN_THRESHOLD
        ? verticalScale(20)
        : verticalScale(22),
    paddingHorizontal: width < TINY_SCREEN_THRESHOLD
      ? scale(3)
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(6)
        : scale(8),
    width: '100%',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width < TINY_SCREEN_THRESHOLD
      ? '80%' 
      : width < SMALL_SCREEN_THRESHOLD
        ? '88%'
        : '90%',
    paddingHorizontal: width < TINY_SCREEN_THRESHOLD
      ? scale(8) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(14)
        : scale(16),
    marginBottom: verticalScale(width < TINY_SCREEN_THRESHOLD ? 14 : 10), 
  },
  iconButton: {
    width: width < TINY_SCREEN_THRESHOLD
      ? scale(40) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(50)
        : scale(54),
    height: width < TINY_SCREEN_THRESHOLD
      ? scale(40) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(50)
        : scale(54),
    borderRadius: width < TINY_SCREEN_THRESHOLD
      ? scale(20) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(25)
        : scale(27),
    borderWidth: 2,
    borderColor: '#381401',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: width < TINY_SCREEN_THRESHOLD
      ? scale(20) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(25)
        : scale(27),
    height: width < TINY_SCREEN_THRESHOLD
      ? scale(20) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(25)
        : scale(27),
  },
  nextButton: {
    width: width < TINY_SCREEN_THRESHOLD
      ? scale(110) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(150)
        : scale(160),
    height: width < TINY_SCREEN_THRESHOLD
      ? verticalScale(40) 
      : width < SMALL_SCREEN_THRESHOLD
        ? verticalScale(50)
        : verticalScale(54),
    borderRadius: width < TINY_SCREEN_THRESHOLD
      ? scale(20) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(25)
        : scale(27),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  nextButtonText: {
    color: '#000',
    fontSize: width < TINY_SCREEN_THRESHOLD
      ? scale(12) 
      : width < SMALL_SCREEN_THRESHOLD
        ? scale(15)
        : scale(16),
    fontWeight: 'bold',
  },
});