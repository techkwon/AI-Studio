import { BoardSquare, SquareType } from './types';

export const PLAYER_AVATARS = [
  { icon: 'CAT', color: 'bg-red-400', textColor: 'text-red-600', border: 'border-red-600' },
  { icon: 'DOG', color: 'bg-blue-400', textColor: 'text-blue-600', border: 'border-blue-600' },
  { icon: 'BEAR', color: 'bg-yellow-400', textColor: 'text-yellow-600', border: 'border-yellow-600' },
  { icon: 'RABBIT', color: 'bg-green-400', textColor: 'text-green-600', border: 'border-green-600' },
  { icon: 'PANDA', color: 'bg-gray-400', textColor: 'text-gray-600', border: 'border-gray-600' },
  { icon: 'FOX', color: 'bg-orange-400', textColor: 'text-orange-600', border: 'border-orange-600' },
];

export const MISSIONS = [
  "지금 내 기분은 어떤가요? 그 이유는 무엇일까요?",
  "내가 가장 잘하는 것은 무엇이라고 생각하나요?",
  "나의 어떤 점이 가장 자랑스러운가요?",
  "화가 날 때, 기분을 가라앉히기 위해 나는 어떻게 하나요?",
  "스트레스를 받았을 때, 건강하게 해소하는 나만의 방법은 무엇인가요?",
  "실수했을 때, 나는 보통 어떻게 반응하나요?",
  "친구가 슬퍼 보일 때, 어떻게 위로해줄 수 있을까요?",
  "나와 다른 의견을 가진 사람의 말을 끝까지 들어준 경험이 있나요?",
  "다른 사람의 입장에서 생각해본 최근 경험에 대해 이야기해주세요.",
  "친구와 다퉜을 때, 어떻게 화해하는 편인가요?",
  "다른 사람에게 도움을 요청하는 것이 어려운가요, 쉬운가요? 그 이유는?",
  "고맙다는 말을 가장 최근에 했던 때는 언제인가요? 누구에게, 어떤 일로 했나요?",
  "좋은 친구가 되기 위해 가장 중요하다고 생각하는 것은 무엇인가요?",
  "최근에 했던 선택 중 가장 잘했다고 생각하는 것은 무엇인가요?",
  "어떤 결정을 내리기 전에 무엇을 가장 먼저 고려하나요?",
  "내가 한 행동이 다른 사람에게 어떤 영향을 미칠지 생각해본 적 있나요?",
  "요즘 나를 가장 힘들게 하는 감정은 무엇인가요?",
  "최근에 세운 목표를 이루기 위해 어떤 노력을 했나요?",
  "여기 있는 다른 사람의 기분은 어떨 것 같나요? 왜 그렇게 생각하나요?",
  "팀 활동에서 나의 역할은 무엇이라고 생각하나요?"
];

export const LADDERS: { start: number; end: number }[] = [
    { start: 1, end: 38 }, { start: 4, end: 14 }, { start: 9, end: 31 },
    { start: 21, end: 42 }, { start: 28, end: 84 }, { start: 51, end: 67 },
    { start: 72, end: 91 }, { start: 80, end: 99 },
];

export const CHUTES: { start: number; end: number }[] = [
    { start: 17, end: 7 }, { start: 54, end: 34 }, { start: 62, end: 19 },
    { start: 64, end: 60 }, { start: 87, end: 36 }, { start: 93, end: 73 },
    { start: 95, end: 75 }, { start: 98, end: 79 },
];

const path: { row: number; col: number }[] = [];
for (let row = 9; row >= 0; row--) {
  if (row % 2 !== 0) { // Odd rows (from bottom, 9, 7, ..) move left-to-right
    for (let col = 0; col < 10; col++) {
      path.push({ row, col });
    }
  } else { // Even rows (8, 6, ..) move right-to-left
    for (let col = 9; col >= 0; col--) {
      path.push({ row, col });
    }
  }
}

export const BOARD_LAYOUT: BoardSquare[] = path.map((pos, index) => {
  const ladder = LADDERS.find(l => l.start === index + 1);
  if (ladder) {
    return { type: SquareType.LADDER, mission: '사다리!', position: pos, targetPosition: ladder.end - 1 };
  }

  const chute = CHUTES.find(c => c.start === index + 1);
  if (chute) {
    return { type: SquareType.CHUTE, mission: '미끄럼틀!', position: pos, targetPosition: chute.end - 1 };
  }

  if (index === 0) {
    return { type: SquareType.START, mission: '시작', position: pos };
  }

  if (index === path.length - 1) {
    return { type: SquareType.END, mission: '도착!', position: pos };
  }

  return {
    type: SquareType.MISSION,
    mission: MISSIONS[index % MISSIONS.length],
    position: pos,
  };
});