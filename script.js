const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const closeBtn = document.getElementById("closeBtn");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const okFineBtn = document.getElementById("okFineBtn");

const copyBtn = document.getElementById("copyBtn");
const chosenPlanEl = document.getElementById("chosenPlan");

const steps = Array.from(document.querySelectorAll(".step"));
const dots = Array.from(document.querySelectorAll(".dot"));

let currentStep = 0;
let chosenPlan = "";

// --- helpers ---
function showOverlay() {
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  goToStep(0);
}

function hideOverlay() {
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function goToStep(stepIndex) {
  currentStep = stepIndex;

  steps.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  const step = steps.find(s => Number(s.dataset.step) === stepIndex);
  if (step) step.classList.add("active");

  const dot = dots.find(d => Number(d.dataset.step) === stepIndex);
  if (dot) dot.classList.add("active");
}

// --- open/close ---
startBtn.addEventListener("click", showOverlay);
closeBtn.addEventListener("click", hideOverlay);

// close when clicking backdrop (outside modal)
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) hideOverlay();
});

// Escape key closes overlay
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.classList.contains("hidden")) hideOverlay();
});

// --- step navigation buttons ---
document.querySelectorAll(".nextBtn").forEach(btn => {
  btn.addEventListener("click", () => goToStep(1));
});

document.querySelectorAll(".backBtn").forEach(btn => {
  btn.addEventListener("click", () => goToStep(1));
});

// --- Yes/No flow ---
yesBtn?.addEventListener("click", () => goToStep(3));

noBtn?.addEventListener("click", (e) => {
  // On the 1st click, it starts running away
  e.preventDefault();
  e.stopPropagation();
  enableRunaway();
});

okFineBtn?.addEventListener("click", () => {
  startHearts();
  goToStep(3);
});

// --- No button "run away" logic ---
let runawayMode = false;

function getNoButtonContainer() {
  // The parent container is: <div class="actions two"> ... </div>
  // It exists on step 2 of the modal (data-step="1")
  return noBtn?.closest(".actions.two");
}

function enableRunaway() {
  runawayMode = true;

  const container = getNoButtonContainer();
  if (!container || !noBtn) return;

  // Allow absolute positioning inside the button row
  container.style.position = "relative";
  noBtn.style.position = "absolute";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";

  // Make it run away when you try to hover it too (optional but fun)
  noBtn.addEventListener("mouseenter", moveNoButton);
  moveNoButton();

  // Also start hearts when runaway begins
  startHearts();
}

function moveNoButton() {
  const container = getNoButtonContainer();
  if (!container || !noBtn) return;

  const pad = 6;
  const c = container.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();

  const maxX = Math.max(pad, c.width - b.width - pad);
  const maxY = Math.max(pad, c.height - b.height - pad);

  const x = pad + Math.random() * (maxX - pad);
  const y = pad + Math.random() * (maxY - pad);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

// --- plan selection ---
document.querySelectorAll(".plan").forEach(btn => {
  btn.addEventListener("click", () => {
    chosenPlan = btn.dataset.plan || "";
    chosenPlanEl.textContent = chosenPlan || "Pick one above 👆";
  });
});

// --- copy message ---
copyBtn?.addEventListener("click", async () => {
  const planText = chosenPlan ? `Plan: ${chosenPlan}` : `Plan: (you pick!)`;
  const msg = `Will you be my Valentine? 💖\n\n${planText}\n\nIf you're free, let's do it this week 🥰`;

  try {
    await navigator.clipboard.writeText(msg);
    copyBtn.textContent = "Copied! ✅";
    setTimeout(() => (copyBtn.textContent = "Copy message to send"), 1200);
  } catch {
    // fallback
    alert(msg);
  }
});