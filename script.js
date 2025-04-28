document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const accessCodeInput = document.getElementById('access-code');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loginSection = document.getElementById('login-section');
    const loadingSection = document.getElementById('loading-section');
    
    // Expresión regular para validar el formato del código
    const codeRegex = /^PAST-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    
    // Lista de códigos válidos codificados en Base64
    const encodedCodes = [
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
    ];

    // Función para decodificar los códigos
    function getValidCodes() {
        return encodedCodes.map(code => atob(code));
    }

    // Variables para control de intentos
    let attempts = 0;
    const maxAttempts = 5;
    const blockTime = 30000; // 30 segundos de bloqueo
    
    // Obtener datos de acceso guardados
    let accessData = JSON.parse(localStorage.getItem('pastelometroAccessData')) || {};
    
    // Verificar si hay un código guardado y cargarlo
    if (accessData.lastUsedCode) {
        accessCodeInput.value = accessData.lastUsedCode;
    }
    
    // Verificar si hay un bloqueo activo
    if (accessData.blockedUntil && new Date().getTime() < accessData.blockedUntil) {
        const remainingTime = Math.ceil((accessData.blockedUntil - new Date().getTime()) / 1000);
        errorMessage.textContent = `Demasiados intentos fallidos. Por favor espere ${remainingTime} segundos antes de intentar nuevamente.`;
        errorMessage.classList.remove('hidden');
        loginBtn.disabled = true;
        
        setTimeout(() => {
            loginBtn.disabled = false;
            errorMessage.classList.add('hidden');
        }, accessData.blockedUntil - new Date().getTime());
    }
    
    // Formatear automáticamente el código de acceso
    accessCodeInput.addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase();
        
        // Eliminar cualquier carácter que no sea alfanumérico o guión
        value = value.replace(/[^A-Z0-9-]/g, '');
        
        // Asegurar que "PAST-" esté al inicio
        if (!value.startsWith('PAST-') && value.length > 0) {
            value = 'PAST-' + value.replace(/^PAST-?/, '');
        }
        
        // Añadir guiones cada 4 caracteres después de "PAST-"
        if (value.length > 5) {
            let parts = value.split('-');
            let mainPart = parts.slice(1).join('');
            let formatted = 'PAST-';
            
            for (let i = 0; i < mainPart.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += '-';
                }
                formatted += mainPart[i];
            }
            
            value = formatted;
        }
        
        e.target.value = value;
    });
    
    // Manejar el evento de clic en el botón de acceso
    loginBtn.addEventListener('click', function() {
        const code = accessCodeInput.value.trim();
        
        // Validar el formato del código
        if (!codeRegex.test(code)) {
            errorMessage.textContent = 'Formato de código inválido. Use el formato: PAST-XXXX-XXXX-XXXX-XXXX';
            errorMessage.classList.remove('hidden');
            successMessage.classList.add('hidden');
            return;
        }
        
        // Verificar si el código es válido
        if (getValidCodes().includes(code)) {
            // Guardar el código utilizado para recordarlo
            accessData.lastUsedCode = code;
            
            // Verificar límite de dispositivos (máximo 3)
            if (!accessData[code]) {
                accessData[code] = { devices: 1, lastAccess: new Date().getTime() };
            } else if (accessData[code].devices >= 3) {
                errorMessage.textContent = 'Este código ya ha sido utilizado en el máximo de dispositivos permitidos (3).';
                errorMessage.classList.remove('hidden');
                successMessage.classList.add('hidden');
                return;
            } else {
                accessData[code].devices++;
                accessData[code].lastAccess = new Date().getTime();
            }
            
            // Guardar datos de acceso
            localStorage.setItem('pastelometroAccessData', JSON.stringify(accessData));
            
            // Mostrar mensaje de éxito y redirigir
            loginSection.classList.add('hidden');
            loadingSection.classList.remove('hidden');
            
            setTimeout(() => {
                window.location.href = 'https://luishparedes.github.io/pastelometro/';
            }, 2000);
            
        } else {
            // Código inválido
            attempts++;
            
            if (attempts >= maxAttempts) {
                // Bloquear temporalmente
                const blockedUntil = new Date().getTime() + blockTime;
                accessData.blockedUntil = blockedUntil;
                localStorage.setItem('pastelometroAccessData', JSON.stringify(accessData));
                
                errorMessage.textContent = `Demasiados intentos fallidos. Por favor espere ${blockTime/1000} segundos antes de intentar nuevamente.`;
                errorMessage.classList.remove('hidden');
                loginBtn.disabled = true;
                
                setTimeout(() => {
                    loginBtn.disabled = false;
                    errorMessage.classList.add('hidden');
                    attempts = 0;
                }, blockTime);
            } else {
                errorMessage.textContent = `Código inválido. Intentos restantes: ${maxAttempts - attempts}`;
                errorMessage.classList.remove('hidden');
                
                if (attempts >= maxAttempts - 2) {
                    errorMessage.classList.add('attempts-warning');
                }
            }
            
            successMessage.classList.add('hidden');
        }
    });
    
    // Permitir el acceso con la tecla Enter
    accessCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
});
