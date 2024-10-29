import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Modal, View, ScrollView, Button, TouchableOpacity } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { lessons } from '@/database/lessons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { QuestionnaireModal } from '@/components/QuestionaireModel';

export default function TabTwoScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [lessonId, setLessonId] = useState(0);

  const lessonPressed = (id : any) => {
    setLessonId(id)
    setModalVisible(true)
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="leaf-outline" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Study</ThemedText>
      </ThemedView>
      <ThemedText>Đây là một app để giúp mẹ thi đậu Phật cử.</ThemedText>

      {
        lessons.map((lesson) => (
          <TouchableOpacity 
            key={lesson.lessonId} 
            onPress={() => lessonPressed(lesson.lessonId)}
          >
            <ThemedText>
              {`Bài ${lesson.lessonId + 1}: ${lesson.title} `}
              <Ionicons 
                color={lesson.isCompleted ? "green" : "black"} 
                name={lesson.isCompleted ? "leaf" : "leaf-outline"} 
              />
            </ThemedText>
          </TouchableOpacity>

        ))
      }

      <QuestionnaireModal lessonId={lessonId} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
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
  optionText: {
    fontSize: 16,
  },
});
