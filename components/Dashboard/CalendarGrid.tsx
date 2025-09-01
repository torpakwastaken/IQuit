import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Habit } from '@/store/habitStore';

interface CalendarGridProps {
  habit: Habit;
}

export function CalendarGrid({ habit }: CalendarGridProps) {
  // Create a grid showing the last 40 days
  const createGrid = () => {
    const squares = [];
    const today = new Date();
    
    // Create 40 squares representing the last 40 days
    for (let i = 0; i < 40; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (39 - i)); // Start from 39 days ago
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if this date has a successful check-in
      const checkIn = habit.checkIns.find(c => c.date === dateStr);
      const isSuccess = checkIn?.status === 'success';
      const isToday = dateStr === today.toISOString().split('T')[0];
      
      // Determine color based on check-in status
      let backgroundColor;
      if (isSuccess) {
        backgroundColor = '#22c55e'; // Bright green for checked-in days
      } else if (checkIn?.status === 'failed') {
        backgroundColor = '#ef4444'; // Red for failed days
      } else {
        backgroundColor = '#374151'; // Dark gray for no check-in
      }
      
      squares.push({
        key: i,
        backgroundColor,
        isToday,
        date: dateStr
      });
    }
    
    return squares;
  };

  const squares = createGrid();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {squares.map((square) => (
          <View
            key={square.key}
            style={[
              styles.square,
              { backgroundColor: square.backgroundColor },
              square.isToday && styles.todayBorder
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 192, // 8 squares * (20px + 4px margin) = 192px
  },
  square: {
    width: 20,
    height: 20,
    margin: 2,
    borderRadius: 3,
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
});