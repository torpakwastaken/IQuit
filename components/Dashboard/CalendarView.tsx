import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { ChevronLeft, ChevronRight, X, Save, Edit3 } from 'lucide-react-native';
import { Habit, useHabitStore } from '@/store/habitStore';

interface CalendarViewProps {
  habit: Habit;
}

export function CalendarView({ habit }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const { getDayNote, addDayNote, updateDayNote, deleteDayNote } = useHabitStore();

  // Get current month and year
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Week day names
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDatePress = (day: number) => {
    // Create date string without timezone issues
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    const existingNote = getDayNote(habit.id, dateStr);
    setNoteText(existingNote || '');
    setModalVisible(true);
  };

  const handleSaveNote = () => {
    if (!selectedDate) return;

    if (noteText.trim()) {
      const existingNote = getDayNote(habit.id, selectedDate);
      if (existingNote) {
        updateDayNote(habit.id, selectedDate, noteText.trim());
      } else {
        addDayNote(habit.id, selectedDate, noteText.trim());
      }
    } else {
      // If note is empty, delete it
      deleteDayNote(habit.id, selectedDate);
    }

    setModalVisible(false);
    setSelectedDate(null);
    setNoteText('');
  };

  const handleDeleteNote = () => {
    if (!selectedDate) return;
    
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDayNote(habit.id, selectedDate);
            setModalVisible(false);
            setSelectedDate(null);
            setNoteText('');
          }
        }
      ]
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.emptyDay} />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = dateStr === todayStr;
      const hasNote = !!getDayNote(habit.id, dateStr);
      
      // Check if this date has a check-in
      const checkIn = habit.checkIns.find(c => c.date === dateStr);
      const hasCheckIn = !!checkIn;
      const isSuccess = checkIn?.status === 'success';

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.day,
            isToday && styles.today,
            hasCheckIn && (isSuccess ? styles.successDay : styles.failedDay),
            hasNote && styles.hasNote
          ]}
          onPress={() => handleDatePress(day)}
        >
          <Text style={[
            styles.dayText,
            isToday && styles.todayText,
            hasCheckIn && styles.checkedInText
          ]}>
            {day}
          </Text>
          {hasNote && <View style={styles.noteDot} />}
        </TouchableOpacity>
      );
    }

    return days;
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    // Parse the date string correctly to avoid timezone issues
    const [yearStr, monthStr, dayStr] = selectedDate.split('-');
    const date = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <View style={styles.container}>
        {/* Month Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <ChevronLeft size={20} color="#64748b" />
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {monthNames[month]} {year}
          </Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Week Day Headers */}
        <View style={styles.weekHeader}>
          {weekDays.map((day) => (
            <View key={day} style={styles.weekDay}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendar}>
          {renderCalendarDays()}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.legendText}>Success</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>Failed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>Has Note</Text>
          </View>
        </View>
      </View>

      {/* Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {formatSelectedDate()}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>
                <Edit3 size={16} color="#64748b" /> Add a note for this day
              </Text>
              <TextInput
                style={styles.noteInput}
                value={noteText}
                onChangeText={setNoteText}
                placeholder="How did you feel today? Any challenges or victories?"
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActions}>
              {getDayNote(habit.id, selectedDate || '') && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteNote}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#f1f5f9',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '13.5%', // Match the day width for consistent 7-day layout
    aspectRatio: 1,
  },
  day: {
    width: '13.5%', // Slightly less than 14.28% to ensure proper 7-day layout with margins
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
    position: 'relative',
  },
  today: {
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
  successDay: {
    backgroundColor: '#22c55e',
  },
  failedDay: {
    backgroundColor: '#ef4444',
  },
  hasNote: {
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#f1f5f9',
  },
  todayText: {
    color: '#60a5fa',
    fontFamily: 'Inter-Bold',
  },
  checkedInText: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  noteDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
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
  noteContainer: {
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
});