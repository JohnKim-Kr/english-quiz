const TOTAL_TIME = 120;
const API_ENDPOINT = "https://api.pexels.com/v1/search";
const DEFAULT_API_KEY = "4ObLFYLfgCcxIiOHoMOtmeKHgl2qsWcIC7sez6OKSCLFGdfUkzPpoN2v";

const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const nicknameInput = document.getElementById("nickname");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const timeText = document.getElementById("timeText");
const scoreText = document.getElementById("scoreText");
const fuseEl = document.getElementById("fuse");
const optionsEl = document.getElementById("options");
const quizImage = document.getElementById("quizImage");
const imageCredit = document.getElementById("imageCredit");
const judgeMark = document.getElementById("judgeMark");
const answerReveal = document.getElementById("answerReveal");
const playerName = document.getElementById("playerName");
const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const accuracyEl = document.getElementById("accuracy");
const resultTitle = document.getElementById("resultTitle");

const difficultyButtons = Array.from(document.querySelectorAll(".seg-btn"));

let words = [];
let currentDifficulty = "easy";
let currentQuestion = null;
let timerId = null;
let remaining = TOTAL_TIME;
let correct = 0;
let wrong = 0;
let usedIndexes = [];
let apiKey = DEFAULT_API_KEY;
let wordsReady = false;

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function setScreen(name) {
  Object.keys(screens).forEach((key) => {
    screens[key].classList.toggle("hidden", key !== name);
  });
}

function selectDifficulty(nextDifficulty) {
  currentDifficulty = nextDifficulty;
  difficultyButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.difficulty === nextDifficulty);
  });
}

difficultyButtons.forEach((btn) => {
  btn.addEventListener("click", () => selectDifficulty(btn.dataset.difficulty));
});

function updateFuse() {
  const progress = Math.max(remaining / TOTAL_TIME, 0);
  const fuseWidth = fuseEl.getBoundingClientRect().width;
  document.documentElement.style.setProperty("--fuse-progress", progress.toString());
  document.documentElement.style.setProperty("--fuse-max", `${fuseWidth}px`);
  timeText.textContent = formatTime(remaining);
}

function resetState() {
  remaining = TOTAL_TIME;
  correct = 0;
  wrong = 0;
  usedIndexes = [];
  scoreText.textContent = "정답 0";
  updateFuse();
}

function getPool() {
  return words.filter((item) => item.difficulty === currentDifficulty);
}

function pickQuestion() {
  const pool = getPool();
  if (pool.length === 0) return null;

  if (usedIndexes.length >= pool.length) {
    usedIndexes = [];
  }

  let index;
  do {
    index = Math.floor(Math.random() * pool.length);
  } while (usedIndexes.includes(index));

  usedIndexes.push(index);
  return pool[index];
}

function pickOptions(answerWord) {
  const pool = getPool().filter((item) => item.word !== answerWord.word);
  const distractors = shuffle(pool).slice(0, 3).map((item) => item.word);
  return shuffle([answerWord.word, ...distractors]);
}

function setOptions(options, answer) {
  optionsEl.innerHTML = "";
  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.addEventListener("click", () => handleAnswer(btn, option === answer));
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(button, isCorrect) {
  Array.from(optionsEl.children).forEach((btn) => (btn.disabled = true));
  if (isCorrect) {
    button.classList.add("correct");
  } else {
    const correctBtn = Array.from(optionsEl.children).find(
      (btn) => btn.textContent === currentQuestion.word,
    );
    if (correctBtn) correctBtn.classList.add("correct");
  }
  judgeMark.className = `judge-mark ${isCorrect ? "correct" : "wrong"}`;

  if (isCorrect) {
    correct += 1;
    scoreText.textContent = `정답 ${correct}`;
    answerReveal.style.display = "none";
  } else {
    wrong += 1;
    answerReveal.textContent = `정답: ${currentQuestion.word}`;
    answerReveal.style.display = "block";
  }

  setTimeout(() => {
    judgeMark.className = "judge-mark";
    if (remaining <= 0) {
      finishQuiz();
    } else {
      nextQuestion();
    }
  }, 450);
}

async function fetchImage(query) {
  if (!apiKey) {
    return {
      url: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
      credit: "Pexels",
    };
  }

  try {
    const response = await fetch(`${API_ENDPOINT}?query=${encodeURIComponent(query)}&per_page=10`, {
      headers: { Authorization: apiKey },
    });

    if (!response.ok) {
      throw new Error("Image fetch failed");
    }

    const data = await response.json();
    const photo = data.photos?.[Math.floor(Math.random() * data.photos.length)];

    if (!photo) {
      throw new Error("No image found");
    }

    return {
      url: photo.src.landscape || photo.src.medium,
      credit: `${photo.photographer} / Pexels`,
    };
  } catch (error) {
    return {
      url: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
      credit: "Pexels (fallback)",
    };
  }
}

async function nextQuestion() {
  currentQuestion = pickQuestion();
  if (!currentQuestion) return;

  answerReveal.style.display = "none";
  const { url, credit } = await fetchImage(currentQuestion.imageQuery || currentQuestion.word);
  quizImage.src = url;
  imageCredit.textContent = `Image: ${credit}`;

  const options = pickOptions(currentQuestion);
  setOptions(options, currentQuestion.word);
}

function startTimer() {
  updateFuse();
  clearInterval(timerId);
  timerId = setInterval(() => {
    remaining -= 1;
    updateFuse();
    if (remaining <= 0) {
      clearInterval(timerId);
      finishQuiz();
    }
  }, 1000);
}

function finishQuiz() {
  clearInterval(timerId);
  const total = correct + wrong;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  correctCountEl.textContent = correct;
  wrongCountEl.textContent = wrong;
  accuracyEl.textContent = `${accuracy}%`;
  resultTitle.textContent = `${playerName.textContent}님의 결과`;
  setScreen("result");
}

function startQuiz() {
  if (!wordsReady || words.length === 0) {
    alert("단어를 불러오지 못했어요. 로컬 서버로 열어주세요.");
    return;
  }
  const nickname = nicknameInput.value.trim() || "Player";
  playerName.textContent = nickname;

  resetState();
  setScreen("quiz");
  nextQuestion();
  startTimer();
}

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", () => {
  setScreen("start");
});

async function loadWords() {
  try {
    const response = await fetch("data/words.json");
    words = await response.json();
    wordsReady = true;
  } catch (error) {
    wordsReady = false;
  }
}

window.addEventListener("resize", updateFuse);

loadWords();
updateFuse();
