import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Easing } from 'react-native-reanimated';

const backgroundImage = require('./assets/images/beautiful.webp');

export default function App() {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const feedbackOpacity = useState(new Animated.Value(0))[0];
  const [guessCount, setGuessCount] = useState(0);
  const [winCount, setWinCount] = useState(0);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  useEffect(() => {
    if (feedback) {
      feedbackOpacity.setValue(1); // Reset the animation value
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 1000,
        delay: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [feedback]);

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    let newFeedback = '';
    if (numGuess > randomNumber) {
      newFeedback = 'Your guess is too high!';
    } else if (numGuess < randomNumber) {
      newFeedback = 'Your guess is too low!';
    } else {
      newFeedback = 'Correct! You guessed the number!';
      setRandomNumber(generateRandomNumber());
      setGuessCount(0); // Reset the guess count for the new game
      setWinCount(prevWinCount => prevWinCount + 1); // Increment the win count
    }
    setFeedback(newFeedback);
    setGuess('');
    setGuessCount(prevCount => prevCount + 1); // Increment the guess count

    // Reset and start the feedback animation
    feedbackOpacity.setValue(0);
    Animated.timing(feedbackOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 500,
        delay: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  const feedbackStyle = {
    opacity: feedbackOpacity,
    transform: [
      {
        translateY: feedbackOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent']} style={styles.container}>
        <Text style={styles.title}>Guess the Number!</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={guess}
          onChangeText={setGuess}
          placeholder="Enter your guess"
          placeholderTextColor="#ccc"
        />
        <Button title="Submit Guess" onPress={handleGuess} color="#6200ee" />
        {feedback ? (
          <Animated.Text style={[styles.feedback, feedbackStyle]}>{feedback}</Animated.Text>
        ) : null}
        <View style={styles.countersContainer}>
          <View style={styles.guessCountContainer}>
            <Text style={styles.counterText}>Guesses: {guessCount}</Text>
          </View>
          <View style={styles.winCountContainer}>
            <Text style={styles.counterText}>Wins: {winCount}</Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000',
  },
  feedback: {
    marginTop: 20,
    fontSize: 24,
    color: '#fff',
  },
  countersContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  guessCountContainer: {
    marginRight: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  winCountContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  counterText: {
    fontSize: 18,
    color: '#fff',
  },
});