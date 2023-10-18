
; /* Start:"a:4:{s:4:"full";s:30:"/links/script.js?1691667456506";s:6:"source";s:16:"/links/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function() {
    $('.zoomable').on('click', function() {
        if ($(this).hasClass('zoomed')) {
            $(this).removeClass('zoomed');
        } else {
            $('.zoomable').removeClass('zoomed'); // Убрать zoomed со всех изображений
            $(this).addClass('zoomed');
        }
    });

    $('body').on('click', function(e) {
        if (!$(e.target).hasClass('zoomable')) {
            $('.zoomable').removeClass('zoomed');
        }
    });
});
/* End */
;; /* /links/script.js?1691667456506*/
