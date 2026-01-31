import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const DEFAULT_DURATION = 400;
const DEFAULT_DELAY = 0;
const STAGGER_DELAY = 60;

/**
 * Fade-in animation on mount. Use for screen/content entrance.
 */
export function useFadeIn(opts?: { delay?: number; duration?: number; initialOpacity?: number }) {
  const opacity = useRef(new Animated.Value(opts?.initialOpacity ?? 0)).current;
  const delay = opts?.delay ?? DEFAULT_DELAY;
  const duration = opts?.duration ?? DEFAULT_DURATION;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [opacity, delay, duration]);

  return opacity;
}

/**
 * Slide-up + fade-in on mount. Good for cards and modals.
 */
export function useSlideUpFadeIn(opts?: { delay?: number; duration?: number; distance?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(opts?.distance ?? 24)).current;
  const delay = opts?.delay ?? DEFAULT_DELAY;
  const duration = opts?.duration ?? DEFAULT_DURATION;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [opacity, translateY, delay, duration]);

  return { opacity, translateY };
}

/**
 * Staggered entrance for list items. Pass index and optional baseDelay/itemDelay.
 */
export function useStaggeredFadeIn(
  index: number,
  opts?: { baseDelay?: number; itemDelay?: number; duration?: number }
) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const baseDelay = opts?.baseDelay ?? 0;
  const itemDelay = opts?.itemDelay ?? STAGGER_DELAY;
  const duration = opts?.duration ?? 320;

  useEffect(() => {
    const delay = baseDelay + index * itemDelay;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [index, opacity, translateY, baseDelay, itemDelay, duration]);

  return { opacity, translateY };
}

/**
 * Press scale feedback for buttons/cards. Returns { scale, handlers }.
 */
export function usePressScale(activeScale = 0.97) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: activeScale,
      useNativeDriver: true,
      speed: 200,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 200,
      bounciness: 8,
    }).start();
  };

  return { scale, onPressIn, onPressOut };
}

/**
 * Tab switch / segment animation: animate underline or highlight position.
 */
export function useSegmentAnimation(activeIndex: number, count: number) {
  const anim = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: activeIndex,
      useNativeDriver: true,
      speed: 24,
      bounciness: 8,
    }).start();
  }, [activeIndex, anim]);

  return anim;
}
