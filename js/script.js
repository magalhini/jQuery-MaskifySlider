(function ($) {

    $.fn.Maskify = function (settings) {

        var options = $.extend({
            'canvas' : '',
            'marginTop' : 0,
            'slider' : true,
            'delay' : 5000
        }, settings);

        return this.each(function () {

            var elem        = $(this),
                items       = elem.find(options.canvas),
                sources     = elem.find('img'),
                galleryImgs = [],
                itemLength  = 0,
                itemWidth   = 0,
                itemHeight  = 0,
                index       = 0,
                isWebkit    = $.browser.webkit ? true : false,
                autoSlider  = options.slider ? createAutoslide(options.delay) : null;

            createImages();

            /* Create the automatic slide transition */
            function createAutoslide(time) {
                var interval = setInterval(function () {
                    next();
                }, time);

                return interval;
            }

            /* Append image tags to each canvas element */
            function createImages() {
                $.each(items, function (i, obj) {
                    var el = $(this),
                        imgEl = $('<img>');

                    el.append(imgEl);
                    galleryImgs.push(imgEl);
                    imgEl.addClass('item-' + (i + 1));

                    itemLength += 1;
                });

                setPositions();
            }

            /* Get width and height of our canvas elements */
            function getImageSizes(items) {
                itemWidth = items.eq(0).width();
                itemHeight = items.eq(0).height();
            }

            /* Calculate position and offsets to give the masked effect */
            function setPositions() {
                getImageSizes(items);

                var margins = 0;

                $.each(galleryImgs, function (i, obj) {
                    var $this = obj;

                    margins += i !== 0 ? parseInt($this.css('margin-left') + $this.css('margin-right'), 10) : 0;

                    $this.css({
                        'margin-left': (- itemWidth * itemLength / itemLength * i)  - margins + 'px',
                        'margin-top' : options.marginTop ? -options.marginTop + '%' : 0
                    });
                });

                setImage(index);
            }

            /* Next image */
            function next() {
                index = index < sources.length - 1 ? index += 1 : 0;
                setImage(index);
            }

            /* Previous image */
            function previous() {
                index = index !== 0 ? index -= 1 : sources.length - 1;
                setImage(index);
            }

            /* Sets the new image based on the current inde */
            function setImage(newIndex) {
                var imgsClone = galleryImgs.slice(0);

                (function walk(img) {
                    img.fadeOut(function () {
                        setTimeout(function () {
                            img.attr('src', sources.eq(newIndex).attr('src')).fadeIn();
                            if (imgsClone.length) {
                                walk(imgsClone.shift());
                            }
                        }, 100);
                    });
                }(imgsClone.shift()));

                /*
                $.each(galleryImgs, function (i, img) {
                    img.fadeOut(function () {
                        img.attr('src', sources.eq(newIndex).attr('src')).fadeIn();
                    });
                }); */
            }

            /* For debugging */
            window.next = next;
            window.previous = previous;
        });
    };
})(jQuery);