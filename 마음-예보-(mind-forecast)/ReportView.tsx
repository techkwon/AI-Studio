
import React from 'react';
import { ReportData } from '../types';
import { getBiorhythmForChart } from '../services/biorhythmService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SunIcon, PartlyCloudyIcon, CloudIcon, CheckCircleIcon, ExclamationIcon, BrainIcon, HeartIcon, BedIcon } from './Icons';

interface ReportViewProps {
  report: ReportData;
  birthDate: string;
  onDelete: () => void;
}

const WeatherIcon: React.FC<{ score: number }> = ({ score }) => {
    if (score > 75) return <SunIcon className="w-16 h-16 text-yellow-400" />;
    if (score > 40) return <PartlyCloudyIcon className="w-16 h-16 text-yellow-400" />;
    return <CloudIcon className="w-16 h-16 text-gray-400" />;
};

const Gauge: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className="text-amber-500"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" className="text-3xl font-bold" textAnchor="middle" dy=".3em" fill="currentColor">{score}</text>
            </svg>
        </div>
    );
};

const ReportView: React.FC<ReportViewProps> = ({ report, birthDate, onDelete }) => {
    const biorhythmData = getBiorhythmForChart(birthDate);
    const fiveElementsData = [
        { subject: '목(木)', value: report.fiveElements.wood, fullMark: 100 },
        { subject: '화(火)', value: report.fiveElements.fire, fullMark: 100 },
        { subject: '토(土)', value: report.fiveElements.earth, fullMark: 100 },
        { subject: '금(金)', value: report.fiveElements.metal, fullMark: 100 },
        { subject: '수(水)', value: report.fiveElements.water, fullMark: 100 },
    ];
    
    const recIcons: { [key: string]: React.ReactNode } = {
        '오전': <SunIcon className="w-8 h-8 text-amber-500" />,
        '오후': <PartlyCloudyIcon className="w-8 h-8 text-amber-500" />,
        '저녁': <BedIcon className="w-8 h-8 text-amber-500" />,
    };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-gray-800">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-amber-800">오늘의 마음 예보</h1>
        <p className="text-lg text-gray-600 mt-2">당신만을 위한 하루 가이드</p>
      </header>

      {/* Mind Weather */}
      <section className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-amber-700 mb-4">마음 날씨</h2>
        <div className="flex flex-col sm:flex-row items-center justify-around space-y-4 sm:space-y-0">
          <div className="flex flex-col items-center">
             <WeatherIcon score={report.mindWeather.score} />
          </div>
          <Gauge score={report.mindWeather.score} />
          <p className="text-center text-lg font-medium text-gray-700 sm:w-1/3">"{report.mindWeather.summary}"</p>
        </div>
      </section>

      {/* Keywords */}
      <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-amber-700 mb-4">오늘의 키워드</h2>
          <div className="flex flex-wrap justify-center gap-3">
              {report.keywords.map((keyword, index) => (
                  <span key={index} className="bg-amber-100 text-amber-800 text-md font-semibold px-4 py-2 rounded-full">
                      # {keyword}
                  </span>
              ))}
          </div>
      </section>
      
      {/* Detailed Forecast */}
      <section className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-amber-700 mb-4">상세 예보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">바이오리듬</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={biorhythmData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="physical" name="신체" stroke="#d97706" strokeWidth={2} />
                <Line type="monotone" dataKey="emotional" name="감성" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="intellectual" name="지성" stroke="#fbbf24" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">오행 에너지</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={fiveElementsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="에너지" dataKey="value" stroke="#b45309" fill="#f59e0b" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-amber-700 mb-4">시간대별 추천 활동</h2>
        <div className="space-y-4">
            {(Object.keys(report.recommendations) as Array<keyof typeof report.recommendations>).map(key => (
                <div key={key} className="flex items-start space-x-4 p-4 bg-amber-50 rounded-lg">
                    {recIcons[key === 'morning' ? '오전' : key === 'afternoon' ? '오후' : '저녁']}
                    <div>
                        <h4 className="font-bold text-lg text-amber-900">{report.recommendations[key].activity}</h4>
                        <p className="text-gray-600">{report.recommendations[key].description}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Advice & Caution */}
      <section className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-3 flex items-center text-green-700"><CheckCircleIcon className="w-6 h-6 mr-2" /> 오늘의 조언</h3>
            <p className="text-gray-700 leading-relaxed">{report.detailedAdvice.advice}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-3 flex items-center text-red-700"><ExclamationIcon className="w-6 h-6 mr-2" /> 주의할 점</h3>
            <p className="text-gray-700 leading-relaxed">{report.detailedAdvice.caution}</p>
        </div>
      </section>

      {/* Closing Message */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg text-center">
        <p className="text-lg italic">"{report.closingMessage}"</p>
      </section>

      <footer className="text-center pt-4">
        <button onClick={onDelete} className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          저장된 정보 삭제하고 다시 시작하기
        </button>
      </footer>
    </div>
  );
};

export default ReportView;
