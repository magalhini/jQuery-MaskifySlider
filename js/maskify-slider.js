(function ($) {
    $.fn.Maskify = function (settings) {

        var options = $.extend({
            'canvas' : [],
            'marginTop' : 0,
            'slider' : true,
            'delay' : 5000,
            'transitionLength' : 1000,
            'cssTransition' : true,
            'percentage' : false
        }, settings);

        /* For CSS transitions, find which browser we're using */
        function findTransition(el) {
            var properties = [ 'transition', 'WebkitTransition', 'msTransition', 'MozTransition', 'OTransition' ],
                prop;

            while (properties.length) {
                prop = properties.shift();
                if (el[0].style[prop] != undefined) {
                    return prop;
                }
            }
        }

        return this.each(function () {

            var elem        = $(this),
                items       = elem.find(options.canvas),
                sources     = elem.find('img'),
                galleryImgs = [],
                itemLength  = 0,
                index       = 0,
                unit        = options.percentage ? '%' : 'px',
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

                sources.css('display', 'none'); // hide the passed images sources
                setPositions();
            }

            /* Get width and height of our canvas elements */
            function getImageSizes(items) {
                var itemWidth = items.eq(0).width(),
                    itemHeight = items.eq(0).height();

                return {
                    width: itemWidth,
                    height: itemHeight
                };
            }

            /* Calculate position and offsets to give the masked effect */
            function setPositions() {
                var sizes = getImageSizes(items);

                var margins = 0,
                    offsetLeft = 0,
                    isJsTransition = options.cssTransition ? false : true,
                    animationProp = isJsTransition ? findTransition(galleryImgs[0]) : null;
                    // If using JS to animate, remove all css3 transition properties. The above gets the proper -vendor to detect the transition property.

                $.each(galleryImgs, function (i, obj) {
                    var $this = obj;

                    margins += i !== 0 ? parseInt($this.css('margin-left') + $this.css('margin-right'), 10) : 0;

                    // Remove transition properties if we're using JS.
                    if (isJsTransition) {
                        $this.get(0).style[animationProp] = 'none';
                    }

                    // As of now, percentage widths only work with elements without margin :(
                    // Will try to fix it soon!
                    if (!options.percentage) {
                        offsetLeft = (- sizes.width * itemLength / itemLength * i)  - margins + unit;
                    } else {
                        offsetLeft = (-100 * i) + '%';
                    }

                    $this.css({
                        'margin-left': offsetLeft,
                        'margin-top' : options.marginTop ? -options.marginTop + unit : 0
                    });
                });

                setImage(index); // Set current gallery position
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

                /* Create a self-invoking fn that grabs every image element.
                If the transition is CSS only, add a second timer to wait for the element to fade out (therefore not needing to listen to transitionEnd events). */

                (function walk(img) {
                    if (options.cssTransition === true) {
                        // animate via CSS (requires .fadeOut and .showUp classes in the .css file)
                        setTimeout(function () {
                            img.removeClass('showUp').addClass('fadeOut');
                            setTimeout(function () {
                                img.attr('src', sources.eq(newIndex).attr('src'));
                                img.addClass('showUp');
                            }, options.transitionLength);
                            if (imgsClone.length) walk(imgsClone.shift());
                        }, 250);
                    } else {
                        // or, we animate via javascript.
                        img.fadeOut(function () {
                            setTimeout(function () {
                                img.attr('src', sources.eq(newIndex).attr('src')).fadeIn();
                                if (imgsClone.length) walk(imgsClone.shift());
                            }, 250);
                        });
                    }
                }(imgsClone.shift()));
            }
        });
    };
})(jQuery);