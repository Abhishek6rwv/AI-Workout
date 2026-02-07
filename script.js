// ============================
// 1. NAVIGATION & SECTION CONTROL
// ============================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    }

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-target="${sectionId}"]`);
    if (navItem) navItem.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    // Default section
    showSection('dashboard');

    // Navbar clicks
    document.querySelectorAll('.nav-item').forEach(navItem => {
        navItem.addEventListener('click', () => {
            const target = navItem.getAttribute('data-target');
            showSection(target);
        });
    });

    setupRoutines();
    initWeeklyChart();
    initChartSaveButtons();
    setupChatbot();
});

// ============================
// 2. DASHBOARD FEATURES
// ============================

// Water Intake
function addWater() {
    const waterAmount = document.getElementById('water-amount');
    const waterBar = document.getElementById('water-bar-inner');
    if (!waterAmount || !waterBar) return;

    let current = parseInt(waterAmount.textContent) || 0;
    if (current < 4000) current += 200;

    waterAmount.textContent = current;
    const percent = Math.min(current / 4000 * 100, 100);
    waterBar.style.width = `${percent}%`;
}

// Sleep Tracker
function logSleep() {
    const input = document.getElementById('sleep-input');
    const display = document.getElementById('sleep-hours');
    if (!input || !display) return;

    display.textContent = input.value || '0';
}

// Motivation Quotes
const quotes = [
    "Great things never come from comfort zones.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "The body achieves what the mind believes.",
    "Push yourself, because no one else is going to do it for you."
];

function newQuote() {
    const quoteText = document.getElementById('quote-text');
    if (!quoteText) return;
    quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// HIIT Generator
const hiitList = [
    "20s High knees + 30s Rest × 5",
    "15 Push-ups + 10 Jump squats × 3",
    "40s Burpees + 30s Mountain Climbers × 4"
];

function genHIIT() {
    const hiit = document.getElementById('hiit-workout');
    if (!hiit) return;
    hiit.textContent = hiitList[Math.floor(Math.random() * hiitList.length)];
}

// Nutrition Tips
const nutriTips = [
    "Eat colorful veggies for max nutrients!",
    "Stay hydrated – water is vital for recovery.",
    "Add lean protein to every meal.",
    "Choose whole grains for lasting energy."
];

function newTip() {
    const tipEl = document.getElementById('nutri-tip');
    if (!tipEl) return;
    tipEl.textContent = nutriTips[Math.floor(Math.random() * nutriTips.length)];
}

// ============================
// 3. WORKOUT DISPLAY (GIF SECTIONS)
// ============================
function showWorkout(id) {
    const sections = document.querySelectorAll(".workout-subsection");
    sections.forEach(sec => sec.style.display = "none");
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
}

// ============================
// 4. CALCULATORS
// ============================

// BMI
function calculateBMI() {
    const heightInput = document.getElementById('bmi-height');
    const weightInput = document.getElementById('bmi-weight');
    if (!heightInput || !weightInput) return;

    const heightCm = parseFloat(heightInput.value);
    const weightKg = parseFloat(weightInput.value);
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
        alert('Please enter valid height and weight.');
        return;
    }

    const bmi = weightKg / ((heightCm / 100) ** 2);
    let cat = bmi < 18.5 ? 'Underweight' :
              bmi < 24.9 ? 'Normal' :
              bmi < 29.9 ? 'Overweight' : 'Obese';

    const bmiResult = document.getElementById('bmi-result');
    if (bmiResult) bmiResult.textContent = `Your BMI is ${bmi.toFixed(2)} (${cat})`;
}

// Steps → Calories
function calculateStepsCalories() {
    const stepsInput = document.getElementById('steps-count');
    const weightInput = document.getElementById('steps-weight');
    if (!stepsInput || !weightInput) return;

    const steps = parseFloat(stepsInput.value);
    const weight = parseFloat(weightInput.value);
    if (!steps || !weight || steps <= 0 || weight <= 0) {
        alert('Enter both steps and weight correctly.');
        return;
    }

    const calories = (steps * weight * 0.00057).toFixed(2);
    const result = document.getElementById('steps-calories-result');
    if (result) result.textContent = `Burned approx. ${calories} kcal`;
}

// BMR
function calculateBMR() {
    const ageInput = document.getElementById('bmr-age');
    const heightInput = document.getElementById('bmr-height');
    const weightInput = document.getElementById('bmr-weight');
    const genderSelect = document.getElementById('bmr-gender');

    if (!ageInput || !heightInput || !weightInput || !genderSelect) return;

    const age = parseInt(ageInput.value);
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const gender = genderSelect.value;

    if (!age || !height || !weight || age <= 0 || height <= 0 || weight <= 0) {
        alert('Enter valid age, height, and weight.');
        return;
    }

    let bmr = gender === 'male'
        ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

    const res = document.getElementById('bmr-result');
    if (res) res.textContent = `Your BMR is ${bmr.toFixed(0)} kcal/day`;
}

// Daily calories
function calculateCalories() {
    const activitySelect = document.getElementById('activity-level');
    const bmrTextEl = document.getElementById('bmr-result');
    if (!activitySelect || !bmrTextEl) return;

    const activity = parseFloat(activitySelect.value);
    const bmrText = bmrTextEl.textContent;
    if (!bmrText) {
        alert('Calculate BMR first.');
        return;
    }

    const bmrMatch = bmrText.match(/(\d+)/);
    if (!bmrMatch) {
        alert('BMR value not found.');
        return;
    }

    const calories = parseInt(bmrMatch[1], 10) * activity;
    const res = document.getElementById('calorie-result');
    if (res) res.textContent = `Daily calorie needs: ${Math.round(calories)} kcal`;
}

// Distance-based steps
function calculateSteps() {
    const distanceEl = document.getElementById("distance");
    const stepLengthEl = document.getElementById("stepLength");
    const resultEl = document.getElementById("result");
    const canvas = document.getElementById("stepsChart");
    if (!distanceEl || !stepLengthEl || !resultEl || !canvas) return;

    let distance = parseFloat(distanceEl.value);
    let stepLength = parseFloat(stepLengthEl.value);

    if (!distance || !stepLength || distance <= 0 || stepLength <= 0) {
        resultEl.textContent = "Please enter valid values.";
        return;
    }

    let distanceM = distance * 1000;
    let steps = Math.round(distanceM / stepLength);

    resultEl.textContent = "Estimated steps: " + steps;

    let ctx = canvas.getContext("2d");
    if (window.stepsChartObj) window.stepsChartObj.destroy();
    window.stepsChartObj = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Calculated Steps'],
            datasets: [{ label: 'Steps', data: [steps] }]
        },
        options: {
            indexAxis: 'y',
            scales: { x: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });

    const saveBtn = document.getElementById("saveChartBtn");
    if (saveBtn) saveBtn.style.display = "inline-block";
}

// Height-based steps
function calculateHeightSteps() {
    const distanceEl = document.getElementById("distanceHeight");
    const unitEl = document.getElementById("distanceUnit");
    const heightCmEl = document.getElementById("heightCm");
    const heightInchEl = document.getElementById("heightInch");
    const heightFootEl = document.getElementById("heightFoot");
    const resultEl = document.getElementById("resultHeight");
    const canvas = document.getElementById("heightStepsChart");

    if (!distanceEl || !unitEl || !resultEl || !canvas) return;

    let distance = parseFloat(distanceEl.value);
    let unit = unitEl.value;
    let heightCm = parseFloat(heightCmEl.value);
    const heightInch = parseFloat(heightInchEl.value);
    const heightFoot = parseFloat(heightFootEl.value);

    if (!heightCm && heightInch) heightCm = heightInch * 2.54;
    if (!heightCm && heightFoot) heightCm = heightFoot * 30.48;

    if (!distance || !heightCm || distance <= 0 || heightCm <= 0) {
        resultEl.textContent = "Please enter valid values.";
        return;
    }

    let distanceM = unit === "kilometers" ? distance * 1000 : distance;

    let strideLengthM = (heightCm * 0.415) / 100;
    let steps = Math.round(distanceM / strideLengthM);

    resultEl.textContent = "Estimated steps: " + steps;

    let ctx = canvas.getContext("2d");
    if (window.heightStepsChartObj) window.heightStepsChartObj.destroy();
    window.heightStepsChartObj = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Calculated Steps'],
            datasets: [{ label: 'Steps', data: [steps] }]
        },
        options: {
            indexAxis: 'y',
            scales: { x: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });

    const saveBtn = document.getElementById("saveHeightChartBtn");
    if (saveBtn) saveBtn.style.display = "inline-block";
}

// ============================
// 5. PROGRESS & ROUTINES
// ============================
const routines = {
    0: [
        "🕖 8:00 AM: Late wake up & hydrate",
        "🧘 8:30 AM: Gentle yoga/stretch",
        "🍳 9:00 AM: Big healthy breakfast",
        "📖 10:00 AM: Reading/family time",
        "🚶 5:00 PM: Evening walk",
        "🍴 7:30 PM: Light dinner",
        "🛌 10:30 PM: Early to bed",
    ],
    1: [
        "🕖 7:00 AM: Wake up & hydrate",
        "🏃 7:30 AM: 20-min jog",
        "🍽️ 8:30 AM: Oats, fruit, nuts",
        "🖥️ 9:00 AM: Work/Study",
        "💪 6:00 PM: Gym (Upper body)",
        "🥗 7:30 PM: Protein, veggies, rice",
        "🛌 11:00 PM: Bedtime",
    ],
    2: [
        "🕖 7:10 AM: Wake up & stretch",
        "🚲 7:40 AM: Cycling 30-min",
        "🍳 8:30 AM: Eggs & toast",
        "👩‍💻 9:00 AM: Work/Project",
        "🏋️ 6:00 PM: Gym (Legs/abs)",
        "🥙 7:30 PM: Lentils, salad, roti",
        "🛌 10:30 PM: Relax & sleep",
    ],
    3: [
        "🕖 7:00 AM: Early rise & hydrate",
        "🏃 7:30 AM: Fast walk 25-min",
        "🥣 8:30 AM: Muesli & yogurt",
        "🖥️ 9:00 AM: Work/Classes",
        "🥊 6:00 PM: HIIT/circuit",
        "🍛 7:30 PM: Brown rice, dal, veggies",
        "🛌 10:45 PM: Early lights out",
    ],
    4: [
        "🕖 7:30 AM: Wake up & hydrate",
        "🧘 8:00 AM: Relax & breathing exercises",
        "🍌 8:30 AM: Fruits & seeds",
        "⌨️ 9:00 AM: Work/Assignments",
        "🏋️ 6:30 PM: Gym (Back/biceps)",
        "🍗 8:00 PM: Chicken, soup, salad",
        "🛌 11:15 PM: Sleep",
    ],
    5: [
        "🕖 7:00 AM: Wake up & stretch",
        "🚶 7:40 AM: Walk 20-min",
        "🥚 8:30 AM: Protein breakfast",
        "🖥️ 9:00 AM: Work/Meetings",
        "💪 6:00 PM: Gym (Shoulders/triceps)",
        "🥗 8:00 PM: Mixed veggies & brown rice",
        "🎬 10:00 PM: Movie or reading",
        "🛌 11:30 PM: Sleep late",
    ],
    6: [
        "🕖 8:30 AM: Weekend sleep in",
        "🥞 9:15 AM: Pancakes/fruit breakfast",
        "🧘 10:00 AM: Yoga/Pilates",
        "🛒 12:00 PM: Shopping/errands",
        "⚽ 5:00 PM: Sports/friends",
        "🍴 8:00 PM: Cheat meal night",
        "🛌 12:15 AM: Bedtime",
    ]
};

function setupRoutines() {
    const select = document.getElementById("fitness-day-select");
    const button = document.getElementById("show-fitness-routine");
    const output = document.getElementById("fitness-routine-output");

    if (!button || !select || !output) return;

    button.addEventListener("click", () => {
        const day = parseInt(select.value, 10);
        const routine = routines[day];
        output.innerHTML = "";
        if (routine) {
            routine.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                output.appendChild(li);
            });
        } else {
            output.innerHTML = "<li>No routine found for this day.</li>";
        }
    });
}

// ============================
// 6. AI VOICE ASSISTANT
// ============================
const voiceBtn = document.getElementById("voice-assistant-btn");
const synth = window.speechSynthesis;
let recognition = null;

// Speech recognition setup
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => console.log("🎤 Listening...");
    recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.toLowerCase();
        if (!transcript) return;
        console.log("Heard:", transcript);
        handleCommand(transcript);
    };

    recognition.onerror = (event) => {
        console.log("Recognition error:", event.error);
        speak("Voice recognition failed. Try again.");
    };
} else {
    console.log("Speech recognition not supported. Use Chrome or Edge.");
}

// Speak helper
function speak(text) {
    if (!text) return;
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
}

// Command handler
function handleCommand(cmd) {
    console.log("Handling command:", cmd);

    // Navigate sections
    if (cmd.includes("dashboard")) {
        showSection("dashboard");
        speak("Opening your dashboard.");
    } else if (cmd.includes("progress")) {
        showSection("progress");
        speak("Showing your progress overview.");
    } else if (cmd.includes("workout") || cmd.includes("workouts")) {
        showSection("workouts");
        speak("Opening your workout library.");
    } else if (cmd.includes("calculator") || cmd.includes("fitness checker")) {
        showSection("calculators");
        speak("Opening fitness calculators.");
    } else if (cmd.includes("wellness")) {
        showSection("wellness");
        speak("Opening wellness tips.");
    }

    // Specific workouts
    else if (cmd.includes("chest")) {
        showSection("workouts");
        showWorkout("chest");
        speak("Here is your chest workout.");
    } else if (cmd.includes("biceps")) {
        showSection("workouts");
        showWorkout("biceps");
        speak("Here is your biceps workout.");
    } else if (cmd.includes("triceps")) {
        showSection("workouts");
        showWorkout("triceps");
        speak("Here is your triceps workout.");
    } else if (cmd.includes("shoulder")) {
        showSection("workouts");
        showWorkout("shoulder");
        speak("Here is your shoulder workout.");
    } else if (cmd.includes("back")) {
        showSection("workouts");
        showWorkout("back");
        speak("Here is your back workout.");
    } else if (cmd.includes("legs")) {
        showSection("workouts");
        showWorkout("legs");
        speak("Here is your leg workout.");
    } else if (cmd.includes("abs") || cmd.includes("core")) {
        showSection("workouts");
        showWorkout("abs");
        speak("Here is your abs workout.");
    } else if (cmd.includes("cardio")) {
        showSection("workouts");
        showWorkout("cardio");
        speak("Here is a cardio workout.");
    } else if (cmd.includes("full body")) {
        showSection("workouts");
        showWorkout("fullbody");
        speak("Here is a full body workout.");
    }

    // Help
    else if (cmd.includes("help") || cmd.includes("what can you do")) {
        speak("You can say things like: open dashboard, show progress, open workouts, or show chest workout.");
    } else {
        speak("Sorry, I did not understand that. Please try again.");
    }
}

// Voice button click
if (voiceBtn && recognition) {
    voiceBtn.addEventListener("click", () => {
        try {
            recognition.start();
            console.log("Voice assistant started...");
        } catch (err) {
            console.error("Recognition start error:", err);
            speak("Error starting voice assistant. Try again.");
        }
    });
}

// ==================
// 7. AI CHATBOT
// ==================
let chatPopup, chatBody, chatInput, sendBtn, toggleBtn, closeBtn;

function setupChatbot() {
    chatPopup = document.getElementById("assistantPopup");
    chatBody = document.getElementById("assistantBody");
    chatInput = document.getElementById("assistantInput");
    sendBtn = document.getElementById("assistantSendBtn");
    toggleBtn = document.getElementById("chatbotToggleBtn");
    closeBtn = document.getElementById("assistantCloseBtn");

    if (!chatPopup || !chatBody || !chatInput || !sendBtn || !toggleBtn || !closeBtn) return;

    toggleBtn.addEventListener("click", () => {
        chatPopup.classList.toggle("hide");
    });

    closeBtn.addEventListener("click", () => {
        chatPopup.classList.add("hide");
    });

    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // Optional: welcome message
    createChatBubble("Hi! I'm your AI fitness assistant. Ask me about workouts, diet, or motivation. 💪", "ai");
}

// IMPORTANT: for real projects, call your own backend instead of putting API key here
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBCPYCCqTocp9KXyIhmD84cezqGX44OUfY";

function createChatBubble(text, sender = "ai") {
    if (!chatBody) return;
    const bubble = document.createElement("div");
    bubble.textContent = text;
    bubble.classList.add(sender === "user" ? "user-bubble" : "ai-bubble");
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function getAIResponse(message) {
    if (!chatBody) return;

    const loader = document.createElement("div");
    loader.textContent = "⏳ AI is typing...";
    loader.style.fontStyle = "italic";
    loader.style.color = "#999";
    chatBody.appendChild(loader);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: message }] }
                ]
            })
        });

        const data = await res.json();
        loader.remove();

        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response received!";
        createChatBubble(aiText, "ai");
    } catch (err) {
        console.error(err);
        loader.textContent = "⚠️ Error fetching response!";
    }
}

function sendMessage() {
    if (!chatInput) return;
    const message = chatInput.value.trim();
    if (!message) return;

    createChatBubble(message, "user");
    chatInput.value = "";
    getAIResponse(message);
}

// ==================
// 8. WEEKLY STEPS CHART + SAVE BUTTON
// ==================
function initWeeklyChart() {
    const weeklyCanvas = document.getElementById('weeklyStepsChart');
    if (!weeklyCanvas) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const stepsData = [8200, 9100, 7800, 8700, 9200, 10500, 9800];

    const wctx = weeklyCanvas.getContext('2d');
    new Chart(wctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{ label: 'Steps', data: stepsData }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1000 }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    const weeklySaveBtn = document.getElementById("saveWeeklyBtn");
    if (weeklySaveBtn) {
        weeklySaveBtn.onclick = function () {
            const chartURL = weeklyCanvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = chartURL;
            link.download = "weekly_steps_chart.png";
            link.click();
        };
    }
}

// ==================
// 9. SAVE CHART BUTTONS FOR OTHER CHARTS
// ==================
function initChartSaveButtons() {
    const saveStepsBtn = document.getElementById("saveChartBtn");
    const stepsCanvas = document.getElementById("stepsChart");
    if (saveStepsBtn && stepsCanvas) {
        saveStepsBtn.onclick = function () {
            const chartURL = stepsCanvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = chartURL;
            link.download = "distance_steps_chart.png";
            link.click();
        };
    }

    const saveHeightBtn = document.getElementById("saveHeightChartBtn");
    const heightCanvas = document.getElementById("heightStepsChart");
    if (saveHeightBtn && heightCanvas) {
        saveHeightBtn.onclick = function () {
            const chartURL = heightCanvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = chartURL;
            link.download = "height_steps_chart.png";
            link.click();
        };
    }
}
