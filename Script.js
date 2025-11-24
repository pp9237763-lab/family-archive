/* 
🛡️ СИСТЕМА ЗАЩИТЫ СЕМЕЙНОГО АРХИВА АКТИВИРОВАНА
*/

// 🔐 Пароль: 18.02.2007
const CORRECT_PASSWORD = "18022007";
let userName = '';

// Создаем помощника ДО ввода пароля
createAssistant();

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
        // Обновляем помощника после входа
        updateAssistantAccess(true);
    } else {
        errorElement.classList.remove('hidden');
        document.getElementById('password').value = '';
    }
}

// 🆔 ИСПРАВЛЕННАЯ ФОРМА ИДЕНТИФИКАЦИИ
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
                    <input type="text" id="lastName" placeholder="Фамилия" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                    <input type="text" id="firstName" placeholder="Имя" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                    <input type="text" id="middleName" placeholder="Отчество" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                </div>
                
                <div class="form-section">
                    <h3>👨‍👩‍👦 Данные родителей</h3>
                    <input type="text" id="motherName" placeholder="ФИО матери" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                    <input type="text" id="fatherName" placeholder="ФИО отца" style="width:100%;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;">
                </div>
                
                <button onclick="processIdentification()" style="width:100%;padding:12px;background:#3498db;color:white;border:none;border-radius:8px;margin:10px 0;">Войти в архив</button>
                <p id="identification-result"></p>
            </div>
        </div>
    `;
}

// 🔍 ИСПРАВЛЕННАЯ ИДЕНТИФИКАЦИЯ
function processIdentification() {
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const middleName = document.getElementById('middleName').value.trim();
    const motherName = document.getElementById('motherName').value.trim();
    const fatherName = document.getElementById('fatherName').value.trim();
    const resultElement = document.getElementById('identification-result');
    
    if (!firstName || !lastName) {
        resultElement.innerHTML = "❌ Пожалуйста, введите имя и фамилию";
        return;
    }
    
    userName = `${firstName} ${middleName}`;
    const fullName = `${lastName} ${firstName} ${middleName}`.trim();
    
    // Улучшенная идентификация
    const identificationResult = analyzeFamilyConnection(lastName, firstName, middleName, motherName, fatherName, fullName);
    
    resultElement.innerHTML = identificationResult.message;
    resultElement.className = identificationResult.success ? 'success' : 'warning';
    
    if (identificationResult.success) {
        setTimeout(() => {
            showFamilyInfo(identificationResult.relation);
            // Обновляем помощника с полным доступом
            updateAssistantAccess(true, identificationResult.relation);
        }, 2000);
    }
}

// 🔎 УЛУЧШЕННЫЙ АНАЛИЗ РОДСТВА
function analyzeFamilyConnection(lastName, firstName, middleName, motherName, fatherName, fullName) {
    const knownFamily = {
        "Голышев Никита Викторович": { 
            mother: "Голышева Любовь Анатольевна", 
            father: "Голышев Виктор",
            type: "прямой"
        },
        "Голышева Любовь Анатольевна": { 
            mother: "Голышева Елена Николаевна",
            type: "прямой" 
        },
        "Кадошников Вадим Сергеевич": { 
            mother: "Голышева Наталья Сергеевна",
            type: "двоюродный" 
        },
        "Кадошникова Валерия Сергеевна": { 
            mother: "Голышева Наталья Сергеевна",
            type: "двоюродный" 
        }
    };
    
    // Проверка прямого совпадения
    if (knownFamily[fullName]) {
        return {
            success: true,
            relation: "прямой член семьи",
            message: `🎉 Добро пожаловать, ${fullName}! Вы прямой член семьи Голышевых.`
        };
    }
    
    // Анализ по фамилии
    if (lastName === "Голышев" || lastName === "Голышева") {
        return {
            success: true,
            relation: "родственник",
            message: `🌿 Приветствую, родственник! Фамилия ${lastName} связана с нашей семьёй.`
        };
    }
    
    // Анализ по родителям
    if (motherName) {
        for (const [knownName, data] of Object.entries(knownFamily)) {
            if (data.mother && motherName.includes(data.mother.split(' ')[0])) {
                return {
                    success: true,
                    relation: "потомок",
                    message: `🌳 Приветствую, потомок! Вы связаны через ${data.mother}.`
                };
            }
        }
    }
    
    // Если есть данные родителей
    if (motherName || fatherName) {
        return {
            success: true,
            relation: "гость с данными",
            message: `👋 Приветствую, ${userName}! Спасибо за предоставленные данные.`
        };
    }
    
    return {
        success: true,
        relation: "гость",
        message: `👋 Приветствую, ${userName}! Добро пожаловать в архив как гость.`
    };
}

// 🏠 ОСНОВНОЙ КОНТЕНТ АРХИВА
function showFamilyInfo(relation = "гость") {
    document.getElementById('content').innerHTML = `
        <div class="welcome-message">
            <div class="header-section">
                <h2>🕰️ Добро пожаловать в семейный архив!</h2>
                <p class="quote">«Прошлое — это фундамент, настоящее — строительство, будущее — наследие»</p>
                <div class="user-badge">Статус: ${relation}</div>
            </div>
            
            <div class="message-section">
                <h3>👋 Кто я?</h3>
                <p><strong>Голышев Никита Викторович</strong><br>
                Родился 18.02.2007 года в Ленинске-Кузнецком, Кемеровской области</p>
            </div>
            
            <div class="message-section">
                <h3>👨‍👩‍👦 Моя семья</h3>
                <p><strong>Мать:</strong> Голышева Любовь Анатольевна (13.09.1986 г.р.)</p>
                <p><strong>Бабушка:</strong> Голышева Елена Николаевна (04.05.1956 г.р.)</p>
            </div>

            <div class="message-section">
                <h3>🏠 Дом бабушки</h3>
                <p>Переулок Самарский 15 - деревянный дом с баней, колодцем и садом.</p>
            </div>
        </div>
    `;
}

// 🎯 ГЛОБАЛЬНЫЙ ПОМОЩНИК (работает всегда)
let assistantInstance = null;
let hasFullAccess = false;
let userRelation = "неизвестно";

function createAssistant() {
    if (document.getElementById('assistant-container')) return;
    
    const assistantHTML = `
        <div id="assistant-container">
            <div id="assistant-button">💬 Помощник</div>
            <div id="assistant-chat" class="hidden">
                <div id="chat-header">
                    <span>🕰️ Помощник архива</span>
                    <button id="close-chat">×</button>
                </div>
                <div id="chat-messages"></div>
                <div id="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Задайте вопрос...">
                    <button id="send-message">➤</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', assistantHTML);
    initializeAssistant();
}

function updateAssistantAccess(fullAccess = false, relation = "неизвестно") {
    hasFullAccess = fullAccess;
    userRelation = relation;
}

function initializeAssistant() {
    // 🔧 СИСТЕМНЫЙ МОДУЛЬ
    const SystemUtils = {
        getSystemInfo() {
            const ua = navigator.userAgent;
            let deviceType = 'Компьютер';
            let powerLevel = 'средней мощности';

            if (/Android/.test(ua)) {
                deviceType = 'Телефон';
                powerLevel = 'мобильное устройство';
            } else if (/iPhone|iPad/.test(ua)) {
                deviceType = 'iPhone/iPad';
                powerLevel = 'Apple устройство';
            }

            // Определяем "мощность" по количеству ядер
            const cores = navigator.hardwareConcurrency || 2;
            if (cores >= 8) powerLevel = 'мощное железо';
            else if (cores >= 4) powerLevel = 'средней мощности';
            else powerLevel = 'простое устройство';

            return {
                deviceType,
                powerLevel,
                browser: this.getBrowser(ua),
                cores: cores
            };
        },

        getBrowser(ua) {
            if (ua.includes('Chrome')) return 'Chrome';
            if (ua.includes('Firefox')) return 'Firefox';
            if (ua.includes('Safari')) return 'Safari';
            return 'Браузер';
        },

        getCurrentTime() {
            const now = new Date();
            return {
                date: now.toLocaleDateString('ru-RU'),
                time: now.toLocaleTimeString('ru-RU')
            };
        }
    };

    // 🧠 УМНЫЙ ПОМОЩНИК
    const SmartAssistant = {
        getGreeting() {
            const systemInfo = SystemUtils.getSystemInfo();
            const timeInfo = SystemUtils.getCurrentTime();
            
            return `Привет! Смотрю у тебя ${systemInfo.powerLevel} (${systemInfo.deviceType}) 📱\n` +
                   `Сейчас: ${timeInfo.time}, ${timeInfo.date} 🕰️\n` +
                   `Ты спросишь откуда я знаю? Не важно 😉\n` +
                   `Я помощник архива. Есть вопросы - задавай, отвечу!`;
        },

        getResponse(question, hasFullAccess, userRelation) {
            const lowerQuestion = question.toLowerCase();
            const systemInfo = SystemUtils.getSystemInfo();
            const timeInfo = SystemUtils.getCurrentTime();

            // ОБЩИЕ КОМАНДЫ (работают всегда)
            if (lowerQuestion.includes('привет') || lowerQuestion.includes('здравств')) {
                return this.getGreeting();
            }

            if (lowerQuestion.includes('время') || lowerQuestion.includes('дата')) {
                return `🕰️ Сейчас: ${timeInfo.time}\n📅 Дата: ${timeInfo.date}`;
            }

            if (lowerQuestion.includes('система') || lowerQuestion.includes('устройств')) {
                return `💻 Твое устройство: ${systemInfo.deviceType}\n` +
                       `⚡ Мощность: ${systemInfo.powerLevel}\n` +
                       `🖥️ Браузер: ${systemInfo.browser}\n` +
                       `🔢 Процессорных ядер: ${systemInfo.cores}`;
            }

            if (lowerQuestion.includes('помощ') || lowerQuestion.includes('команды')) {
                let response = "📋 Доступные команды:\n";
                response += "• 'время' - текущее время\n";
                response += "• 'система' - информация об устройстве\n";
                
                if (hasFullAccess) {
                    response += "• 'семья' - о семье Голышевых\n";
                    response += "• 'дом' - о доме бабушки\n";
                    response += "• 'никита' - о создателе архива\n";
                } else {
                    response += "\n🔒 После входа в архив откроются команды о семье";
                }
                
                return response;
            }

            // ЗАЩИЩЕННЫЕ КОМАНДЫ (только после входа)
            if (!hasFullAccess) {
                if (lowerQuestion.includes('семья') || lowerQuestion.includes('голышев') || 
                    lowerQuestion.includes('никита') || lowerQuestion.includes('дом')) {
                    return "🔒 Эта информация будет доступна после ввода пароля в архив";
                }
                return "🤔 Интересный вопрос! Но подробности о семье доступны только после входа в архив.";
            }

            // ПОЛНЫЙ ДОСТУП (после входа)
            if (lowerQuestion.includes('семья') || lowerQuestion.includes('голышев')) {
                return `👨‍👩‍👦 Семья Голышевых:\n` +
                       `• Никита (18.02.2007) - создатель архива\n` +
                       `• Любовь Анатольевна (13.09.1986) - мать\n` +
                       `• Елена Николаевна (04.05.1956) - бабушка\n` +
                       `📊 Ваш статус: ${userRelation}`;
            }

            if (lowerQuestion.includes('никита')) {
                return "👦 Никита Голышев - создатель этого архива. Родился 18.02.2007 в Ленинске-Кузнецком.";
            }

            if (lowerQuestion.includes('дом') || lowerQuestion.includes('бабушк')) {
                return "🏠 Дом бабушки: переулок Самарский 15. Деревянный дом с баней и садом.";
            }

            return "🤔 Интересный вопрос! Попробуйте спросить о времени, системе или семье.";
        }
    };

    // Элементы помощника
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
            if (chatMessages.children.length === 0) {
                addMessage("🕰️ Помощник", SmartAssistant.getGreeting(), true);
            }
        }
    }

    function addMessage(sender, text, isAssistant = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isAssistant ? 'assistant-message' : 'user-message'}`;
        const formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${formattedText}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        addMessage("Вы", message);
        chatInput.value = '';
        
        setTimeout(() => {
            const response = SmartAssistant.getResponse(message, hasFullAccess, userRelation);
            addMessage("🕰️ Помощник", response, true);
        }, 500);
    }

    // События
    assistantBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', () => {
        assistantChat.classList.add('hidden');
    });
    sendBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    // Закрытие по клику вне чата
    document.addEventListener('click', (e) => {
        if (!assistantChat.contains(e.target) && 
            !assistantBtn.contains(e.target) && 
            e.target !== assistantBtn && 
            !assistantChat.classList.contains('hidden')) {
            assistantChat.classList.add('hidden');
        }
    });

    assistantInstance = SmartAssistant;
}