import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Trophy, Target, Trash2, Edit3, X, Save } from 'lucide-react-native';
import { useHabitStore } from '@/store/habitStore';
import { useTranslation } from '@/utils/i18n';
import { CalendarView } from '@/components/Dashboard/CalendarView';
import { getHabitIcon } from '@/utils/habitIcons';

export default function HabitDetail() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const { 
    habits, 
    language, 
    getCurrentStreak, 
    getLongestStreak, 
    getDaysSinceStart,
    deleteHabit,
    updateHabit,
    updateDayNote,
    deleteDayNote
  } = useHabitStore();
  const t = useTranslation(language);

  // State for edit modals
  const [editMotivationModal, setEditMotivationModal] = useState(false);
  const [editMotivationText, setEditMotivationText] = useState('');
  const [editNotesModal, setEditNotesModal] = useState(false);
  const [editNoteModal, setEditNoteModal] = useState(false);
  const [editNoteText, setEditNoteText] = useState('');
  const [selectedNoteDate, setSelectedNoteDate] = useState('');

  const habit = habits.find(h => h.id === habitId);

  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Habit not found</Text>
      </SafeAreaView>
    );
  }

  const HabitIcon = getHabitIcon(habit.icon);
  const currentStreak = getCurrentStreak(habit.id);
  const longestStreak = getLongestStreak(habit.id);
  const daysSinceStart = getDaysSinceStart(habit.id);

  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone and will remove all your progress.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleEditMotivation = () => {
    setEditMotivationText(habit.motivation || '');
    setEditMotivationModal(true);
  };

  const handleSaveMotivation = () => {
    updateHabit(habit.id, { motivation: editMotivationText.trim() });
    setEditMotivationModal(false);
    setEditMotivationText('');
  };

  const handleEditNotes = () => {
    setEditNotesModal(true);
  };

  const handleSelectNote = (date: string, note: string) => {
    setSelectedNoteDate(date);
    setEditNoteText(note);
    setEditNotesModal(false);
    setEditNoteModal(true);
  };

  const handleSaveNote = () => {
    if (editNoteText.trim()) {
      updateDayNote(habit.id, selectedNoteDate, editNoteText.trim());
    } else {
      deleteDayNote(habit.id, selectedNoteDate);
    }
    setEditNoteModal(false);
    setEditNoteText('');
    setSelectedNoteDate('');
  };

  const handleDeleteNote = (date: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDayNote(habit.id, date);
            setEditNotesModal(false);
          }
        }
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <View style={styles.habitInfo}>
          <HabitIcon size={32} color="#3b82f6" />
          <Text style={styles.habitName}>{habit.name}</Text>
        </View>
        <TouchableOpacity onPress={handleDeleteHabit} style={styles.deleteButton}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Calendar size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{daysSinceStart}</Text>
            <Text style={styles.statLabel}>Days Since Start</Text>
          </View>
          
          <View style={styles.statCard}>
            <Target size={24} color="#10b981" />
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Trophy size={24} color="#f59e0b" />
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Calendar</Text>
          <CalendarView habit={habit} />
        </View>

        {habit.dayNotes && habit.dayNotes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderWithAction}>
              <Text style={styles.sectionTitle}>Your Daily Notes</Text>
              <TouchableOpacity onPress={handleEditNotes} style={styles.editButton}>
                <Edit3 size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            <View style={styles.notesContainer}>
              {habit.dayNotes
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date (newest first)
                .map((dayNote, index) => {
                  const noteDate = new Date(dayNote.date);
                  const formattedDate = noteDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  });
                  const isLastItem = index === habit.dayNotes.length - 1;
                  
                  return (
                    <View key={index} style={[styles.noteItem, isLastItem && styles.lastNoteItem]}>
                      <View style={styles.noteHeader}>
                        <Text style={styles.noteDate}>{formattedDate}</Text>
                      </View>
                      <Text style={styles.noteText}>&ldquo;{dayNote.note}&rdquo;</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeaderWithAction}>
            <Text style={styles.sectionTitle}>Your Motivation</Text>
            <TouchableOpacity onPress={handleEditMotivation} style={styles.editButton}>
              <Edit3 size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          {habit.motivation ? (
            <View style={styles.motivationCard}>
              <Text style={styles.motivationText}>&ldquo;{habit.motivation}&rdquo;</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleEditMotivation} style={styles.addMotivationButton}>
              <Text style={styles.addMotivationText}>+ Add your motivation</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit Motivation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editMotivationModal}
        onRequestClose={() => setEditMotivationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Your Motivation</Text>
              <TouchableOpacity 
                onPress={() => setEditMotivationModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.motivationInput}
              value={editMotivationText}
              onChangeText={setEditMotivationText}
              placeholder="Why do you want to quit this habit?"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveMotivation}
              >
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save Motivation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Select Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editNotesModal}
        onRequestClose={() => setEditNotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Note to Edit</Text>
              <TouchableOpacity 
                onPress={() => setEditNotesModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notesSelectionContainer}>
              {habit.dayNotes && habit.dayNotes
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((dayNote, index) => {
                  const noteDate = new Date(dayNote.date);
                  const formattedDate = noteDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  });
                  
                  return (
                    <View key={index} style={styles.noteSelectionItem}>
                      <TouchableOpacity 
                        style={styles.noteSelectionContent}
                        onPress={() => handleSelectNote(dayNote.date, dayNote.note)}
                      >
                        <Text style={styles.noteSelectionDate}>{formattedDate}</Text>
                        <Text style={styles.noteSelectionText} numberOfLines={2}>
                          "{dayNote.note}"
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleDeleteNote(dayNote.date)}
                        style={styles.noteDeleteButton}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editNoteModal}
        onRequestClose={() => setEditNoteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Note</Text>
              <TouchableOpacity 
                onPress={() => setEditNoteModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.noteInput}
              value={editNoteText}
              onChangeText={setEditNoteText}
              placeholder="How did you feel today? Any challenges or victories?"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveNote}
              >
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginLeft: 12,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#7f1d1d20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef444440',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#f1f5f9',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  notesContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  noteItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  lastNoteItem: {
    borderBottomWidth: 0,
  },
  noteHeader: {
    marginBottom: 6,
  },
  noteDate: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3b82f6',
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  motivationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    borderWidth: 1,
    borderColor: '#334155',
  },
  motivationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#e2e8f0',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 50,
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    padding: 6,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  addMotivationButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
  },
  addMotivationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  motivationInput: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 80,
    marginBottom: 20,
  },
  modalActions: {
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  noteInput: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 100,
    marginBottom: 20,
  },
  notesSelectionContainer: {
    maxHeight: 400,
  },
  noteSelectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  noteSelectionContent: {
    flex: 1,
    padding: 12,
  },
  noteSelectionDate: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  noteSelectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    fontStyle: 'italic',
  },
  noteDeleteButton: {
    padding: 12,
    backgroundColor: '#ef444420',
    borderRadius: 6,
    marginRight: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});