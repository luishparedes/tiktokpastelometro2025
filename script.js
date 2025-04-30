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
    
    // Códigos válidos (codificados en Base64)
    const VALID_CODES = [
         "UEFTVC0xQTJCLTNDNEQtNUU2Ri03RzhI", "UEFTVC05STA5Si1LMUwyLU0zTjQtTzVQNg==",
        "UEFTVC1RN1I4LVM5VDAtVTFWMi1XM1g0", "UEFTVC1ZNVpBLUE3QjgtQzlEMC1FMUYy",
        "UEFTVC1HM0g0LUk1SjYtSzdMOC1NOU4w", "UEFTVC1PMVAyLVEzUjQtUzVUNi1VN1Y4",
        "UEFTVC1XOVgwLVkxWjItQTNCNS1DNVQ2", "UEFTVC1FN0Y4LUc5SDAtSTFKMitLM0w0",
        "UEFTVC1NNU42LU83UDgtUTlSMC1TMVQy", "UEFTVC1VM1Y0LVc1WDYtWTdaOC1BOUIw",
        "UEFTVC1DMUQyLUUzRjQtRzVINi1JN0o4", "UEFTVEtNOUwwLU0xTjItTzNQNC1RNVI2",
        "UEFTVC1TN1Q4LVU5VjAtVzFYMitZM1o0", "UEFTVC1BNUI2LUM3RDgtRTlGMC1HMUgy",
        "UEFTVC1JM0o0LUs1TDYtTTdOOC1POVAw", "UEFTVC1RMVIyLVMzVDQtVTVWNi1XN1g4",
        "UEFTVC1ZOVowLUExQjItQzNENC1FNVY2", "UEFTVEtHN0g4LUk5SjAtSzFMMi1NM040",
        "UEFTVEtPNVA2LVE3UjgtUzlUMC1VMVYy", "UEFTVFcTM1g0LVk1WjYtQTdCOC1DOUQw",
        "UEFTVEVFMUYyLUczSDQtSTVKNi1LN0w4", "UEFTVE05TjAtTzFQMi1RM1I0LVM1VDY",
        "UEFTVFU3VjgtVzlYMC1ZMVoyLUEzQjQ=", "UEFTVEM1RDYtRTdGOC1HOUgwLUkxSjI=",
        "UEFTVEtNM0w0LU01TjYtTzdQOC1ROVIw", "UEFTVFMxVDItVTNWNC1XNVg2LVk3Wjg=",
        "UEFTVEE5QjAtQzFEMi1FM0Y0LUc1SDY=", "UEFTVEk3SjgtSzlMMC1NMU4yLU8zUDQ=",
        "UEFTVFE1UjYtUzdUOC1VOVYwLVcxWDY=", "UEFTVFkzWjQtQTVCNi1DN0Q4LUU5RjA=",
        "UEFTVEcxSDItSTNKNC1LNUw2LU03Tjg=", "UEFTVE85UDAtUTFSMi1TM1Q0LVU1VjY=",
        "UEFTVFc3WDgtWTlaMC1BMUIyLUMzRDQ=", "UEFTVEU1RjYtRzdIOC1JOUowLUsxTDI=",
        "UEFTVE0zTjQtTzVQNi1RN1I4LVM5VDQ=", "UEFTVFUxVjItVzNYNC1ZNVpBLUE3Qjg=",
        "UEFTVEM5RDAtRTFGMi1HM0g0LUk1SjY=", "UEFTVEs3TDgtTTlOMC1PMVAyLVEzUjQ=",
        "UEFTVFM1VDYtVTdWOC1XOVgwLVkxWjI=", "UEFTVEEzQjQtQzVCNi1FN0Y4LUc5SDA=",
        "UEFTVEkxSjItSzNMNC1NNU42LU83UDg=", "UEFTVFE5UjAtUzFUMi1VM1Y0LVc1WDY=",
        "UEFTVFk3WjgtQTlCMC1DMUQyLUUzRjQ=", "UEFTVEc1SDYtSTdKOC1LOUwwLU0xTjI=",
        "UEFTVE8zUDQtUTVSNi1TN1Q4LVU5VjA=", "UEFTVFcxWDItWTNaNC1BNUI2LUM3RDg=",
        "UEFTVEU5RjAtRzFIMi1JM0o0LUs1TDY=", "UEFTVE03TjgtTzlQMC1RMVIyLVMzVDQ=",
        "UEFTVFU1VjYtVzdYOC1ZOVowLUExQjI=", "UEFTVEMzRDQtRTVGNi1HN0g4LUk5SjA=",
        "UEFTVEsxTDItTTNONC1PNVA2LVE3Ujg=", "UEFTVFM5VDAtVTFWMi1XM1g0LVk1WjY=",
        "UEFTVEE3QjgtQzlEMC1FMUYyLUczSDQ=", "UEFTVEk1SjYtSzNMOC1NOU4wLU8xUDI=",
        "UEFTVFEzUjQtUzVUNi1VN1Y4LVc5WDA=", "UEFTVFkxWjItQTNCNS1DNVQ2LUU3Rjg=",
        "UEFTVEc5SDAtSTFKMitLM0w0LU01TjY=", "UEFTVE83UDgtUTlSMC1TMVQyLVUzVjQ=",
        "UEFTVFc1WDYtWTdaOC1BOUIwLUMxRDI=", "UEFTVEUzRjQtRzVINi1JN0o4LUs5TDA=",
        "UEFTVE0xTjItTzNQNC1RNVI2LVM3VDg=", "UEFTVFU5VjAtVzFYMitZM1o0LUE1QjY=",
        "UEFTVEM3RDgtRTlGMC1HMUgyLUkzSjQ=", "UEFTVEs1TDYtTTdOOC1POVAwLVEzVDQ=",
        "UEFTVFMzVDQtVTVWNi1XN1g4LVk5WjA=", "UEFTVEExQjItQzNENC1FNVY2LUc3SDg=",
        "UEFTVEk5SjAtSzFMMi1NM040LU81UDY=", "UEFTVFE3UjgtUzlUMC1VMVYyLVczWDQ=",
        "UEFTVFk1WjYtQTdCOC1DOUQwLUUxRjI=", "UEFTVEczSDQtSTVKNi1LN0w4LU05TjA=",
        "UEFTVE8xUDItUTNSNC1TNVQ2LVU3Vjg=", "UEFTVFc5WDAtWTFaMi1BM0I1LUM1VDY=",
        "UEFTVEU3RjgtRzlIMC1JMUoyK0szTDQ=", "UEFTVE01TjYtTzdQOC1ROVIwLVMxVDI=",
        "UEFTVFUzVjQtVzVYNi1ZN1o4LUE5QjA=", "UEFTVEMxRDItRTNGNC1HNUg2LUk3Sjg=",
        "UEFTVEs5TDAtTTFOMi1PM1A0LVE1UjY=", "UEFTVFM3VDgtVTlWMC1XM1g0LVk1WjY=",
        "UEFTVEE1QjYtQzdEOC1FOUYwLUcxSDI=", "UEFTVEkzSjQtSzVMNi1NN044LU85UDA=",
        "UEFTVFExUjItUzNUNC1VN1Y2LVc3WDg=", "UEFTVFk5WjAtQTFCMy1DM0Q0LUU1RjY=",
        "UEFTVEc3SDgtSTlKMC1LMUwyLU0zTjQ=", "UEFTVE81UDYtUTdSOC1TOVQwLVUxVjI=",
        "UEFTVFczWDQtWTVaNi1BN0I4LUM5RDA=", "UEFTVEUxRjItRzNINC1JNUo2LUs3TDg=",
        "UEFTVE05TjAtTzFQMi1RM1I0LVM1VDY=", "UEFTVFU3VjgtVzlYMC1ZMVoyLUEzQjQ=",
        "UEFTVEM1RDYtRTdGOC1HOUgwLUkxSjI=", "UEFTVEtNM0w0LU01TjYtTzdQOC1ROVIw",
        "UEFTVFMxVDItVTNWNC1XNVg2LVk3Wjg=", "UEFTVEE5QjAtQzFEMi1FM0Y0LUc1SDY=",
        "UEFTVEk3SjgtSzlMMC1NMU4yLU8zUDQ=", "UEFTVFE1UjYtUzdUOC1VOVYwLVcxWDY=",
        "UEFTVFkzWjQtQTVCNi1DN0Q4LUU5RjA=", "UEFTVEcxSDItSTNKNC1LNUw2LU03Tjg=",
        "UEFTVE85UDAtUTFSMi1TM1Q0LVU1VjY=", "UEFTVFc3WDgtWTlaMC1BMUIyLUMzRDQ=",
        "UEFTVEU1RjYtRzdIOC1JOUowLUsxTDI=", "UEFTVE0zTjQtTzVQNi1RN1I4LVM5VDQ=",
        "UEFTVFUxVjItVzNYNC1ZNVpBLUE3Qjg=", "UEFTVEM5RDAtRTFGMi1HM0g0LUk1SjY=",
        "UEFTVEs3TDgtTTlOMC1PMVAyLVEzUjQ=", "UEFTVFM1VDYtVTdWOC1XOVgwLVkxWjI=",
        "UEFTVEEzQjQtQzVCNi1FN0Y4LUc5SDA=", "UEFTVEkxSjItSzNMNC1NNU42LU83UDg=",
        "UEFTVFE5UjAtUzFUMi1VM1Y0LVc1WDY=", "UEFTVFk3WjgtQTlCMC1DMUQyLUUzRjQ=",
        "UEFTVEc1SDYtSTdKOC1LOUwwLU0xTjI=", "UEFTVE8zUDQtUTVSNi1TN1Q4LVU5VjA=",
        "UEFTVFcxWDItWTNaNC1BNUI2LUM3RDg=", "UEFTVEU5RjAtRzFIMi1JM0o0LUs1TDY=",
        "UEFTVE03TjgtTzlQMC1RMVIyLVMzVDQ=", "UEFTVFU1VjYtVzdYOC1ZOVowLUExQjI=",
        "UEFTVEMzRDQtRTVGNi1HN0g4LUk5SjA=", "UEFTVEsxTDItTTNONC1PNVA2LVE3Ujg=",
        "UEFTVFM5VDAtVTFWMi1XM1g0LVk1WjY=", "UEFTVEE3QjgtQzlEMC1FMUYyLUczSDQ=",
        "UEFTVEk1SjYtSzNMOC1NOU4wLU8xUDI=", "UEFTVFEzUjQtUzVUNi1VN1Y4LVc5WDA=",
        "UEFTVFkxWjItQTNCNS1DNVQ2LUU3Rjg=", "UEFTVEc5SDAtSTFKMitLM0w0LU01TjY=",
        "UEFTVE83UDgtUTlSMC1TMVQyLVUzVjQ=", "UEFTVFc1WDYtWTdaOC1BOUIwLUMxRDI=",
        "UEFTVEUzRjQtRzVINi1JN0o4LUs5TDA=", "UEFTVE0xTjItTzNQNC1RNVI2LVM3VDg=",
        "UEFTVFU5VjAtVzFYMitZM1o0LUE1QjY=", "UEFTVEM3RDgtRTlGMC1HMUgyLUkzSjQ=",
        "UEFTVEs1TDYtTTdOOC1POVAwLVEzVDQ=", "UEFTVFMzVDQtVTVWNi1XN1g4LVk5WjA=",
        "UEFTVEExQjItQzNENC1FNVY2LUc3SDg=", "UEFTVEk5SjAtSzFMMi1NM040LU81UDY=",
        "UEFTVFE3UjgtUzlUMC1VMVYyLVczWDQ=", "UEFTVFk1WjYtQTdCOC1DOUQwLUUxRjI=",
        "UEFTVEczSDQtSTVKNi1LN0w4LU05TjA=", "UEFTVE8xUDItUTNSNC1TNVQ2LVU3Vjg=",
        "UEFTVFc5WDAtWTFaMi1BM0I1LUM1VDY=", "UEFTVEU3RjgtRzlIMC1JMUoyK0szTDQ=",
        "UEFTVE01TjYtTzdQOC1ROVIwLVMxVDI=", "UEFTVFUzVjQtVzVYNi1ZN1o4LUE5QjA=",
        "UEFTVEMxRDItRTNGNC1HNUg2LUk3Sjg=", "UEFTVEs5TDAtTTFOMi1PM1A0LVE1UjY=",
        "UEFTVFM3VDgtVTlWMC1XM1g0LVk1WjY=", "UEFTVEE1QjYtQzdEOC1FOUYwLUcxSDI=",
        "UEFTVEkzSjQtSzVMNi1NN044LU85UDA=", "UEFTVFExUjItUzNUNC1VN1Y2LVc3WDg=",
        "UEFTVFk5WjAtQTFCMy1DM0Q0LUU1RjY=", "UEFTVEc3SDgtSTlKMC1LMUwyLU0zTjQ=",
        "UEFTVE81UDYtUTdSOC1TOVQwLVUxVjI=", "UEFTVFczWDQtWTVaNi1BN0I4LUM5RDA=",
        "UEFTVEUxRjItRzNINC1JNUo2LUs3TDg=", "UEFTVE05TjAtTzFQMi1RM1I0LVM1VDY=",
        "UEFTVFU3VjgtVzlYMC1ZMVoyLUEzQjQ=", "UEFTVEM1RDYtRTdGOC1HOUgwLUkxSjI=",
        "UEFTVEtNM0w0LU01TjYtTzdQOC1ROVIw", "UEFTVFMxVDItVTNWNC1XNVg2LVk3Wjg=",
        "UEFTVEE5QjAtQzFEMi1FM0Y0LUc1SDY=", "UEFTVEk3SjgtSzlMMC1NMU4yLU8zUDQ=",
        "UEFTVFE1UjYtUzdUOC1VOVYwLVcxWDY=", "UEFTVFkzWjQtQTVCNi1DN0Q4LUU5RjA=",
        "UEFTVEcxSDItSTNKNC1LNUw2LU03Tjg=", "UEFTVE85UDAtUTFSMi1TM1Q0LVU1VjY=",
        "UEFTVFc3WDgtWTlaMC1BMUIyLUMzRDQ=", "UEFTVEU1RjYtRzdIOC1JOUowLUsxTDI=",
        "UEFTVE0zTjQtTzVQNi1RN1I4LVM5VDQ=", "UEFTVFUxVjItVzNYNC1ZNVpBLUE3Qjg=",
        "UEFTVEM5RDAtRTFGMi1HM0g0LUk1SjY=", "UEFTVEs3TDgtTTlOMC1PMVAyLVEzUjQ=",
        "UEFTVFM1VDYtVTdWOC1XOVgwLVkxWjI=", "UEFTVEEzQjQtQzVCNi1FN0Y4LUc5SDA=",
        "UEFTVEkxSjItSzNMNC1NNU42LU83UDg=", "UEFTVFE5UjAtUzFUMi1VM1Y0LVc1WDY=",
        "UEFTVFk3WjgtQTlCMC1DMUQyLUUzRjQ=", "UEFTVEc1SDYtSTdKOC1LOUwwLU0xTjI=",
        "UEFTVE8zUDQtUTVSNi1TN1Q4LVU5VjA=", "UEFTVFcxWDItWTNaNC1BNUI2LUM3RDg=",
        "UEFTVEU5RjAtRzFIMi1JM0o0LUs1TDY=", "UEFTVE03TjgtTzlQMC1RMVIyLVMzVDQ=",
        "UEFTVFU1VjYtVzdYOC1ZOVowLUExQjI=", "UEFTVEMzRDQtRTVGNi1HN0g4LUk5SjA=",
        "UEFTVEsxTDItTTNONC1PNVA2LVE3Ujg=", "UEFTVFM5VDAtVTFWMi1XM1g0LVk1WjY=",
        "UEFTVEE3QjgtQzlEMC1FMUYyLUczSDQ=", "UEFTVEk1SjYtSzNMOC1NOU4wLU8xUDI=",
        "UEFTVFEzUjQtUzVUNi1VN1Y4LVc5WDA=", "UEFTVFkxWjItQTNCNS1DNVQ2LUU3Rjg=",
        "UEFTVEc5SDAtSTFKMitLM0w0LU01TjY=", "UEFTVE83UDgtUTlSMC1TMVQyLVUzVjQ=",
        "UEFTVFc1WDYtWTdaOC1BOUIwLUMxRDI=", "UEFTVEUzRjQtRzVINi1JN0o4LUs5TDA=",
        "UEFTVE0xTjItTzNQNC1RNVI2LVM3VDg=", "UEFTVFU5VjAtVzFYMitZM1o0LUE1QjY=",
        "UEFTVEM3RDgtRTlGMC1HMUgyLUkzSjQ=", "UEFTVEs1TDYtTTdOOC1POVAwLVEzVDQ=",
        "UEFTVFMzVDQtVTVWNi1XN1g4LVk5WjA=", "UEFTVEExQjItQzNENC1FNVY2LUc3SDg=",
        "UEFTVEk5SjAtSzFMMi1NM040LU81UDY=", "UEFTVFE3UjgtUzlUMC1VMVYyLVczWDQ=",
        "UEFTVFk1WjYtQTdCOC1DOUQwLUUxRjI=", "UEFTVEczSDQtSTVKNi1LN0w4LU05TjA=",
        "UEFTVE8xUDItUTNSNC1TNVQ2LVU3Vjg=", "UEFTVFc5WDAtWTFaMi1BM0I1LUM1VDY=",
        "UEFTVEU3RjgtRzlIMC1JMUoyK0szTDQ=", "UEFTVE01TjYtTzdQOC1ROVIwLVMxVDI=",
        "UEFTVFUzVjQtVzVYNi1ZN1o4LUE5QjA=", "UEFTVEMxRDItRTNGNC1HNUg2LUk3Sjg=",
        "UEFTVEs5TDAtTTFOMi1PM1A0LVE1UjY=", "UEFTVFM3VDgtVTlWMC1XM1g0LVk1WjY=",
        "UEFTVEE1QjYtQzdEOC1FOUYwLUcxSDI=", "UEFTVEkzSjQtSzVMNi1NN044LU85UDA=",
        "UEFTVFExUjItUzNUNC1VN1Y2LVc3WDg=", "UEFTVFk5WjAtQTFCMy1DM0Q0LUU1RjY=",
        "UEFTVEc3SDgtSTlKMC1LMUwyLU0zTjQ=", "UEFTVE81UDYtUTdSOC1TOVQwLVUxVjI=",
        "UEFTVFczWDQtWTVaNi1BN0I4LUM5RDA=", "UEFTVEUxRjItRzNINC1JNUo2LUs3TDg=",
        "UEFTVE05TjAtTzFQMi1RM1I0LVM1VDY=", "UEFTVFU3VjgtVzlYMC1ZMVoyLUEzQjQ=",
        "UEFTVEM1RDYtRTdGOC1HOUgwLUkxSjI=", "UEFTVEtNM0w0LU01TjYtTzdQOC1ROVIw"
        
    ].map(code => atob(code)); // Decodificar directamente

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
