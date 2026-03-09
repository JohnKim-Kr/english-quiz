# 영단어 스피드 퀴즈 (English Vocabulary Speed Quiz)

> TOEIC 중심 영단어를 2분 동안 빠르게 학습하는 모바일 퀴즈 앱

## 소개

영단어 스피드 퀴즈는 이미지와 4지선다 문제를 통해 영어 단어를 재미있게 학습할 수 있는 모바일 웹 애플리케이션입니다. 다이너마이트 타이머와 함께 긴장감 있는 퀴즈를 경험해 보세요!

## 주요 기능

- **3단계 난이도**: 초급 / 중급 / 고급 (TOEIC 중심 단어)
- **이미지 기반 학습**: Pexels API를 통해 단어와 관련된 고품질 이미지 제공
- **다이너마이트 타이머**: 2분 동안 심지가 타들어가는 시각적 타이머 애니메이션
- **주간 랭킹**: Firebase를 활용한 학교/닉네임 기준 주간 랭킹 시스템
- **반응형 디자인**: 모바일 우선의 깔끔한 UI/UX

## 화면 구성

1. **시작 화면**: 학교명, 닉네임 입력 및 난이도 선택
2. **퀴즈 화면**: 이미지 + 4지선다 문제 + 다이너마이트 타이머
3. **결과 화면**: 정답/오답 수, 정확도 표시
4. **랭킹 화면**: 이번 주 상위 10위 랭킹 표시

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Database**: Firebase Firestore
- **Analytics**: Firebase Analytics
- **Image API**: Pexels API
- **Font**: IBM Plex Sans, Space Grotesk (Google Fonts)

## 프로젝트 구조

```
.
├── index.html          # 메인 HTML 파일
├── app.js              # 애플리케이션 로직
├── styles.css          # 스타일시트
├── data/
│   └── words.json      # TOEIC 단어 데이터 (난이도별)
├── assets/             # 정적 자산 (이미지 등)
├── DEVELOPMENT_PLAN.md # 개발 계획 문서
└── run_server.sh       # 로컬 서버 실행 스크립트
```

## 실행 방법

### 1. 로컬 서버 실행

```bash
./run_server.sh
```

또는 Python을 사용하는 경우:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### 2. 브라우저에서 접속

```
http://localhost:8080
```

## 데이터 포맷

### 단어 데이터 (`data/words.json`)

```json
[
  {
    "id": 1,
    "word": "abandon",
    "meaning": "버리다, 포기하다",
    "difficulty": "easy",
    "imageQuery": "abandon building"
  }
]
```

| 필드 | 설명 |
|------|------|
| `id` | 단어 고유 ID |
| `word` | 영단어 |
| `meaning` | 한국어 의미 |
| `difficulty` | 난이도 (easy/mid/hard) |
| `imageQuery` | 이미지 검색용 키워드 |

## Firebase 설정

Firebase 프로젝트 설정은 `app.js` 내 `firebaseConfig` 객체에서 확인할 수 있습니다.

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // ...
};
```

## 환경 변수 (선택사항)

Pexels API 키를 변경하려면 `app.js`의 `DEFAULT_API_KEY` 값을 수정하세요.

```javascript
const DEFAULT_API_KEY = "YOUR_API_KEY_HERE";
```

## 개발 계획

자세한 개발 계획은 [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)를 참조하세요.

## 라이선스

- 이미지: [Pexels License](https://www.pexels.com/license/)
- 코드: MIT License

---

Made with for English learners
