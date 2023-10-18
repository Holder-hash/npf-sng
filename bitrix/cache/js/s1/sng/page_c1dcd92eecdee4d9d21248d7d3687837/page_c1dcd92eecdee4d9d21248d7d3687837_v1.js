
; /* Start:"a:4:{s:4:"full";s:85:"/bitrix/components/bitrix/map.yandex.view/templates/.default/script.js?15650967611540";s:6:"source";s:70:"/bitrix/components/bitrix/map.yandex.view/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
if (!window.BX_YMapAddPlacemark)
{
	window.BX_YMapAddPlacemark = function(map, arPlacemark)
	{
		if (null == map)
			return false;

		if(!arPlacemark.LAT || !arPlacemark.LON)
			return false;

		var props = {};
		if (null != arPlacemark.TEXT && arPlacemark.TEXT.length > 0)
		{
			var value_view = '';

			if (arPlacemark.TEXT.length > 0)
			{
				var rnpos = arPlacemark.TEXT.indexOf("\n");
				value_view = rnpos <= 0 ? arPlacemark.TEXT : arPlacemark.TEXT.substring(0, rnpos);
			}

			props.balloonContent = arPlacemark.TEXT.replace(/\n/g, '<br />');
			props.hintContent = value_view;
		}

		var obPlacemark = new ymaps.Placemark(
			[arPlacemark.LAT, arPlacemark.LON],
			props,
			{balloonCloseButton: true}
		);

		map.geoObjects.add(obPlacemark);

		return obPlacemark;
	}
}

if (!window.BX_YMapAddPolyline)
{
	window.BX_YMapAddPolyline = function(map, arPolyline)
	{
		if (null == map)
			return false;

		if (null != arPolyline.POINTS && arPolyline.POINTS.length > 1)
		{
			var arPoints = [];
			for (var i = 0, len = arPolyline.POINTS.length; i < len; i++)
			{
				arPoints.push([arPolyline.POINTS[i].LAT, arPolyline.POINTS[i].LON]);
			}
		}
		else
		{
			return false;
		}

		var obParams = {clickable: true};
		if (null != arPolyline.STYLE)
		{
			obParams.strokeColor = arPolyline.STYLE.strokeColor;
			obParams.strokeWidth = arPolyline.STYLE.strokeWidth;
		}
		var obPolyline = new ymaps.Polyline(
			arPoints, {balloonContent: arPolyline.TITLE}, obParams
		);

		map.geoObjects.add(obPolyline);

		return obPolyline;
	}
}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:74:"/local/components/sng/callback/templates/.default/script.js?16508623523782";s:6:"source";s:59:"/local/components/sng/callback/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function () {
    $('#callback-phone').mask('+7 (000) 000-00-00');
    $('.callback-link').on('click', function(e){
        e.preventDefault();
        $.magnificPopup.open({
            items:{src:'#popup-feedback'},
            type: 'inline',
            midClick: true,
            mainClass: 'mfp-fade'
        })
    });
    $('#callback-submit').on('click', function(e){
        var $this = $(this),
            $popup = $('#popup-feedback'),
            $name = $('#callback-name'),
            $phone = $('#callback-phone'),
            $theme = $('#callback-theme'),
            $personalData = $('#callback-personal-data'),
            $globalError = $popup.find('.js_global_error').eq(0),
            $globalErrorSpan = $globalError.find('span').eq(0),
            link = window.location.href;

        $globalError.addClass('hide');
        if ($name.val() && $phone.val() && $personalData.is(':checked') && $theme.val()) {
            $name.parents('.form__item').eq(0).removeClass('form__item--error');
            $phone.parents('.form__item').eq(0).removeClass('form__item--error');
            $personalData.parents('.form__item').eq(0).removeClass('form__item--error');
            $theme.parents('.form__item').eq(0).removeClass('form__item--error');

            $.ajax({
                method: 'POST',
                data: {
                    name: $name.val(),
                    phone: $phone.val(),
                    personal_data: 'Y',
                    theme: $('#callback-theme option:selected').text(),
                    form: 'callback',
                    submit: 1
                },
                url: link,
                cache: false,
                dataType: 'json',
                success: function (json) {
                    if (json.success) {
                        $popup.find('.popup__form-desc').eq(0).css('padding-top', '30px').text('Ваша заявка отправлена. Специалист свяжется с вами в ближайшее время.');
                        $popup.find('.popup__body-input-wrap').eq(0).hide();
                        $this.hide();
                    } else {
                        if (json.errors.length) {
                            $globalError.removeClass('hide');
                            $globalErrorSpan.html(json.errors.join("<br>"));
                        }
                    }
                },
                error: function (e, err) {
                    console.log(e);
                    console.log(err);
                }
            });
        } else {
            if (!$name.val()) {
                $name.parents('.form__item').eq(0).addClass('form__item--error');
            } else {
                $name.parents('.form__item').eq(0).removeClass('form__item--error');
            }
            if (!$phone.val()) {
                $phone.parents('.form__item').eq(0).addClass('form__item--error');
            } else {
                $phone.parents('.form__item').eq(0).removeClass('form__item--error');
            }
            if (!$theme.val()) {
                $theme.parents('.form__item').eq(0).addClass('form__item--error');
            } else {
                $theme.parents('.form__item').eq(0).removeClass('form__item--error');
            }
            if (!$personalData.is(':checked')) {
                $personalData.parents('.form__item').eq(0).addClass('form__item--error');
            } else {
                $personalData.parents('.form__item').eq(0).removeClass('form__item--error');
            }

            $popup.find('.form__item--error').eq(0).focus();
        }

        return false;
    });
});
/* End */
;
; /* Start:"a:4:{s:4:"full";s:75:"/local/components/sng/writefond/templates/.default/script.js?16939849518983";s:6:"source";s:60:"/local/components/sng/writefond/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function () {
    var $writeFondCounterCurrent = $('#writefond-counter-current'),
        $writefondFile = $('#writefond-file'),
        $writeFondText = $('#writefond-text'),
        $popup = $('#popup-writefond'),
        $globalError = $popup.find('.js_global_error').eq(0),
        $globalErrorSpan = $globalError.find('span').eq(0),
        maxlength = 500,
        currentFiles = [];

    $('#writefond-phone').mask('+7 (000) 000-00-00');

    $('#writefond-phone').on('keypress', function(e) {
        var value = $(this).val();
        if (value.length === 0 && e.key === '8') {
            e.preventDefault();
            $(this).val('+7 ');
        }
    });

    $('.writefond-link').magnificPopup({
        items: { src: '#popup-writefond' },
        type: 'inline',
        midClick: true,
        mainClass: 'mfp-fade'
    });

    function updateFilesList(files) {
        currentFiles = [];
        for (var i = 0; i < files.length; i++) {
            currentFiles.push(files[i]);
        }
    }

    function validateFiles(files, allowedExtensions) {
        var errors = [],
            filesDom = '',
            filesResults = '',
            filesSize = 0,
            extensions = [],
            filesCount = files.length,
            filesChose = 'Всего выбрано файлов: ';

        if (filesCount > 0) {
            for (var i = 0; i < filesCount; i++) {
                var file = files[i];
                filesDom += '<li class="file__item"><span class="file__index">' + (i + 1) + '</span>. <span class="file__name">' + file.name + '</span> - <span class="file__size">' + (parseFloat(file.size / 1024).toFixed(0)) + ' Кб</span> <button class="files__item--remove" data-index="' + i + '">Удалить</button></li>';
                filesSize += file.size;
                extensions.push(file.name.substring(file.name.lastIndexOf('.') + 1));
            }

            filesResults = '<hr><div><span class="file__current">' + parseFloat(filesSize / 1024).toFixed(0) + ' Кб</span> / 14 000 Кб</div>';

            if (extensions.some(ext => !allowedExtensions.includes(ext))) {
                errors.push('Неверный формат файла');
            }

            if (filesSize > (14 * 1024 * 1024)) {
                errors.push('Превышен максимальный объем в 14 Мб');
            }
        }

        return {
            errors, 
            filesDom,
            filesResults,
            filesCount,
            filesChose
        };
    }

    function handleFilesChange(update = true) {
        var $this = $(this),
            $allowedExtensions = $this.data('writefond-input').split(', ');

        if (update) {
            updateFilesList(this.files);
        }

        $globalError.add('.file__total-number, .file__total-text, .file__list, .file__results').addClass('hide');

        var fileData = validateFiles(currentFiles, $allowedExtensions);

        if (fileData.errors.length > 0) {
            $globalError.removeClass('hide');
            $globalErrorSpan.html(fileData.errors.join("<br>"));
            return false;
        }

        $('.file__total-number').html(fileData.filesCount).removeClass('hide');
        $('.file__list').html(fileData.filesDom).removeClass('hide');
        $('.file__results').html(fileData.filesResults).removeClass('hide');
        $('.file__total-text').html(fileData.filesChose).removeClass('hide');
    }

    $writefondFile.on('change', function() { handleFilesChange.call(this); });

    $(document).on('click', '.files__item--remove', function() {
        var fileIndex = $(this).data('index');
        currentFiles.splice(fileIndex, 1);
        handleFilesChange.call($writefondFile[0], false); 
    });

    function handleTextChange(e) {
        e.target.value = e.target.value.substring(0, maxlength);
        $writeFondCounterCurrent.html(e.target.value.length);
    }

    function handleSubmit(event) {
        event.preventDefault(); 

        var formData = {
            name: $('#writefond-name').val(),
            email: $('#writefond-email').val(),
            phone: $('#writefond-phone').val(),
            text: $('#writefond-text').val(),
            theme: $('#writefond-theme').val(),
            personalData: $('#writefond-personal-data').is(':checked')
        };

        var errors = validateForm(formData);
        if (errors.length > 0) {
            $globalError.removeClass('hide');
            $globalErrorSpan.html(errors.join("<br>"));
            return;
        }

        var fd = new FormData();
        fd.append('name', formData.name);
        fd.append('email', formData.email);
        fd.append('phone', formData.phone);
        fd.append('text', formData.text);
        fd.append('theme', $('#writefond-theme option:selected').text());
        fd.append('personal_data', 'Y');

        var $this = $(this),
            $files = $writefondFile.prop('files'),
            link = window.location.href; 
            
        if ($files) {
            for (var i = 0; i < $files.length; i++) {
                fd.append('file[' + i + ']', $files[i]);
            }

            for (var j = 0; j < $files.length; j++) {
                fd.append('fileArr_' + j, $files[j]);
            }
        }

        fd.append('form', 'writefond');
        fd.append('submit', 1);

        $.ajax({
            method: 'POST',
            data: fd,
            url: link,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                var json = JSON.parse(data);
                if (json.success === 1) {
                    $popup.find('.popup__form-desc').eq(0).html('<div style="text-align: justify;">Обращаем Ваше внимание, что в случае неподтверждения получения Вашего обращения в течение 3-х рабочих дней, необходимо обратиться в Фонд по телефону: (3462) 55-05-77.</div>');
                    $popup.find('.popup__body-input-wrap').eq(0).hide();
                    $popup.find('.popup__title').eq(0).text('Обращение отправлено');
                    $globalError.addClass('hide');
                    $globalErrorSpan.html('');
                    $this.hide();
                } else {
                    if (json.errors.length) {
                        $globalError.removeClass('hide');
                        $globalErrorSpan.html(json.errors.join("<br>"));
                    }
                }
            },
            beforeSend: function () {
                $this.prop('disabled', true);
                $this.addClass('is-loading');
            },
            complete: function () {
                $this.prop('disabled', false);
                $this.removeClass('is-loading');
            },
            error: function (e, err) {
                console.log(e);
                console.log(err);
            }
        });
    }

    function validateEmail(email) {
        var emailRegEx = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegEx.test(email);
    }

    function validateForm(formData) {
        var errors = [];

        function validateField($field, condition, errorMessage) {
            if (condition) {
                $field.parents('.form__item').eq(0).addClass('form__item--error');
                errors.push(errorMessage);
            } else {
                $field.parents('.form__item').eq(0).removeClass('form__item--error');
            }
        }

        validateField($('#writefond-name'), !formData.name, 'Пожалуйста, заполните имя.');
        validateField($('#writefond-email'), !formData.email || !validateEmail(formData.email), 'Пожалуйста, заполните адрес электронной почты корректно.');
        validateField($('#writefond-phone'), !formData.phone, 'Пожалуйста, заполните номер телефона.');
        validateField($('#writefond-theme'), !formData.theme, 'Пожалуйста, выберите тему.');
        validateField($('#writefond-text'), !formData.text, 'Пожалуйста, внесите текст обращения.');
        validateField($('#writefond-personal-data'), !formData.personalData, 'Пожалуйста, предоставьте согласие на обработку персональных данных.');

        return errors;
    }

    $writefondFile.change(handleFilesChange);
    $writeFondText.on('change keyup paste', handleTextChange);
    $('#writefond-submit').on('click', handleSubmit);
});
/* End */
;; /* /bitrix/components/bitrix/map.yandex.view/templates/.default/script.js?15650967611540*/
; /* /local/components/sng/callback/templates/.default/script.js?16508623523782*/
; /* /local/components/sng/writefond/templates/.default/script.js?16939849518983*/
