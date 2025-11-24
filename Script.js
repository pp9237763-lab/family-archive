/* 
🛡️ СИСТЕМА ЗАЩИТЫ СЕМЕЙНОГО АРХИВА АКТИВИРОВАНА
*/

// 🔐 Пароль: 18.02.2007
const CORRECT_PASSWORD = "18022007";
let userName = '';

function checkPassword() {
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('error');
    const loginScreen = document.getElementById('login');
    const contentScreen = document.getElementById('content');
    
    if (password === "") return;
    
    if (password === CORRECT_PASSWORD) {
        loginScreen.classList.add('hidden');
        contentScreen.classList.remove('hidden');
        showIdentificationForm();
    } else {
        errorElement.classList.remove('hidden');
        document.getElementById('password').value = '';
    }
}

function showIdentificationForm() {
    document.getElementById('content').innerHTML = `
        <div class="welcome-message">
            <div class="header-section">
                <h2>🕰️ Представьтесь, незнакомец</h2>
                <p class="quote">«Каждый человек - новая ветвь на дереве рода»</p>
            </div>
            
            <div class="identification-form">
                <div class="form-section">
                    <h3>👤 Ваши данные</h3>
                    <input type="text" id="firstName" placeholder="Ваше имя" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                    <input type="text" id="lastName" placeholder="Ваша фамилия" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                </div>
                
                <div class="form-section">
                    <h3>👨‍👩‍👦 Для идентификации</h3>
                    <input type="text" id="motherName" placeholder="Имя матери" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                    <input type="text" id="fatherName" placeholder="Имя отца" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                </div>
                
                <button onclick="processIdentification()" style="width:100%;padding:12px;background:#3498db;color:white;border:none;border-radius:8px;margin:10px 0;">Войти в архив</button>
                <p id="identification-result"></p>
            </div>
        </div>
    `;
}

function processIdentification() {
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const motherName = document.getElementById('motherName').value.trim();
    const fatherName = document.getElementById('fatherName').value.trim();
    const resultElement = document.getElementById('identification-result');
    
    if (!firstName) {
        resultElement.innerHTML = "❌ Пожалуйста, введите ваше имя";
        return;
    }
    
    userName = firstName;
    
    // Простая идентификация
    let relation = "гость";
    let message = `👋 Приветствую, ${userName}! Добро пожаловать в архив!`;
    
    if (motherName.includes("Любовь") || motherName.includes("Голышева")) {
        relation = "потомок";
        message = `🌳 Приветствую, потомок! Вы связаны с семьёй Голышевых.`;
    }
    
    resultElement.innerHTML = message;
    
    setTimeout(() => {
        showFamilyInfo(relation);
        createAssistant();
    }, 2000);
}

function showFamilyInfo(relation = "гость") {
    document.getElementById('content').innerHTML = `
        <div class="welcome-message">
            <div class="header-section">
                <h2>🕰️ Добро пожаловать, ${userName}!</h2>
                <p class="quote">«Прошлое — это фундамент, настоящее — строительство, будущее — наследие»</p>
                <div class="user-badge">Статус: ${relation}</div>
            </div>
            
            <div class="message-section">
                <h3>👋 Кто я?</h3>
                <p><strong>Голышев Никита Викторович</strong><br>
                Родился 18.02.2007 года в Ленинске-Кузнецком, Кемеровской области</p>
                
                <p>Роды матери проходили тяжело. Я родился очень рано, на 1-2 месяца раньше срока. 
                По шкале Апгар 3/5 баллов.</p>
            </div>
            
            <div class="message-section">
                <h3>👨‍👩‍👦 Моя семья</h3>
                <p><strong>Мать:</strong> Голышева Любовь Анатольевна (13.09.1986 г.р.)</p>
                <p><strong>Бабушка:</strong> Голышева Елена Николаевна (04.05.1956 г.р.)</p>
                <p><strong>Двоюродный брат:</strong> Кадошников Вадим Сергеевич (2000 г.р.)</p>
                <p><strong>Двоюродная сестра:</strong> Кадошникова Валерия Сергеевна (2004 г.р.)</p>
            </div>

            <div class="message-section">
                <h3>🏠 Дом бабушки</h3>
                <p>Переулок Самарский 15 - деревянный дом с баней, колодцем и садом. 
                Место моего детства с 2010 года.</p>
            </div>
            
            <div class="message-section">
                <h3>🌳 Ты — часть этого древа</h3>
                <p>Каждая ветвь нашего рода важна. Каждый лист — уникален.</p>
                
                <p style="text-align: center; font-style: italic; margin-top: 30px;">
                "Прошлое — это фундамент, настоящее — строительство, 
                будущее — наследие. Береги нашу историю."
                </p>
                
                <p style="text-align: right; margin-top: 20px;">
                — Никита, хранитель семейной памяти<br>
                2024 год
                </p>
            </div>
        </div>
    `;
}

// 🎯 УМНЫЙ ПОМОЩНИК
function createAssistant() {
    const assistantHTML = `
        <div id="assistant-container">
            <div id="assistant-button">💬 Помощник</div>
            <div id="assistant-chat" class="hidden">
                <div id="chat-header">
                    <span>🕰️ Помощник архива</span>
                    <button id="close-chat" style="background:none;border:none;color:white;font-size:20px;">×</button>
                </div>
                <div id="chat-messages"></div>
                <div id="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Спросите о семье...">
                    <button id="send-message">➤</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', assistantHTML);

    const assistantKnowledge = {
        greetings: ["Привет! Я помощник семейного архива!", "Здравствуйте! Чем могу помочь?", "Добро пожаловать в архив!"],
        family: ["Семья Голышевых: Никита (18.02.2007), мать Любовь, бабушка Елена.", "Наша семья живёт в Ленинске-Кузнецком."],
        archive: ["Этот архив создан для сохранения семейной истории."]
    };

    const assistantBtn = document.getElementById('assistant-button');
    const assistantChat = document.getElementById('assistant-chat');
    const closeBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');

    function toggleChat() {
        assistantChat.classList.toggle('hidden');
        if (!assistantChat.classList.contains('hidden')) {
            chatInput.focus();
            addMessage("🕰️ Помощник", `Привет, ${userName}! Спросите о семье Голышевых.`, true);
        }
    }

    function addMessage(sender, text, isAssistant = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isAssistant ? 'assistant-message' : 'user-message'}`;
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getAnswer(question) {
        const lowerQ = question.toLowerCase();
        if (lowerQ.includes('привет')) return assistantKnowledge.greetings[0];
        if (lowerQ.includes('семья') || lowerQ.includes('голыше')) return assistantKnowledge.family[0];
        if (lowerQ.includes('архив')) return assistantKnowledge.archive[0];
        return "Интересный вопрос! Я помогу разобраться в семейной истории.";
    }

    function handleUserMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        addMessage(userName, message);
        chatInput.value = '';
        
        setTimeout(() => {
            const answer = getAnswer(message);
            addMessage("🕰️ Помощник", answer, true);
        }, 1000);
    }

    assistantBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', () => assistantChat.classList.add('hidden'));
    sendBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
}
