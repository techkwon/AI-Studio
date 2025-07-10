
import { Question, AnimalPersona, AnimalTypeKey } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "학생들에게 유용해 보이는 새로운 교육용 앱이 있다면, 개인정보처리방침을 확인하기보다 일단 설치해서 써보는 편이다.",
    options: [
      { text: "매우 그렇다", value: 2 },
      { text: "가끔 그렇다", value: 1 },
      { text: "전혀 아니다", value: 0 },
    ],
    imageUrl: "https://imgur.com/yi8u9rA.png" // Added image URL (appended .png for direct image link if necessary)
  },
  {
    id: 2,
    text: "학생들의 활동 결과물을 칭찬해주고 싶어, 개인 식별 정보(이름 등)를 가리지 않고 학급 SNS에 올린 적이 있다.",
    options: [
      { text: "자주 그런다", value: 2 },
      { text: "한두 번 있다", value: 1 },
      { text: "절대 안 그런다", value: 0 },
    ],
    imageUrl: "https://imgur.com/saHqtg3.png"
  },
  {
    id: 3,
    text: "수업에 사용했던 웹사이트의 학급 계정 비밀번호를 졸업 후에도 바꾸지 않고 그대로 둔다.",
    options: [
      { text: "대부분 그렇다", value: 2 },
      { text: "가끔 잊는다", value: 1 },
      { text: "항상 바꾼다", value: 0 },
    ],
    imageUrl: "https://imgur.com/MOIOtMV.png"
  },
  {
    id: 4,
    text: "'전체 동의'가 편해서, 서비스의 선택적 정보 제공 동의 항목을 잘 읽지 않는다.",
    options: [
      { text: "항상 그렇다", value: 2 },
      { text: "바쁠 때만 그렇다", value: 1 },
      { text: "꼼꼼히 읽는다", value: 0 },
    ],
    imageUrl: "https://imgur.com/IKeewC3.png"
  },
  {
    id: 5,
    text: "학생 데이터가 담긴 USB나 파일을 동료 교사에게 별다른 보안 조치 없이 전달한 경험이 있다.",
    options: [
      { text: "여러 번 있다", value: 2 },
      { text: "급할 때 한 적 있다", value: 1 },
      { text: "암호화하거나 안전하게 전달한다", value: 0 },
    ],
    imageUrl: "https://imgur.com/08J6OGw.png"
  },
  {
    id: 6,
    text: "학교나 교육청에서 제공하는 보안 교육 자료나 가이드라인을 얼마나 자주 찾아보고 실천하는 편인가요?",
    options: [
      { text: "매우 자주 찾아보고 실천한다", value: 0 },
      { text: "가끔 생각날 때 찾아본다", value: 1 },
      { text: "거의 찾아보지 않는다", value: 2 },
    ],
    imageUrl: "https://imgur.com/M5ysM0o.png"
  },
  {
    id: 7,
    text: "새로운 교육용 앱이나 웹사이트를 동료 교사에게 추천할 때, 보안적인 측면도 함께 고려하여 전달하나요?",
    options: [
      { text: "항상 보안 측면을 우선적으로 고려한다", value: 0 },
      { text: "가끔 고려하지만, 기능이 더 중요하다", value: 1 },
      { text: "주로 기능 위주로 추천하며 보안은 크게 신경쓰지 않는다", value: 2 },
    ],
    imageUrl: "https://imgur.com/lM3YCtY.png"
  },
  {
    id: 8,
    text: "급하게 업무를 처리해야 할 때, 보안 절차(예: VPN 사용, 파일 암호화)를 생략하고 진행한 적이 있나요?",
    options: [
      { text: "자주 있다", value: 2 },
      { text: "가끔 있지만 최소한의 조치는 하려고 한다", value: 1 },
      { text: "거의 없다, 항상 절차를 따른다", value: 0 },
    ],
    imageUrl: "https://imgur.com/1xSlIQp.png"
  },
  {
    id: 9,
    text: "개인 기기(스마트폰, 개인 노트북)를 사용하여 학교 업무를 처리할 때, 기기 자체의 보안 설정(화면 잠금, 백신 등)에 얼마나 신경 쓰나요?",
    options: [
      { text: "매우 꼼꼼하게 관리하고 업데이트한다", value: 0 },
      { text: "기본적인 설정은 해두지만, 자주 확인하지는 않는다", value: 1 },
      { text: "별로 신경 쓰지 않거나 잘 모른다", value: 2 },
    ],
    imageUrl: "https://imgur.com/f6lr6hN.png"
  },
  {
    id: 10,
    text: "학교에서 공식적으로 도입하지 않은 개인적인 클라우드 저장소나 협업 도구를 업무에 얼마나 자주 사용하나요?",
    options: [
      { text: "매우 자주 사용한다, 편리하기 때문이다", value: 2 },
      { text: "필요할 때 가끔 사용하지만, 민감 정보는 피한다", value: 1 },
      { text: "거의 사용하지 않거나, 공식 도구만 사용한다", value: 0 },
    ],
    imageUrl: "https://imgur.com/sAbAq4b.png"
  },
  {
    id: 11,
    text: "학생 계정이나 학급 전체 계정의 비밀번호를 설정할 때, 여러 서비스에서 동일하거나 유사한 비밀번호를 사용하는 편인가요?",
    options: [
      { text: "자주 그렇다, 기억하기 편해서", value: 2 },
      { text: "몇몇 중요한 계정 외에는 가끔 그렇다", value: 1 },
      { text: "항상 서비스마다 다르고 복잡한 비밀번호를 사용한다", value: 0 },
    ],
    imageUrl: "https://imgur.com/7H9FvMP.png"
  },
  {
    id: 12,
    text: "데이터 유출 사고나 보안 위협에 대한 뉴스를 접했을 때, 나의 교육 환경에도 적용될 수 있는지 점검하는 편인가요?",
    options: [
      { text: "항상 나의 상황에 대입해보고 필요한 조치를 취한다", value: 0 },
      { text: "가끔 생각은 해보지만, 실제 조치로 이어지진 않는다", value: 1 },
      { text: "나와는 직접적인 관련이 없다고 생각하거나 무관심하다", value: 2 },
    ],
    imageUrl: "https://imgur.com/iwq8uDY.png"
  },
];

export const ANIMAL_PERSONAS: Record<AnimalTypeKey, AnimalPersona> = {
  desertFox: {
    key: 'desertFox',
    name: "신중한 사막여우",
    oneLiner: "돌다리도 두들겨보는 데이터 보안의 모범생",
    description: "당신은 데이터 보안에 있어 매우 신중하고 꼼꼼한 성향을 가지고 있습니다. 새로운 도구를 사용하기 전에는 반드시 개인정보처리방침을 확인하고, 정보의 안전성을 최우선으로 생각합니다. 마치 사막의 위험을 감지하는 여우처럼, 잠재적인 위험을 미리 파악하고 대비하는 능력이 뛰어납니다.",
    strengths: [
      "개인정보 보호에 대한 인식이 매우 높습니다.",
      "새로운 디지털 도구나 서비스 도입에 신중하여 위험을 최소화합니다.",
      "데이터 처리와 관련된 규정 및 정책을 준수하려는 의지가 강합니다."
    ],
    weaknesses: [
      "지나친 신중함으로 인해 좋은 교육적 기회를 놓칠 수 있습니다. 때로는 안전성이 검증된 도구를 과감히 활용하는 유연성이 필요합니다.",
      "변화에 대한 적응이 다소 느릴 수 있습니다. 새로운 기술의 이점을 충분히 활용하지 못할 가능성이 있습니다.",
      "협업 시 너무 많은 안전 절차를 요구하여 동료들이 불편함을 느낄 수 있습니다. 효율성과 안전성 사이의 균형을 찾는 것이 중요합니다."
    ],
    imageUrl: "https://i.imgur.com/LYhX6Fx.png",
    fantasticDuo: { key: 'meerkat', reason: "행동대장 미어캣의 추진력이 새로운 영감을 주고, 신기술 도입의 균형을 잡아줄 수 있습니다." },
    nightmarePartner: { key: 'busyBeaver', reason: "효율을 중시하는 바쁜 비버와 함께라면, 사막여우의 신중함이 답답하게 느껴질 수 있습니다." }
  },
  meerkat: {
    key: 'meerkat',
    name: "행동대장 미어캣",
    oneLiner: "일단 쓰고 본다! 새로운 기술을 사랑하는 얼리어답터",
    description: "당신은 새로운 기술과 교육용 도구에 대한 호기심이 왕성한 얼리어답터입니다. 학생들에게 다양하고 흥미로운 경험을 제공하려는 열정이 넘치며, 일단 시도해보고 판단하는 것을 선호합니다. 미어캣처럼 주변을 살피며 새로운 것을 빠르게 발견하고 적용하는 능력이 뛰어납니다.",
    strengths: [
      "새로운 기술과 트렌드에 매우 민감하고 빠르게 적응합니다.",
      "학생들에게 혁신적이고 다양한 교육 경험을 제공하려는 열정이 높습니다.",
      "문제 해결을 위해 창의적이고 새로운 방법을 시도하는 것을 두려워하지 않습니다."
    ],
    weaknesses: [
      "속도와 편리성을 우선시하다 중요한 보안 절차나 개인정보보호 규정을 간과할 수 있습니다. '일단 사용'하기 전에 최소한의 안전 점검은 필수입니다.",
      "새로운 서비스의 개인정보 동의 절차나 데이터 활용 범위를 꼼꼼히 확인하지 않을 가능성이 높습니다. 학생들의 정보가 어떻게 사용되는지 주의해야 합니다.",
      "자주 사용하지 않는 앱이나 계정이 방치되어 보안 위협으로 이어질 수 있습니다. 주기적인 디지털 정리가 필요합니다."
    ],
    imageUrl: "https://i.imgur.com/jR7qQOM.png",
    fantasticDuo: { key: 'wiseOwl', reason: "현명한 올빼미의 깊이 있는 지식과 신중함이 미어캣의 빠른 실행력에 안정성을 더해줄 것입니다." },
    nightmarePartner: { key: 'hamster', reason: "변화를 꺼리는 햄스터와 함께라면, 미어캣의 혁신적인 시도가 좌절될 수 있습니다." }
  },
  polarBear: {
    key: 'polarBear',
    name: "다정한 북극곰",
    oneLiner: "좋은 건 함께! 공유와 협업을 즐기는 커뮤니티 리더",
    description: "당신은 따뜻한 마음으로 동료 교사 및 학생들과 정보를 공유하고 협업하는 것을 즐깁니다. 학생들의 성과를 널리 알리고, 유용한 교육 자료를 나누는 데 적극적입니다. 북극곰처럼 넉넉한 마음으로 커뮤니티를 이끌지만, 때로는 그 다정함이 보안에는 소홀함으로 이어질 수 있습니다.",
    strengths: [
      "학생들의 성과를 적극적으로 공유하고 칭찬하여 동기를 부여합니다.",
      "동료 교사들과 교육 자료 및 정보를 활발히 공유하며 협력적인 분위기를 조성합니다.",
      "커뮤니티 활동에 적극적이며, 긍정적인 관계 형성에 능숙합니다."
    ],
    weaknesses: [
      "정보 공유 시 개인정보(이름, 얼굴 사진 등) 노출에 대한 민감도가 낮을 수 있습니다. 공유 전 반드시 비식별화 조치를 취해야 합니다.",
      "자료 공유의 편리성을 위해 보안이 취약한 방법을 사용할 수 있습니다. (예: 공개 링크, 공용 계정 비밀번호 공유)",
      "저작권 및 라이선스 문제를 간과하고 자료를 공유할 가능성이 있습니다. 공유하는 자료의 출처와 사용 범위를 확인해야 합니다."
    ],
    imageUrl: "https://i.imgur.com/UDBrUfW.png",
    fantasticDuo: { key: 'loyalDog', reason: "충직한 강아지의 규칙 준수 성향이 북극곰의 공유 활동에 필요한 안전장치를 마련해 줄 수 있습니다." },
    nightmarePartner: { key: 'loneWolf', reason: "독립적인 고독한 늑대와는 협업 스타일이 달라, 북극곰의 공유 문화가 겉돌 수 있습니다." }
  },
  hamster: {
    key: 'hamster',
    name: "둥지 속의 햄스터",
    oneLiner: "내 컴퓨터가 가장 안전해! 검증된 것만 고집하는 안정지향형",
    description: "당신은 익숙하고 검증된 방법을 선호하며, 데이터를 주로 자신의 컴퓨터나 오프라인 저장 장치에 보관하려는 경향이 있습니다. 외부 서비스의 위험을 최소화하고 안정적으로 데이터를 관리하는 것을 중요하게 생각합니다. 마치 둥지 안에서 안전하게 먹이를 보관하는 햄스터와 같습니다.",
    strengths: [
      "클라우드 서비스나 외부 플랫폼의 보안 위험에 대해 인지하고 있으며, 이를 피하려 합니다.",
      "중요 데이터를 개인 장치에 오프라인으로 보관하여 외부 해킹 위협으로부터 상대적으로 안전하다고 느낍니다.",
      "익숙한 도구와 방식을 사용하여 작업 효율성을 유지합니다."
    ],
    weaknesses: [
      "USB 분실, 하드 드라이브 고장 등 오프라인 데이터 관리의 물리적 위험에 취약할 수 있습니다. 백업 전략이 중요합니다.",
      "보안 업데이트가 적용된 최신 클라우드 서비스의 이점(협업, 자동 백업 등)을 활용하지 못할 수 있습니다.",
      "파일 공유 시 안전하지 않은 방법(예: 암호화되지 않은 USB 전달)을 사용할 수 있어, 오프라인임에도 불구하고 데이터 유출 위험이 존재합니다."
    ],
    imageUrl: "https://i.imgur.com/urKBPeV.png",
    fantasticDuo: { key: 'slyChameleon', reason: "능숙한 카멜레온이 햄스터에게 안전한 최신 기술을 점진적으로 도입하도록 도울 수 있습니다." },
    nightmarePartner: { key: 'socialParrot', reason: "사교적인 앵무새가 가져오는 수많은 새로운 정보들이 햄스터를 혼란스럽게 만들 수 있습니다." }
  },
  wiseOwl: {
    key: 'wiseOwl',
    name: "현명한 올빼미",
    oneLiner: "지식은 힘! 보안 정책과 교육의 파수꾼",
    description: "당신은 데이터 보안에 대한 깊은 이해를 바탕으로 정책과 규정을 중시하며, 주변에도 보안 의식을 전파하는 현명한 교육자입니다. 올빼미처럼 넓은 시야로 잠재적 위험을 파악하고, 체계적인 지식을 통해 안전한 교육 환경을 구축하려 합니다.",
    strengths: ["보안 정책 및 규정 준수율 높음", "데이터 보호 교육 및 인식 개선에 기여", "신중한 의사결정으로 위험 최소화", "최신 보안 위협 동향에 대한 관심 높음"],
    weaknesses: ["새로운 기술 도입에 지나치게 보수적일 수 있음", "과도한 절차 강조로 효율성 저하 우려", "이론에 치우쳐 실제적인 유연성 부족 가능성", "동료들에게 '깐깐하다'는 인상을 줄 수 있음"],
    imageUrl: "https://i.imgur.com/JYDWklL.png",
    fantasticDuo: { key: 'meerkat', reason: "미어캣의 빠른 실행력이 올빼미의 신중함에 활력을 더해, 균형 잡힌 혁신을 이끌 수 있습니다." },
    nightmarePartner: { key: 'busyBeaver', reason: "바쁜 비버의 효율성 우선주의는 올빼미가 중시하는 보안 절차를 무시하게 만들 수 있습니다." }
  },
  busyBeaver: {
    key: 'busyBeaver',
    name: "바쁜 비버",
    oneLiner: "시간은 금! 효율적인 일처리가 최우선",
    description: "당신은 수많은 업무를 효율적으로 처리하기 위해 다양한 도구를 활용하고 빠른 속도를 중시합니다. 비버처럼 부지런히 일하지만, 때로는 속도 때문에 보안 절차를 간소화하거나 생략하려는 경향이 있습니다.",
    strengths: ["높은 업무 생산성과 효율성", "다양한 디지털 도구 활용 능력 뛰어남", "빠른 문제 해결 및 적응력"],
    weaknesses: ["보안 절차 간소화 또는 생략 경향", "여러 계정에 동일/유사 비밀번호 사용 가능성", "'나중에 해야지' 하며 보안 업데이트 소홀", "피싱 메일이나 스미싱에 취약할 수 있음 (빠른 클릭)"],
    imageUrl: "https://i.imgur.com/uDz51PJ.png",
    fantasticDuo: { key: 'desertFox', reason: "사막여우의 신중함이 비버의 빠른 업무 처리에 필요한 보안 점검을 보완해줄 수 있습니다." },
    nightmarePartner: { key: 'wiseOwl', reason: "현명한 올빼미의 꼼꼼함과 절차 중시는 비버의 속도 지향과 충돌할 수 있습니다." }
  },
  slyChameleon: {
    key: 'slyChameleon',
    name: "능숙한 카멜레온",
    oneLiner: "상황에 맞춰 변신! 보안도 유연하게 대처",
    description: "당신은 주변 환경과 요구사항에 맞춰 보안 수칙을 능숙하게 따르는 것처럼 보입니다. 카멜레온처럼 상황에 따라 필요한 모습을 보여주지만, 보안의 근본적인 중요성보다는 규정 준수 자체에 초점을 맞출 수 있습니다.",
    strengths: ["규정 및 지침에 대한 높은 순응도", "겉으로 보기에 보안 문제 없어 보임", "변화하는 환경에 대한 빠른 적응력"],
    weaknesses: ["보안의 본질적 이해보다 형식적 준수에 치중", "새로운 위협에 대한 주도적인 대응 부족", "실질적인 보안 의식 내재화 미흡 가능성", "감독이 소홀해지면 보안 수칙을 어길 수 있음"],
    imageUrl: "https://i.imgur.com/C18LUE6.png",
    fantasticDuo: { key: 'wiseOwl', reason: "현명한 올빼미의 깊이 있는 지도가 카멜레온의 형식적인 보안 인식을 실질적으로 바꿔줄 수 있습니다." },
    nightmarePartner: { key: 'loneWolf', reason: "고독한 늑대의 독자적인 방식은 카멜레온의 '규정 준수'마저 어렵게 만들 수 있습니다." }
  },
  loyalDog: {
    key: 'loyalDog',
    name: "충직한 강아지",
    oneLiner: "규칙을 잘 지켜요! 안내만 있다면 OK",
    description: "당신은 학교나 교육청에서 제공하는 지침과 가이드라인을 충실히 따르려는 성향이 강합니다. 강아지처럼 주어진 규칙을 잘 따르지만, 때로는 비판적인 사고 없이 지침에만 의존하여 예상치 못한 위험에 직면할 수 있습니다.",
    strengths: ["주어진 보안 지침 및 정책의 성실한 이행", "조직의 보안 표준 준수에 기여", "안정적이고 예측 가능한 행동 패턴"],
    weaknesses: ["보안 지침 부재 시 대처 능력 미흡", "새로운 보안 위협에 대한 능동적 판단 부족", "지침의 맹목적 신뢰로 인한 잠재적 위험 간과", "사회공학적 공격에 취약할 수 있음 (권위에 약함)"],
    imageUrl: "https://i.imgur.com/kRcZXSy.png",
    fantasticDuo: { key: 'polarBear', reason: "다정한 북극곰의 협업 정신과 정보력이 강아지에게 더 넓은 시야를 제공할 수 있습니다." },
    nightmarePartner: { key: 'socialParrot', reason: "사교적인 앵무새가 전하는 확인되지 않은 '지침'에 혼란을 겪을 수 있습니다." }
  },
  loneWolf: {
    key: 'loneWolf',
    name: "고독한 늑대",
    oneLiner: "나만의 방식이 최고! 독립적인 보안 전문가",
    description: "당신은 자신만의 방식과 도구를 선호하며, 때로는 표준화된 보안 절차보다 자신의 판단을 더 신뢰합니다. 늑대처럼 독립적이지만, 이러한 성향이 조직 전체의 보안 정책과 충돌하거나 협업을 어렵게 만들 수 있습니다.",
    strengths: ["특정 분야에 대한 깊이 있는 지식 가능성", "독자적인 문제 해결 능력 보유", "자신만의 시스템에 대한 높은 통제력"],
    weaknesses: ["표준 보안 절차 및 도구 사용 저항", "협업 시 보안 정보 공유 및 통합 어려움", "개인 시스템의 취약점이 조직 전체에 영향 가능성", "새로운 보안 트렌드나 조직의 변화에 뒤쳐질 수 있음"],
    imageUrl: "https://i.imgur.com/ggwr6KH.png",
    fantasticDuo: { key: 'slyChameleon', reason: "능숙한 카멜레온이 늑대의 독자적인 시스템과 조직의 요구 사이에서 유연한 다리 역할을 할 수 있습니다." },
    nightmarePartner: { key: 'loyalDog', reason: "규칙을 중시하는 강아지는 늑대의 독자적인 행동 방식을 이해하기 어려워 갈등이 생길 수 있습니다." }
  },
  socialParrot: {
    key: 'socialParrot',
    name: "사교적인 앵무새",
    oneLiner: "이거 좋던데? 정보 공유의 달인!",
    description: "당신은 새로운 정보나 유용한 도구를 발견하면 주변 사람들과 적극적으로 공유하는 것을 즐깁니다. 앵무새처럼 들은 것을 잘 전파하지만, 때로는 정보의 정확성이나 보안성을 충분히 검토하지 않고 공유하여 의도치 않은 문제를 일으킬 수 있습니다.",
    strengths: ["활발한 정보 공유로 새로운 소식 전파", "동료들과의 네트워킹 및 소통 능력 우수", "새로운 도구나 방법에 대한 빠른 수용"],
    weaknesses: ["검증되지 않은 정보나 도구 공유 위험", "공유 과정에서 민감 정보 노출 가능성", "보안보다 정보의 신속한 전파에 집중", "잘못된 보안 상식을 퍼뜨릴 수 있음"],
    imageUrl: "https://i.imgur.com/syHY9BY.png",
    fantasticDuo: { key: 'desertFox', reason: "사막여우의 신중함이 앵무새가 공유하는 정보의 안전성을 검증하는 데 도움을 줄 수 있습니다." },
    nightmarePartner: { key: 'meerkat', reason: "미어캣과 앵무새가 만나면 확인되지 않은 정보가 걷잡을 수 없이 퍼져나갈 수 있습니다. '일단 쓰고 보자'와 '일단 전파하자'의 조합은 위험합니다." }
  }
};


export const SCORING_MATRIX: Record<number, Record<number, Partial<Record<AnimalTypeKey, number>>>> = {
  // Q1: Install new app without checking policy
  1: {
    2: { meerkat: 2, busyBeaver: 1, socialParrot: 1 }, // Very likely
    1: { meerkat: 1, polarBear: 0.5, socialParrot: 0.5, busyBeaver: 0.5 }, // Sometimes
    0: { desertFox: 2, wiseOwl: 2, loyalDog: 1, hamster: 0.5 }, // Not at all
  },
  // Q2: Share PII on SNS
  2: {
    2: { polarBear: 2, socialParrot: 2, meerkat: 1 }, // Often
    1: { polarBear: 1, socialParrot: 1, busyBeaver: 0.5 }, // Once or twice
    0: { desertFox: 2, wiseOwl: 2, hamster: 1, loyalDog: 0.5 }, // Never
  },
  // Q3: Don't change old passwords
  3: {
    2: { busyBeaver: 2, hamster: 1, meerkat: 1 }, // Mostly
    1: { busyBeaver: 1, hamster: 0.5, meerkat: 0.5, slyChameleon: 0.5 }, // Sometimes forget
    0: { desertFox: 2, wiseOwl: 2, loyalDog: 1 }, // Always change
  },
  // Q4: 'Agree to All' ToS
  4: {
    2: { meerkat: 2, busyBeaver: 2, socialParrot: 1 }, // Always
    1: { meerkat: 1, busyBeaver: 1, polarBear: 0.5, slyChameleon: 0.5 }, // Only when busy
    0: { desertFox: 2, wiseOwl: 2, loyalDog: 1 }, // Read carefully
  },
  // Q5: Unsecured USB/file transfer
  5: {
    2: { hamster: 2, polarBear: 1, busyBeaver: 1 }, // Many times
    1: { hamster: 1, polarBear: 0.5, busyBeaver: 0.5, socialParrot: 0.5 }, // In a hurry
    0: { desertFox: 2, wiseOwl: 1, loyalDog: 1 }, // Encrypt or secure transfer
  },
  // Q6: Check & practice security guidelines
  6: {
    0: { loyalDog: 2, wiseOwl: 2, desertFox: 1, slyChameleon: 1 }, // Very often
    1: { polarBear: 1, hamster: 0.5, slyChameleon: 0.5 }, // Sometimes
    2: { meerkat: 1, busyBeaver: 2, loneWolf: 2, socialParrot: 1 }, // Rarely
  },
  // Q7: Consider security when recommending tools
  7: {
    0: { wiseOwl: 2, desertFox: 2, loyalDog: 1 }, // Always consider security first
    1: { polarBear: 1, slyChameleon: 1, meerkat: 0.5 }, // Sometimes, but features are more important
    2: { socialParrot: 2, meerkat: 2, busyBeaver: 1 }, // Mainly recommend based on features, not security
  },
  // Q8: Skip security procedures when in a hurry
  8: {
    2: { busyBeaver: 2, meerkat: 1, socialParrot: 0.5 }, // Often
    1: { busyBeaver: 1, polarBear: 0.5, slyChameleon: 1 }, // Sometimes, but try minimal measures
    0: { desertFox: 2, wiseOwl: 2, loyalDog: 1, hamster: 0.5 }, // Rarely, always follow procedures
  },
  // Q9: Security of personal devices for work
  9: {
    0: { desertFox: 2, wiseOwl: 1, hamster: 1, loneWolf: 1 }, // Very meticulous
    1: { polarBear: 1, loyalDog: 0.5, slyChameleon: 0.5, meerkat: 0.5 }, // Basic settings, don't check often
    2: { busyBeaver: 2, socialParrot: 1, meerkat: 1 }, // Don't care much or don't know
  },
  // Q10: Use of unofficial cloud/collaboration tools
  10: {
    2: { loneWolf: 2, meerkat: 1, busyBeaver: 1, socialParrot: 0.5 }, // Very often, for convenience
    1: { loneWolf: 1, polarBear: 0.5, slyChameleon: 1 }, // Sometimes, but avoid sensitive info
    0: { desertFox: 2, wiseOwl: 1, loyalDog: 2, hamster: 1 }, // Rarely or only official tools
  },
  // Q11: Password reuse
  11: {
    2: { busyBeaver: 2, meerkat: 1, socialParrot: 1, hamster: 0.5 }, // Often, easy to remember
    1: { polarBear: 1, slyChameleon: 1 }, // Sometimes, except for important accounts
    0: { desertFox: 2, wiseOwl: 2, loyalDog: 1, loneWolf: 0.5 }, // Always different and complex
  },
  // Q12: Reaction to security news
  12: {
    0: { wiseOwl: 2, desertFox: 2, loyalDog: 1, loneWolf: 0.5 }, // Always check and take action
    1: { polarBear: 1, hamster: 1, slyChameleon: 1, meerkat: 0.5 }, // Think about it, but no action
    2: { busyBeaver: 1, socialParrot: 2, meerkat: 1 }, // Unrelated or indifferent
  },
};