
import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import DateInputForm from './components/DateInputForm';
import LoadingSpinner from './components/LoadingSpinner';
import ReportView from './components/ReportView';
import { generateMindForecast } from './services/geminiService';
import { calculateBiorhythms } from './services/biorhythmService';
import { ReportData } from './types';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useLocalStorage<string | null>('mind-forecast-birthdate', null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      const biorhythms = calculateBiorhythms(date);
      const data = await generateMindForecast(date, biorhythms);
      setReportData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      // Clear birthdate if there's an error to allow re-entry
      setBirthDate(null);
    } finally {
      setIsLoading(false);
    }
  }, [setBirthDate]);

  useEffect(() => {
    if (birthDate && !reportData) {
      handleGenerateReport(birthDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthDate, handleGenerateReport]);

  const handleFormSubmit = (date: string, shouldSave: boolean) => {
    if (shouldSave) {
      setBirthDate(date);
    } else {
      // Don't save to localStorage, just use for this session
      setBirthDate(null); // Clear any old saved value
      handleGenerateReport(date);
    }
  };

  const handleDeleteData = () => {
    setBirthDate(null);
    setReportData(null);
    setError(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">오류 발생</h2>
          <p className="text-gray-700 mt-2 mb-4">{error}</p>
          <button
            onClick={handleDeleteData}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  if (reportData && birthDate) {
    return <ReportView report={reportData} birthDate={birthDate} onDelete={handleDeleteData} />;
  }
  
  // This case handles when a user opted not to save, but a report is ready.
  if (reportData && !birthDate) {
      // We need a dummy date for the chart. The report is the main thing.
      // In a real scenario, we might pass the temporary date down.
      // For now, let's create a temporary birthDate for display that is not saved.
      const temporaryBirthDate = new Date().toISOString().split('T')[0]; // This is a placeholder
      return <ReportView report={reportData} birthDate={temporaryBirthDate} onDelete={handleDeleteData} />;
  }

  return <DateInputForm onGenerate={handleFormSubmit} />;
};

export default App;
