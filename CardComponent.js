import React, {useEffect, useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Easing,
    TouchableOpacity
} from 'react-native';
import FlipCard from 'react-native-flip-card';

const CardComponent = (props) => {
    const animation = useState(new Animated.Value(0))[0];
    const [animValue, setanimValue] = useState(0);

    const { item, index, onClick, isInactive, isFlipped, isDisabled, openCards, flip } = props

    const handleClick = () => {
        !isFlipped && !isDisabled && onClick(index);
    };

    console.log(openCards)

    const RotateDataFront = animation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const RotateDataBack = animation.interpolate({
        inputRange: [180, 360],
        outputRange: ['180deg', '360deg'],
    });

    const RotateText = animation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const callAnimation=()=>{
        // animation.setValue(0);

        if(animValue >= 90){
            Animated.spring(animation, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver:true,
                easing: Easing.linear,
              }).start();
      
        }else{
            Animated.spring(animation, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver:true,
                easing: Easing.linear,
              }).start();
              handleClick()

        }
    }

    useEffect(()=>{
        // if(openCards.length!= 0){
            animation.addListener(({ value }) => {
                setanimValue(value)
                
            });
            // callAnimation()
        // }
        console.log(openCards)
        // if(flip){
        //     setanimValue(0)
        //     callAnimation()
    
        // }
    },[animation, openCards])

    return(
        <View style={{margin: 10,}}>
        {/* Back Side */}
            <TouchableOpacity onPress= {()=> callAnimation()}>
            <Animated.View style={[styles.back, {transform: [{ rotateX: RotateDataBack }]}]}>
            <Text style={{fontSize: 15, fontWeight:'500', transform: [{ scaleY : -1}]}}>{item.alphabet}</Text>
            </Animated.View>

            {/* Face Side */}
            <Animated.View style={[styles.face, {transform: [{ rotateX: RotateDataFront }]}]}>
            <Text style={{fontSize: 20, fontWeight:'500' }}>Face</Text>
            </Animated.View>
            </TouchableOpacity>

        </View>
    )
}
export default React.memo(CardComponent);

const styles = StyleSheet.create({  
    face: {
      width: 65,
      height: 100,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: '#2ecc71',
      justifyContent: 'center',
      alignItems: 'center',
      backfaceVisibility: 'hidden'
    },
    back: {
      width: 65,
      height: 100,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: '#f1c40f',
      justifyContent: 'center',
      alignItems: 'center',
      position:'absolute',
      top: 0
    },
  });