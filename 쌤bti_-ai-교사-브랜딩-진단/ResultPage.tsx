import React, { useRef, useState } from 'react';
import { SsaemBtiResult } from '../types';
import StarRating from './StarRating';
import { Download, Share2, RefreshCw, Sparkles, Target, TrendingUp, ChevronsRight, Crown } from 'lucide-react';

// This is a workaround for the fact that jsPDF is loaded from a script tag
declare const jspdf: any;
declare const html2canvas: any;

interface ResultPageProps {
  result: SsaemBtiResult;
  onRestart: () => void;
}

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }> = ({ icon, title, children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 ${className}`}>
        <div className="flex items-center mb-4">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-600 space-y-2">{children}</div>
    </div>
);

const ResultPage: React.FC<ResultPageProps> = ({ result, onRestart }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rating, setRating] = useState(0);

  const handleDownloadImage = () => {
    if (!reportRef.current) return;
    setIsProcessing(true);
    html2canvas(reportRef.current, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#f9fafb'
    }).then((canvas: any) => {
      const link = document.createElement('a');
      link.download = 'SsaemBTI_Report.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch((err: any) => {
        console.error("Error generating image:", err);
        alert("이미지 생성 중 오류가 발생했습니다.");
    }).finally(() => {
      setIsProcessing(false);
    });
  };

  const handleDownloadPdf = () => {
    if (!reportRef.current) return;
    setIsProcessing(true);
    
    html2canvas(reportRef.current, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#f9fafb' // Ensure bg color for canvas
    }).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;

      let newImgWidth = pdfWidth - 20; // with 10mm margin on each side
      let newImgHeight = newImgWidth / ratio;

      if (newImgHeight > pdfHeight - 20) { // with 10mm margin top/bottom
          newImgHeight = pdfHeight - 20;
          newImgWidth = newImgHeight * ratio;
      }

      const xOffset = (pdfWidth - newImgWidth) / 2;
      const yOffset = (pdfHeight - newImgHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
      pdf.save('SsaemBTI_Report.pdf');
      
    }).catch((err: any) => {
        console.error("Error generating PDF:", err);
        alert("PDF 생성 중 오류가 발생했습니다.");
    }).finally(() => {
        setIsProcessing(false);
    });
  };
  
  return (
    <div className="w-full animate-fade-in-up">
      <div ref={reportRef} className="bg-gray-50 p-4 sm:p-8 rounded-t-2xl">
          <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600">나의 브랜딩 리포트</h1>
              <p className="text-gray-500 mt-2">Gemini AI가 분석한 선생님만의 특별한 모습입니다.</p>
          </div>
          <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="grid md:grid-cols-5 items-center">
                    <div className="md:col-span-3 p-6 order-2 md:order-1">
                        <div className="flex items-center mb-4">
                            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-4"><Crown size={24} /></div>
                            <h3 className="text-xl font-bold text-gray-800">나의 캐릭터</h3>
                        </div>
                        <p className="text-3xl font-black text-indigo-600 mb-3">{result.character.name}</p>
                        <p className="text-gray-600">{result.character.description}</p>
                    </div>
                    <div className="md:col-span-2 bg-indigo-50 flex items-center justify-center p-4 h-full min-h-[250px] order-1 md:order-2">
                        <img 
                            src={result.characterImageUrl} 
                            alt={result.character.name} 
                            className="max-w-full h-auto max-h-64 object-contain"
                        />
                    </div>
                </div>
              </div>

              <SectionCard icon={<Sparkles size={24} />} title="나의 슬로건">
                  <p className="text-xl font-semibold text-center text-gray-700 italic">"{result.slogan}"</p>
              </SectionCard>
              
              <SectionCard icon={<Target size={24} />} title="나의 강점">
                {result.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start">
                        <ChevronsRight className="w-5 h-5 text-indigo-500 mr-2 mt-1 flex-shrink-0" />
                        <p>{strength}</p>
                    </div>
                ))}
              </SectionCard>

              <SectionCard icon={<TrendingUp size={24} />} title={result.growth_point.title}>
                  <p>{result.growth_point.description}</p>
              </SectionCard>
          </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-b-2xl p-6 mt-0">
        <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">결과가 마음에 드시나요?</h3>
        <div className="flex justify-center mb-6">
            <StarRating rating={rating} onRating={setRating} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <button onClick={handleDownloadPdf} disabled={isProcessing} className="flex items-center justify-center gap-2 w-full bg-red-500 text-white font-bold py-3 px-4 rounded-full hover:bg-red-600 transition-all duration-300 disabled:bg-gray-400">
                <Download size={20} /> PDF 저장
            </button>
            <button onClick={handleDownloadImage} disabled={isProcessing} className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-600 transition-all duration-300 disabled:bg-gray-400">
                <Share2 size={20} /> 이미지 공유
            </button>
            <button onClick={onRestart} disabled={isProcessing} className="flex items-center justify-center gap-2 w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-full hover:bg-gray-700 transition-all duration-300">
                <RefreshCw size={20} /> 다시하기
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
