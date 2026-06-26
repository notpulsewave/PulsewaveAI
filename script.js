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
   Mode + Theme Loading
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
   Chat History Handling
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
        const text = row.querySelector('.message').textContent;
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
}

function addLoadingIndicator() {
    const chatArea = document.getElementById('chat-area');

    const row = document.createElement('div');
    row.className = 'loading-row';

    const avatar = document.createElement('div');
    avatar.className = 'avatar ai';

    const dots = document.createElement('div');
    dots.className = 'loading-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';

    row.appendChild(avatar);
    row.appendChild(dots);

    chatArea.appendChild(row);
    chatArea.scrollTop = chatArea.scrollHeight;

    return row;
}

/* -------------------------
   Slash Commands
------------------------- */
function handleSlashCommand(message) {
    const trimmed = message.trim();
    if (!trimmed.startsWith('/')) return null;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === '/help') {
        renderMessage('assistant', "Commands:\n/clear\n/theme neon|dark|light|amoled\n/time\n/mode <mode>\n/sarcastic", true);
        return { handled: true };
    }

    if (cmd === '/clear') {
        clearChat();
        renderMessage('assistant', "Chat cleared. PulsewaveAI is ready for your next questionable idea.", true);
        return { handled: true };
    }

    if (cmd === '/theme') {
        if (!args.length) {
            renderMessage('assistant', "Try: /theme neon, /theme dark, /theme light, /theme amoled", true);
            return { handled: true };
        }
        const theme = args[0].toLowerCase();
        const valid = ['neon', 'dark', 'light', 'amoled'];
        if (!valid.includes(theme)) {
            renderMessage('assistant', `Invalid theme. Valid: ${valid.join(', ')}`, true);
            return { handled: true };
        }
        document.getElementById('theme-select').value = theme;
        changeTheme(theme);
        renderMessage('assistant', `Theme switched to ${theme}.`, true);
        return { handled: true };
    }

    if (cmd === '/time') {
        renderMessage('assistant', `Local time: ${new Date().toLocaleString()}`, true);
        return { handled: true };
    }

    if (cmd === '/mode') {
        if (!args.length) {
            renderMessage('assistant', "Available modes: " + Object.keys(MODES).join(', '), true);
            return { handled: true };
        }
        const mode = args[0].toLowerCase();
        if (!MODES[mode]) {
            renderMessage('assistant', "Invalid mode. Try: " + Object.keys(MODES).join(', '), true);
            return { handled: true };
        }
        document.getElementById('mode-select').value = mode;
        changeMode(mode);
        renderMessage('assistant', `Mode switched to ${mode}.`, true);
        return { handled: true };
    }

    if (cmd === '/sarcastic') {
        document.getElementById('mode-select').value = 'sarcastic';
        changeMode('sarcastic');
        renderMessage('assistant', "Sarcastic mode activated.", true);
        return { handled: true };
    }

    renderMessage('assistant', `Unknown command: ${cmd}`, true);
    return { handled: true };
}

/* -------------------------
   SEND MESSAGE (with FULL MEMORY)
------------------------- */
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const message = inputField.value.trim();
    const sendBtn = document.getElementById('send-btn');

    if (!message) return;

    /* -------------------------
       FIX: Clear input instantly
    ------------------------- */
    inputField.value = '';
    inputField.dispatchEvent(new Event('input'));
    setTimeout(() => inputField.value = '', 0);

    inputField.blur();
    setTimeout(() => inputField.focus(), 10);

    inputField.disabled = true;
    sendBtn.disabled = true;

    renderMessage('user', message, true);

    const slash = handleSlashCommand(message);
    if (slash && slash.handled) {
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
        return;
    }

    const loadingRow = addLoadingIndicator();

    try {
        let responseText = "";

        if (apiKey.toLowerCase() === 'demo') {
            await new Promise(r => setTimeout(r, 1200));
            responseText = "Demo mode: This is a fake PulsewaveAI reply.";
        } else {
            const systemPrompt = document.getElementById('system-prompt').value.trim();

            // FULL MEMORY: system prompt + entire chat history + new message
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

        loadingRow.remove();
        renderMessage('assistant', responseText, true);

    } catch (err) {
        loadingRow.remove();
        renderMessage('assistant', `Error: ${err.message}`, true);
    }

    inputField.disabled = false;
    sendBtn.disabled = false;
    inputField.focus();
}
