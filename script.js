document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const accessCodeInput = document.getElementById('access-code');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loginSection = document.getElementById('login-section');
    const loadingSection = document.getElementById('loading-section');
    
    // Configuración
    const CODE_PREFIX = 'PAST-';
    const CODE_REGEX = /^PAST-[A-Z0-9]{4}$/;
    const MAX_ATTEMPTS = 5;
    const BLOCK_TIME = 30000; // 30 segundos
    const MAX_DEVICES = 3;
    
    // Nuevos códigos válidos (formato simplificado PAST-XXXX)
    const VALID_CODES = [
        "PAST-1W3E", "PAST-2R4T", "PAST-3E5Y", "PAST-4T6U", "PAST-5Y7I",
        "PAST-6U8O", "PAST-7I9P", "PAST-8O0A", "PAST-9P1S", "PAST-0A2D",
        "PAST-QW3F", "PAST-WE4G", "PAST-ER5H", "PAST-RT6J", "PAST-TY7K",
        "PAST-YU8L", "PAST-UI9Z", "PAST-IO0X", "PAST-OP1C", "PAST-PA2V",
        "PAST-AS3B", "PAST-SD4N", "PAST-DF5M", "PAST-FG6Q", "PAST-GH7W",
        "PAST-HJ8E", "PAST-JK9R", "PAST-KL0T", "PAST-LZ1Y", "PAST-ZX2U",
        "PAST-XC3I", "PAST-CV4O", "PAST-VB5P", "PAST-BN6A", "PAST-NM7S",
        "PAST-MQ8D", "PAST-QW9F", "PAST-WE0G", "PAST-ER1H", "PAST-RT2J",
        "PAST-TY3K", "PAST-YU4L", "PAST-UI5Z", "PAST-IO6X", "PAST-OP7C",
        "PAST-PA8V", "PAST-AS9B", "PAST-SD0N", "PAST-DF1M", "PAST-FG2Q",
        "PAST-GH3W", "PAST-HJ4E", "PAST-JK5R", "PAST-KL6T", "PAST-LZ7Y",
        "PAST-ZX8U", "PAST-XC9I", "PAST-CV0O", "PAST-VB1P", "PAST-BN2A",
        "PAST-NM3S", "PAST-MQ4D", "PAST-QW5F", "PAST-WE6G", "PAST-ER7H",
        "PAST-RT8J", "PAST-TY9K", "PAST-YU0L", "PAST-UI1Z", "PAST-IO2X",
        "PAST-OP3C", "PAST-PA4V", "PAST-AS5B", "PAST-SD6N", "PAST-DF7M",
        "PAST-FG8Q", "PAST-GH9W", "PAST-HJ0E", "PAST-JK1R", "PAST-KL2T",
        "PAST-LZ3Y", "PAST-ZX4U", "PAST-XC5I", "PAST-CV6O", "PAST-VB7P",
        "PAST-BN8A", "PAST-NM9S", "PAST-MQ0D", "PAST-QW1F", "PAST-WE2G",
        "PAST-ER3H", "PAST-RT4J", "PAST-TY5K", "PAST-YU6L", "PAST-UI7Z",
        "PAST-IO8X", "PAST-OP9C", "PAST-PA0V", "PAST-AS1B", "PAST-SD2N",
        "PAST-DF3M", "PAST-FG4Q", "PAST-GH5W", "PAST-HJ6E", "PAST-JK7R",
        "PAST-KL8T", "PAST-LZ9Y", "PAST-ZX0U", "PAST-XC1I", "PAST-CV2O",
        "PAST-VB3P", "PAST-BN4A", "PAST-NM5S", "PAST-MQ6D", "PAST-QW7F",
        "PAST-WE8G", "PAST-ER9H", "PAST-RT0J", "PAST-TY1K", "PAST-YU2L",
        "PAST-UI3Z", "PAST-IO4X", "PAST-OP5C", "PAST-PA6V", "PAST-AS7B",
        "PAST-SD8N", "PAST-DF9M", "PAST-FG0Q", "PAST-GH1W", "PAST-HJ2E",
        "PAST-JK3R", "PAST-KL4T", "PAST-LZ5Y", "PAST-ZX6U", "PAST-XC7I",
        "PAST-CV8O", "PAST-VB9P", "PAST-BN0A", "PAST-NM1S", "PAST-MQ2D",
        "PAST-QW3F", "PAST-WE4G", "PAST-ER5H", "PAST-RT6J", "PAST-TY7K",
        "PAST-YU8L", "PAST-UI9Z", "PAST-IO0X", "PAST-OP1C", "PAST-PA2V",
        "PAST-AS3B", "PAST-SD4N", "PAST-DF5M", "PAST-FG6Q", "PAST-GH7W",
        "PAST-HJ8E", "PAST-JK9R", "PAST-KL0T", "PAST-LZ1Y", "PAST-ZX2U",
        "PAST-XC3I", "PAST-CV4O", "PAST-VB5P", "PAST-BN6A", "PAST-NM7S",
        "PAST-MQ8D", "PAST-QW9F", "PAST-WE0G", "PAST-ER1H", "PAST-RT2J",
        "PAST-TY3K", "PAST-YU4L", "PAST-UI5Z", "PAST-IO6X", "PAST-OP7C",
        "PAST-PA8V", "PAST-AS9B", "PAST-SD0N", "PAST-DF1M", "PAST-FG2Q",
        "PAST-GH3W", "PAST-HJ4E", "PAST-JK5R", "PAST-KL6T", "PAST-LZ7Y",
        "PAST-ZX8U", "PAST-XC9I", "PAST-CV0O", "PAST-VB1P", "PAST-BN2A",
        "PAST-NM3S", "PAST-MQ4D", "PAST-QW5F", "PAST-WE6G", "PAST-ER7H",
        "PAST-RT8J", "PAST-TY9K", "PAST-YU0L", "PAST-UI1Z", "PAST-IO2X"
    ];

    // Variables de estado
    let attempts = 0;
    let accessData = JSON.parse(localStorage.getItem('pastelometroAccessData')) || {};

    // Generar ID de dispositivo único
    function getDeviceId() {
        let deviceId = localStorage.getItem('pastelometroDeviceId');
        if (!deviceId) {
            deviceId = 'device-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('pastelometroDeviceId', deviceId);
        }
        return deviceId;
    }

    // Verificar bloqueo por intentos fallidos
    function checkBlockStatus() {
        if (accessData.blockedUntil && Date.now() < accessData.blockedUntil) {
            const remainingTime = Math.ceil((accessData.blockedUntil - Date.now()) / 1000);
            errorMessage.textContent = `Demasiados intentos fallidos. Por favor espere ${remainingTime} segundos antes de intentar nuevamente.`;
            errorMessage.classList.remove('hidden');
            loginBtn.disabled = true;
            
            setTimeout(() => {
                loginBtn.disabled = false;
                errorMessage.classList.add('hidden');
            }, accessData.blockedUntil - Date.now());
            
            return true;
        }
        return false;
    }

    // Formatear código de entrada
    function formatCodeInput(value) {
        value = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        
        if (!value.startsWith(CODE_PREFIX) && value.length > 0) {
            value = CODE_PREFIX + value.replace(/^PAST-?/, '');
        }
        
        // Limitar a 4 caracteres después del prefijo
        if (value.length > CODE_PREFIX.length) {
            const mainPart = value.substring(CODE_PREFIX.length).replace(/-/g, '');
            value = CODE_PREFIX + mainPart.substring(0, 4);
        }
        
        return value;
    }

    // Validar código y manejar acceso
    function validateAndLogin(code) {
        const deviceId = getDeviceId();
        
        if (!CODE_REGEX.test(code)) {
            showError('Formato de código inválido. Use el formato: PAST-XXXX');
            return;
        }
        
        if (VALID_CODES.includes(code)) {
            handleValidCode(code, deviceId);
        } else {
            handleInvalidCode();
        }
    }

    function handleValidCode(code, deviceId) {
        // Inicializar datos para este código si no existen
        if (!accessData[code]) {
            accessData[code] = {
                devices: {},
                lastAccess: Date.now()
            };
        }
        
        // Registrar dispositivo
        accessData[code].devices[deviceId] = Date.now();
        
        // Verificar límite de dispositivos
        const deviceCount = Object.keys(accessData[code].devices).length;
        if (deviceCount > MAX_DEVICES) {
            showError(`Este código ya ha sido utilizado en el máximo de dispositivos permitidos (${MAX_DEVICES}).`);
            return;
        }
        
        // Actualizar datos
        accessData.lastUsedCode = code;
        accessData[code].lastAccess = Date.now();
        localStorage.setItem('pastelometroAccessData', JSON.stringify(accessData));
        
        // Redirigir
        loginSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
        setTimeout(() => {
            window.location.href = 'https://luishparedes.github.io/pastelometro/';
        }, 2000);
    }

    function handleInvalidCode() {
        attempts++;
        
        if (attempts >= MAX_ATTEMPTS) {
            accessData.blockedUntil = Date.now() + BLOCK_TIME;
            localStorage.setItem('pastelometroAccessData', JSON.stringify(accessData));
            
            showError(`Demasiados intentos fallidos. Por favor espere ${BLOCK_TIME/1000} segundos antes de intentar nuevamente.`);
            loginBtn.disabled = true;
            
            setTimeout(() => {
                loginBtn.disabled = false;
                errorMessage.classList.add('hidden');
                attempts = 0;
            }, BLOCK_TIME);
        } else {
            showError(`Código inválido. Intentos restantes: ${MAX_ATTEMPTS - attempts}`, attempts >= MAX_ATTEMPTS - 2);
        }
    }

    function showError(message, isWarning = false) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        if (isWarning) errorMessage.classList.add('attempts-warning');
        successMessage.classList.add('hidden');
    }

    // Inicialización
    if (accessData.lastUsedCode) {
        accessCodeInput.value = accessData.lastUsedCode;
    }
    
    checkBlockStatus();

    // Event Listeners
    accessCodeInput.addEventListener('input', function(e) {
        e.target.value = formatCodeInput(e.target.value);
    });
    
    loginBtn.addEventListener('click', function() {
        validateAndLogin(accessCodeInput.value.trim());
    });
    
    accessCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginBtn.click();
    });
});
