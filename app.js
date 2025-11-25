// app.js - Объединенная версия с рабочей идентификацией и аудио приветствием
const { useState, useEffect, useRef } = React;

// 🎵 СОКРАЩЕННОЕ АУДИО В BASE64 (сильно сжатая версия)
const AudioSystem = {
    // Сильно сокращенный Base64 (заглушка - в реальности нужно полноценное аудио)
    shortAudio: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQeBzWK1fLMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQeBzWK1fLMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQeBzWK1fLMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQeBzWK1fLMeSw=",
    
    // Текст для синхронизации с таймингами (в миллисекундах)
    subtitles: [
        { text: "Привет...", start: 0, end: 1500 },
        { text: "Ты попал в семейный архив Голышевых", start: 1500, end: 4000 },
        { text: "Это место хранит историю нашей семьи", start: 4000, end: 6500 },
        { text: "Для доступа нужно подтвердить родство", start: 6500, end: 9000 },
        { text: "Наслаждайся探索...", start: 9000, end: 11000 }
    ],
    
    audio: null,
    isPlaying: false,
    
    init() {
        this.audio = new Audio(this.shortAudio);
        this.audio.preload = "auto";
    },
    
    play(onProgress, onEnd) {
        if (!this.audio) this.init();
        
        this.audio.currentTime = 0;
        this.isPlaying = true;
        
        this.audio.play().then(() => {
            // Запускаем отслеживание прогресса
            const progressInterval = setInterval(() => {
                if (!this.isPlaying) {
                    clearInterval(progressInterval);
                    return;
                }
                
                const currentTime = this.audio.currentTime * 1000; // в миллисекундах
                onProgress(currentTime);
                
            }, 100);
            
            this.audio.onended = () => {
                this.isPlaying = false;
                clearInterval(progressInterval);
                onEnd();
            };
            
        }).catch(error => {
            console.log('Аудио не может быть воспроизведено:', error);
            this.isPlaying = false;
            onEnd();
        });
    },
    
    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        this.isPlaying = false;
    },
    
    // Получить текущий текст для отображения
    getCurrentText(currentTime) {
        for (const subtitle of this.subtitles) {
            if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
                return subtitle.text;
            }
        }
        return "";
    }
};

// 🎯 ТОЧНАЯ БАЗА ЧЛЕНОВ СЕМЬИ (исправленная версия из второго кода)
const FAMILY_DATABASE = {
    // Основное ядро семьи
    "Голышев Никита Викторович": {
        mother: "Голышева Любовь Анатольевна",
        father: "Голышев Виктор",
        birth: "18.02.2007"
    },
    "Голышева Любовь Анатольевна": {
        mother: "Голышева Елена Николаевна", 
        father: "Боронин Анатолий Никитович",
        birth: "13.09.1986"
    },
    "Голышева Елена Николаевна": {
        mother: "Голышева Александра Викторовна",
        father: "Голышев Никита Кириллович", 
        birth: "04.05.1956"
    },
    
    // Прародители
    "Голышев Никита Кириллович": {
        wife: "Голышева Александра Викторовна"
    },
    "Голышева Александра Викторовна": {
        alsoKnownAs: ["Голышева Александра Викторова"],
        husband: "Голышев Никита Кириллович"
    },
    
    // Боковые ветви - ИСПРАВЛЕННЫЕ СВЯЗИ
    "Голышева Наталья Сергеевна": {
        alsoKnownAs: ["Попова Наталья Сергеевна"],
        father: "Голышев Сергей Николаевич",
        mother: "Голышева Елена Николаевна",
        children: ["Голышева Валерия Сергеевна", "Голышев Вадим Сергеевич"]
    },
    "Попов Андрей": {
        mother: "Попова Наталья Сергеевна"
    },
    "Боронин Анатолий Никитович": {
        daughter: "Голышева Любовь Анатольевна"
    },
    
    // Вторая линия
    "Моторина Еремеева": {
        father: "Голышев Никита Кириллович"
    },
    "Голышев Виталий Владимирович": {
        mother: "Моторина Еремеева",
        wife: "Моторина Ирина Валерьевна"
    },
    "Моторина Ирина Валерьевна": {
        husband: "Голышев Виталий Владимирович"
    },
    "Голышев Евгений Витальевич": {
        mother: "Моторина Ирина Валерьевna",
        father: "Голышев Виталий Владимирович",
        birth: "11.09.1996",
        wife: "Голышева Анна"
    },
    "Голышева Анна": {
        husband: "Голышев Евгений Витальевич"
    },
    "Голышева Варвара": {
        mother: "Голышева Анna",
        father: "Голышев Евгений Витальевич"
    },
    
    // Линия отчима
    "Елгин Владислав Владимирович": {},
    "Елгина Елена Геннадьевна": {
        birth: "04.03.1970",
        husband: "Елгин Владислав Владимирович"
    },
    "Елгина Светлана Владиславовna": {
        birth: "03.06.1996",
        mother: "Елгина Елена Геннадьевna",
        father: "Елгин Владислав Владимирович"
    },
    
    // Дополнительные родственники
    "Елгин Роман": {},
    "Елгин Захар": {
        father: "Елгин Роман",
        mother: "Катя"
    },
    "Елгина Мира": {
        father: "Елгин Роман", 
        mother: "Катя"
    },
    
    // Двоюродные - ИСПРАВЛЕННЫЕ СВЯЗИ
    "Голышева Валерия Сергеевna": {
        alsoKnownAs: ["Кадошникова Валерия Сергеевna"],
        mother: "Голышева Наталья Сергеевna", // ИСПРАВЛЕНО: мать Наталья, не Любовь
        father: "Голышев Сергей"
    },
    "Голышев Вадим Сергеевич": {
        alsoKnownAs: ["Кадошников Вадим Сергеевич"],
        mother: "Голышева Наталья Сергеевna", // ИСПРАВЛЕНО: мать Наталья, не Любовь
        father: "Голышев Сергей"
    },
    "Голышев Макар Данилович": {
        alsoKnownAs: ["Кадошников Макар Данилович"],
        mother: "Голышева Валерия Сергеевna"
    }
};

// 🛡️ СИСТЕМА ВРЕМЕНИ (улучшенная версия из второго кода)
const TimeSystem = {
    startDate: new Date('2025-11-24'),
    timeFile: null,
    
    init() {
        this.createTimeFile();
        return this.verifyTimeIntegrity();
    },
    
    createTimeFile() {
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

TimeSystem.init();

// 🔎 УСИЛЕННАЯ ПРОВЕРКА РОДСТВЕННОЙ СВЯЗИ (исправленная версия из второго кода)
function verifyFamilyConnection(userData) {
    const { lastName, firstName, middleName, motherFirstName, motherLastName, motherMiddleName, fatherFirstName, fatherLastName, fatherMiddleName } = userData;
    
    const fullName = `${lastName} ${firstName} ${middleName || ''}`.trim();
    const motherFullName = `${motherLastName} ${motherFirstName} ${motherMiddleName || ''}`.trim();
    const fatherFullName = `${fatherLastName} ${fatherFirstName} ${fatherMiddleName || ''}`.trim();

    let relation = "неизвестно";
    let message = "❌ Связь с семьёй Голышевых не подтверждена";
    let success = false;

    // 🔐 ПРОВЕРКА 1: Прямое совпадение с базой
    if (FAMILY_DATABASE[fullName]) {
        success = true;
        relation = "прямой член семьи";
        message = `✅ Подтверждено: ${fullName} - прямой член семьи`;
    }

    // 🔐 ПРОВЕРКА 2: Проверка альтернативных имен
    if (!success) {
        for (const [key, data] of Object.entries(FAMILY_DATABASE)) {
            if (data.alsoKnownAs && data.alsoKnownAs.includes(fullName)) {
                success = true;
                relation = "прямой член семьи";
                message = `✅ Подтверждено: ${fullName} - известен также как ${key}`;
                break;
            }
        }
    }

    // 🔐 ПРОВЕРКА 3: Проверка через родителей (ИСПРАВЛЕННАЯ)
    if (!success && motherFirstName && fatherFirstName) {
        // Проверка по известным родительским парам (ОБНОВЛЕННЫЕ СВЯЗИ)
        const parentCombinations = [
            // Основная линия
            { mother: "Голышева Любовь Анатольевна", father: "Голышев Виктор", child: "Голышев Никита Викторович" },
            { mother: "Голышева Елена Николаевна", father: "Боронин Анатолий Никитович", child: "Голышева Любовь Анатольевна" },
            { mother: "Голышева Александра Викторовна", father: "Голышев Никита Кириллович", child: "Голышева Елена Николаевна" },
            
            // Боковая ветвь Натальи
            { mother: "Голышева Елена Николаевна", father: "Голышев Сергей Николаевич", child: "Голышева Наталья Сергеевна" },
            { mother: "Голышева Наталья Сергеевна", father: "Голышев Сергей", child: "Голышева Валерия Сергеевна" },
            { mother: "Голышева Наталья Сергеевna", father: "Голышев Сергей", child: "Голышев Вадим Сергеевич" },
            { mother: "Голышева Валерия Сергеевna", father: "", child: "Голышев Макар Данилович" },
            
            // Вторая линия
            { mother: "Моторина Еремеева", father: "", child: "Голышев Виталий Владимирович" },
            { mother: "Моторина Ирина Валерьевna", father: "Голышев Виталий Владимирович", child: "Голышев Евгений Витальевич" },
            { mother: "Голышева Анna", father: "Голышев Евгений Витальевич", child: "Голышева Варвара" }
        ];

        for (const combo of parentCombinations) {
            const motherMatch = combo.mother && (
                motherFullName.includes(combo.mother.split(' ')[1]) || 
                (combo.mother.includes("Александра Викторовна") && motherFullName.includes("Александра") && motherFullName.includes("Виктор"))
            );
            
            const fatherMatch = combo.father && fatherFullName.includes(combo.father.split(' ')[1]);
            
            if (motherMatch || fatherMatch) {
                success = true;
                relation = "потомок";
                message = `✅ Родственная связь подтверждена через родителей`;
                break;
            }
        }
    }

    // 🔐 ПРОВЕРКА 4: Проверка по фамилиям и редким именам
    if (!success) {
        const familyLastNames = ["Голышев", "Голышева", "Кадошников", "Кадошникова", "Моторина", "Елгин", "Елгина", "Боронин", "Попов", "Попова"];
        const rareFamilyNames = ["Никита", "Любовь", "Елена", "Валерия", "Вадим", "Макар", "Виталий", "Евгений", "Варвара", "Александра", "Анатолий", "Наталья", "Анна", "Сергей"];
        
        if (familyLastNames.includes(lastName) && rareFamilyNames.includes(firstName)) {
            success = true;
            relation = "возможный родственник";
            message = `✅ Фамилия и имя характерны для семьи Голышевых`;
        }
    }

    // 🔐 ПРОВЕРКА 5: Дополнительная информация
    if (!success && userData.additionalInfo) {
        const keywords = ["голышев", "голышева", "самарский", "ленинск", "никита", "любовь", "елена", "валерия", "вадим", "макар", "наталья", "попова", "кадошников"];
        const infoLower = userData.additionalInfo.toLowerCase();
        
        let keywordCount = 0;
        keywords.forEach(keyword => {
            if (infoLower.includes(keyword)) keywordCount++;
        });
        
        if (keywordCount >= 2) {
            success = true;
            relation = "родственник";
            message = `✅ Связь подтверждена через дополнительную информацию`;
        }
    }

    // 🚫 ЕСЛИ ВСЕ ПРОВЕРКИ ПРОВАЛЕНЫ - ДОСТУП ЗАПРЕЩЕН
    if (!success) {
        return {
            success: false,
            relation: "доступ запрещен",
            message: "🚫 Доступ запрещен. Предоставленные данные не подтверждают связь с семьёй Голышевых."
        };
    }

    return {
        success: true,
        relation,
        message
    };
}

// 🎪 ОСНОВНОЙ КОМПОНЕНТ (из первого кода с аудио)
function FamilyArchive() {
    const [currentScreen, setCurrentScreen] = useState('welcome');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRelation, setUserRelation] = useState('неизвестно');
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [timeMessage, setTimeMessage] = useState('');
    const [audioText, setAudioText] = useState('');
    const [showAudioText, setShowAudioText] = useState(false);

    const CORRECT_PASSWORD = "18022007";

    useEffect(() => {
        setTimeMessage(TimeSystem.getTimeMessage());
        AudioSystem.init();
        
        const interval = setInterval(() => {
            setTimeMessage(TimeSystem.getTimeMessage());
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

    // 🎵 Запуск аудио при загрузке welcome экрана
    useEffect(() => {
        if (currentScreen === 'welcome') {
            const playAudio = () => {
                AudioSystem.play(
                    // onProgress - обновляем текст в реальном времени
                    (currentTime) => {
                        const text = AudioSystem.getCurrentText(currentTime);
                        setAudioText(text);
                        setShowAudioText(true);
                    },
                    // onEnd - скрываем текст когда аудио закончилось
                    () => {
                        setTimeout(() => {
                            setShowAudioText(false);
                            setAudioText('');
                        }, 1000);
                    }
                );
            };

            // Запускаем аудио сразу
            playAudio();
        }
    }, [currentScreen]);

    const proceedToAuth = () => {
        AudioSystem.stop();
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
        setCurrentScreen('welcome');
        setUserName('');
        setUserRelation('неизвестно');
        setPassword('');
        setUserData(null);
    };

    const replayAudio = () => {
        AudioSystem.stop();
        setTimeout(() => {
            AudioSystem.play(
                (currentTime) => {
                    const text = AudioSystem.getCurrentText(currentTime);
                    setAudioText(text);
                    setShowAudioText(true);
                },
                () => {
                    setTimeout(() => {
                        setShowAudioText(false);
                        setAudioText('');
                    }, 1000);
                }
            );
        }, 100);
    };

    return (
        <div className="react-app">
            {/* 🎵 Баннер с текстом аудио */}
            {showAudioText && (
                <div className="audio-banner">
                    <div className="audio-text">{audioText}</div>
                    <div className="audio-pulse"></div>
                </div>
            )}

            {!isLoggedIn ? (
                <>
                    {currentScreen === 'welcome' && (
                        <WelcomeScreen onProceed={proceedToAuth} timeMessage={timeMessage} onReplayAudio={replayAudio} />
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

// 🎭 ЭКРАН ПРИВЕТСТВИЯ С АУДИО (из первого кода)
function WelcomeScreen({ onProceed, timeMessage, onReplayAudio }) {
    return (
        <div className="welcome-container">
            <div className="welcome-overlay">
                <div className="welcome-content">
                    <div className="header-section">
                        <h1>🕰️ СЕМЕЙНЫЙ АРХИВ</h1>
                        <h2>ГОЛЫШЕВЫХ</h2>
                        <div className="time-message">{timeMessage}</div>
                    </div>
                    
                    <div className="welcome-message">
                        <div className="message-section">
                            <h3>🔐 ЗАЩИЩЕННОЕ ХРАНИЛИЩЕ</h3>
                            <p>Цифровая летопись семьи через поколения</p>
                        </div>

                        <div className="message-section">
                            <h3>🌳 ДРЕВО ПАМЯТИ</h3>
                            <p>Истории, традиции и наследие рода Голышевых</p>
                        </div>

                        <div className="message-section">
                            <h3>🔍 ТОЛЬКО ДЛЯ СВОИХ</h3>
                            <p>Доступ предоставляется после подтверждения родства</p>
                        </div>
                    </div>

                    <div className="welcome-actions">
                        <button onClick={onProceed} className="submit-btn main-action">
                            🚀 НАЧАТЬ ИДЕНТИФИКАЦИЮ
                        </button>
                        <button onClick={onReplayAudio} className="replay-btn">
                            🔄 Повторить приветствие
                        </button>
                    </div>

                    <div className="welcome-footer">
                        <p>«Память о предках — это дар, который мы передаём потомкам»</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 📝 КОМПОНЕНТ АУТЕНТИФИКАЦИИ (из первого кода)
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
        additionalInfo: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.firstName || formData.firstName.trim().length < 2) {
            alert('❌ Пожалуйста, введите ваше имя');
            return;
        }

        if (!formData.lastName || formData.lastName.trim().length < 2) {
            alert('❌ Пожалуйста, введите вашу фамилию');
            return;
        }

        if (!formData.birthDate || formData.birthDate.trim().length < 4) {
            alert('❌ Пожалуйста, введите дату рождения');
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
                            placeholder="Дата рождения * (дд.мм.гггг)"
                        />
                    </div>
                    
                    <div className="form-section">
                        <h3>👩 Данные матери</h3>
                        <input 
                            type="text" 
                            value={formData.motherLastName}
                            onChange={(e) => handleInputChange('motherLastName', e.target.value)}
                            placeholder="Фамилия матери"
                        />
                        <input 
                            type="text" 
                            value={formData.motherFirstName}
                            onChange={(e) => handleInputChange('motherFirstName', e.target.value)}
                            placeholder="Имя матери"
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
                            placeholder="Фамилия отца"
                        />
                        <input 
                            type="text" 
                            value={formData.fatherFirstName}
                            onChange={(e) => handleInputChange('fatherFirstName', e.target.value)}
                            placeholder="Имя отца"
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
                </div>
            </div>
        </div>
    );
}

// 🔐 КОМПОНЕНТ ВХОДА (из первого кода)
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
                                {userData.firstName} {userData.middleName || ''} - {userData.relation}
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

// 🏠 КОМПОНЕНТ ИНФОРМАЦИИ О СЕМЬЕ (из первого кода)
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
                Родился 18.02.2007 года в Ленинске-Кузнецком</p>
            </div>
            
            <div className="message-section">
                <h3>👨‍👩‍👦 Ближайшая семья</h3>
                <p><strong>Мать:</strong> Голышева Любовь Анатольевна (13.09.1986 г.р.)</p>
                <p><strong>Бабушка:</strong> Голышева Елена Николаевна (04.05.1956 г.р.)</p>
            </div>

            <div className="message-section">
                <h3>👨‍👩‍👧‍👦 Двоюродные родственники</h3>
                <p><strong>Двоюродная сестра:</strong> Голышева/Кадошникова Валерия Сергеевна</p>
                <p><strong>Двоюродный брат:</strong> Голышев/Кадошников Вадим Сергеевич</p>
                <p><strong>Сын Валерии:</strong> Голышев/Кадошников Макар Данилович</p>
            </div>

            <div className="message-section">
                <h3>🏠 Дом бабушки</h3>
                <p>Переулок Самарский 15 - деревянный дом с баней, колодцем и садом.</p>
            </div>
        </div>
    );
}

// 🤖 КОМПОНЕНТ ПОМОЩНИКА (из первого кода)
function SmartAssistant({ isLoggedIn }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const knowledgeBase = {
        "привет": "Привет! 👋 Я помощник семейного архива Голышевых.",
        "никита": isLoggedIn ? "👦 Голышев Никита Викторович\n• Родился: 18.02.2007\n• Создатель архива" : "🔒 Информация доступна после входа",
        "любовь": isLoggedIn ? "👩 Голышева Любовь Анатольевна\n• Родилась: 13.09.1986\n• Мать Никиты" : "🔒 Информация доступна после входа",
        "дом": isLoggedIn ? "🏠 Дом бабушки:\n• Адрес: переулок Самарский 15" : "🔒 Информация доступна после входа",
        "помощь": "Я могу рассказать об архиве. После входа откроются дополнительные возможности."
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;
        
        addMessage("Вы", inputMessage);
        const userMessage = inputMessage;
        setInputMessage('');
        
        setTimeout(() => {
            const response = knowledgeBase[userMessage.toLowerCase()] || 
                (isLoggedIn ? 
                    "🤔 Интересный вопрос! Пока моя база знаний ограничена семейной историей." :
                    "🔒 Для доступа к информации необходимо войти в архив.");
            addMessage("🕰️ Помощник", response, true);
        }, 500);
    };

    const addMessage = (sender, text, isAssistant = false) => {
        const newMessage = { 
            id: Date.now() + Math.random(), 
            sender, 
            text, 
            isAssistant 
        };
        setMessages(prev => [...prev, newMessage]);
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
                        <button id="close-chat" onClick={() => setIsChatOpen(false)}>
                            ×
                        </button>
                    </div>
                    
                    <div id="chat-messages">
                        {messages.map(message => (
                            <div key={message.id} className={`message ${message.isAssistant ? 'assistant-message' : 'user-message'}`}>
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
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isLoggedIn ? "Задайте вопрос о семье..." : "Базовые вопросы..."}
                        />
                        <button onClick={handleSendMessage}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<FamilyArchive />, document.getElementById('root'));