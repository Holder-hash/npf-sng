
; /* Start:"a:4:{s:4:"full";s:78:"/local/components/sng/presentation/templates/.default/script.js?16860351876791";s:6:"source";s:63:"/local/components/sng/presentation/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function () {
    $('.presentation-link').on('click', function(e){
        e.preventDefault();
        $.magnificPopup.open({
            items:{src:'#popup-presentation'},
            type: 'inline',
            midClick: true,
            mainClass: 'mfp-fade'
        })
    });
    $('.presentation-print').on('click', function(e){
        e.preventDefault();
        printPdf('https://npf-sng.ru/upload/medialibrary/6ed/tsaowwcceypkmfd2nevuajb9jcidwgw8.PDF');
    });
    $('#presentation-submit').on('click', function(e){

        var $this = $(this),
            $popup = $('#popup-presentation'),
            $email = $('#presentation-email'),
            $globalError = $popup.find('.js_global_error').eq(0),
            $globalErrorSpan = $globalError.find('span').eq(0),
            link = window.location.href;

        $globalError.addClass('hide');

        if ($email.val()) {
            $email.parents('.form__item').eq(0).removeClass('form__item--error');

            var fd = new FormData();
            fd.append('email', $email.val());

            fd.append('form', 'presentation');
            fd.append('submit',1);

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
                        $popup.find('.popup__form-desc').eq(0).html('<div style="text-align: justify;">Презентация успешно отправлена.</div>');
                        $popup.find('.popup__body-input-wrap').eq(0).hide();
                        $popup.find('.popup__title').eq(0).text('Обращение отправлено');
                        $this.hide();
                    } else {
                        if (json.errors.length) {
                            $globalError.removeClass('hide');
                            $globalErrorSpan.html(json.errors.join("<br>"));
                        }
                    }
                },
                beforeSend: function(){
                    $this.prop('disabled', true);
                    $this.addClass('is-loading');
                },
                complete: function(){
                    $this.prop('disabled', false);
                    $this.removeClass('is-loading');
                },
                error: function (e, err) {
                    console.log(e);
                    console.log(err);
                }
            });
        } else {
            if (!$email.val()) {
                $email.parents('.form__item').eq(0).addClass('form__item--error');
            } else {
                $email.parents('.form__item').eq(0).removeClass('form__item--error');
            }
            $popup.find('.form__item--error').eq(0).focus();
        }
        return false;
    });

    // If absolute URL from the remote server is provided, configure the CORS
    // header on that server.
    var url = '/upload/medialibrary/6ed/tsaowwcceypkmfd2nevuajb9jcidwgw8.PDF';

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    // var pdfjsLib = window['../../../../local/markup/dist/js/pdf.js'];
    // var pdfjsViewer = window['../../../../local/markup/dist/js/pdf_viewer.js'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../../../../local/markup/dist/js/pdfjs.worker.js';

    var pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 1,
        css_units = 668/500,
        container = document.getElementById('canvas-viewer'),
        eventBus = new pdfjsViewer.EventBus();


    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) {
        // pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function(page) {
            var viewport = page.getViewport({scale: scale});
            var custom_scale = container.clientWidth / (viewport.width * css_units);

            container.innerHTML = '';

            var pdfPageView = new pdfjsViewer.PDFPageView({
                container: container,
                id: num,
                scale: custom_scale,
                defaultViewport: page.getViewport(custom_scale),
                eventBus: eventBus,
                // We can enable text/annotations layers, if needed
                textLayerFactory: new pdfjsViewer.DefaultTextLayerFactory(),
                annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
            });
            // Associates the actual page with the view, and drawing it
            pdfPageView.setPdfPage(page);
            return pdfPageView.draw();
        });
    }

    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    /**
     * Displays previous page.
     */
    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }
    document.getElementById('prev').addEventListener('click', onPrevPage);

    /**
     * Displays next page.
     */
    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }
    document.getElementById('next').addEventListener('click', onNextPage);

    /**
     * Asynchronously downloads PDF.
     */
    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;

        // Initial/first page rendering
        renderPage(pageNum);
    });

    function printPdf(url) {
        var iframe = this._printIframe;
        if (!this._printIframe) {
            iframe = this._printIframe = document.createElement('iframe');
            document.body.appendChild(iframe);

            iframe.style.display = 'none';
            iframe.onload = function() {
                setTimeout(function() {
                    iframe.focus();
                    iframe.contentWindow.print();
                }, 1);
            };
        }

        iframe.src = url;
    }

});
/* End */
;; /* /local/components/sng/presentation/templates/.default/script.js?16860351876791*/
