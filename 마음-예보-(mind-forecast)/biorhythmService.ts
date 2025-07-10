
import { BiorhythmData } from '../types';

const PHYSICAL_CYCLE = 23;
const EMOTIONAL_CYCLE = 28;
const INTELLECTUAL_CYCLE = 33;

const calculateDaysSinceBirth = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  birth.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateBiorhythmValue = (days: number, cycle: number): number => {
  const value = Math.sin((2 * Math.PI * days) / cycle);
  // Convert from [-1, 1] to [0, 100]
  return Math.round((value + 1) * 50);
};

export const calculateBiorhythms = (birthDate: string): BiorhythmData => {
  const daysSinceBirth = calculateDaysSinceBirth(birthDate);
  
  const todayBiorhythms = {
    physical: calculateBiorhythmValue(daysSinceBirth, PHYSICAL_CYCLE),
    emotional: calculateBiorhythmValue(daysSinceBirth, EMOTIONAL_CYCLE),
    intellectual: calculateBiorhythmValue(daysSinceBirth, INTELLECTUAL_CYCLE),
  };

  return todayBiorhythms;
};

export const getBiorhythmForChart = (birthDate: string) => {
    const daysSinceBirth = calculateDaysSinceBirth(birthDate);
    const data = [];
    for (let i = -2; i <= 2; i++) {
        const day = daysSinceBirth + i;
        data.push({
            name: i === 0 ? '오늘' : `${i > 0 ? '+' : ''}${i}일`,
            physical: calculateBiorhythmValue(day, PHYSICAL_CYCLE),
            emotional: calculateBiorhythmValue(day, EMOTIONAL_CYCLE),
            intellectual: calculateBiorhythmValue(day, INTELLECTUAL_CYCLE),
        });
    }
    return data;
};
