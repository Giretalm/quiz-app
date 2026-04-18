import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Button } from "react-native";

import styles from "./styles";

import { ButtonGroup } from "@rneui/base";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const sampleQuestions = [
  {
    prompt: "What is the capital of the United States?",
    type: "multiple-choice",
    choices: ["New York", "Los Angeles", "Washington, D.C.", "Chicago"],
    correct: 2, // Washington, D.C.
  },
  {
    prompt: "Which are mobile operating systems?",
    type: "multiple-answer",
    choices: ["iOS", "Windows", "Linux", "Android"],
    correct: [0, 3], //iOS & Android
  },
  {
    prompt: "The Earth revolves around the Sun.",
    type: "true-false",
    choices: ["True", "False"],
    correct: 0, // True
  },
];

export function Question({ route, navigation }) {
  const { data, index, answers } = route.params;
  const question = data[index];

  const [selected, setSelected] = useState(
    question.type === "multiple-answer" ? [] : null
  );


  useEffect(() => {
    setSelected(question.type === "multiple-answer" ? [] : null);
  }, [index]);

  const handleSelect = (i) => {
    if (question.type === "multiple-answer") {
      if (selected?.includes(i)) {
        setSelected(selected.filter((x) => x !== i));
      } else {
        setSelected([...selected, i]);
      }
    } else {
      setSelected(i);
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[index] = selected;

    if (index + 1 < data.length) {
      navigation.replace("Question", {
        data,
        index: index + 1,
        answers: newAnswers,
      });
    } else {
      navigation.replace("Summary", {
        data,
        answers: newAnswers,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <ButtonGroup
        testID="choices"
        buttons={question.choices}
        vertical
        selectedIndex={
          question.type === "multiple-answer" ? undefined : selected
        }
        selectedIndexes={
          question.type === "multiple-answer" ? selected : undefined
        }
        onPress={handleSelect}
      />

      <Button
        title="Next"
        onPress={handleNext}
        disabled={
          selected === null ||
          (Array.isArray(selected) && selected.length === 0)
        }
      />
    </View>
  );
}

export function Summary({ route }) {
  const { data, answers } = route.params;

  const checkCorrect = (correct, answer) => {
    if (Array.isArray(correct)) {
      return (
        Array.isArray(answer) &&
        correct.length === answer.length &&
        correct.every((v) => answer.includes(v))
      );
    }
    return correct === answer;
  };

  let score = 0;
  data.forEach((q, i) => {
    if (checkCorrect(q.correct, answers[i])) score++;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.score}>
        Score: {score} / {data.length}
      </Text>

      {data.map((q, i) => (
        <View key={i} style={styles.block}>
          <Text style={styles.prompt}>{q.prompt}</Text>

          {q.choices.map((c, j) => {
            const isCorrect = Array.isArray(q.correct)
              ? q.correct.includes(j)
              : q.correct === j;

            const userAnswer = answers[i];
            const isChosen = Array.isArray(userAnswer)
              ? userAnswer.includes(j)
              : userAnswer === j;

            return (
              <Text
                key={j}
                style={[
                  isCorrect && styles.correct,
                  isChosen && !isCorrect && styles.incorrect,
                ]}
              >
                {c}
              </Text>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Question"
          component={Question}
          initialParams={{
            data: sampleQuestions,
            index: 0,
            answers: [],
          }}
        />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}