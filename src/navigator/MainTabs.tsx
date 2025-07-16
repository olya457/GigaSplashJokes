
import React, { useState } from 'react';
import {
  View,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Category from '../scripts/Category';
import Randomizer from '../scripts/Randomizer';
import Saved from '../scripts/Saved';

const { width } = Dimensions.get('window');

const tabs = [
  {
    name: 'Randomizer',
    icon: require('../assets/game_icons_card_random.png'),
    component: Randomizer,
  },
  {
    name: 'Category',
    icon: require('../assets/ep_menu.png'),
    component: Category,
  },
  {
    name: 'Saved',
    icon: require('../assets/material_symbols_bookmark.png'),
    component: Saved,
  },
];

const TabWrapperScreen = () => {
  const [activeTab, setActiveTab] = useState('Randomizer');
  const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component ?? Randomizer;

  const buttonStyle: ViewStyle = {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#381401',
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <ActiveComponent />
      </View>

      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const isActive = tab.name === activeTab;

          const icon = (
            <Image
              source={tab.icon as ImageSourcePropType}
              style={{
                width: 36,
                height: 36,
                tintColor: '#381401',
              }}
              resizeMode="contain"
            />
          );

          return (
            <Pressable
              key={tab.name}
              onPress={() => setActiveTab(tab.name)}
              style={styles.button}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#EF0F00', '#FED800']}
                  style={buttonStyle}
                >
                  {icon}
                </LinearGradient>
              ) : (
                <View style={[buttonStyle, { backgroundColor: '#0074C7' }]}>
                  {icon}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E1F3',
  },
  screenWrapper: {
    flex: 1,
  },
  navBar: {
    position: 'absolute',
    bottom: 26,
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    zIndex: 10,
  },
  button: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabWrapperScreen;
