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
    const CODE_REGEX = /^PAST-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const MAX_ATTEMPTS = 5;
    const BLOCK_TIME = 30000; // 30 segundos
    const MAX_DEVICES = 3;
    
    // Códigos válidos (en texto claro)
    const VALID_CODES = [
        "PAST-1A2B-3C4D-5E6F-7G8H",
        "PAST-9I09J-K1L2-M3N4-O5P6",
        "PAST-Q7R8-S9T0-U1V2-W3X4",
        "PAST-Y5ZA-A7B8-C9D0-E1F2",
        "PAST-G3H4-I5J6-K7L8-M9N0",
        "PAST-O1P2-Q3R4-S5T6-U7V8",
        "PAST-W9X0-Y1Z2-A3B5-C5T6",
        "PAST-E7F8-G9H0-I1J2-K3L4",
        "PAST-M5N6-O7P8-Q9R0-S1T2",
        "PAST-U3V4-W5X6-Y7Z8-A9B0",
        "PAST-C1D2-E3F4-G5H6-I7J8",
        "PAST-KM9L0-M1N2-O3P4-Q5R6",
        "PAST-S7T8-U9V0-W1X2-Y3Z4",
        "PAST-A5B6-C7D8-E9F0-G1H2",
        "PAST-I3J4-K5L6-M7N8-O9P0",
        "PAST-Q1R2-S3T4-U5V6-W7X8",
        "PAST-Y9Z0-A1B2-C3D4-E5V6",
        "PAST-KG7H8-I9J0-K1L2-M3N4",
        "PAST-KO5P6-Q7R8-S9T0-U1V2",
        "PAST-KW3X4-Y5Z6-A7B8-C9D0",
        "PAST-KE1F2-G3H4-I5J6-K7L8",
        "PAST-KM9N0-O1P2-Q3R4-S5T6",
        "PAST-KU7V8-W9X0-Y1Z2-A3B4",
        "PAST-KC5D6-E7F8-G9H0-I1J2",
        "PAST-KK3L4-M5N6-O7P8-Q9R0",
        "PAST-KS1T2-U3V4-W5X6-Y7Z8",
        "PAST-KA9B0-C1D2-E3F4-G5H6",
        "PAST-KI7J8-K9L0-M1N2-O3P4",
        "PAST-KQ5R6-S7T8-U9V0-W1X6",
        "PAST-KY3Z4-A5B6-C7D8-E9F0",
        "PAST-KG1H2-I3J4-K5L6-M7N8",
        "PAST-KO9P0-Q1R2-S3T4-U5V6",
        "PAST-KW7X8-Y9Z0-A1B2-C3D4",
        "PAST-KE5F6-G7H8-I9J0-K1L2",
        "PAST-KM3N4-O5P6-Q7R8-S9T4",
        "PAST-KU1V2-W3X4-Y5ZA-A7B8",
        "PAST-KC9D0-E1F2-G3H4-I5J6",
        "PAST-KK7L8-M9N0-O1P2-Q3R4",
        "PAST-KS5T6-U7V8-W9X0-Y1Z2",
        "PAST-KA3B4-C5B6-E7F8-G9H0",
        "PAST-KI1J2-K3L4-M5N6-O7P8",
        "PAST-KQ9R0-S1T2-U3V4-W5X6",
        "PAST-KY7Z8-A9B0-C1D2-E3F4",
        "PAST-KG5H6-I7J8-K9L0-M1N2",
        "PAST-KO3P4-Q5R6-S7T8-U9V0",
        "PAST-KW1X2-Y3Z4-A5B6-C7D8",
        "PAST-KE9F0-G1H2-I3J4-K5L6",
        "PAST-KM7N8-O9P0-Q1R2-S3T4",
        "PAST-KU5V6-W7X8-Y9Z0-A1B2",
        "PAST-KC3D4-E5F6-G7H8-I9J0",
        "PAST-KK1L2-M3N4-O5P6-Q7R8",
        "PAST-KS9T0-U1V2-W3X4-Y5Z6",
        "PAST-KA7B8-C9D0-E1F2-G3H4",
        "PAST-KI5J6-K7L8-M9N0-O1P2",
        "PAST-KQ3R4-S5T6-U7V8-W9X0",
        "PAST-KY1Z2-A3B5-C5T6-E7F8",
        "PAST-KG9H0-I1J2-K3L4-M5N6",
        "PAST-KO7P8-Q9R0-S1T2-U3V4",
        "PAST-KW5X6-Y7Z8-A9B0-C1D2",
        "PAST-KE3F4-G5H6-I7J8-K9L0",
        "PAST-KM1N2-O3P4-Q5R6-S7T8",
        "PAST-KU9V0-W1X2-Y3Z4-A5B6",
        "PAST-KC1D2-E3F4-G5H6-I7J8",
        "PAST-KK9L0-M1N2-O3P4-Q5R6",
        "PAST-KS7T8-U9V0-W1X2-Y3Z4",
        "PAST-KA5B6-C7D8-E9F0-G1H2",
        "PAST-KI3J4-K5L6-M7N8-O9P0",
        "PAST-KQ1R2-S3T4-U5V6-W7X8",
        "PAST-KY9Z0-A1B2-C3D4-E5F6",
        "PAST-KG7H8-I9J0-K1L2-M3N4",
        "PAST-KO5P6-Q7R8-S9T0-U1V2",
        "PAST-KW3X4-Y5Z6-A7B8-C9D0",
        "PAST-KE1F2-G3H4-I5J6-K7L8",
        "PAST-KM9N0-O1P2-Q3R4-S5T6",
        "PAST-KU7V8-W9X0-Y1Z2-A3B4",
        "PAST-KC5D6-E7F8-G9H0-I1J2",
        "PAST-KK3L4-M5N6-O7P8-Q9R0",
        "PAST-KS1T2-U3V4-W5X6-Y7Z8",
        "PAST-KA9B0-C1D2-E3F4-G5H6",
        "PAST-KI7J8-K9L0-M1N2-O3P4",
        "PAST-KQ5R6-S7T8-U9V0-W1X6",
        "PAST-KY3Z4-A5B6-C7D8-E9F0",
        "PAST-KG1H2-I3J4-K5L6-M7N8",
        "PAST-KO9P0-Q1R2-S3T4-U5V6",
        "PAST-KW7X8-Y9Z0-A1B2-C3D4",
        "PAST-KE5F6-G7H8-I9J0-K1L2",
        "PAST-KM3N4-O5P6-Q7R8-S9T4",
        "PAST-KU1V2-W3X4-Y5ZA-A7B8",
        "PAST-KC9D0-E1F2-G3H4-I5J6",
        "PAST-KK7L8-M9N0-O1P2-Q3R4",
        "PAST-KS5T6-U7V8-W9X0-Y1Z2",
        "PAST-KA3B4-C5B6-E7F8-G9H0",
        "PAST-KI1J2-K3L4-M5N6-O7P8",
        "PAST-KQ9R0-S1T2-U3V4-W5X6",
        "PAST-KY7Z8-A9B0-C1D2-E3F4",
        "PAST-KG5H6-I7J8-K9L0-M1N2",
        "PAST-KO3P4-Q5R6-S7T8-U9V0",
        "PAST-KW1X2-Y3Z4-A5B6-C7D8",
        "PAST-KE9F0-G1H2-I3J4-K5L6",
        "PAST-KM7N8-O9P0-Q1R2-S3T4",
        "PAST-KU5V6-W7X8-Y9Z0-A1B2",
        "PAST-KC3D4-E5F6-G7H8-I9J0",
        "PAST-KK1L2-M3N4-O5P6-Q7R8",
        "PAST-KS9T0-U1V2-W3X4-Y5Z6",
        "PAST-KA7B8-C9D0-E1F2-G3H4",
        "PAST-KI5J6-K7L8-M9N0-O1P2",
        "PAST-KQ3R4-S5T6-U7V8-W9X0",
        "PAST-KY1Z2-A3B5-C5T6-E7F8",
        "PAST-KG9H0-I1J2-K3L4-M5N6",
        "PAST-KO7P8-Q9R0-S1T2-U3V4",
        "PAST-KW5X6-Y7Z8-A9B0-C1D2",
        "PAST-KE3F4-G5H6-I7J8-K9L0",
        "PAST-KM1N2-O3P4-Q5R6-S7T8",
        "PAST-KU9V0-W1X2-Y3Z4-A5B6",
        "PAST-KC1D2-E3F4-G5H6-I7J8",
        "PAST-KK9L0-M1N2-O3P4-Q5R6",
        "PAST-KS7T8-U9V0-W1X2-Y3Z4",
        "PAST-KA5B6-C7D8-E9F0-G1H2",
        "PAST-KI3J4-K5L6-M7N8-O9P0",
        "PAST-KQ1R2-S3T4-U5V6-W7X8",
        "PAST-KY9Z0-A1B2-C3D4-E5F6",
        "PAST-KG7H8-I9J0-K1L2-M3N4",
        "PAST-KO5P6-Q7R8-S9T0-U1V2",
        "PAST-KW3X4-Y5Z6-A7B8-C9D0",
        "PAST-KE1F2-G3H4-I5J6-K7L8",
        "PAST-KM9N0-O1P2-Q3R4-S5T6",
        "PAST-KU7V8-W9X0-Y1Z2-A3B4",
        "PAST-KC5D6-E7F8-G9H0-I1J2",
        "PAST-KK3L4-M5N6-O7P8-Q9R0",
        "PAST-KS1T2-U3V4-W5X6-Y7Z8",
        "PAST-KA9B0-C1D2-E3F4-G5H6",
        "PAST-KI7J8-K9L0-M1N2-O3P4",
        "PAST-KQ5R6-S7T8-U9V0-W1X6",
        "PAST-KY3Z4-A5B6-C7D8-E9F0",
        "PAST-KG1H2-I3J4-K5L6-M7N8",
        "PAST-KO9P0-Q1R2-S3T4-U5V6",
        "PAST-KW7X8-Y9Z0-A1B2-C3D4",
        "PAST-KE5F6-G7H8-I9J0-K1L2",
        "PAST-KM3N4-O5P6-Q7R8-S9T4",
        "PAST-KU1V2-W3X4-Y5ZA-A7B8",
        "PAST-KC9D0-E1F2-G3H4-I5J6",
        "PAST-KK7L8-M9N0-O1P2-Q3R4",
        "PAST-KS5T6-U7V8-W9X0-Y1Z2",
        "PAST-KA3B4-C5B6-E7F8-G9H0",
        "PAST-KI1J2-K3L4-M5N6-O7P8",
        "PAST-KQ9R0-S1T2-U3V4-W5X6",
        "PAST-KY7Z8-A9B0-C1D2-E3F4",
        "PAST-KG5H6-I7J8-K9L0-M1N2",
        "PAST-KO3P4-Q5R6-S7T8-U9V0",
        "PAST-KW1X2-Y3Z4-A5B6-C7D8",
        "PAST-KE9F0-G1H2-I3J4-K5L6",
        "PAST-KM7N8-O9P0-Q1R2-S3T4",
        "PAST-KU5V6-W7X8-Y9Z0-A1B2",
        "PAST-KC3D4-E5F6-G7H8-I9J0",
        "PAST-KK1L2-M3N4-O5P6-Q7R8",
        "PAST-KS9T0-U1V2-W3X4-Y5Z6",
        "PAST-KA7B8-C9D0-E1F2-G3H4",
        "PAST-KI5J6-K7L8-M9N0-O1P2",
        "PAST-KQ3R4-S5T6-U7V8-W9X0",
        "PAST-KY1Z2-A3B5-C5T6-E7F8",
        "PAST-KG9H0-I1J2-K3L4-M5N6",
        "PAST-KO7P8-Q9R0-S1T2-U3V4",
        "PAST-KW5X6-Y7Z8-A9B0-C1D2",
        "PAST-KE3F4-G5H6-I7J8-K9L0",
        "PAST-KM1N2-O3P4-Q5R6-S7T8",
        "PAST-KU9V0-W1X2-Y3Z4-A5B6",
        "PAST-KC1D2-E3F4-G5H6-I7J8",
        "PAST-KK9L0-M1N2-O3P4-Q5R6",
        "PAST-KS7T8-U9V0-W1X2-Y3Z4",
        "PAST-KA5B6-C7D8-E9F0-G1H2",
        "PAST-KI3J4-K5L6-M7N8-O9P0",
        "PAST-KQ1R2-S3T4-U5V6-W7X8",
        "PAST-KY9Z0-A1B2-C3D4-E5F6",
        "PAST-KG7H8-I9J0-K1L2-M3N4",
        "PAST-KO5P6-Q7R8-S9T0-U1V2",
        "PAST-KW3X4-Y5Z6-A7B8-C9D0",
        "PAST-KE1F2-G3H4-I5J6-K7L8",
        "PAST-KM9N0-O1P2-Q3R4-S5T6",
        "PAST-KU7V8-W9X0-Y1Z2-A3B4",
        "PAST-KC5D6-E7F8-G9H0-I1J2",
        "PAST-KK3L4-M5N6-O7P8-Q9R0"
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
        
        if (value.length > CODE_PREFIX.length) {
            const parts = value.split('-');
            const mainPart = parts.slice(1).join('');
            let formatted = CODE_PREFIX;
            
            for (let i = 0; i < mainPart.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += '-';
                formatted += mainPart[i];
            }
            
            value = formatted;
        }
        
        return value;
    }

    // Validar código y manejar acceso
    function validateAndLogin(code) {
        const deviceId = getDeviceId();
        
        if (!CODE_REGEX.test(code)) {
            showError('Formato de código inválido. Use el formato: PAST-XXXX-XXXX-XXXX-XXXX');
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
