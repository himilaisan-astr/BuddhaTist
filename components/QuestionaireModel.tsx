import { useEffect, useState } from "react";
import { Button, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { lessons } from "@/database/lessons";
import { questionDB } from "@/database/questions";

export const QuestionnaireModal = ({ lessonId, visible, onClose }: any) => {
  const currentLesson = lessons[lessonId];
  const [answers, setAnswers] = useState<any[]>(currentLesson.content.answers);
  const [questions, setQuestions] = useState(currentLesson.content.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Track selected option

  const [correct, setCorrect] = useState<boolean>();
  const [ansCheck, setAnsCheck] = useState<boolean>();

  useEffect(() => {
    setAnswers(currentLesson.content.answers);
    setQuestions(currentLesson.content.questions)
  }, [lessonId])

  const checkAnswer = () => {
    if (selectedOption !== null) {
        const thisQuestion = questionDB[lessonId][currentQuestionIndex];
        const correctAnswer = thisQuestion.correctOption;
        const givenIndex = thisQuestion.options.findIndex(option => option === selectedOption);

        setCorrect(givenIndex == correctAnswer)
        return true
    }
    return false
  }
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setAnswers((prev : any) => ([ ...prev, questions[currentQuestionIndex].id]));
  };

  const handleSwipeLeft = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  }

  const handleSubmit = () => {
  
    // Automatically go to the next question
    if (currentQuestionIndex < questions.length - 1) {

        if (ansCheck != true){
            setAnsCheck(checkAnswer());
        } else {
            // Reset all the variables

            handleSwipeLeft();
            setSelectedOption(null); // Reset selected option for the next question
            setCorrect(undefined); // Reset correct answer
            setAnsCheck(false);
        }
    } else {

        // set isCompleted
        currentLesson.isCompleted = true;

        onClose();
    }
  };

  const handleClose = () => {
    setSelectedOption(null); // Reset selected option when closing the modal
    setCurrentQuestionIndex(0); // Reset question index
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedText style={styles.question}>
            {questions[currentQuestionIndex].question}
          </ThemedText>
          {questions[currentQuestionIndex].options.map((option: any) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                selectedOption === option  && styles.selectedOption,
                selectedOption === option && ansCheck && (correct ? styles.correctOption : styles.wrongOption)   
            ]}
            
              onPress={() => handleOptionSelect(option)}
            >
              <ThemedText style={styles.optionText}>{option}</ThemedText>
            </TouchableOpacity>
          ))}
          {/* {currentQuestionIndex === questions.length - 1 && ( */}
            <Button title="Submit" onPress={handleSubmit} />
          {/* )} */}
        </ScrollView>
        <Button title="Close" onPress={handleClose} />
      </View>
    </Modal>
  );
};

// Add styles for the selected option
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1, // Ensures that the ScrollView can scroll
    justifyContent: 'flex-start',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#d0e0f0', // Change to your desired selected background color
  },
  correctOption: {
    backgroundColor: '#4CAF50', // Softer green
    color: 'white',
  },
  wrongOption: {
    backgroundColor: '#F44336', // Brighter red
    color: 'white',
  },
  optionText: {
    fontSize: 16,
  },
});
