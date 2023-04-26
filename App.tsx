import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

/**
 * Follows this tutorial
 * https://www.youtube.com/watch?v=4HUreYYoE6U&list=PLjHsmVtnAr9TWoMAh-3QMiP7bPUqPFuFZ&index=2
 */

const SIZE = 80;
const CIRCLE_RADIUS = SIZE * 2;

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    height: SIZE,
    width: SIZE,
    backgroundColor: 'rgba(0,0,255, 0.5)',
    borderRadius: 16,
  },
  circle: {
    height: CIRCLE_RADIUS * 2,
    width: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 4,
    borderColor: 'rgb(0,0,255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type PanGestureContext = {
  translateX: number;
  translateY: number;
};
const App = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    PanGestureContext
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: () => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: withSpring(translateX.value)},
        {translateY: withSpring(translateY.value)},
      ],
    };
  });

  return (
    <View style={s.container}>
      <View style={s.circle}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[s.square, rStyle]} />
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default App;
