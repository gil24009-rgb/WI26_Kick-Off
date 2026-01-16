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
  };

  /*
    Click area positions are percentages, relative to the displayed image box.
    You said Yes and No are stacked vertically, so defaults are top and bottom halves.
    You can later adjust these values after measuring coordinates.
  */
 const HitBoxes = {
  // Question buttons (based on 1080 x 1920)
  yes: { x: 0.002315, y: 0.219271, w: 0.925000, h: 0.104104 },
  no: { x: 0.0, y: 0.340104, w: 0.925000, h: 0.104104 },

  // Result page buttons (based on 1080 x 3700)
  // Using bottom aligned conversion because your Y was given as -28 but buttons are at the bottom
  share: { x: 0.274074, y: 0.964595, w: 0.459259, h: 0.027838 },
  restart: { x: 0.0, y: 0.964595, w: 0.434259, h: 0.027838 },
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
  const elBgm = document.getElementById("bgm");
  const elTap = document.getElementById("tapAnywhere");
  const elYes = document.getElementById("btnYes");
  const elNo = document.getElementById("btnNo");
  const elShare = document.getElementById("btnShare");
  const elRestart = document.getElementById("btnRestart");

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
  function answerCurrent(answerKey) {
    const node = Graph[currentId];
    if (!node) return;

    setAnswer(node.recordKey, answerKey);

    const next = nextIdForAnswer(node, answerKey);

    // If we just answered Q10, go to result
    if (currentId === "q10") {
      goTo("result");
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
  await ensureBgm();
  goTo(Graph.start.next);
});

  elYes.addEventListener("click", async () => {
  await ensureBgm();
  answerCurrent("A");
});

elNo.addEventListener("click", async () => {
  await ensureBgm();
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

  window.addEventListener("keydown", (e) => {
  if (e.key === "d" || e.key === "D") {
    elStage.classList.toggle("debug");
  }
});

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