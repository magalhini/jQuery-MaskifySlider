#Maskify Slider 0.2a
##a jQuery plugin

### Warning
This plugin is still in (very slow) development and it's likely that you'll find a few errors, as it isn't quite ready for public use yet.

### Demo: http://ricardofilipe.com/projects/maskify/

###What is is:

MaskifySlider is an extremely simple plugin which enables you to create an image slider with the effect of an image mask. The plugin will automically offset the images position according to the spacing between their placeholders, giving the impression that it's only one masked image.

###How it works:

You simply pass in the set of images you want to display, and the set of placeholders to display the images in. These can be far apart of close together. The plugin doesn't account for images which are smaller than the width of the placeholders + their margins, so be sure that your images are big enough to fit it.

###How to use:

Assuming this HTML...

```html
 <div class="widgets">
    <div class="sources">
        <img src="img.jpg" alt="">
        <img src="img2.jpg" alt="">
        <img src="img3.jpg" alt="">
        <img src="img4.jpg" alt="">
    </div>
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
</div>
```
And then call:

```javascript
    $('.widgets').Maskify({
        'canvas': '.circle',       // elements in which to show the img
        'marginTop': 200,          // px to offset images from the top (default: 0)
        'slider': true,            // slide the images (default: true)
        'delay': 7000,             // image transition delay (default: 5000)
        'transitionLength': 1000,  // duration of the transition (default: 1000)
        'cssTransition' : true,    // prefer CSS transitions. false means JS. (default: true)
        'percentage': true         // use if your containers use % width (default: false)
    });
```

The gallery images, the ones to display, can be anywhere inside your parent selector (see example above).

### CSS or JS?

The plugin supports both ways of transitions: CSS3 and JS.
By default it will use CSS3, so make sure to include the keyframes animations provided in the CSS files which accompany this project. If you simply want to use JS, you'll need no extra CSS.

### Known bugs

This plugin is still in development. There is a known issue when using border-radius on the placeholder/canvas elements in Webkit and Opera, which don't deal very well when overflowing img tags as their children.

In webkit, you can prevent this issue by using the -webkit-mask property, which will hide the overflow images but will hide any borders, box-shadows, outlines, etc, in your elements.
In Opera I still couldn't find a way to make this work. If you need to use this in Opera, it's better to turn off the slider at this point.

Please note that the 'percentage' option is still a work in progress; it will only work if you're using the grid effect, ie, without margins, as the percentage values still don't account for those.
Will fix this soon.