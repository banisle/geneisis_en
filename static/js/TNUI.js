// thenet UI LIB 0.7
// banisle@gmail.com

'use strict';
var context = window,
    $root = $(document.documentElement).addClass("js"),
    tmpInput = document.createElement("input"),
    isTouch = ("ontouchstart" in context),
    isMobile = ("orientation" in context) || isTouch || window.IS_MOBILE === true,
    supportPlaceholder = ("placeholder" in tmpInput),
    detectIe = get_version_of_IE();

isTouch && $root.addClass("touch");
isMobile && $root.addClass("mobile");

function get_version_of_IE() { //ie aegent 체크
    var word;
    var agent = navigator.userAgent.toLowerCase();
    // IE old version ( IE 10 or Lower ) 
    if (navigator.appName == "Microsoft Internet Explorer") word = "msie ";
    // IE 11 
    else if (agent.search("trident") > -1) word = "trident/.*rv:";
    // Microsoft Edge  
    else if (agent.search("edge/") > -1) word = "edge/";
    // 그외, IE가 아니라면 ( If it's not IE or Edge )  
    else return -1;
    var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
    if (reg.exec(agent) != null) return parseInt(RegExp.$1 + RegExp.$2);
    return -1;
}

if (!(window.console && console.log)) {
    console = {
        log: function () {},
        debug: function () {},
        info: function () {},
        warn: function () {},
        error: function () {}
    };
}


if (typeof Function.prototype.bind === "undefined") {
    Function.prototype.bind = function () {
        var fn = this,
            args = arraySlice.call(arguments),
            object = args.shift();
        return function (context) {
            var local_args = args.concat(arraySlice.call(arguments));
            if (this !== window) {
                local_args.push(this)
            }
            return fn.apply(object, local_args)
        }
    }
}

var TNUI = TNUI || {};

TNUI.module = (function () {
    // (sta) TNUI returm module
    return {
        
        // mark : accoUi
        accoUi: function () {
            var uiAccoWrap = $('.ui-accordian'),
                uiAccobtn = uiAccoWrap.find('.ui-btn-acco'),
                uiAccoCt = uiAccoWrap.find('.ui-acco-ct'),
                ArrBtn = Array.prototype.slice.call(uiAccobtn),
                ArrSubBtn = ArrBtn.filter(function (i) {
                    return $(i).hasClass('sub');
                }),
                opendSt = $('[data-open]'),
                tarCtH;

            // console.log( ArrSubBtn );


            //click evt
            uiAccobtn.on('click', function (e) {
                var t = $(this),
                    allowMultiple = t.closest(uiAccoWrap).attr('data-allow-multiple') == 'true',
                    isExpanded = t.attr('aria-expanded') == 'true',
                    isSub = t.closest(uiAccoWrap).hasClass('sub-accord'),
                    tarId = t.attr('aria-controls'),
                    tarCt = t.closest(uiAccoWrap).find('#' + tarId),
                    motSpd = parseInt(t.closest(uiAccoWrap).attr('data-trans-speed')),
                    tarCtH = t.closest(uiAccoWrap).find(tarCt).height(),
                    tarCtAH = t.closest(uiAccoWrap).find(tarCt).css('height', 'auto').height();

                if (tarCt.is(':animated')) {
                    return
                }

                if (!isExpanded) {
                    //다중 열기 불가능
                    if (!allowMultiple) {
                        t.closest(uiAccoWrap).find(uiAccoCt).animate({
                            'height': 0
                        }, 0);
                        t.closest(uiAccoWrap).find(uiAccobtn).attr('aria-expanded', 'false').removeAttr('aria-disabled');
                        t.closest(uiAccoWrap).find('li').removeClass('active');
                        t.attr('aria-disabled', 'true');
                    };

                    t.attr('aria-expanded', 'true');
                    t.closest('li').addClass('active');
                    //서브 어코디언 클릭시 부모의 높이값 증가
                    if (isSub) {
                        var pH = t.closest(uiAccoCt).height();
                        t.closest(uiAccoCt).height(parseInt(pH) + parseInt(tarCtAH));
                    }
                    t.closest(uiAccoWrap).find(tarCt).stop().height(tarCtH).animate({
                        'height': tarCtAH + 'px'
                    }, motSpd);


                } else {

                    //다중 열기 불가능
                    if (!allowMultiple) {
                        if (isExpanded) {
                            return
                        };
                        t.attr('aria-expanded', 'false');
                        t.closest(uiAccoWrap).find(uiAccoCt).animate({
                            'height': 0
                        }, motSpd);
                        t.closest(uiAccoWrap).find(uiAccobtn).attr('aria-expanded', 'false');
                        t.closest(uiAccoWrap).find(tarCt).stop().animate({
                            'height': tarCtAH + 'px'
                        }, motSpd);
                        t.removeAttr('aria-disabled');
                        t.closest('li').addClass('active');
                        return;
                    };

                    t.attr('aria-expanded', 'false')
                    //서브 어코디언 클릭시 부모의 높이값 감소
                    if (isSub) {
                        var pH = t.closest(uiAccoCt).height();
                        t.closest(uiAccoCt).height(parseInt(pH) - parseInt(tarCtAH));
                    }
                    t.closest(uiAccoWrap).find(tarCt).stop().animate({
                        'height': 0
                    }, motSpd);
                    t.closest('li').removeClass('active');
                }

                e.preventDefault();

            }).on('focus', function () {
                $(this).closest(uiAccoWrap).addClass('focus');
            }).on('blur', function () {
                $(this).closest(uiAccoWrap).removeClass('focus');
            });

            // 키 바인딩
            uiAccoWrap.on('keydown', function (e) {
                var target = e.target;
                var key = e.which.toString();


                // 33 = Page Up, 34 = Page Down
                var ctrlModifier = (e.ctrlKey && key.match(/33|34/));

                // Is this coming from an accordion header?
                if (uiAccobtn) {
                    // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
                    // 38 = Up, 40 = Down
                    if (key.match(/38|40/) || ctrlModifier) {
                        var index = ArrBtn.indexOf(target);
                        var direction = (key.match(/34|40/)) ? 1 : -1;
                        var length = ArrBtn.length;
                        var newIndex = (index + length + direction) % length;

                        //서브 아코디언 있을경우 
                        if ($(target).is('.sub-has') && $(target).attr('aria-expanded') == 'false') {
                            direction == 1 ? newIndex = newIndex + ArrSubBtn.length : newIndex;
                        } else if ($(target).is('.ui-sub-next') && $(target).closest('[data-li]').prev().find(uiAccobtn).attr('aria-expanded') == 'false') {
                            direction == -1 ? newIndex = newIndex - ArrSubBtn.length : newIndex;
                        };

                        ArrBtn[newIndex].focus();

                        e.preventDefault();
                    } else if (key.match(/35|36/)) {
                        // 35 = End, 36 = Home keyboard operations
                        switch (key) {
                            // Go to first accordion
                            case '36':
                                ArrBtn[0].focus();
                                break;
                                // Go to last accordion
                            case '35':
                                ArrBtn[ArrBtn.length - 1].focus();
                                break;
                        }
                        e.preventDefault();

                    }

                }
            });



            //init
            // uiAccoCt.hide();
            opendSt.trigger('click');
            uiAccoWrap.each(function () {
                var t = $(this);
                t.find('.ui-btn-acco').last().addClass('last');
            });
            // 서브 어코디언 있을때 다음 어코디언(키맵핑)에 클래스 추가
            if ($('.sub-has').length !== 0) $('.sub-has').closest('[data-li]').next().find(uiAccobtn).addClass('ui-sub-next');

            console.log('accoUi');

        },
       
        // mark : init
        init: function () {
            // var t = this;

            // t.tabUi();
            // t.selectUi();
            // t.tooltipUi();
            // t.modalUi();
            // t.scrollUi();
            // t.accoUi();
        }

    }
    // (end) TNUI returm module



})();

