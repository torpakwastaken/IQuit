import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Habit } from '@/store/habitStore';

interface CalendarGridProps {
  habit: Habit;
}

export function CalendarGrid({ habit }: CalendarGridProps) {
  const getDays = () => {
    const days = [];
    const today = new Date();
    
    // Show last 35 days (5 weeks)
    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  const getDayStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const checkIn = habit.checkIns.find(c => c.date === dateStr);
    const habitStart = new Date(habit.startDate);
    
    if (date < habitStart) return 'before-start';
    if (date > new Date()) return 'future';
    if (!checkIn) return 'missed';
    
    return checkIn.status;
  };

  const getSquareStyle = (status: string, isToday: boolean) => {
    const baseStyle = [styles.daySquare];
    
    if (isToday) {
      baseStyle.push(styles.todaySquare);
    }
    
    switch (status) {
      case 'success':
        baseStyle.push(styles.successSquare);
        break;
      case 'failed':
        baseStyle.push(styles.failedSquare);
        break;
      case 'missed':
        baseStyle.push(styles.missedSquare);
        break;
      case 'future':
        baseStyle.push(styles.futureSquare);
        break;
      case 'before-start':
        baseStyle.push(styles.beforeStartSquare);
        break;
    }
    
    return baseStyle;
  };

  const days = getDays();
  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {days.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const status = getDayStatus(date);
          const isToday = dateStr === today;
          
          return (
            <TouchableOpacity
              key={index}
              style={getSquareStyle(status, isToday)}
              activeOpacity={0.7}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  daySquare: {
    width: '12.5%',
    aspectRatio: 1,
    margin: 1,
    borderRadius: 3,
    backgroundColor: '#374151',
  },
  todaySquare: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  successSquare: {
    backgroundColor: '#10b981',
  },
  failedSquare: {
    backgroundColor: '#ef4444',
  },
  missedSquare: {
    backgroundColor: '#6b7280',
  },
  futureSquare: {
    backgroundColor: '#374151',
    opacity: 0.3,
  },
  beforeStartSquare: {
    backgroundColor: 'transparent',
  },
});