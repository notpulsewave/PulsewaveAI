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

function getSystemPrompt() {
    const promptEl = document.getElementById('system-prompt');
    return promptEl ? promptEl.value.trim() : '';
}

/* -------------------------
   Mode + Theme
------------------------- */
function setSystemPromptForMode(mode, overwrite = true) {
    const promptEl = document.getElementById('system-prompt');
    if (promptEl && overwrite) promptEl.value = MODES[mode] || MODES['sarcastic'];

    const badge = document.getElementById('mode-badge');
    if (badge) badge.textContent = "Mode: " + mode.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function validateAndStart() {
    const inputKey = document.getElementById('api-key');
    const errorDiv = document.getElementById('api-error');

    if (!inputKey || !errorDiv) return;

    const trimmedKey = inputKey.value.trim();
    if (trimmedKey === "") {
        errorDiv.textContent = "Please enter an API key or 'demo'.";
        return;
    }

    apiKey = trimmedKey;
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
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved && document.getElementById("theme-select")) {
        document.getElementById("theme-select").value = saved;
        changeTheme(saved);
    }
}

function changeMode(mode) {
    setSystemPromptForMode(mode, true);
    localStorage.setItem(MODE_KEY, mode);
}

function loadMode() {
    const saved = localStorage.getItem(MODE_KEY) || 'sarcastic';
    const modeSelect = document.getElementById('mode-select');
    if (modeSelect) modeSelect.value = saved;
    setSystemPromptForMode(saved, true);
}

/* -------------------------
   Chat History
------------------------- */
function saveChatHistory(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function loadChatHistory() {
    const chatArea = document.getElementById('chat-area');
    if (!chatArea) return;

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
        const text = textEl ? textEl.textContent || textEl.innerText : "";
        messages.push({ role, content: text });
    });

    return messages;
}

function clearChat() {
    const chatArea = document.getElementById('chat-area');
    if (chatArea) chatArea.innerHTML = "";
    saveChatHistory([]);
}

/* -------------------------
   UI Helpers
------------------------- */
function setupKeyboardShortcuts() {
    if (document.body.dataset.shortcutsBound === '1') return;
    document.body.dataset.shortcutsBound = '1';

    document.addEventListener('keydown', (e) => {
        const inputField = document.getElementById('user-input');
        if (!inputField) return;

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
    if (!chatArea) return;

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

    if (save) saveChatHistory(getCurrentMessages());

    return { row, bubble };
}

function toggleSystemPrompt() {
    const section = document.getElementById("system-prompt-section");
    if (!section) return;
    section.classList.toggle("hidden");
}

function addTypingIndicator() {
    const chatArea = document.getElementById('chat-area');
    if (!chatArea) return null;

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
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) themeSelect.value = theme;
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
        const modeSelect = document.getElementById('mode-select');
        if (modeSelect) modeSelect.value = mode;
        changeMode(mode);
        renderMessage('assistant', `Mode switched to ${mode}.`, true);
        return { handled: true };
    }

    if (cmd === '/sarcastic') {
        const modeSelect = document.getElementById('mode-select');
        if (modeSelect) modeSelect.value = 'sarcastic';
        changeMode('sarcastic');
        renderMessage('assistant', "Sarcastic mode activated.", true);
        return { handled: true };
    }

    renderMessage('assistant', `Unknown command: ${cmd}`, true);
    return { handled: true };
}

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatArea = document.getElementById('chat-area');
    if (!inputField || !sendBtn || !chatArea) return;

    const message = inputField.value.trim();
    if (!message) return;

    inputField.value = '';
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

    const typingRow = addTypingIndicator();

    try {
        let responseText = "";

        if (apiKey.toLowerCase() === 'demo') {
            await new Promise(r => setTimeout(r, 800));
            responseText = "Demo mode: This is a fake PulsewaveAI reply.";
        } else {
            const systemPrompt = getSystemPrompt();

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

        if (typingRow && chatArea.contains(typingRow)) {
            chatArea.removeChild(typingRow);
        }

        renderMessage('assistant', responseText, true);

    } catch (err) {
        if (typingRow && chatArea.contains(typingRow)) {
            chatArea.removeChild(typingRow);
        }
        renderMessage('assistant', `Error: ${err.message}`, true);
    }

    inputField.disabled = false;
    sendBtn.disabled = false;
    inputField.focus();
}
