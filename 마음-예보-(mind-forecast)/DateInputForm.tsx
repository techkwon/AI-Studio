
import React, { useState } from 'react';

interface DateInputFormProps {
  onGenerate: (birthDate: string, shouldSave: boolean) => void;
}

const DateInputForm: React.FC<DateInputFormProps> = ({ onGenerate }) => {
  const [birthDate, setBirthDate] = useState('');
  const [shouldSave, setShouldSave] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setError('생년월일을 입력해주세요.');
      return;
    }
    const date = new Date(birthDate);
    const today = new Date();
    if (date > today) {
        setError('생년월일은 오늘보다 이전이어야 합니다.');
        return;
    }
    setError('');
    onGenerate(birthDate, shouldSave);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-800">마음 예보</h1>
            <p className="text-gray-600 mt-2">AI가 당신의 오늘을 점쳐드려요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              생년월일
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition"
              required
              max={new Date().toISOString().split("T")[0]}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex items-center">
            <input
              id="save-birthdate"
              type="checkbox"
              checked={shouldSave}
              onChange={(e) => setShouldSave(e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="save-birthdate" className="ml-2 block text-sm text-gray-900">
              브라우저에 생년월일 저장
            </label>
          </div>
          <p className="text-xs text-gray-500">
              체크 시, 다음 방문 때 생년월일을 다시 입력하지 않아도 됩니다. 정보는 서버에 저장되지 않고 현재 사용 중인 브라우저에만 안전하게 보관됩니다.
          </p>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            확인하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default DateInputForm;
