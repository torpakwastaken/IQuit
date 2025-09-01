import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Habit } from '@/store/habitStore';

interface CalendarGridProps {
  habit: Habit;
}

export function CalendarGrid({ habit }: CalendarGridProps) {
  // Create a grid showing the current month as a proper calendar
  const createMonthGrid = () => {
    const squares = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get first day of the month and number of days
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const todayStr = today.toISOString().split('T')[0];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      squares.push({
        key: `empty-${i}`,
        backgroundColor: 'transparent',
        isEmpty: true
      });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if this date has a check-in
      const checkIn = habit.checkIns.find(c => c.date === dateStr);
      const isSuccess = checkIn?.status === 'success';
      const isFailed = checkIn?.status === 'failed';
      const isToday = dateStr === todayStr;
      
      // Determine color based on check-in status
      let backgroundColor;
      if (isSuccess) {
        backgroundColor = '#fbbf24'; // Bright yellow for successful days
      } else if (isFailed) {
        backgroundColor = '#ef4444'; // Red for failed days
      } else {
        backgroundColor = '#374151'; // Dark gray for no check-in
      }
      
      squares.push({
        key: day,
        backgroundColor,
        isToday,
        isEmpty: false
      });
    }
    
    return squares;
  };

  const squares = createMonthGrid();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {squares.map((square) => (
          <View
            key={square.key}
            style={[
              styles.square,
              { backgroundColor: square.backgroundColor },
              square.isToday && styles.todayBorder,
              square.isEmpty && styles.emptySquare
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
    width: 192, // 7 squares * (24px + 4px margin) = 196px (adjusted for weekly layout)
  },
  square: {
    width: 24,
    height: 24,
    margin: 2,
    borderRadius: 3,
  },
  emptySquare: {
    backgroundColor: 'transparent',
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
});