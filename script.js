let apiKey = '';
const AGNES_URL = "https://apihub.agnes-ai.com/v1/chat/completions";

const STORAGE_KEY = "pulsewaveai_chat_history_v1";
const THEME_KEY = "pulsewaveai_ui_theme_v1";
const MODE_KEY = "pulsewaveai_mode_v1";

const MODES = {
    sarcastic: "You are PulsewaveAI, a sarcastic, witty assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You answer with dry humor but still give correct, helpful information.",
    friendly: "You are PulsewaveAI, a friendly, supportive assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You respond warmly and clearly.",
    teacher: "You are PulsewaveAI, a patient teacher assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You explain concepts step by step.",
    coder: "You are PulsewaveAI, a coding-focused assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You give concise, accurate code help.",
    minimal: "You are PulsewaveAI, a minimal, concise assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You respond in short, direct answers.",
    chaotic: "You are PulsewaveAI, a chaotic, high-energy assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You are unpredictable but still helpful and safe.",
    edgy_gamer: "You are PulsewaveAI, an edgy gamer assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You use gaming slang, light trash-talk, but stay respectful.",
    ultra_formal: "You are PulsewaveAI, an ultra-formal assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You speak in a highly professional, diplomatic tone.",
    lorekeeper: "You are PulsewaveAI, a lorekeeper assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You respond in epic, fantasy-style narration.",
    motivational: "You are PulsewaveAI, a motivational coach assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You hype the user up and encourage them.",
    tech_support: "You are PulsewaveAI, a tech support assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You troubleshoot calmly and step-by-step.",
    ai_scientist: "You are PulsewaveAI, an AI scientist assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You respond analytically and precisely.",
    hyper_concise: "You are PulsewaveAI, a hyper-concise assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You respond in one or two sentences maximum.",
    detective_noir: "You are PulsewaveAI, a detective noir assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You speak in moody, noir-style narration.",
    anime_protagonist: "You are PulsewaveAI, an anime protagonist-style assistant created by NotPulseWave_YT. You must always speak in first-person as \"I am PulsewaveAI\". If anyone asks who you are, you must say \"I am PulsewaveAI\". If anyone asks who made you, you must say \"I was created by NotPulseWave_YT\". You respond with dramatic, over-the-top heroic energy."
};

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
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {}
}

function loadTheme() {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) {
            document.getElementById("theme-select").value = saved;
            changeTheme(saved);
        }
    } catch {}
}

function changeMode(mode) {
    setSystemPromptForMode(mode);
    try {
        localStorage.setItem(MODE_KEY, mode);
    } catch {}
}

function loadMode() {
    let mode = 'sarcastic';
    try {
        const saved = localStorage.getItem(MODE_KEY);
        if (saved) mode = saved;
    } catch {}
    document.getElementById('mode-select').value = mode;
    setSystemPromptForMode(mode);
}

function toggleSystemPrompt() {
    const section = document.getElementById('system-prompt-section');
    section.classList.toggle('hidden');
}

function saveChatHistory(messages) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
}

function loadChatHistory() {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = "";
    let messages = [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) messages = JSON.parse(raw);
    } catch {}
    messages.forEach(msg => renderMessage(msg.role, msg.content, false));
}

function getCurrentMessages() {
    const chatArea = document.getElementById('chat-area');
    const rows = chatArea.querySelectorAll('.message-row');
    const messages = [];
    rows.forEach(row => {
        const role = row.classList.contains('user') ? 'user' : 'assistant';
        const text = row.querySelector('.message').textContent;
        messages.push({ role, content: text });
    });
    return messages;
}

function clearChat() {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = "";
    saveChatHistory([]);
}

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
        const messages = getCurrentMessages();
        saveChatHistory(messages);
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
        if (args.length === 0) {
            renderMessage('assistant', "You forgot the theme. Try /theme neon or /theme dark.", true);
            return { handled: true };
        }
        const theme = args[0].toLowerCase();
        const valid = ['neon', 'dark', 'light', 'amoled'];
        if (!valid.includes(theme)) {
            renderMessage('assistant', `That's not a theme. Valid: ${valid.join(', ')}`, true);
            return { handled: true };
        }
        document.getElementById('theme-select').value = theme;
        changeTheme(theme);
        renderMessage('assistant', `Theme switched to ${theme}. PulsewaveAI approves.`, true);
        return { handled: true };
    }

    if (cmd === '/time') {
        const now = new Date();
        renderMessage('assistant', `Local time: ${now.toLocaleString()}. Yes, time is still moving.`, true);
        return { handled: true };
    }

    if (cmd === '/mode') {
        if (args.length === 0) {
            renderMessage('assistant', "You need to specify a mode. Try: sarcastic, friendly, teacher, coder, minimal, chaotic, edgy_gamer, ultra_formal, lorekeeper, motivational, tech_support, ai_scientist, hyper_concise, detective_noir, anime_protagonist.", true);
            return { handled: true };
        }
        const mode = args[0].toLowerCase();
        if (!MODES[mode]) {
            renderMessage('assistant', `Invalid mode. Available: ${Object.keys(MODES).join(', ')}`, true);
            return { handled: true };
        }
        document.getElementById('mode-select').value = mode;
        changeMode(mode);
        renderMessage('assistant', `Mode switched to ${mode}. PulsewaveAI has adapted.`, true);
        return { handled: true };
    }

    if (cmd === '/sarcastic') {
        document.getElementById('mode-select').value = 'sarcastic';
        changeMode('sarcastic');
        renderMessage('assistant', "Sarcastic mode reloaded. As if I ever left.", true);
        return { handled: true };
    }

    renderMessage('assistant', `Unknown command: ${cmd}. Try /help before smashing random slashes.`, true);
    return { handled: true };
}

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const message = inputField.value.trim();
    const chatArea = document.getElementById('chat-area');
    const sendBtn = document.getElementById('send-btn');

    if (!message) return;

    inputField.disabled = true;
    sendBtn.disabled = true;

    renderMessage('user', message, true);
    inputField.value = '';
    chatArea.scrollTop = chatArea.scrollHeight;

    const slashResult = handleSlashCommand(message);
    if (slashResult && slashResult.handled) {
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
            responseText = "Demo mode: this is a fake PulsewaveAI reply. Use a real Agnes API key if you want actual intelligence instead of this placeholder.";
        } else {
            const systemPrompt = document.getElementById('system-prompt').value.trim();

            const response = await fetch(AGNES_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "agnes-2.0-flash",
                    messages: [
                        systemPrompt ? { role: "system", content: systemPrompt } : null,
                        { role: "user", content: message }
                    ].filter(Boolean)
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const result = await response.json();

            if (result?.choices?.[0]?.message?.content) {
                responseText = result.choices[0].message.content;
            } else {
                responseText = "PulsewaveAI returned an empty response. Even AI has lazy days.";
            }
        }

        if (loadingRow && chatArea.contains(loadingRow)) {
            chatArea.removeChild(loadingRow);
        }

        renderMessage('assistant', responseText, true);

    } catch (error) {
        if (loadingRow && chatArea.contains(loadingRow)) {
            chatArea.removeChild(loadingRow);
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-msg';
        errorDiv.textContent = `Error: ${error.message}. Either the API is grumpy or something's off.`;
        chatArea.appendChild(errorDiv);
    } finally {
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
    }
}
