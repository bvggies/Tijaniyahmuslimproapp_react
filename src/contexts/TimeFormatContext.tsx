import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TimeFormat = '12h' | '24h';

interface TimeFormatContextType {
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  formatTime: (date: Date) => string;
  formatTimeWithSeconds: (date: Date) => string;
}

const TimeFormatContext = createContext<TimeFormatContextType | undefined>(undefined);

interface TimeFormatProviderProps {
  children: ReactNode;
}

export const TimeFormatProvider: React.FC<TimeFormatProviderProps> = ({ children }) => {
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>('12h');

  // Load saved time format preference
  useEffect(() => {
    loadTimeFormat();
  }, []);

  const loadTimeFormat = async () => {
    try {
      const savedFormat = await AsyncStorage.getItem('timeFormat');
      if (savedFormat && (savedFormat === '12h' || savedFormat === '24h')) {
        setTimeFormatState(savedFormat as TimeFormat);
      }
    } catch (error) {
      console.error('Error loading time format:', error);
    }
  };

  const setTimeFormat = async (format: TimeFormat) => {
    try {
      setTimeFormatState(format);
      await AsyncStorage.setItem('timeFormat', format);
    } catch (error) {
      console.error('Error saving time format:', error);
    }
  };

  const formatTime = (date: Date): string => {
    if (timeFormat === '12h') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
  };

  const formatTimeWithSeconds = (date: Date): string => {
    if (timeFormat === '12h') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    }
  };

  const value: TimeFormatContextType = {
    timeFormat,
    setTimeFormat,
    formatTime,
    formatTimeWithSeconds,
  };

  return (
    <TimeFormatContext.Provider value={value}>
      {children}
    </TimeFormatContext.Provider>
  );
};

export const useTimeFormat = (): TimeFormatContextType => {
  const context = useContext(TimeFormatContext);
  if (context === undefined) {
    throw new Error('useTimeFormat must be used within a TimeFormatProvider');
  }
  return context;
};
