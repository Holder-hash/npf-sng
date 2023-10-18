
; /* Start:"a:4:{s:4:"full";s:74:"/local/components/sng/contract/templates/.default/script.js?16178780382117";s:6:"source";s:59:"/local/components/sng/contract/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function() {
    var slideIndex = 1,
        $typeTextTitle = $('.type_text-title'),
        $typeTextSubTitle = $('.type_text-subtitle');

    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("contract__hero");
        if(n > slides.length) {
            slideIndex = 1;
        }
        if(n < slides.length) {
            slideIndex = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex - 1].style.display = "block";
    }

    function plusSlide() {
        showSlides(slideIndex += 1);
    }

    (function(){
        setInterval(function (){
            plusSlide();
            $typeTextTitle.each(function(){
                $(this).show();
                $(this).animate_Text();
            });
            $typeTextSubTitle.each(function () {
                $(this).show();
                $(this).animate_Text(2000);
            });
        }, 9000);
    })();

    $.fn.animate_Text = function(time) {
        var string = this.text();
        return this.each(function(){
           var $this = $(this);
           $this.html(string.replace(/./g, '<span class="new">$&</span>'));
           if (time) {
               setTimeout(function() {
                   $this.find('span.new').each(function (i, el) {
                       setTimeout(function() {
                           $(el).addClass('div_opacity');
                       }, 50 * i);
                   });
               }, time);
           } else {
               $this.find('span.new').each(function (i, el) {
                   setTimeout(function() {
                       $(el).addClass('div_opacity');
                   }, 50 * i);
               });
           }
        });
    }

    $typeTextTitle.each(function(){
        $(this).show();
        $(this).animate_Text();
    });
    $typeTextSubTitle.each(function () {
        $(this).show();
        $(this).animate_Text(2000);
    });
});
/* End */
;
; /* Start:"a:4:{s:4:"full";s:76:"/local/components/sng/calc-banner/templates/.default/script.js?1611045762741";s:6:"source";s:62:"/local/components/sng/calc-banner/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function() {
    (function() {
        $('#calc-banner-close').click(function () {
            var $data = {calc: 'true'};
            $.ajax({
                method: 'POST',
                data: $data,
                url: '/local/ajax/calc.php',
                cache: false,
                dataType: 'json',
                success: function(json){
                    console.log(json);
                    if(json.success) {
                        $('#footer__calc').hide();
                    }
                },
                error: function(e, err) {
                    console.log(e);
                    console.log(err);
                }
            });
        });
    })();
});
/* End */
;; /* /local/components/sng/contract/templates/.default/script.js?16178780382117*/
; /* /local/components/sng/calc-banner/templates/.default/script.js?1611045762741*/
