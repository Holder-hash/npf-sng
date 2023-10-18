
; /* Start:"a:4:{s:4:"full";s:78:"/local/components/sng/contribution/templates/.default/script.js?16923516858294";s:6:"source";s:63:"/local/components/sng/contribution/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function() {
    // Валидация инпута для ввода только кириллицы
    $(".contribution__form-input").eq(0).on('input', function() {
        var value = $(this).val();
        var newValue = value.replace(/[^а-яё\s]/gi, ''); 
        $(this).val(newValue);
    });

    // Валидация инпута для ввода только цифр
    $(".contribution__form-input").eq(1).on('input', function() {
        var value = $(this).val();
        var newValue = value.replace(/[^0-9]/g, ''); 
        $(this).val(newValue);
    });

    // Календарь
    $("#contractDate").datepicker();

    $(".contribution__form-calendar").click(function() {
        $("#contractDate").datepicker("show");
    });

    // Устанавливаем значения в localStorage перед отправкой AJAX-запроса
    function setLocalStorage() {
        localStorage.setItem('fio', $('#fio').val());
        localStorage.setItem('sum', $('#sum').val());
        localStorage.setItem('contractNumber', $('#contractNumber').val());
        localStorage.setItem('contractDate', $('#contractDate').val());
    }

    function convertToPDF(htmlContent, actionType) {
        var opt = {
            margin: 10,
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        document.body.appendChild(tempDiv);

        if (actionType === 'print') {
            html2pdf().from(tempDiv).set(opt).toPdf().get('pdf').then(function(pdf) {
                if (actionType === 'print') {
                    var blob = pdf.output('blob');
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.target = '_blank';
                    link.click();
                    document.body.removeChild(tempDiv);
                } else if (actionType === 'download') {
                    pdf.save('document.pdf');
                    document.body.removeChild(tempDiv);
                }
            }).catch(onError => console.log(onError));
        } else if (actionType === 'download') {
            html2pdf().from(tempDiv).set(opt).save().then(function() {
                document.body.removeChild(tempDiv);
            }).catch(function(error) {
                console.error("Error generating PDF: ", error);
            });
        }
        
    }

    function updateTemplateWithData(template, data) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = template;

        // Добавьте текущую дату
        var currentDate = new Date();
        var currentDay = currentDate.getDate();
        var currentMonth = currentDate.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
        var currentYear = currentDate.getFullYear();
        var months = ["", "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        tempDiv.querySelector('#time').textContent = `${currentDay} ${months[currentMonth]} ${currentYear} г.`;

        if (data.fio) {
            tempDiv.querySelector('#fio').textContent = data.fio;
        }
        if (data.sum) {
            tempDiv.querySelector('#sum').textContent = data.sum;
        }
        if (data.contractNumber) {
            tempDiv.querySelector('#contractNumber').textContent = data.contractNumber;
        }
        if (data.contractDate) {
            // Предполагая, что формат даты 'DD.MM.YYYY'
            var parts = data.contractDate.split('.');
            tempDiv.querySelector('#contractDateNumber').textContent = parts[0];
            tempDiv.querySelector('#contractDateMonth').textContent = months[parseInt(parts[1])];
            tempDiv.querySelector('#contractDateYear').textContent = parts[2];
        }

        return tempDiv.innerHTML;
    }

    $("#contractNumber").on('input', function(e) {
        // Проверяем, соответствует ли ввод регулярному выражению (только числа и знак "-")
        if (!/^[0-9-]*$/.test($(this).val())) {
            // Удаляем последний введенный символ, если он не соответствует
            $(this).val($(this).val().slice(0, -1));
        }
    });

    // Получите все элементы input формы
    const $inputs = $(".contribution__form-input");
    const errorInput = "contribution__form-input-error";
    const $errorLabel = $(".contribution__form-label-error");

    // Функция для проверки заполнения всех полей
    function checkFields() {
        let allFilled = true;
    
        $inputs.each(function() {
            if (!$(this).val().trim()) {
                allFilled = false;
                $(this).addClass(errorInput ); // Добавить класс для подсветки ошибки
            } else {
                $(this).removeClass(errorInput); // Удалить класс, если поле заполнено
            }
        });
    
        // Устанавливаем видимость $errorLabel в зависимости от того, заполнены ли все поля
        if (allFilled) {
            $errorLabel.css('visibility', 'hidden');
        } else {
            $errorLabel.css('visibility', 'visible');
        }
    
        return allFilled;
    }

    // Добавьте обработчики событий для кнопок
    $('.contribution__button--print').click(function(e) {
        if (!checkFields()) {
            e.preventDefault(); // Предотвратите печать или загрузку, если поля не заполнены
            return;
        }
        e.preventDefault(); // Предотвратите печать или загрузку, если поля не заполнены
        setLocalStorage();
        var dataToSend = {
            fio: localStorage.getItem('fio'),
            sum: localStorage.getItem('sum'),
            contractNumber: localStorage.getItem('contractNumber'),
            contractDate: localStorage.getItem('contractDate')
        };
    
        $.ajax({
            url: '/fiz-liz/NPO/dogovor/vznos/print.php',
            method: 'GET',
            data: dataToSend,
            success: function(response) {
                var updatedTemplate = updateTemplateWithData(response, dataToSend);
                    convertToPDF(updatedTemplate, 'print');
            },
            error: function(xhr, status, error) {
                console.error("Error fetching content: ", error);
            }
        });
    });
    
    $('.contribution__button--load').click(function(e) {
        if (!checkFields()) {
            e.preventDefault(); // Предотвратите печать или загрузку, если поля не заполнены
            return;
        }
        e.preventDefault(); // Предотвратите печать или загрузку, если поля не заполнены
        setLocalStorage();
        var dataToSend = {
            fio: localStorage.getItem('fio'),
            sum: localStorage.getItem('sum'),
            contractNumber: localStorage.getItem('contractNumber'),
            contractDate: localStorage.getItem('contractDate')
        };
    
        $.ajax({
            url: '/fiz-liz/NPO/dogovor/vznos/print.php',
            method: 'GET',
            data: dataToSend,
            success: function(response) {
                var updatedTemplate = updateTemplateWithData(response, dataToSend);
                convertToPDF(updatedTemplate, 'download');
            },
            error: function(xhr, status, error) {
                console.error("Error fetching content: ", error);
            }
        });
    });
});
/* End */
;; /* /local/components/sng/contribution/templates/.default/script.js?16923516858294*/
