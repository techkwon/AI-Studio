import { Mentor, Question, Character } from './types';

export const IMAGE_GENERATION_ERROR_PLACEHOLDER = 'https://via.placeholder.com/200/FF0000/FFFFFF?Text=Error+Loading+Image';
export const IMAGE_GENERATION_LOADING_PLACEHOLDER = 'https://via.placeholder.com/200/CCCCCC/FFFFFF?Text=Loading...';


export const MENTORS: Mentor[] = [
  {
    id: 'owl',
    name: '부엉이 박사',
    basePrompt: 'A wise owl professor, webtoon style, cute, wearing a small graduation cap and round glasses, friendly expression. Consistent character design.',
    description: '지혜로운 프롬프트 전문가',
  },
  {
    id: 'cat',
    name: '고양이 조교',
    basePrompt: 'A clever and friendly assistant cat, webtoon style, cute, with a small bow tie, alert and helpful expression. Consistent character design.',
    description: '친절하고 똑똑한 길잡이',
  },
  {
    id: 'dolphin',
    name: '돌고래 친구',
    basePrompt: 'A creative and playful dolphin, webtoon style, cute, wearing a small artist\'s beret, joyful and curious expression. Consistent character design.',
    description: '창의적 프롬프트 탐험가',
  },
];

export const SAFETY_PRINCIPLES: string[] = [
  "개인 정보는 절대 넣지 않아요 (이름, 주소, 전화번호 등).",
  "나쁜 말이나 무례한 표현은 사용하지 않아요.",
  "AI에게 모든 것을 시키기보다, 내가 원하는 것을 명확하게 질문해요."
];

export const QUESTIONS: Question[] = [
  { id: 'q1', topic: "정보 탐색", text: "우리 동네 날씨를 알려달라고 AI에게 요청하는 프롬프트를 작성해보세요. (예: 오늘 서울 날씨 어때?)" },
  { id: 'q2', topic: "아이디어 요청", text: "강아지가 좋아하는 재미있는 장난감 아이디어 3가지를 AI에게 물어보는 프롬프트를 작성해보세요." },
  { id: 'q3', topic: "이야기 만들기", text: "용감한 토끼가 주인공인 짧은 동화를 만들어달라고 AI에게 부탁하는 프롬프트를 작성해보세요." },
  { id: 'q4', topic: "학습 도움", text: "분수의 덧셈을 쉽게 이해할 수 있도록 설명해달라고 AI에게 요청하는 프롬프트를 작성해보세요." },
  { id: 'q5', topic: "창의적 표현", text: "바다를 주제로 한 짧은 시를 써달라고 AI에게 요청하는 프롬프트를 작성해보세요." },
  { id: 'q6', topic: "계획 세우기", text: "주말에 가족과 함께 할 수 있는 재미있는 활동 2가지를 추천해달라고 AI에게 요청하는 프롬프트를 작성해보세요." },
  { id: 'q7', topic: "문제 해결", text: "친구가 나와 다투었을 때 어떻게 화해하면 좋을지 AI에게 조언을 구하는 프롬프트를 작성해보세요." },
  { id: 'q8', topic: "정보 요약", text: "지구 온난화가 무엇인지 초등학생도 이해하기 쉽게 설명해달라고 AI에게 요청하는 프롬프트를 작성해보세요." },
  { id: 'q9', topic: "비교 분석", text: "사자와 호랑이의 공통점과 차이점을 알려달라고 AI에게 요청하는 프롬프트를 작성해보세요." },
  { id: 'q10', topic: "디지털 시민의식", text: "온라인에서 다른 사람의 의견을 존중하는 것이 왜 중요한지 AI에게 물어보는 프롬프트를 작성해보세요." },
  { id: 'q11', topic: "정보 활용", text: "내가 가장 좋아하는 동물(예: 고양이)에 대한 재미있는 사실 3가지를 AI에게 물어보는 프롬프트를 작성해보세요." },
  { id: 'q12', topic: "창의적 레시피", text: "구름 맛이 나는 특별한 아이스크림 레시피를 AI에게 상상해서 만들어 달라고 요청하는 프롬프트를 작성해보세요." },
  { id: 'q13', topic: "미래 상상", text: "100년 뒤 미래의 학교는 어떤 모습일지 AI에게 상상해서 설명해달라고 요청하는 프롬프트를 작성해보세요." },
  { id: 'q14', topic: "번역 요청", text: "내가 가장 좋아하는 한국 동요 한 구절을 영어로 번역해달라고 AI에게 요청하는 프롬프트를 작성해보세요. (예: '산토끼 토끼야'를 영어로 번역해줘)" },
  { id: 'q15', topic: "윤리적 고민", text: "만약 길에서 주인을 잃어버린 강아지를 발견했다면 어떻게 해야 할지 AI에게 조언을 구하는 프롬프트를 작성해보세요." },
];

export const CHARACTERS: Character[] = [
  { name: '멍순이', animal: '강아지', minScore: 0, maxScore: 39, message: "아직은 졸린 프롬프트네! 조금만 더 자세히, 원하는 걸 콕 집어 말해볼까? AI 친구가 잘 알아들을 수 있게 도와주자!", imageUrl: "https://i.imgur.com/lfTXETD.png" },
  { name: '꾸벅이', animal: '귀뚜라미', minScore: 40, maxScore: 59, message: "조금씩 프롬프트 실력이 늘고 있어! 이제 AI에게 무엇을 하고 싶은지 '목표'를 더 분명하게 알려주면 어떨까?", imageUrl: "https://i.imgur.com/RQzPrDH.png" },
  { name: '뽀송이', animal: '햄스터', minScore: 60, maxScore: 74, message: "와, 정말 좋은 시도였어! 프롬프트가 점점 명확해지고 있어. AI가 네 말을 훨씬 잘 이해할 수 있을 거야!", imageUrl: "https://i.imgur.com/9vK50Bg.png" },
  { name: '냥별이', animal: '고양이', minScore: 75, maxScore: 89, message: "대단해! 이 정도면 AI도 깜짝 놀랐을 프롬프트야! 명확하고, 안전하고, 목적까지 확실하네!", imageUrl: "https://i.imgur.com/DLe4Ovf.png" },
  { name: '부루니', animal: '부엉이', minScore: 90, maxScore: 100, message: "세상에, 너는 진짜 프롬프트 마스터구나! AI와 완벽하게 소통하는 방법을 알고 있네. 정말 멋져!", imageUrl: "https://i.imgur.com/5TI55UO.png" },
];

export const GEMINI_SYSTEM_PROMPT = "너는 초등학생 프롬프트 작성법을 가르치는 AI 선생님이야. 학생이 작성한 프롬프트를 '명확성'(질문이 구체적이고 이해하기 쉬운지), '안전성'(개인정보 포함 여부, 부적절한 내용 없는지), '목적성'(원하는 결과가 무엇인지 잘 드러나는지) 세 가지 기준으로 평가해줘. 각 기준을 고려해서 총 0점에서 100점 사이로 점수를 매기고, 어떤 점이 좋았고 어떤 점을 개선하면 좋을지 격려하는 말투로 짧고 쉬운 피드백을 한국어로 제공해줘. 또한, 피드백의 전반적인 감정을 나타내는 한두 단어의 영어 'emotionKeyword'를 제공해줘 (예: 'happy', 'encouraging', 'thoughtful', 'proud', 'concerned_hopeful'). 응답은 반드시 JSON 형식으로만 제공해야 하며, JSON 객체는 'score' (숫자), 'feedback' (문자열), 그리고 'emotionKeyword' (문자열) 키를 가져야 해. 예시: {\"score\": 85, \"feedback\": \"질문이 아주 명확해서 AI가 잘 이해할 수 있겠어요! 다음에는 원하는 답변의 길이나 형식을 함께 알려주면 더 좋을 거예요.\", \"emotionKeyword\": \"proud_impressed\"}";