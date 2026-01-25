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

noBtn?.addEventListener("click", () => goToStep(2));

okFineBtn?.addEventListener("click", () => goToStep(3));

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