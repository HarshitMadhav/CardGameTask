/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList
} from 'react-native';
import constants from './constants'
import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
const { width, height } = Dimensions.get('window');
import CardComponent from './CardComponent';

const uniqueCardsArray= [
  {
    alphabet: "A",
    isFlipped: false
  },
  {
    alphabet: "B",
    isFlipped: false
  },
  {
    alphabet: "C",
    isFlipped: false
  },
  {
    alphabet: "D",
    isFlipped: false
  },
  {
    alphabet: "E",
    isFlipped: false
  },
  {
    alphabet: "F",
    isFlipped: false
  },
  {
    alphabet: "G",
    isFlipped: false
  },
  {
    alphabet: "H",
    isFlipped: false
  }
]

function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

const App = () => {

  const [cards, setCards] = useState(() => shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  // const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(
    0
  );
  const timeout = useRef(null);
  const [flip, setFlip] = useState(false)

  const disable = () => {
    setShouldDisableAllCards(true);
  };

  const enable = () => {
    setShouldDisableAllCards(false);
  };


  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueCardsArray.length) {
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      // localStorage.setItem("bestScore", highScore);
    }
  };

  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].alphabet === cards[second].alphabet) {
      setClearedCards((prev) => ({ ...prev, [cards[first].alphabet]: true }));
      setOpenCards([]);
      setBestScore(bestScore+1);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
      setFlip(true)
    }, 500);
  };

  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);

  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.alphabet]);
  };

  
  const renderCards = (item, index) => {
    return(
      <CardComponent
        item={item}
        index={index}
        isDisabled={shouldDisableAllCards}
        isInactive={checkIsInactive(item)}
        isFlipped={checkIsFlipped(index)}
        onClick={handleCardClick}
        openCards={openCards}
        flip={flip}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 5 }}>
      <StatusBar backgroundColor="black" />
          <FlatList data={cards}
            renderItem={({item, index}) => renderCards(item,index)}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
          />

        <Text style={{fontSize: 15, fontWeight:'500'}}>Moves: {moves} </Text>
        <Text style={{fontSize: 15, fontWeight:'500'}}>Score: {bestScore} </Text>

    </SafeAreaView>
  );
};

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
  },
});

export default App;
