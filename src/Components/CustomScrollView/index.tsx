import React, {useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';

const {height: containerHeight} = Dimensions.get('window');

import {ReactNode} from 'react';
import {ViewStyle} from 'react-native';

import {StyleProp} from 'react-native';

type CustomScrollViewProps = {
  children: ReactNode;
  style?: ViewStyle;
  indicatorColor?: string; // nova prop
  refreshControl?: React.ReactElement; // adiciona a prop refreshControl
  contentContainerStyle?: StyleProp<ViewStyle>; // adiciona a prop contentContainerStyle
};

export default function CustomScrollView({
  children,
  style,
  indicatorColor = '#FFF', // valor padrão branco
  refreshControl,
  contentContainerStyle,
}: CustomScrollViewProps) {
  const [indicatorHeight, setIndicatorHeight] = useState(40);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const scrollViewRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(1);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleContentSizeChange = (w: number, h: number) => {
    setContentHeight(h);
    // Calcula altura do indicador
    if (h > containerHeight) {
      setIndicatorHeight(Math.max((containerHeight / h) * containerHeight, 30));
    } else {
      setIndicatorHeight(0);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset, contentSize} = e.nativeEvent;
    if (contentSize.height > containerHeight) {
      const maxScroll = contentSize.height - containerHeight;
      const percent = contentOffset.y / maxScroll;
      const maxIndicatorTop = containerHeight - indicatorHeight;
      setIndicatorTop(percent * maxIndicatorTop);
      setShowIndicator(true);

      // Limpa timeout anterior
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      // Esconde o indicador após 700ms sem scroll
      hideTimeout.current = setTimeout(() => setShowIndicator(false), 700);
    } else {
      setIndicatorTop(0);
      setShowIndicator(false);
    }
  };

  return (
    <View
      style={[
        {
          flex: 1,
          position: 'relative',
        },
        style,
      ]}>
      <ScrollView
        refreshControl={refreshControl}
        contentContainerStyle={contentContainerStyle}
        ref={scrollViewRef}
        onContentSizeChange={handleContentSizeChange}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false} // Esconde o nativo
        style={{flex: 1}}>
        {children}
      </ScrollView>
      {indicatorHeight > 0 && showIndicator && (
        <View
          style={[
            styles.indicator,
            {
              height: indicatorHeight,
              top: indicatorTop,
              backgroundColor: indicatorColor, // usa a nova prop
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    right: 2,
    width: 6,
    borderRadius: 3,
    opacity: 0.8,
  },
});
