
; /* Start:"a:4:{s:4:"full";s:71:"/local/components/sng/calc/templates/.default/script.js?169745039128144";s:6:"source";s:55:"/local/components/sng/calc/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function(){
    var $form = $('#calc-form'),
        $pension = $('#pension'),
        $pensionMonth = $('#pension_month'),
        $pensionCorp = $('#pension_corp'),
        $dateBirthday = $('#date-birthday'),
        $savePeriodYear = $('#savePeriodYear'),
        $savePeriodMonth = $('#savePeriodMonth'),
        $salary = $('#salary'),
        $moneyStart = $('#money-start'),
        $male = $('#male'),
        $female = $('#female'),
        $percentSalary = $('#percentSalary'),
        $percentCheck = $('#percent-check'),
        tableDieManM12,
        tableDieFemM12,
        tableDieManM4,
        tableDieFemM4;

    $dateBirthday.mask('99.99.9999');

    $('.form-control').each(function () {
        $(this).on('input change', function () {
            if(($percentCheck.is(':checked')) && $salary.val()) {
                $salary.removeClass('calc__input-error');
                $('.calc__text-error').remove();
            }

            calcNPO();

            $('.calc__space').each(function () {
                $(this).val(String($(this).val().replace(/[^0-9.]/g,'')).replace(/\B(?=(\d{3})+(?!\d))/g, " "));
            });
        });
    });

    $('.form-check-input').each(function () {
        $(this).on('change', function () {
            $salary.removeClass('calc__input-error');
            $('.calc__text-error').remove();
            $moneyStart.prop('disabled', false);
            calcNPO();
        });
    });

    $dateBirthday.datepicker({
        onSelect: function () {
            calcNPO();
        }
    });

    var calcNPOOne = function () {
        // Дата рождения
        var dateBirthday = moment($('#date-birthday').val(), "DD.MM.YYYY", true);

        // Размер взноса
        var moneyStart = $moneyStart.val().replace(/\s+/g, '');

        // Доходность
        var profit = Number($('#profit').val())/100;

        // Дата наступления пенсионных оснований
        var dateEnd = moment($('#date-end').val(), "DD.MM.YYYY");

        // Текущая дата
        var dateCurrent = moment().toDate();

        // Конец текущего года
        var dateEndYear = moment(dateCurrent).endOf('year');

        // Начало текущего года
        var dateStartYear = moment(dateCurrent).startOf('year');

        // Разница между текущей датой и окончанием года в днях
        var dateDiffYear = dateEndYear.diff(dateCurrent, 'days');

        // Срок выплат
        var periodPay = $('#periodPay').val();

        // Выбор процента от зарплаты
        if($percentCheck.is(':checked')) {
            $('.calc__text-error').remove();
            $moneyStart.prop('disabled', true);
            if($salary.val()) {
                moneyStart = ($salary.val().replace(/\s+/g, ''))*($percentSalary.val()/100);
            } else {
                $salary.addClass('calc__input-error');
                $salary.after('<span class="calc__text-error">Данное поле необходимо заполнить для расчета</span>');
            }
        }

        // Дата наступления пенсии
        var datePension = '';

        // Выбор пола
        if($male.is(':checked')) {
            datePension = moment(dateBirthday).add(60, 'years');
            if(dateBirthday.isValid()) {
                if(moment(dateCurrent).isAfter(datePension)) {
                    $.magnificPopup.open({
                        items:{src:'#popup-calc-old'},
                        type: 'inline',
                        midClick: true,
                        mainClass: 'mfp-fade'
                    });
                }
            }
        }

        if($female.is(':checked')) {
            datePension = moment(dateBirthday).add(55, 'years');
            if(dateBirthday.isValid()) {
                if(moment(dateCurrent).isAfter(datePension)) {
                    $.magnificPopup.open({
                        items:{src:'#popup-calc-old'},
                        type: 'inline',
                        midClick: true,
                        mainClass: 'mfp-fade'
                    });
                }
            }
        }

        // Накопительный период в годах
        var savePeriodYear = Math.abs(datePension.diff(dateStartYear, 'years'));
        var savePeriodMonth = moment.duration(((Math.abs(datePension.diff(dateStartYear, 'years', true))) % 1), 'years').asMonths().toFixed(0);

        if(savePeriodYear && !isNaN(savePeriodYear)) {
            $savePeriodYear.empty();
            $savePeriodYear.html(savePeriodYear);
        }

        if(savePeriodMonth && !isNaN(savePeriodMonth)) {
            $savePeriodMonth.empty();
            $savePeriodMonth.html(savePeriodMonth);
        }

        // Пенсия
        var pension = (Number(moneyStart)*(1+(dateDiffYear/365)*profit))*Math.pow(1+profit,savePeriodYear-1);

        // Партнерство
        if(moneyStart > 120000) {
            moneyStart = 120000;
        }

        var pension_corp = moneyStart*Math.pow((1+profit), savePeriodYear-1);

        var pensionCorpMonth = '';

        // Срочная (есть срок выплат) ежемесячная
        var fastPensionMonth = pension/12/periodPay;

        // Пожизненная пенсия
        var foreverPensionMoth = '';

        // Выбор пола
        if($male.is(':checked')) {
            // Пожизненная пенсия
            foreverPensionMoth = pension/12/tableDieManM12;
            pensionCorpMonth = pension_corp/12/tableDieManM4;
        }

        if($female.is(':checked')) {
            // Пожизненная пенсия
            foreverPensionMoth = pension/12/tableDieFemM12;
            pensionCorpMonth = pension_corp/12/tableDieFemM4;
        }

        // Кнопка пожизненно
        if($('#forever').is(':checked')) {
            if(foreverPensionMoth) {
                $pensionMonth.html(foreverPensionMoth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
            }
            if($('#work-sng').is(':checked')) {
                if(pensionCorpMonth) {
                    $pensionCorp.html(pensionCorpMonth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '))
                }
            } else {
                $pensionCorp.empty();
            }
        } else {
            if(fastPensionMonth) {
                $pensionMonth.html(Math.floor(fastPensionMonth).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
            }
            if($('#work-sng').is(':checked')) {
                if(pensionCorpMonth) {
                    $pensionCorp.html(pensionCorpMonth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '))
                }
            } else {
                $pensionCorp.empty();
            }
        }

        if(pension && !isNaN(pension)) {
            $pension.empty();
            $pension.html(pension.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
        } else {
            $pension.empty();
            $pension.html('___');
        }

        if(!moneyStart && (Number($percentSalary.val()) === 0)) {
            $pensionCorp.empty();
            $pension.empty();
            $pension.html('___');
            $pensionMonth.empty();
        }
    };

    var calcNPOYear = function () {
        // Дата рождения
        var dateBirthday = moment($('#date-birthday').val(), "DD.MM.YYYY", true);

        // Доходность
        var profit = Number($('#profit').val())/100;

        // Размер взноса
        var moneyStart = $moneyStart.val().replace(/\s+/g, '');

        // Текущая дата
        var dateCurrent = moment().toDate();

        // Конец текущего года
        var dateEndYear = moment(dateCurrent).endOf('year');

        // Начало текущего года
        var dateStartYear = moment(dateCurrent).startOf('year');

        // Разница между текущей датой и окончанием года в днях
        var dateDiffYear = Math.abs(dateStartYear.diff(dateCurrent, 'days'));

        // Срок выплат
        var periodPay = $('#periodPay').val();

        // Выбор процента от зарплаты
        if($percentCheck.is(':checked')) {
            $('.calc__text-error').remove();
            $moneyStart.prop('disabled', true);
            if($salary.val()) {
                moneyStart = ($salary.val().replace(/\s+/g, ''))*($percentSalary.val()/100);
            } else {
                $salary.addClass('calc__input-error');
                $salary.after('<span class="calc__text-error">Данное поле необходимо заполнить для расчета</span>');
            }
        }

        // Дата наступления пенсии
        var datePension = '';

        // Выбор пола
        if($male.is(':checked')) {
            datePension = moment(dateBirthday).add(60, 'years');
            if(dateBirthday.isValid()) {
                if(moment(dateCurrent).isAfter(datePension)) {
                    $.magnificPopup.open({
                        items:{src:'#popup-calc-old'},
                        type: 'inline',
                        midClick: true,
                        mainClass: 'mfp-fade'
                    });
                }
            }
        }

        if($female.is(':checked')) {
            datePension = moment(dateBirthday).add(55, 'years');
            if(dateBirthday.isValid()) {
                if(moment(dateCurrent).isAfter(datePension)) {
                    $.magnificPopup.open({
                        items:{src:'#popup-calc-old'},
                        type: 'inline',
                        midClick: true,
                        mainClass: 'mfp-fade'
                    });
                }
            }
        }

        // Накопительный период в годах
        var savePeriodYear = Math.abs(datePension.diff(dateStartYear, 'years'));
        var savePeriodMonth = moment.duration(((Math.abs(datePension.diff(dateStartYear, 'years', true))) % 1), 'years').asMonths().toFixed(0);

        if(savePeriodYear && !isNaN(savePeriodYear)) {
            $savePeriodYear.empty();
            $savePeriodYear.html(savePeriodYear);
        }

        if(savePeriodMonth && !isNaN(savePeriodMonth)) {
            $savePeriodMonth.empty();
            $savePeriodMonth.html(savePeriodMonth);
        }

        var d = profit/(1+profit);
        var S24 = (Math.pow(1+profit, savePeriodYear) - 1)/d;
        var Spred = moneyStart*S24;
        var Speriodend = Spred + Number(moneyStart);
        var b = moneyStart*profit/365*dateDiffYear*Math.pow(1+profit,savePeriodYear-1);
        var pension = Speriodend - b;

        // Партнерство
        if(moneyStart > 120000) {
            moneyStart = 120000;
        }

        var pension_corp = moneyStart*(((Math.pow(1+Number(profit), savePeriodYear-1)-1)/d)+2);

        var pensionCorpMonth = '';

        // Срочная (есть срок выплат) ежемесячная
        var fastPensionMonth = pension/12/periodPay;

        // Пожизненная пенсия
        var foreverPensionMoth = '';

        // Выбор пола
        if($male.is(':checked')) {
            // Пожизненная пенсия
            foreverPensionMoth = pension/12/tableDieManM12;
            pensionCorpMonth = pension_corp/12/tableDieManM4;
        }

        if($female.is(':checked')) {
            // Пожизненная пенсия
            foreverPensionMoth = pension/12/tableDieFemM12;
            pensionCorpMonth = pension_corp/12/tableDieFemM4;
        }

        if(pension && !isNaN(pension)) {
            $pension.empty();
            $pension.html(pension.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
        } else {
            $pension.empty();
            $pension.html('___');
        }

        // Кнопка пожизненно
        if($('#forever').is(':checked')) {
            if(foreverPensionMoth) {
                $pensionMonth.html(foreverPensionMoth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
            }
            if($('#work-sng').is(':checked')) {
                if(pensionCorpMonth) {
                    $pensionCorp.html(pensionCorpMonth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '))
                }
            } else {
                $pensionCorp.empty();
            }
        } else {
            if(fastPensionMonth) {
                $pensionMonth.html(Math.floor(fastPensionMonth).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
            }
            if($('#work-sng').is(':checked')) {
                if(pensionCorpMonth) {
                    $pensionCorp.html(pensionCorpMonth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '))
                }
            } else {
                $pensionCorp.empty();
            }
        }

        if(!moneyStart && (Number($percentSalary.val()) === 0)) {
            $pensionCorp.empty();
            $pension.empty();
            $pension.html('___');
            $pensionMonth.empty();
        }
    };

    var calcNPOMonth = function () {
        // Дата рождения
        var dateBirthday = moment($('#date-birthday').val(), "DD.MM.YYYY", true);

        // Доходность
        var profit = Number($('#profit').val())/100;

        // Размер взноса
        var moneyStart = $moneyStart.val().replace(/\s+/g, '');

        // Текущая дата
        var dateCurrent = moment().toDate();

        // Конец текущего года
        var dateEndYear = moment(dateCurrent).endOf('year');

        // Начало текущего года
        var dateStartYear = moment(dateCurrent).startOf('year');

        // Разница между текущей датой и началом года в днях
        var dateDiffYear = Math.abs(dateStartYear.diff(dateCurrent, 'days'));

        // Разница между текущей датой и началом года в месяцах
        var dateDiffMonth = Math.abs(dateStartYear.diff(dateCurrent, 'months'));

        // Выбор процента от зарплаты
        if($percentCheck.is(':checked')) {
            $('.calc__text-error').remove();
            $moneyStart.prop('disabled', true);
            if($salary.val()) {
                moneyStart = ($salary.val().replace(/\s+/g, ''))*($percentSalary.val()/100);
            } else {
                $salary.addClass('calc__input-error');
                $salary.after('<span class="calc__text-error">Данное поле необходимо заполнить для расчета</span>');
            }
        }

        // Дата наступления пенсии
        var datePension = '';

        // Выбор пола
        if($male.is(':checked')) {
            datePension = moment(dateBirthday).add(60, 'years');
            if(dateBirthday.isValid()) {
                if(moment(dateCurrent).isAfter(datePension)) {
                    $.magnificPopup.open({
                        items:{src:'#popup-calc-old'},
                        type: 'inline',
                        midClick: true,
                        mainClass: 'mfp-fade'
                    });
                }
            }
        }

        if($female.is(':checked')) {
            datePension = moment(dateBirthday).add(55, 'years');
            if(dateBirthday.isValid()) {
                if(moment(dateCurrent).isAfter(datePension)) {
                    $.magnificPopup.open({
                        items:{src:'#popup-calc-old'},
                        type: 'inline',
                        midClick: true,
                        mainClass: 'mfp-fade'
                    });
                }
            }
        }

        // Начало года наступления пенсии
        var datePensionStart = moment(datePension).startOf('year');

        // Разница между датой пенсии и началом года в месяцах
        var datePensionDiffMonth = datePension.diff(datePensionStart, 'months');

        // Накопительный период в годах
        var savePeriodYear = Math.abs(datePension.diff(dateStartYear, 'years'));
        var savePeriodMonth = Math.ceil(moment.duration(((Math.abs(datePension.diff(dateStartYear, 'years', true))) % 1), 'years').asMonths());

        if(savePeriodYear && !isNaN(savePeriodYear)) {
            $savePeriodYear.empty();
            $savePeriodYear.html(savePeriodYear);
        }

        if(savePeriodMonth && !isNaN(savePeriodMonth)) {
            $savePeriodMonth.empty();
            $savePeriodMonth.html(savePeriodMonth);
        }

        // Разница в днях между каждым месяцем
        var dateDiffEveryMonth = 0;
        var monthString = '';
        for(var i=0; i<dateDiffMonth; i++) {
            if(i<9) {
                monthString = '0' + (i+1);
            } else {
                monthString = i+1;
            }
            dateDiffEveryMonth += Math.abs(dateEndYear.diff(moment('01.'+monthString+'.'+moment(dateCurrent).year(), 'DD.MM.YYYY').toDate(), 'days'));
        }

        var dateStartMonth = moment(dateCurrent).startOf('month');
        var dateDiffLastDay = Math.abs(dateStartMonth.diff(dateCurrent, 'days'));

        var dateDiffStartYear = Math.abs(dateStartYear.diff(dateCurrent, 'days'));

        // Срок выплат
        var periodPay = $('#periodPay').val();

        // Выбор процента от зарплаты
        if($percentCheck.is(':checked')) {
            $('.calc__text-error').remove();
            if($salary.val()) {
                moneyStart = ($salary.val().replace(/\s+/g, ''))*($percentSalary.val()/100);
            } else {
                $salary.addClass('calc__input-error');
                $salary.after('<span class="calc__text-error">Данное поле необходимо заполнить для расчета</span>');
            }
        }

        var d = profit/(1+profit);
        var d12 = 12*(1-Math.pow(1-d,1/12));
        var S3 = (Math.pow(1+profit,savePeriodYear)-1)/profit;
        var Spredvar = (moneyStart*12*S3*profit/d12).toFixed(2);
        var Scon = Number(Spredvar)+Number(moneyStart*savePeriodMonth);
        var rigthFormula = (moneyStart*(Math.trunc(dateDiffStartYear/30)+profit/365*(dateDiffEveryMonth+dateDiffLastDay))*Math.pow(1+profit,savePeriodYear-1)).toFixed(2);
        var pension = (Scon - rigthFormula);

        // Партнерство
        // var pension_corp = moneyStart*12*((((Math.pow(1+profit, savePeriodYear-1)-1)/d)+1))+moneyStart*(Number(datePensionDiffMonth)+1)-moneyStart*dateDiffMonth*Math.pow(1+profit, savePeriodYear-1);
        var pension_corp = (Math.min(moneyStart*(12 - dateDiffMonth), 120000)*Math.pow(1+profit,savePeriodYear-1)+Math.min(moneyStart*(Number(datePensionDiffMonth)+1), 120000)+Math.min(moneyStart,10000)*(12*((Math.pow(1+profit,savePeriodYear-2)-1)/d+1))).toFixed(2);

        var pensionCorpMonth = '';

        // Срочная (есть срок выплат) ежемесячная
        var fastPensionMonth = pension/12/periodPay;

        // Пожизненная пенсия
        var foreverPensionMoth = '';

        // Выбор пола
        if($male.is(':checked')) {
            // Пожизненная пенсия
            foreverPensionMoth = pension/12/tableDieManM12;
            pensionCorpMonth = pension_corp/12/tableDieManM4;
        }

        if($female.is(':checked')) {
            // Пожизненная пенсия
            foreverPensionMoth = pension/12/tableDieFemM12;
            pensionCorpMonth = pension_corp/12/tableDieFemM4;
        }

        if(pension && !isNaN(pension)) {
            $pension.empty();
            $pension.html(pension.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
        } else {
            $pension.empty();
            $pension.html('___');
        }

        // Кнопка пожизненно
        if($('#forever').is(':checked')) {
            if(foreverPensionMoth) {
                $pensionMonth.html(foreverPensionMoth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
            }
            // если работник СНГ
            if($('#work-sng').is(':checked')) {
                if(pensionCorpMonth) {
                    $pensionCorp.html(pensionCorpMonth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '))
                }
            } else {
                $pensionCorp.empty();
            }
        } else {
            if(fastPensionMonth) {
                $pensionMonth.html(Math.floor(fastPensionMonth).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
            }
            if($('#work-sng').is(':checked')) {
                if(pensionCorpMonth) {
                    $pensionCorp.html(pensionCorpMonth.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '))
                }
            } else {
                $pensionCorp.empty();
            }
        }

        if(!moneyStart && (Number($percentSalary.val()) === 0)) {
            $pensionCorp.empty();
            $pension.empty();
            $pension.html('___');
            $pensionMonth.empty();
        }

    };

    var calcNPO = function () {

        // Значение из таблицы смертности Муж_2022_ХМАО_m=12 (для 60 лет)
        tableDieManM12 = 14.4720744629737;
        // Значение из таблицы смертности Жен_2022_ХМАО_m=12 (для 55 лет)
        tableDieFemM12 = 20.5064725513624;
        // Значение из таблицы смертности Муж_2022_ХМАО_m=4 (для 60 лет)
        tableDieManM4 = 14.5554077963071;
        // Значение из таблицы смертности Жен_2022_ХМАО_m=4 (для 55 лет)
        tableDieFemM4 = 20.5898058846958;

        if($('#period-one').is(':checked')) {
            calcNPOOne();
        }

        if($('#period-year').is(':checked')) {
            calcNPOYear();
        }

        if($('#period-month').is(':checked')) {
            calcNPOMonth();
        }
    }
});

$(document).on('click', '.print-btn', function(e) {
    e.preventDefault();
    var $pension = $('#pension'),
        $pensionMonth = $('#pension_month'),
        $pensionCorp = $('#pension_corp'),
        $dateBirthday = $('#date-birthday'),
        $savePeriodYear = $('#savePeriodYear'),
        $savePeriodMonth = $('#savePeriodMonth'),
        $moneyStart = $('#money-start'),
        $male = $('#male'),
        $female = $('#female'),
        $percentSalary = $('#percentSalary'),
        $periodPayOutput = $('#periodPayOutput'),
        $salary = $('#salary'),
        $profit = $('#profit'),
        $workSng = $('#work-sng');
        $percentCheck = $('#percent-check');
        $forever = $('#forever');

    // сохраняем значения переменных в localStorage
    localStorage.setItem('date-birthday', $dateBirthday.val());
    localStorage.setItem('pension', $pension.text());
    localStorage.setItem('pension_month', $pensionMonth.text());
    localStorage.setItem('pension_corp', $pensionCorp.text());
    localStorage.setItem('savePeriodYear', $savePeriodYear.text());
    localStorage.setItem('savePeriodMonth', $savePeriodMonth.text());
    localStorage.setItem('money-start', $moneyStart.val());
    localStorage.setItem('male', $male.is(':checked'));
    localStorage.setItem('female', $female.is(':checked'));
    localStorage.setItem('percentSalary', $percentSalary.val());
    localStorage.setItem('percent-check', $percentCheck.is(':checked'));
    localStorage.setItem('periodPayOutput', $periodPayOutput.text());
    localStorage.setItem('salary', $salary.val());
    localStorage.setItem('profit', $profit.val());
    localStorage.setItem('work-sng', $workSng.prop('checked'));
    localStorage.setItem('forever', $forever.prop('checked'));

    $.ajax({
        url: '/pens-calc/print.php',
        type: 'GET',
        success: function(data) {
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            iframe.contentDocument.write(data);
            iframe.contentDocument.close();

            iframe.onload = function() {
                replaceContent(iframe.contentWindow);
                document.body.removeChild(iframe);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX error! Status:', textStatus, 'Error:', errorThrown);
        }
    });
});

function replaceContent(printWindow) {
    const doc = printWindow.document;

    doc.getElementById('pension').textContent = localStorage.getItem('pension');
    doc.getElementById('pension_month').textContent = localStorage.getItem('pension_month');
    doc.getElementById('pension_corp').textContent = localStorage.getItem('pension_corp');
    doc.getElementById('date-birthday').value = localStorage.getItem('date-birthday');
    doc.getElementById('savePeriodYear').textContent = localStorage.getItem('savePeriodYear');
    doc.getElementById('savePeriodMonth').textContent = localStorage.getItem('savePeriodMonth');
    doc.getElementById('money-start').value = localStorage.getItem('percent-check') === 'true' ? "" : localStorage.getItem('money-start');
    doc.getElementById('male').checked = localStorage.getItem('male') === 'true';
    doc.getElementById('female').checked = localStorage.getItem('female') === 'true';
    doc.getElementById('percentSalaryOutput').value = localStorage.getItem('percentSalary');
    doc.getElementById('percent-check').checked = localStorage.getItem('percent-check') === 'true';
    doc.getElementById('periodPayOutput').textContent = localStorage.getItem('periodPayOutput');
    doc.getElementById('salary').value = localStorage.getItem('salary');
    doc.getElementById('profitOutput').textContent = localStorage.getItem('profit');
    doc.getElementById('work-sng').checked = localStorage.getItem('work-sng') === 'true';
    doc.getElementById('forever').checked = localStorage.getItem('forever') === 'true';

    printWindow.print();
    
    localStorage.removeItem('date-birthday');
    localStorage.removeItem('pension');
    localStorage.removeItem('pension_month');
    localStorage.removeItem('pension_corp');
    localStorage.removeItem('savePeriodYear');
    localStorage.removeItem('savePeriodMonth');
    localStorage.removeItem('money-start');
    localStorage.removeItem('male');
    localStorage.removeItem('female');
    localStorage.removeItem('percentSalary');
    localStorage.removeItem('percent-check');
    localStorage.removeItem('periodPayOutput');
    localStorage.removeItem('salary');
    localStorage.removeItem('profit');
    localStorage.removeItem('work-sng');
    localStorage.removeItem('forever');
}
/* End */
;; /* /local/components/sng/calc/templates/.default/script.js?169745039128144*/
