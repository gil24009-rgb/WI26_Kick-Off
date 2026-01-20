(() => {
  "use strict";

  const Paths = {
    start: "assets/images/start/Start.webp",
    q: (name) => `assets/images/questions/${name}.webp`,
    result: (finalIndex) => `assets/images/results/Final${finalIndex}_long.webp`,
    card: (finalIndex) => `assets/images/cards/Card_Final${finalIndex}.webp`,
    loading: (n) => `assets/images/loading/Loading${n}.webp`,
  };

  // 중요: 투명 버튼 위치는 사용자 파일 내부 값 그대로 유지
  const HitBoxes = {
    // Question buttons (based on 1080 x 1920)
    yes: { x: 0.031, y: 0.260071, w: 0.925000, h: 0.104104 },
    no: { x: 0.031, y: 0.402004, w: 0.925000, h: 0.104104 },

    // Result page buttons (based on 1080 x 3700)
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

  async function safePlay(el, { volume = 1, restart = true } = {}) {
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

  async function ensureBgm() {
    if (!elBgm) return;
    try {
      elBgm.volume = 0.6;
      if (elBgm.paused) await elBgm.play();
    } catch (e) {}
  }

  // 효과음2는 연타 시 끊김 방지용으로 매번 새 Audio로 재생
  function playSfx2Overlappable() {
    if (!elSfx2) return;
    const src = elSfx2.currentSrc || elSfx2.src;
    if (!src) return;

    const a = new Audio(src);
    a.preload = "auto";
    a.volume = 0.75;
    a.play().catch(() => {});
  }

  async function playStartSfxThenBgm() {
    // 스타트 효과음은 1회만
    if (!startSfxPlayed) {
      await safePlay(elSfx1, { volume: 0.95, restart: true });
      startSfxPlayed = true;
    }
    await ensureBgm();
  }

  async function playLoadingSfx() {
    await safePlay(elSfx3, { volume: 0.85, restart: true });
    await ensureBgm();
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

    // 효과음1 먼저 시도, 실패해도 진행은 되어야 함
    await playStartSfxThenBgm();
    goTo(Graph.start.next);
  });

  elYes.addEventListener("click", async () => {
    playSfx2Overlappable();
    await ensureBgm();
    await answerCurrent("A");
  });

  elNo.addEventListener("click", async () => {
    playSfx2Overlappable();
    await ensureBgm();
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