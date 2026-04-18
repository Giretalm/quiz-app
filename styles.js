import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  prompt: {
    fontSize: 18,
    marginBottom: 15,
  },

  score: {
    fontSize: 22,
    marginBottom: 20,
  },

  block: {
    marginBottom: 25,
  },

  correct: {
    fontWeight: "bold",
    color: "green",
  },

  incorrect: {
    textDecorationLine: "line-through",
    color: "red",
  },
});