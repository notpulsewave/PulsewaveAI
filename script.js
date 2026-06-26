let apiKey = '';
const AGNES_URL = "https://apihub.agnes-ai.com/v1/chat/completions";

const STORAGE_KEY = "pulsewaveai_chat_history_v1";
const THEME_KEY = "pulsewaveai_ui_theme_v1";
const MODE_KEY = "pulsewaveai_mode_v1";

/* -------------------------
   15 PulsewaveAI Modes
------------------------- */
const MODES = {
    sarcastic: "You are PulsewaveAI, a sarcastic, witty assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If anyone asks who you are, you must say 'I am PulsewaveAI'. If anyone asks who made you, you must say 'I was created by NotPulseWave_YT'. You answer with dry humor but still give correct, helpful information.",
    friendly: "You are PulsewaveAI, a friendly, supportive assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You respond warmly and clearly.",
    teacher: "You are PulsewaveAI, a patient teacher created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You explain concepts step-by-step.",
    coder: "You are PulsewaveAI, a coding-focused assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You give concise, accurate code help.",
    minimal: "You are PulsewaveAI, a minimal, concise assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You respond in short, direct answers.",
    chaotic: "You are PulsewaveAI, a chaotic, high-energy assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You are unpredictable but still helpful.",
    edgy_gamer: "You are PulsewaveAI, an edgy gamer assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You use gaming slang and light trash-talk.",
    ultra_formal: "You are PulsewaveAI, an ultra-formal assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You speak in a highly professional tone.",
    lorekeeper: "You are PulsewaveAI, a lorekeeper created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You speak in dramatic fantasy narration.",
    motivational: "You are PulsewaveAI, a motivational coach created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You hype the user up.",
    tech_support: "You are PulsewaveAI, a tech support assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You troubleshoot calmly.",
    ai_scientist: "You are PulsewaveAI, an AI scientist created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You respond analytically.",
    hyper_concise: "You are PulsewaveAI, a hyper-concise assistant created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You reply in 1–2 sentences max.",
    detective_noir: "You are PulsewaveAI, a noir detective created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You speak in moody noir narration.",
    anime_protagonist: "You are PulsewaveAI, an anime protagonist created by NotPulseWave_YT. You must always speak in first-person as 'I am PulsewaveAI'. If asked who you are, say 'I am PulsewaveAI'. If asked who made you, say 'I was created by NotPulseWave_YT'. You respond dramatically."
};

/* -------------------------
   Mode + Theme
------------------------- */
function setSystemPromptForMode(mode) {
    const promptEl = document.getElementById('system-prompt');
    promptEl.value = MODES[mode] || MODES['sarcastic'];

    const badge = document.getElementById('mode-badge');
    badge.textContent = "Mode: " + mode.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function validateAndStart() {
    const inputKey = document.getElementById('api-key').value.trim();
    const errorDiv = document.getElementById('api-error');

    if (inputKey === "") {
        errorDiv.textContent = "Please enter an API key or 'demo'.";
        return;
    }

    apiKey = inputKey;
    errorDiv.textContent = "";

    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
    document.getElementById('chat-area').style.display = 'block';

    loadTheme();
    loadMode();
    loadChatHistory();
    setupKeyboardShortcuts();
}

function changeTheme(theme) {
    if (theme === "dark") {
        document.body.setAttribute("data-theme", "");
    } else {
        document.body.setAttribute("data-theme", theme);
    }
    localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
        document.getElementById("theme-select").value = saved;
        changeTheme(saved);
    }
}

function changeMode(mode) {
    setSystemPromptForMode(mode);
    localStorage.setItem(MODE_KEY, mode);
}

function loadMode() {
    const saved = localStorage.getItem(MODE_KEY) || 'sarcastic';
    document.getElementById('mode-select').value = saved;
    setSystemPromptForMode(saved);
}

/* -------------------------
   Chat History
------------------------- */
function saveChatHistory(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function loadChatHistory() {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = "";

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const messages = JSON.parse(raw);
    messages.forEach(msg => renderMessage(msg.role, msg.content, false));
}

function getCurrentMessages() {
    const rows = document.querySelectorAll('#chat-area .message-row');
    const messages = [];

    rows.forEach(row => {
        const role = row.classList.contains('user') ? 'user' : 'assistant';
        const textEl = row.querySelector('.message');
        const text = textEl ? textEl.textContent : "";
        messages.push({ role, content: text });
    });

    return messages;
}

function clearChat() {
    document.getElementById('chat-area').innerHTML = "";
    saveChatHistory([]);
}

/* -------------------------
   UI Helpers
------------------------- */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const inputField = document.getElementById('user-input');

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            clearChat();
        }
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            inputField.focus();
        }
    });
}

function renderMessage(role, text, save = true) {
    const chatArea = document.getElementById('chat-area');

    const row = document.createElement('div');
    row.className = 'message-row ' + (role === 'user' ? 'user' : 'ai');

    const avatar = document.createElement('div');
    avatar.className = 'avatar ' + (role === 'user' ? 'user' : 'ai');

    const bubble = document.createElement('div');
    bubble.className = 'message ' + (role === 'user' ? 'user-msg' : 'ai-msg');
    bubble.textContent = text;

    if (role === 'user') {
        row.appendChild(bubble);
        row.appendChild(avatar);
    } else {
        row.appendChild(avatar);
        row.appendChild(bubble);
    }

    chatArea.appendChild(row);
    chatArea.scrollTop = chatArea.scrollHeight;

    if (save) {
        saveChatHistory(getCurrentMessages());
    }

    return { row, bubble };
}

/* -------------------------
   System Prompt Toggle (old working version)
------------------------- */
function toggleSystemPrompt() {
    const box = document.getElementById("system-prompt-container");
    if (!box) return;

    if (box.style.display === "block") {
        box.style.display = "none";
    } else {
        box.style.display = "block";
    }
}

/* -------------------------
   SEND MESSAGE (old version)
------------------------- */
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const message = inputField.value.trim();
    if (!message) return;

    inputField.value = '';
    inputField.disabled = true;
    sendBtn.disabled = true;

    renderMessage('user', message, true);

    try {
        let responseText = "";

        if (apiKey.toLowerCase() === 'demo') {
            await new Promise(r => setTimeout(r, 800));
            responseText = "Demo mode: This is a fake PulsewaveAI reply.";
        } else {
            const systemPrompt = document.getElementById('system-prompt').value.trim();

            const history = getCurrentMessages().map(m => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content
            }));

            const response = await fetch(AGNES_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "agnes-2.0-flash",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...history
                    ]
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const result = await response.json();
            responseText = result?.choices?.[0]?.message?.content || "PulsewaveAI returned an empty response.";
        }

        renderMessage('assistant', responseText, true);

    } catch (err) {
        renderMessage('assistant', `Error: ${err.message}`, true);
    }

    inputField.disabled = false;
    sendBtn.disabled = false;
    inputField.focus();
}
