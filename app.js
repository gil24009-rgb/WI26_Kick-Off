// app.js
(() => {
  "use strict";

  /*
    Folder and filename assumptions

    assets/images/start/Start.webp
    assets/images/questions/Q1.webp
    assets/images/questions/Q2_1.webp ... Q2_2.webp
    assets/images/questions/Q3_1.webp ... Q3_4.webp
    assets/images/questions/Q4_1.webp ... Q4_8.webp
    assets/images/questions/Q5_1.webp ... Q5_8.webp
    assets/images/questions/Q6.webp ... Q10.webp

    assets/images/results/Final1_long.webp ... Final10_long.webp
    assets/images/cards/Card_Final1.webp ... Card_Final10.webp
  */

const Paths = {
  start: "assets/images/start/Start.webp",
  q: (name) => `assets/images/questions/${name}.webp`,
  result: (finalIndex) => `assets/images/results/Final${finalIndex}_long.webp`,
  card: (finalIndex) => `assets/images/cards/Card_Final${finalIndex}.webp`,
  loading: (n) => `assets/images/loading/Loading${n}.webp`,

  audio: {
    sfx1: "assets/audio/sfx1.mp3",
    sfx2: "assets/audio/sfx2.mp3",
    sfx3: "assets/audio/sfx3.mp3",
  },
};

  /*
    Click area positions are percentages, relative to the displayed image box.
    You said Yes and No are stacked vertically, so defaults are top and bottom halves.
    You can later adjust these values after measuring coordinates.
  */
 const HitBoxes = {
  // Question buttons (based on 1080 x 1920)
  yes: { x: 0.031, y: 0.260071, w: 0.925000, h: 0.104104 },
  no: { x: 0.031, y: 0.402004, w: 0.925000, h: 0.104104 },

  // Result page buttons (based on 1080 x 3700)
  // Using bottom aligned conversion because your Y was given as -28 but buttons are at the bottom
  share: { x: 0.514074, y: 0.944595, w: 0.459259, h: 0.027838 },
  restart: { x: 0.05, y: 0.944595, w: 0.434259, h: 0.027838 },
};
  /*
    Screen graph

    Q1 is a single image.
    Q2 has 2 variants.
    Q3 has 4 variants.
    Q4 has 8 variants.
    Q5 has 8 variants and does not branch further.
    Q6 to Q10 are single images.

    The mapping below matches the common 1,2,4,8 structure.
  */
  const Graph = {
    start: {
      type: "start",
      image: Paths.start,
      next: "q1",
    },

    q1: {
      type: "question",
      image: Paths.q("Q1"),
      yes: "q2_1",
      no: "q2_2",
      recordKey: "Q1",
    },

    q2_1: {
      type: "question",
      image: Paths.q("Q2_1"),
      yes: "q3_1",
      no: "q3_2",
      recordKey: "Q2",
    },
    q2_2: {
      type: "question",
      image: Paths.q("Q2_2"),
      yes: "q3_3",
      no: "q3_4",
      recordKey: "Q2",
    },

    q3_1: {
      type: "question",
      image: Paths.q("Q3_1"),
      yes: "q4_1",
      no: "q4_2",
      recordKey: "Q3",
    },
    q3_2: {
      type: "question",
      image: Paths.q("Q3_2"),
      yes: "q4_3",
      no: "q4_4",
      recordKey: "Q3",
    },
    q3_3: {
      type: "question",
      image: Paths.q("Q3_3"),
      yes: "q4_5",
      no: "q4_6",
      recordKey: "Q3",
    },
    q3_4: {
      type: "question",
      image: Paths.q("Q3_4"),
      yes: "q4_7",
      no: "q4_8",
      recordKey: "Q3",
    },

    q4_1: { type: "question", image: Paths.q("Q4_1"), yes: "q5_1", no: "q5_1", recordKey: "Q4" },
    q4_2: { type: "question", image: Paths.q("Q4_2"), yes: "q5_2", no: "q5_2", recordKey: "Q4" },
    q4_3: { type: "question", image: Paths.q("Q4_3"), yes: "q5_3", no: "q5_3", recordKey: "Q4" },
    q4_4: { type: "question", image: Paths.q("Q4_4"), yes: "q5_4", no: "q5_4", recordKey: "Q4" },
    q4_5: { type: "question", image: Paths.q("Q4_5"), yes: "q5_5", no: "q5_5", recordKey: "Q4" },
    q4_6: { type: "question", image: Paths.q("Q4_6"), yes: "q5_6", no: "q5_6", recordKey: "Q4" },
    q4_7: { type: "question", image: Paths.q("Q4_7"), yes: "q5_7", no: "q5_7", recordKey: "Q4" },
    q4_8: { type: "question", image: Paths.q("Q4_8"), yes: "q5_8", no: "q5_8", recordKey: "Q4" },

    q5_1: { type: "questionEnd", image: Paths.q("Q5_1"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_2: { type: "questionEnd", image: Paths.q("Q5_2"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_3: { type: "questionEnd", image: Paths.q("Q5_3"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_4: { type: "questionEnd", image: Paths.q("Q5_4"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_5: { type: "questionEnd", image: Paths.q("Q5_5"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_6: { type: "questionEnd", image: Paths.q("Q5_6"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_7: { type: "questionEnd", image: Paths.q("Q5_7"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_8: { type: "questionEnd", image: Paths.q("Q5_8"), yes: "q6", no: "q6", recordKey: "Q5" },

    q6: { type: "dummy", image: Paths.q("Q6"), yes: "q7", no: "q7", recordKey: "Q6" },
    q7: { type: "dummy", image: Paths.q("Q7"), yes: "q8", no: "q8", recordKey: "Q7" },
    q8: { type: "dummy", image: Paths.q("Q8"), yes: "q9", no: "q9", recordKey: "Q8" },
    q9: { type: "dummy", image: Paths.q("Q9"), yes: "q10", no: "q10", recordKey: "Q9" },
    q10: { type: "dummyEnd", image: Paths.q("Q10"), yes: "result", no: "result", recordKey: "Q10" },
  };

Graph.loading1 = { type: "loading", image: Paths.loading(1) };
Graph.loading2 = { type: "loading", image: Paths.loading(2) };
Graph.loading3 = { type: "loading", image: Paths.loading(3) };

  /*
    Result mapping

    You asked for path based mapping, not score.
    Core key is Q1 to Q5 answers as A or B.
    Split key is Q6 answer as A or B.

    Because you have not provided the exact 8 reachable leaf keys yet,
    this default mapping produces stable results for all 32 possible keys.
    Later, you can replace CoreMap with only your 8 leaf keys.

    How this default works
    1) Convert the 5 letter key into a number from 0 to 31
    2) Map to Base1 to Base8 using modulo 8
    3) Split Base7 and Base8 using Q6 to reach Final9 and Final10

    When you are ready to lock the real tree leaf keys,
    replace CoreMap and keep FinalMap as is.
  */

  function keyToIndex5(key5) {
    // A = 0, B = 1
    let n = 0;
    for (let i = 0; i < key5.length; i += 1) {
      n = (n << 1) | (key5[i] === "B" ? 1 : 0);
    }
    return n >>> 0;
  }

  function computeBase(coreKey5) {
    const idx = keyToIndex5(coreKey5);
    const baseNum = (idx % 8) + 1;
    return `Base${baseNum}`;
  }

  const FinalMap = {
    Base1: { A: 1, B: 1 },
    Base2: { A: 2, B: 2 },
    Base3: { A: 3, B: 3 },
    Base4: { A: 4, B: 4 },
    Base5: { A: 5, B: 5 },
    Base6: { A: 6, B: 6 },
    Base7: { A: 7, B: 9 },
    Base8: { A: 8, B: 10 },
  };

  function computeFinalIndex(coreKey5, splitKey1) {
    const base = computeBase(coreKey5);
    const map = FinalMap[base] || FinalMap.Base1;
    const finalIndex = map[splitKey1] || map.A;
    return finalIndex;
  }

/*
  DOM
*/
const elStage = document.getElementById("stage");
const elImg = document.getElementById("screenImage");

const elTap = document.getElementById("tapAnywhere");
const elYes = document.getElementById("btnYes");
const elNo = document.getElementById("btnNo");
const elShare = document.getElementById("btnShare");
const elRestart = document.getElementById("btnRestart");

// Audio
const elBgm = document.getElementById("bgm");

let audioCtx = null;
let audioReady = false;
let sfxBuffers = { sfx1: null, sfx2: null, sfx3: null };

function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = Ctx ? new Ctx() : null;
  }
  return audioCtx;
}

async function fetchAudioBuffer(url) {
  const ctx = getAudioCtx();
  if (!ctx) return null;
  const res = await fetch(url, { cache: "no-store" });
  const arr = await res.arrayBuffer();
  return await ctx.decodeAudioData(arr);
}

async function initAudioOnce() {
  if (audioReady) return true;

  const ctx = getAudioCtx();
  if (!ctx) return false;

  try {
    if (ctx.state !== "running") {
      await ctx.resume();
    }

    const [b1, b2, b3] = await Promise.all([
      fetchAudioBuffer(Paths.audio.sfx1),
      fetchAudioBuffer(Paths.audio.sfx2),
      fetchAudioBuffer(Paths.audio.sfx3),
    ]);

    sfxBuffers.sfx1 = b1;
    sfxBuffers.sfx2 = b2;
    sfxBuffers.sfx3 = b3;

    audioReady = true;
    return true;
  } catch (e) {
    return false;
  }
}

function playSfx(name, volume = 0.9) {
  const ctx = getAudioCtx();
  if (!ctx || !audioReady) return;

  const buffer = sfxBuffers[name];
  if (!buffer) return;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(ctx.destination);

  try {
    source.start(0);
  } catch (e) {
    // ignore
  }
}

async function ensureBgmPlaying() {
  if (!elBgm) return;
  try {
    elBgm.volume = 0.6;
    if (elBgm.paused) {
      await elBgm.play();
    }
  } catch (e) {
    // autoplay policy can block until user gesture
  }
}

async function playStartSfxThenBgm() {
  if (startSfxPlayed) {
    await ensureBgmPlaying();
    return;
  }

  const ok = await initAudioOnce();
  if (ok) {
    playSfx("sfx1", 0.95);
  }

  await ensureBgmPlaying();
  startSfxPlayed = true;
}

async function playTapSfx() {
  await initAudioOnce();
  playSfx("sfx2", 0.75);
  await ensureBgmPlaying();
}

async function playLoadingSfx() {
  await initAudioOnce();
  playSfx("sfx3", 0.85);
  await ensureBgmPlaying();
}

let audioUnlocked = false;
let startSfxPlayed = false;
let loadingTimer = null;

function stopLoadingTimer() {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
}

async function tryPlay(el, { volume = 1, restart = true } = {}) {
  if (!el) return false;
  try {
    el.volume = volume;
    if (restart) el.currentTime = 0;
    await el.play();
    return true;
  } catch (e) {
    return false;
  }
}

async function unlockAudioIfPossible() {
  if (audioUnlocked) return true;

  // 브라우저 정책상 실패할 수 있음. 실패하면 다음 사용자 입력에서 다시 시도됨.
  const ok = await tryPlay(elBgm, { volume: 0.6, restart: false });
  if (ok) {
    audioUnlocked = true;
    return true;
  }
  return false;
}

async function playStartSfxThenBgm() {
  // start 효과음은 1회만
  if (startSfxPlayed) return;

  // 먼저 오디오 잠금 해제 시도
  await unlockAudioIfPossible();

  // 효과음1 재생 시도
  const sfxOk = await tryPlay(elSfx1, { volume: 0.9, restart: true });

  // bgm은 항상 유지되도록 재생 시도
  await tryPlay(elBgm, { volume: 0.6, restart: false });

  // 효과음이든 bgm이든 한번이라도 성공하면 잠금 해제된 것으로 간주
  if (sfxOk || (!elBgm || !elBgm.paused)) audioUnlocked = true;

  startSfxPlayed = true;
}

function playTapSfx() {
  // 질문 yes no 터치 효과음2
  // 오디오가 아직 잠겨 있으면 이 시점에서 재시도
  unlockAudioIfPossible();
  tryPlay(elSfx2, { volume: 0.75, restart: true });
  tryPlay(elBgm, { volume: 0.6, restart: false });
}

function playLoadingSfx() {
  unlockAudioIfPossible();
  tryPlay(elSfx3, { volume: 0.85, restart: true });
  tryPlay(elBgm, { volume: 0.6, restart: false });
}

function renderLoading(imageSrc) {
  setStageMode("fixed");
  elImg.src = imageSrc;
  elImg.alt = "Loading";

  setDisabled(elTap, true);
  setDisabled(elYes, true);
  setDisabled(elNo, true);
  setDisabled(elShare, true);
  setDisabled(elRestart, true);
}

async function startLoadingSequenceThenResult() {
  stopLoadingTimer();

  await playLoadingSfx();

  const seq = ["loading1", "loading2", "loading3"];
  let i = 0;

  const step = () => {
    const id = seq[i];
    renderLoading(Graph[id].image);

    i += 1;
    if (i < seq.length) {
      loadingTimer = setTimeout(step, 700);
      return;
    }

    loadingTimer = setTimeout(() => {
      const coreKey5 = buildCoreKey();
      const splitKey1 = answers.Q6 || "A";
      const finalIndex = computeFinalIndex(coreKey5, splitKey1);
      renderResult(finalIndex);
    }, 700);
  };

  step();
}

  /*
    State
  */
  const answers = {
    Q1: null,
    Q2: null,
    Q3: null,
    Q4: null,
    Q5: null,
    Q6: null,
    Q7: null,
    Q8: null,
    Q9: null,
    Q10: null,
  };

  let currentId = "start";
  let currentFinalIndex = 1;

  /*
    Helpers
  */

 let bgmStarted = false;

async function ensureBgm() {
  if (bgmStarted) return;
  if (!elBgm) return;

  try {
    elBgm.volume = 0.6;
    await elBgm.play();
    bgmStarted = true;
  } catch (e) {
    // Autoplay policy can block play until user gesture
    // We will try again on the next user action
  }
}

  function setDisabled(el, disabled) {
    el.disabled = !!disabled;
    el.setAttribute("aria-hidden", disabled ? "true" : "false");
  }

  function setHitBox(el, box) {
    el.style.left = `${box.x * 100}%`;
    el.style.top = `${box.y * 100}%`;
    el.style.width = `${box.w * 100}%`;
    el.style.height = `${box.h * 100}%`;
  }

  function setStageMode(mode) {
    elStage.classList.toggle("isFixed", mode === "fixed");
    elStage.classList.toggle("isResult", mode === "result");
  }

  function preload(src) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  }

  function nextIdForAnswer(node, answerKey) {
    if (!node) return "start";
    if (answerKey === "A") return node.yes || node.next || "start";
    return node.no || node.next || "start";
  }

  function buildCoreKey() {
    return `${answers.Q1 || "A"}${answers.Q2 || "A"}${answers.Q3 || "A"}${answers.Q4 || "A"}${answers.Q5 || "A"}`;
  }

  function setAnswer(recordKey, answerKey) {
    if (!recordKey) return;
    if (!(recordKey in answers)) return;
    answers[recordKey] = answerKey;
  }

  /*
    Screen rendering
  */
  function renderStart() {
    setStageMode("fixed");
    elImg.src = Graph.start.image;
    elImg.alt = "Start";

    setDisabled(elTap, false);

    setDisabled(elYes, true);
    setDisabled(elNo, true);
    setDisabled(elShare, true);
    setDisabled(elRestart, true);

    setHitBox(elTap, { x: 0, y: 0, w: 1, h: 1 });

    preload(Graph.q1.image);
  }

  function renderQuestion(node) {
    setStageMode("fixed");
    elImg.src = node.image;
    elImg.alt = node.recordKey || "Question";

    setDisabled(elTap, true);

    setDisabled(elYes, false);
    setDisabled(elNo, false);
    setDisabled(elShare, true);
    setDisabled(elRestart, true);

    setHitBox(elYes, HitBoxes.yes);
    setHitBox(elNo, HitBoxes.no);

    // Preload likely next screens
    preload(node.yes);
    preload(node.no);
  }

  function renderResult(finalIndex) {
    setStageMode("result");
    currentFinalIndex = finalIndex;

    elImg.src = Paths.result(finalIndex);
    elImg.alt = `Final ${finalIndex}`;

    setDisabled(elTap, true);
    setDisabled(elYes, true);
    setDisabled(elNo, true);

    setDisabled(elShare, false);
    setDisabled(elRestart, false);

    setHitBox(elShare, HitBoxes.share);
    setHitBox(elRestart, HitBoxes.restart);

    // Preload card asset
    preload(Paths.card(finalIndex));

    // Scroll to top when showing a long image
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  function goTo(id) {
    currentId = id;

    if (id === "start") {
      renderStart();
      return;
    }

    if (id === "result") {
      const coreKey5 = buildCoreKey();
      const splitKey1 = answers.Q6 || "A";
      const finalIndex = computeFinalIndex(coreKey5, splitKey1);
      renderResult(finalIndex);
      return;
    }
(() => {
  "use strict";

  const Paths = {
    start: "assets/images/start/Start.webp",
    q: (name) => `assets/images/questions/${name}.webp`,
    result: (finalIndex) => `assets/images/results/Final${finalIndex}_long.webp`,
    card: (finalIndex) => `assets/images/cards/Card_Final${finalIndex}.webp`,
    loading: (n) => `assets/images/loading/Loading${n}.webp`,
  };

  const HitBoxes = {
    // Questions (based on your latest tuned values)
    yes: { x: 0.031, y: 0.260071, w: 0.925, h: 0.104104 },
    no: { x: 0.031, y: 0.402004, w: 0.925, h: 0.104104 },

    // Results (your tuned values)
    share: { x: 0.514074, y: 0.944595, w: 0.459259, h: 0.027838 },
    restart: { x: 0.05, y: 0.944595, w: 0.434259, h: 0.027838 },
  };

  const Graph = {
    start: { type: "start", image: Paths.start, next: "q1" },

    q1: { type: "question", image: Paths.q("Q1"), yes: "q2_1", no: "q2_2", recordKey: "Q1" },

    q2_1: { type: "question", image: Paths.q("Q2_1"), yes: "q3_1", no: "q3_2", recordKey: "Q2" },
    q2_2: { type: "question", image: Paths.q("Q2_2"), yes: "q3_3", no: "q3_4", recordKey: "Q2" },

    q3_1: { type: "question", image: Paths.q("Q3_1"), yes: "q4_1", no: "q4_2", recordKey: "Q3" },
    q3_2: { type: "question", image: Paths.q("Q3_2"), yes: "q4_3", no: "q4_4", recordKey: "Q3" },
    q3_3: { type: "question", image: Paths.q("Q3_3"), yes: "q4_5", no: "q4_6", recordKey: "Q3" },
    q3_4: { type: "question", image: Paths.q("Q3_4"), yes: "q4_7", no: "q4_8", recordKey: "Q3" },

    q4_1: { type: "question", image: Paths.q("Q4_1"), yes: "q5_1", no: "q5_1", recordKey: "Q4" },
    q4_2: { type: "question", image: Paths.q("Q4_2"), yes: "q5_2", no: "q5_2", recordKey: "Q4" },
    q4_3: { type: "question", image: Paths.q("Q4_3"), yes: "q5_3", no: "q5_3", recordKey: "Q4" },
    q4_4: { type: "question", image: Paths.q("Q4_4"), yes: "q5_4", no: "q5_4", recordKey: "Q4" },
    q4_5: { type: "question", image: Paths.q("Q4_5"), yes: "q5_5", no: "q5_5", recordKey: "Q4" },
    q4_6: { type: "question", image: Paths.q("Q4_6"), yes: "q5_6", no: "q5_6", recordKey: "Q4" },
    q4_7: { type: "question", image: Paths.q("Q4_7"), yes: "q5_7", no: "q5_7", recordKey: "Q4" },
    q4_8: { type: "question", image: Paths.q("Q4_8"), yes: "q5_8", no: "q5_8", recordKey: "Q4" },

    q5_1: { type: "questionEnd", image: Paths.q("Q5_1"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_2: { type: "questionEnd", image: Paths.q("Q5_2"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_3: { type: "questionEnd", image: Paths.q("Q5_3"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_4: { type: "questionEnd", image: Paths.q("Q5_4"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_5: { type: "questionEnd", image: Paths.q("Q5_5"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_6: { type: "questionEnd", image: Paths.q("Q5_6"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_7: { type: "questionEnd", image: Paths.q("Q5_7"), yes: "q6", no: "q6", recordKey: "Q5" },
    q5_8: { type: "questionEnd", image: Paths.q("Q5_8"), yes: "q6", no: "q6", recordKey: "Q5" },

    q6: { type: "dummy", image: Paths.q("Q6"), yes: "q7", no: "q7", recordKey: "Q6" },
    q7: { type: "dummy", image: Paths.q("Q7"), yes: "q8", no: "q8", recordKey: "Q7" },
    q8: { type: "dummy", image: Paths.q("Q8"), yes: "q9", no: "q9", recordKey: "Q8" },
    q9: { type: "dummy", image: Paths.q("Q9"), yes: "q10", no: "q10", recordKey: "Q9" },
    q10: { type: "dummyEnd", image: Paths.q("Q10"), yes: "result", no: "result", recordKey: "Q10" },

    loading1: { type: "loading", image: Paths.loading(1) },
    loading2: { type: "loading", image: Paths.loading(2) },
    loading3: { type: "loading", image: Paths.loading(3) },
  };

  function keyToIndex5(key5) {
    let n = 0;
    for (let i = 0; i < key5.length; i += 1) n = (n << 1) | (key5[i] === "B" ? 1 : 0);
    return n >>> 0;
  }
  function computeBase(coreKey5) {
    const idx = keyToIndex5(coreKey5);
    const baseNum = (idx % 8) + 1;
    return `Base${baseNum}`;
  }
  const FinalMap = {
    Base1: { A: 1, B: 1 },
    Base2: { A: 2, B: 2 },
    Base3: { A: 3, B: 3 },
    Base4: { A: 4, B: 4 },
    Base5: { A: 5, B: 5 },
    Base6: { A: 6, B: 6 },
    Base7: { A: 7, B: 9 },
    Base8: { A: 8, B: 10 },
  };
  function computeFinalIndex(coreKey5, splitKey1) {
    const base = computeBase(coreKey5);
    const map = FinalMap[base] || FinalMap.Base1;
    return map[splitKey1] || map.A;
  }

  const elStage = document.getElementById("stage");
  const elImg = document.getElementById("screenImage");

  const elTap = document.getElementById("tapAnywhere");
  const elYes = document.getElementById("btnYes");
  const elNo = document.getElementById("btnNo");
  const elShare = document.getElementById("btnShare");
  const elRestart = document.getElementById("btnRestart");

  const elBgm = document.getElementById("bgm");
  const elSfx1 = document.getElementById("sfx1");
  const elSfx2 = document.getElementById("sfx2");
  const elSfx3 = document.getElementById("sfx3");

  const answers = {
    Q1: null, Q2: null, Q3: null, Q4: null, Q5: null,
    Q6: null, Q7: null, Q8: null, Q9: null, Q10: null,
  };

  let currentId = "start";
  let currentFinalIndex = 1;

  let startSfxPlayed = false;
  let loadingTimer = null;

  function stopLoadingTimer() {
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }
  }

  function setDisabled(el, disabled) {
    el.disabled = !!disabled;
    el.setAttribute("aria-hidden", disabled ? "true" : "false");
  }

  function setHitBox(el, box) {
    el.style.left = `${box.x * 100}%`;
    el.style.top = `${box.y * 100}%`;
    el.style.width = `${box.w * 100}%`;
    el.style.height = `${box.h * 100}%`;
  }

  function setStageMode(mode) {
    elStage.classList.toggle("isFixed", mode === "fixed");
    elStage.classList.toggle("isResult", mode === "result");
  }

  function preload(src) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  }

  function nextIdForAnswer(node, answerKey) {
    if (!node) return "start";
    if (answerKey === "A") return node.yes || node.next || "start";
    return node.no || node.next || "start";
  }

  function buildCoreKey() {
    return `${answers.Q1 || "A"}${answers.Q2 || "A"}${answers.Q3 || "A"}${answers.Q4 || "A"}${answers.Q5 || "A"}`;
  }

  function setAnswer(recordKey, answerKey) {
    if (!recordKey) return;
    if (!(recordKey in answers)) return;
    answers[recordKey] = answerKey;
  }

  async function playHtmlAudio(el, volume, restart) {
    if (!el) return false;
    try {
      el.volume = volume;
      if (restart) el.currentTime = 0;
      await el.play();
      return true;
    } catch (e) {
      return false;
    }
  }

  function playSfx2Overlappable() {
    if (!elSfx2) return;
    const src = elSfx2.currentSrc || elSfx2.src;
    if (!src) return;

    const a = new Audio(src);
    a.preload = "auto";
    a.volume = 0.75;
    a.play().catch(() => {});
  }

  async function ensureBgmPlaying() {
    if (!elBgm) return;
    try {
      elBgm.volume = 0.6;
      if (elBgm.paused) await elBgm.play();
    } catch (e) {}
  }

  async function playStartSfxThenBgm() {
    if (!startSfxPlayed) {
      await playHtmlAudio(elSfx1, 0.95, true);
      startSfxPlayed = true;
    }
    await ensureBgmPlaying();
  }

  async function playLoadingSfx() {
    await playHtmlAudio(elSfx3, 0.85, true);
    await ensureBgmPlaying();
  }

  function renderStart() {
    setStageMode("fixed");
    elImg.src = Graph.start.image;
    elImg.alt = "Start";

    setDisabled(elTap, false);
    setDisabled(elYes, true);
    setDisabled(elNo, true);
    setDisabled(elShare, true);
    setDisabled(elRestart, true);

    setHitBox(elTap, { x: 0, y: 0, w: 1, h: 1 });
    preload(Graph.q1.image);
  }

  function renderQuestion(node) {
    setStageMode("fixed");
    elImg.src = node.image;
    elImg.alt = node.recordKey || "Question";

    setDisabled(elTap, true);
    setDisabled(elYes, false);
    setDisabled(elNo, false);
    setDisabled(elShare, true);
    setDisabled(elRestart, true);

    setHitBox(elYes, HitBoxes.yes);
    setHitBox(elNo, HitBoxes.no);

    preload(node.yes);
    preload(node.no);
  }

  function renderLoading(imageSrc) {
    setStageMode("fixed");
    elImg.src = imageSrc;
    elImg.alt = "Loading";

    setDisabled(elTap, true);
    setDisabled(elYes, true);
    setDisabled(elNo, true);
    setDisabled(elShare, true);
    setDisabled(elRestart, true);
  }

  function renderResult(finalIndex) {
    setStageMode("result");
    currentFinalIndex = finalIndex;

    elImg.src = Paths.result(finalIndex);
    elImg.alt = `Final ${finalIndex}`;

    setDisabled(elTap, true);
    setDisabled(elYes, true);
    setDisabled(elNo, true);

    setDisabled(elShare, false);
    setDisabled(elRestart, false);

    setHitBox(elShare, HitBoxes.share);
    setHitBox(elRestart, HitBoxes.restart);

    preload(Paths.card(finalIndex));
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  function goTo(id) {
    currentId = id;

    if (id === "start") {
      renderStart();
      return;
    }

    if (id === "result") {
      const coreKey5 = buildCoreKey();
      const splitKey1 = answers.Q6 || "A";
      const finalIndex = computeFinalIndex(coreKey5, splitKey1);
      renderResult(finalIndex);
      return;
    }

    const node = Graph[id];
    if (!node) {
      renderStart();
      return;
    }

    renderQuestion(node);
  }

  async function startLoadingSequenceThenResult() {
    stopLoadingTimer();
    await playLoadingSfx();

    const seq = ["loading1", "loading2", "loading3"];
    let i = 0;

    const step = () => {
      renderLoading(Graph[seq[i]].image);

      i += 1;
      if (i < seq.length) {
        loadingTimer = setTimeout(step, 700);
        return;
      }

      loadingTimer = setTimeout(() => {
        const coreKey5 = buildCoreKey();
        const splitKey1 = answers.Q6 || "A";
        const finalIndex = computeFinalIndex(coreKey5, splitKey1);
        renderResult(finalIndex);
      }, 700);
    };

    step();
  }

  async function answerCurrent(answerKey) {
    const node = Graph[currentId];
    if (!node) return;

    setAnswer(node.recordKey, answerKey);

    if (currentId === "q10") {
      await startLoadingSequenceThenResult();
      return;
    }

    const next = nextIdForAnswer(node, answerKey);
    goTo(next);
  }

  async function shareResult() {
    const finalIndex = currentFinalIndex;
    const cardUrl = Paths.card(finalIndex);

    try {
      const res = await fetch(cardUrl, { cache: "no-store" });
      const blob = await res.blob();
      const file = new File([blob], `Final${finalIndex}.png`, { type: blob.type || "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My result",
          text: `I got Final${finalIndex}.`,
          files: [file],
        });
        return;
      }
    } catch (e) {}

    const a = document.createElement("a");
    a.href = cardUrl;
    a.download = `Card_Final${finalIndex}.webp`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function restart() {
    stopLoadingTimer();
    for (const k of Object.keys(answers)) answers[k] = null;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    goTo("start");
  }

  elTap.addEventListener("click", async () => {
    if (currentId !== "start") return;
    await playStartSfxThenBgm();
    goTo(Graph.start.next);
  });

  elYes.addEventListener("click", async () => {
    playSfx2Overlappable();
    await ensureBgmPlaying();
    await answerCurrent("A");
  });

  elNo.addEventListener("click", async () => {
    playSfx2Overlappable();
    await ensureBgmPlaying();
    await answerCurrent("B");
  });

  elShare.addEventListener("click", () => shareResult());
  elRestart.addEventListener("click", () => restart());

  setHitBox(elYes, HitBoxes.yes);
  setHitBox(elNo, HitBoxes.no);
  setHitBox(elShare, HitBoxes.share);
  setHitBox(elRestart, HitBoxes.restart);
  setHitBox(elTap, { x: 0, y: 0, w: 1, h: 1 });

  goTo("start");
})();
    const node = Graph[id];
    if (!node) {
      renderStart();
      return;
    }

    renderQuestion(node);
  }

  /*
    Actions
  */
  async function answerCurrent(answerKey) {
    const node = Graph[currentId];
    if (!node) return;

    setAnswer(node.recordKey, answerKey);

    const next = nextIdForAnswer(node, answerKey);

    // If we just answered Q10, go to result
  if (currentId === "q10") {
  // Q10 이후에는 항상 로딩 화면 3장 자동 재생 후 결과로 이동
  await startLoadingSequenceThenResult();
  return;
}

    goTo(next);
  }

  async function shareResult() {
    const finalIndex = currentFinalIndex;
    const cardUrl = Paths.card(finalIndex);

    // Try Web Share with an image file if supported
    try {
      const res = await fetch(cardUrl, { cache: "no-store" });
      const blob = await res.blob();
      const file = new File([blob], `Final${finalIndex}.png`, { type: blob.type || "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My result",
          text: `I got Final${finalIndex}.`,
          files: [file],
        });
        return;
      }
    } catch (e) {
      // Ignore and fall back to download
    }

    // Fallback to download
    const a = document.createElement("a");
    a.href = cardUrl;
    a.download = `Card_Final${finalIndex}.webp`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function restart() {
    for (const k of Object.keys(answers)) answers[k] = null;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    goTo("start");
  }

  /*
    Event wiring
  */
elTap.addEventListener("click", async () => {
  if (currentId !== "start") return;
  await playStartSfxThenBgm();
  goTo(Graph.start.next);
});

elYes.addEventListener("click", async () => {
  await playTapSfx();
  answerCurrent("A");
});

elNo.addEventListener("click", async () => {
  await playTapSfx();
  answerCurrent("B");
});

  elShare.addEventListener("click", () => shareResult());
  elRestart.addEventListener("click", () => restart());

  /*
    Initialize hit boxes once
  */
  setHitBox(elYes, HitBoxes.yes);
  setHitBox(elNo, HitBoxes.no);
  setHitBox(elShare, HitBoxes.share);
  setHitBox(elRestart, HitBoxes.restart);
  setHitBox(elTap, { x: 0, y: 0, w: 1, h: 1 });

  /*
    Start
  */
  goTo("start");


  /*
    Notes for you to update later

    1) Adjust click areas
       Update HitBoxes.yes and HitBoxes.no for questions
       Update HitBoxes.share and HitBoxes.restart for results

    2) Lock real leaf mapping
       Replace computeBase(coreKey5) with a real CoreMap:
       const CoreMap = { "AABAA": "Base1", ... } using your 8 reachable leaf keys
       Then computeBase returns CoreMap[coreKey5] or a default
  */
})();