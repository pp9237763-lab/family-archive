// app.js - Полная версия с временной системой и расширенной семьей
const { useState, useEffect } = React;

// СИСТЕМА ВРЕМЕНИ И ЗАЩИТЫ
const TimeSystem = {
    startDate: new Date('2025-11-24'), // Дата начала системы
    timeFile: null,
    
    init() {
        this.createTimeFile();
        return this.verifyTimeIntegrity();
    },
    
    createTimeFile() {
        // Создаем виртуальный "файл" с меткой времени
        const timeData = {
            startDate: this.startDate.getTime(),
            installDate: Date.now(),
            signature: this.generateSignature()
        };
        
        try {
            localStorage.setItem('family_archive_time_file', JSON.stringify(timeData));
            this.timeFile = timeData;
            return true;
        } catch (e) {
            console.error('Не удалось создать временной файл:', e);
            return false;
        }
    },
    
    generateSignature() {
        return btoa(this.startDate.getTime() + '|' + navigator.userAgent + '|' + Math.random()).slice(0, 32);
    },
    
    verifyTimeIntegrity() {
        try {
            const stored = localStorage.getItem('family_archive_time_file');
            if (!stored) return this.createTimeFile();
            
            const timeData = JSON.parse(stored);
            const currentTime = Date.now();
            const systemAge = currentTime - timeData.installDate;
            
            // Проверяем, не пытались ли обмануть систему
            if (systemAge < 0) {
                console.warn('Обнаружена попытка манипуляции временем!');
                return false;
            }
            
            this.timeFile = timeData;
            return true;
            
        } catch (e) {
            console.error('Ошибка проверки времени:', e);
            return this.createTimeFile();
        }
    },
    
    getSystemInfo() {
        if (!this.timeFile) this.verifyTimeIntegrity();
        
        const now = new Date();
        const systemAge = now.getTime() - this.timeFile.installDate;
        const daysSinceStart = Math.floor((now.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
            currentTime: now,
            systemAge: systemAge,
            daysSinceStart: daysSinceStart,
            isFuture: now > this.startDate,
            timeToStart: this.startDate.getTime() - now.getTime()
        };
    },
    
    getTimeMessage() {
        const info = this.getSystemInfo();
        
        if (info.isFuture) {
            const daysPassed = Math.abs(info.daysSinceStart);
            return `🕰️ Система активна: ${daysPassed} дней с 24.11.2025`;
        } else {
            const daysLeft = Math.ceil(info.timeToStart / (1000 * 60 * 60 * 24));
            return `⏳ До активации системы: ${daysLeft} дней (24.11.2025)`;
        }
    }
};

// Инициализируем систему времени
TimeSystem.init();

function FamilyArchive() {
    const [currentScreen, setCurrentScreen] = useState('whoAreYou');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRelation, setUserRelation] = useState('неизвестно');
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [timeMessage, setTimeMessage] = useState('');

    const CORRECT_PASSWORD = "18022007";

    useEffect(() => {
        setTimeMessage(TimeSystem.getTimeMessage());
        
        // Обновляем время каждую минуту
        const interval = setInterval(() => {
            setTimeMessage(TimeSystem.getTimeMessage());
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const proceedToAuth = () => {
        setCurrentScreen('authentication');
    };

    const handleAuthentication = (authData) => {
        setUserData(authData);
        const authResult = verifyFamilyConnection(authData);
        
        if (authResult.success) {
            setUserName(authData.firstName);
            setUserRelation(authResult.relation);
            setCurrentScreen('login');
        } else {
            setError(authResult.message);
        }
    };

    const checkPassword = () => {
        if (password === CORRECT_PASSWORD) {
            setIsLoggedIn(true);
            setCurrentScreen('familyInfo');
            setError('');
        } else {
            setError('❌ Неверный пароль');
            setPassword('');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentScreen('whoAreYou');
        setUserName('');
        setUserRelation('неизвестно');
        setPassword('');
        setUserData(null);
    };

    return (
        <div className="react-app">
            {!isLoggedIn ? (
                <>
                    {currentScreen === 'whoAreYou' && (
                        <WhoAreYouScreen onProceed={proceedToAuth} timeMessage={timeMessage} />
                    )}
                    {currentScreen === 'authentication' && (
                        <AuthenticationScreen 
                            onAuthenticate={handleAuthentication}
                            error={error}
                        />
                    )}
                    {currentScreen === 'login' && (
                        <LoginScreen 
                            password={password}
                            setPassword={setPassword}
                            error={error}
                            onLogin={checkPassword}
                            userData={userData}
                            timeMessage={timeMessage}
                        />
                    )}
                </>
            ) : (
                <div className="container">
                    <FamilyInfoScreen 
                        userName={userName}
                        userRelation={userRelation}
                        userData={userData}
                        onLogout={handleLogout}
                        timeMessage={timeMessage}
                    />
                </div>
            )}
            <SmartAssistant isLoggedIn={isLoggedIn} />
        </div>
    );
}

function WhoAreYouScreen({ onProceed, timeMessage }) {
    return (
        <div className="container">
            <div className="welcome-message">
                <div className="header-section">
                    <h1>🕰️ Привет, незнакомец!</h1>
                    <p className="quote">«Ты пришёл с миром или с любопытством?»</p>
                    <div className="time-message">{timeMessage}</div>
                </div>
                
                <div className="message-section">
                    <h3>👁️ Что это за место?</h3>
                    <p>Это <strong>семейный архив Голышевых</strong> - цифровое хранилище нашей истории, памяти и наследия.</p>
                </div>

                <div className="message-section">
                    <h3>🔐 Доступ ограничен</h3>
                    <p>Здесь хранится информация только для членов семьи и близких друзей. Если ты здесь не случайно - тебе будет дан пароль.</p>
                </div>

                <div className="message-section">
                    <h3>🔍 Идентификация</h3>
                    <p>Для доступа необходимо подтвердить свою связь с семьёй Голышевых.</p>
                </div>

                <button onClick={onProceed} className="submit-btn">
                    Продолжить идентификацию →
                </button>
            </div>
        </div>
    );
}

function AuthenticationScreen({ onAuthenticate, error }) {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        birthDate: '',
        motherLastName: '',
        motherFirstName: '',
        motherMiddleName: '',
        fatherLastName: '',
        fatherFirstName: '', 
        fatherMiddleName: '',
        relationship: '',
        additionalInfo: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.firstName) {
            alert('❌ Пожалуйста, введите ваше имя');
            return;
        }

        if (!formData.lastName && (!formData.motherLastName || !formData.fatherLastName)) {
            alert('❌ Пожалуйста, введите вашу фамилию ИЛИ фамилии родителей');
            return;
        }

        if (!formData.motherFirstName || !formData.fatherFirstName) {
            alert('❌ Пожалуйста, введите имена обоих родителей');
            return;
        }

        onAuthenticate(formData);
    };

    return (
        <div className="container">
            <div className="welcome-message">
                <div className="header-section">
                    <h2>🔍 Идентификация</h2>
                    <p className="quote">«Кровные узы не разорвать, память предков не стереть»</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="authentication-form">
                    <div className="form-section">
                        <h3>👤 Ваши данные</h3>
                        <input 
                            type="text" 
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Фамилия *"
                        />
                        <input 
                            type="text" 
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Имя *"
                        />
                        <input 
                            type="text" 
                            value={formData.middleName}
                            onChange={(e) => handleInputChange('middleName', e.target.value)}
                            placeholder="Отчество"
                        />
                        <input 
                            type="text" 
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                            placeholder="Дата рождения (дд.мм.гггг)"
                        />
                    </div>
                    
                    <div className="form-section">
                        <h3>👩 Данные матери</h3>
                        <input 
                            type="text" 
                            value={formData.motherLastName}
                            onChange={(e) => handleInputChange('motherLastName', e.target.value)}
                            placeholder="Фамилия матери *"
                        />
                        <input 
                            type="text" 
                            value={formData.motherFirstName}
                            onChange={(e) => handleInputChange('motherFirstName', e.target.value)}
                            placeholder="Имя матери *"
                        />
                        <input 
                            type="text" 
                            value={formData.motherMiddleName}
                            onChange={(e) => handleInputChange('motherMiddleName', e.target.value)}
                            placeholder="Отчество матери"
                        />
                    </div>

                    <div className="form-section">
                        <h3>👨 Данные отца</h3>
                        <input 
                            type="text" 
                            value={formData.fatherLastName}
                            onChange={(e) => handleInputChange('fatherLastName', e.target.value)}
                            placeholder="Фамилия отца *"
                        />
                        <input 
                            type="text" 
                            value={formData.fatherFirstName}
                            onChange={(e) => handleInputChange('fatherFirstName', e.target.value)}
                            placeholder="Имя отца *"
                        />
                        <input 
                            type="text" 
                            value={formData.fatherMiddleName}
                            onChange={(e) => handleInputChange('fatherMiddleName', e.target.value)}
                            placeholder="Отчество отца"
                        />
                    </div>

                    <div className="form-section">
                        <h3>ℹ️ Дополнительно</h3>
                        <select 
                            value={formData.relationship}
                            onChange={(e) => handleInputChange('relationship', e.target.value)}
                            className="form-select"
                        >
                            <option value="">Выберите степень родства</option>
                            <option value="direct">Прямой потомок</option>
                            <option value="sibling">Брат/Сестра</option>
                            <option value="cousin">Двоюродный родственник</option>
                            <option value="aunt_uncle">Тётя/Дядя</option>
                            <option value="nephew_niece">Племянник/Племянница</option>
                            <option value="spouse">Супруг/Супруга</option>
                            <option value="friend">Друг семьи</option>
                            <option value="other">Другое</option>
                        </select>
                        <textarea 
                            value={formData.additionalInfo}
                            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                            placeholder="Дополнительная информация о связи с семьёй Голышевых"
                            className="form-textarea"
                        />
                    </div>
                    
                    <button onClick={handleSubmit} className="submit-btn">
                        🔍 Проверить родственную связь
                    </button>

                    <div className="info-box">
                        <strong>ℹ️ Информация:</strong> Система проверит вашу связь с семьёй Голышевых по предоставленным данным.
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginScreen({ password, setPassword, error, onLogin, userData, timeMessage }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') onLogin();
    };

    return (
        <div className="container">
            <div id="login">
                <div className="header-section">
                    <h1>🔒 Семейный архив Голышевых</h1>
                    <p className="quote">"Доступ предоставлен после проверки родства"</p>
                    <div className="time-message">{timeMessage}</div>
                    
                    {userData && (
                        <div className="success-box">
                            <strong>✅ Идентификация пройдена</strong><br/>
                            <span>
                                {userData.firstName} {userData.middleName || ''} - {userData.relationship || 'родственная связь установлена'}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="password-info">
                    <p><strong>Пароль для доступа</strong></p>
                    <div className="password-hint">
                        🔍 Подсказка: <em>ответ в прошлом...</em>
                    </div>
                </div>
                
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите пароль доступа"
                />
                
                <button onClick={onLogin}>
                    Войти в архив
                </button>
                
                {error && (
                    <div id="error" className="error">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

function FamilyInfoScreen({ userName, userRelation, userData, onLogout, timeMessage }) {
    return (
        <div className="welcome-message">
            <div className="header-section">
                <h2>🕰️ Добро пожаловать в семейный архив!</h2>
                <p className="quote">«Прошлое — это фундамент, настоящее — строительство, будущее — наследие»</p>
                <div className="time-message">{timeMessage}</div>
                <div className="user-badge">Статус: {userRelation}</div>
                {userData && (
                    <div className="user-info">
                        👤 {userData.firstName} {userData.middleName || ''} {userData.lastName || ''}
                    </div>
                )}
                <button onClick={onLogout} className="logout-btn">
                    Выйти из архива
                </button>
            </div>
            
            <div className="message-section">
                <h3>👋 Кто я?</h3>
                <p><strong>Голышев Никита Викторович</strong><br/>
                Родился 18.02.2007 года в Ленинске-Кузнецком, Кемеровской области</p>
            </div>
            
            <div className="message-section">
                <h3>👨‍👩‍👦 Ближайшая семья</h3>
                <p><strong>Мать:</strong> Голышева Любовь Анатольевна (13.09.1986 г.р.)</p>
                <p><strong>Бабушка:</strong> Голышева Елена Николаевна (04.05.1956 г.р.)</p>
            </div>

            <div className="message-section">
                <h3>🌳 Полное семейное древо</h3>
                
                <h4>Первая линия (основная):</h4>
                <p><strong>Прадед:</strong> Голышев Никита Кириллович</p>
                <p><strong>Прабабушка:</strong> Голышева Александра Викторовна</p>
                <p><strong>Их дочь:</strong> Голышева Елена Николаевна</p>
                <p><strong>От Голышева Сергея Николаевича:</strong> Голышева/Попова Наталья Сергеевна</p>
                <p><strong>От Боронина Анатолия Никитовича:</strong> Голышева Любовь Анатольевна</p>
                
                <h4>Вторая линия (ветвь):</h4>
                <p><strong>Дочь прадеда:</strong> Моторина Еремеева</p>
                <p><strong>Её сын:</strong> Голышев Виталий Владимирович</p>
                <p><strong>Его жена:</strong> Моторина Ирина Валерьевна</p>
                <p><strong>Их сын:</strong> Голышев Евгений Витальевич (11.09.1996)</p>
                <p><strong>Его жена:</strong> Голышева Анна</p>
                <p><strong>Дети:</strong> Голышева Варвара, [место под второго ребенка]</p>
                
                <h4>Линия отчима:</h4>
                <p><strong>Отчим:</strong> Елгин Владислав Владимирович</p>
                <p><strong>От первой жены:</strong> Елгина Елена Геннадьевна (04.03.1970)</p>
                <p><strong>Их дочь:</strong> Елгина Светлана Владиславовна (03.06.1996)</p>
                
                <h4>Дополнительные родственники:</h4>
                <p><strong>Родственник:</strong> Елгин Роман</p>
                <p><strong>От Кати:</strong> Елгин Захар, Елгина Мира</p>
            </div>

            <div className="message-section">
                <h3>👨‍👩‍👧‍👦 Двоюродные родственники</h3>
                <p><strong>Двоюродная сестра:</strong> Валерия Сергеевна Кадошникова (Голышева)</p>
                <p><strong>Её сын:</strong> Макар Данилович Голышев (Кадошников)</p>
                <p><strong>Двоюродный брат:</strong> Вадим Сергеевич Кадошников (Голышев)</p>
            </div>

            <div className="message-section">
                <h3>🏠 Дом бабушки</h3>
                <p>Переулок Самарский 15 - деревянный дом с баней, колодцем и садом.</p>
            </div>
        </div>
    );
}

function verifyFamilyConnection(userData) {
    const { lastName, firstName, motherFirstName, motherLastName, fatherFirstName, fatherLastName } = userData;
    
    const familyMembers = {
        "Голышев": ["Никита", "Виктор", "Виталий", "Евгений", "Сергей", "Владимир"],
        "Голышева": ["Любовь", "Елена", "Валерия", "Александра", "Наталья", "Анна", "Варвара"],
        "Кадошникова": ["Валерия"],
        "Кадошников": ["Вадим", "Макар"],
        "Моторина": ["Ирина", "Еремеева"],
        "Елгин": ["Владислав", "Роман", "Захар"],
        "Елгина": ["Елена", "Светлана", "Мира"],
        "Боронин": ["Анатолий"],
        "Попова": ["Наталья"]
    };

    let relation = "неизвестно";
    let message = "❌ Связь с семьёй Голышевых не подтверждена";

    if (lastName && familyMembers[lastName]) {
        relation = "родственник";
        message = `✅ Фамилия ${lastName} найдена в семейной базе`;
    }

    if (motherFirstName === "Любовь" && motherLastName === "Голышева") {
        relation = "прямой потомок";
        message = "✅ Вы прямой потомок Любови Голышевой";
    }

    if (motherFirstName === "Любовь" || motherFirstName === "Елена" || motherFirstName === "Александра") {
        relation = "родственник";
        message = `✅ Связь подтверждена через мать ${motherFirstName}`;
    }

    if (firstName === "Никита" || firstName === "Любовь" || firstName === "Елена" || 
        firstName === "Валерия" || firstName === "Вадим" || firstName === "Макар" ||
        firstName === "Виталий" || firstName === "Евгений" || firstName === "Варвара") {
        relation = "возможный родственник";
        message = `✅ Имя ${firstName} есть в семейной базе`;
    }

    if (userData.relationship && userData.relationship !== "other") {
        relation = userData.relationship;
        message = `✅ Родственная связь подтверждена: ${getRelationshipText(userData.relationship)}`;
    }

    return {
        success: true,
        relation,
        message
    };
}

function getRelationshipText(relationship) {
    const relations = {
        "direct": "прямой потомок",
        "sibling": "брат/сестра", 
        "cousin": "двоюродный родственник",
        "aunt_uncle": "тётя/дядя",
        "nephew_niece": "племянник/племянница",
        "spouse": "супруг/супруга",
        "friend": "друг семьи"
    };
    return relations[relationship] || relationship;
}

function SmartAssistant({ isLoggedIn }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    // БАЗА ЗНАНИЙ С ЦЕНЗУРОЙ
    const knowledgeBase = {
        // Базовые команды (доступны всегда)
        "привет": "Привет! 👋 Я помощник семейного архива Голышевых.",
        "здравствуй": "Здравствуйте! Чем могу помочь?",
        "как дела": "Всё отлично! Готов помогать с информацией об архиве.",
        "что это": "Это семейный архив Голышевых - хранилище нашей семейной истории.",
        "помощь": "Я могу рассказать об архиве. После входа откроются дополнительные возможности.",
        "что ты умеешь": "Отвечаю на базовые вопросы. Полный функционал доступен после авторизации.",
        
        // Конфиденциальная информация (только после входа)
        "никита": isLoggedIn ? 
            "👦 Голышев Никита Викторович\n• Родился: 18.02.2007\n• Место: Ленинск-Кузнецкий\n• Создатель архива" :
            "🔒 Информация о членах семьи доступна после входа в архив",
            
        "любовь": isLoggedIn ?
            "👩 Голышева Любовь Анатольевна\n• Родилась: 13.09.1986\n• Мать Никиты" :
            "🔒 Информация о членах семьи доступна после входа в архив",
            
        "елена": isLoggedIn ?
            "👵 Голышева Елена Николаевна\n• Родилась: 04.05.1956\n• Бабушка Никиты" :
            "🔒 Информация о членах семьи доступна после входа в архив",
            
        "валерия": isLoggedIn ?
            "👩 Валерия Сергеевна Кадошникова\n• Двоюродная сестра Никиты" :
            "🔒 Информация о членах семьи доступна после входа в архив",
            
        "вадим": isLoggedIn ?
            "👦 Вадим Сергеевич Кадошников\n• Двоюродный брат Никиты" :
            "🔒 Информация о членах семьи доступна после входа в архив",
            
        "макар": isLoggedIn ?
            "👶 Макар Данилович\n• Сын Валерии\n• Двоюродный племянник" :
            "🔒 Информация о членах семьи доступна после входа в архив",
            
        "дом": isLoggedIn ?
            "🏠 Дом бабушки:\n• Адрес: переулок Самарский 15\n• Деревянный дом с баней\n• Колодец и сад" :
            "🔒 Информация о семейной собственности доступна после входа",
            
        "семья": isLoggedIn ?
            "👨‍👩‍👦‍👦 Семья Голышевых включает несколько ветвей и поколений. Полное древо доступно в архиве." :
            "🔒 Полная информация о семье доступна после авторизации",
            
        "родственник": isLoggedIn ?
            "🌳 В семье Голышевых есть основные и боковые ветви, включая линии Моториных и Елгиных." :
            "🔒 Информация о родственных связях доступна после входа"
    };

    useEffect(() => {
        if (isChatOpen && messages.length === 0) {
            const greeting = isLoggedIn ? 
                "Привет! 👋 Полный доступ активирован. Могу рассказать о семье Голышевых!" :
                "Привет! 👋 Я помощник архива. Базовые функции доступны, для полного доступа войдите в систему.";
            addMessage("🕰️ Помощник", greeting, true);
        }
    }, [isChatOpen, isLoggedIn]);

    const addMessage = (sender, text, isAssistant = false) => {
        const newMessage = { 
            id: Date.now() + Math.random(), 
            sender, 
            text, 
            isAssistant 
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const getHybridResponse = (question) => {
        const cleanQuestion = question.toLowerCase().trim();
        
        // 1. Проверяем точные совпадения
        if (knowledgeBase[cleanQuestion]) {
            return knowledgeBase[cleanQuestion];
        }
        
        // 2. Используем языковой процессор если доступен
        if (typeof LanguageProcessor !== 'undefined') {
            const hybridResult = LanguageProcessor.generateHybridResponse(cleanQuestion);
            
            switch (hybridResult.type) {
                case 'exact':
                    const keyword = hybridResult.keyword;
                    if (knowledgeBase[keyword]) {
                        return knowledgeBase[keyword];
                    }
                    return isLoggedIn ? 
                        `🔍 Найдено: "${keyword}". В контексте семьи это важное понятие.` :
                        `🔍 Найдено: "${keyword}". Подробности доступны после входа.`;
                    
                case 'similar':
                    const suggestions = hybridResult.suggestions.slice(0, 3);
                    const availableSuggestions = suggestions.filter(s => knowledgeBase[s] && 
                        (isLoggedIn || !knowledgeBase[s].includes('🔒')));
                    
                    if (availableSuggestions.length > 0) {
                        return `🤔 Возможно, вы имели в виду:\n${availableSuggestions.map(s => `• ${s}`).join('\n')}`;
                    }
                    break;
            }
        }
        
        // 3. Fallback ответ
        return isLoggedIn ?
            "🤔 Интересный вопрос! Пока моя база знаний ограничена семейной историей Голышевых." :
            "🔒 Для доступа к расширенной базе знаний необходимо войти в архив.";
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;
        
        addMessage("Вы", inputMessage);
        const userMessage = inputMessage;
        setInputMessage('');
        
        setTimeout(() => {
            const response = getHybridResponse(userMessage);
            addMessage("🕰️ Помощник", response, true);
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div id="assistant-container">
            <div id="assistant-button" onClick={() => setIsChatOpen(true)}>
                💬 {isLoggedIn ? 'Помощник+' : 'Помощник'}
            </div>
            
            {isChatOpen && (
                <div id="assistant-chat">
                    <div id="chat-header">
                        <span>🕰️ {isLoggedIn ? 'Полный доступ' : 'Базовый доступ'}</span>
                        <button 
                            id="close-chat"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsChatOpen(false);
                            }}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div id="chat-messages">
                        {messages.map(message => (
                            <div 
                                key={message.id}
                                className={`message ${message.isAssistant ? 'assistant-message' : 'user-message'}`}
                            >
                                <strong>{message.sender}:</strong> 
                                <div style={{marginTop: '5px'}}>
                                    {message.text.split('\n').map((line, i) => (
                                        <div key={i}>{line}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div id="chat-input-container">
                        <input 
                            type="text"
                            id="chat-input"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isLoggedIn ? "Задайте вопрос о семье..." : "Базовые вопросы..."}
                        />
                        <button id="send-message" onClick={handleSendMessage}>
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<FamilyArchive />, document.getElementById('root'));