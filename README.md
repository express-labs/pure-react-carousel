# pure-react-carousel
A highly impartial suite of React components that can be assembled by the consumer to create a carousel with almost no limits on DOM structure or CSS styles.

My goal was to create a 100% ReactJS carousel that doesn't try to impose structure or styles that need to be defeated in order to match your site's design standards. Are you tired of fighting some other developer's CSS or DOM structure?  If so, this carousel is for you.

Carousels: Love them or hate them.  However, if you are a React developer, and you have to use a carousel, why not use one that was...

- Developed from the ground-up in React.
- Is not a wrapper or port of some non-react carousel like Slick or Flickity.
- Fully supports touch events.
- Is aria compliant.
- Is responsive by default.
- Lets you assemble the carousel components in the DOM in any order you desire so long as they are all children of a single \<CarouselProvider /> component.
- Lets you put any class names, properties, attributes, or styles on any of the components that you need.
- Supports ES6 and commonjs.
- Has 100% test coverage. Solid!

## How To Use It.
Let's make a simple carousel with three slides, a next button, and a back button.

1. Add the module to your project.

`npm i -S pure-react-carousel`

2. Import only the required components into your project.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
```  

3. Using Webpack or Rollup?  Does your Webpack config have a loader for "css" files?  If so, import the css as well.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
```   

4. Put a CarouselProvider component in your code.  This allows the other carousel components to communicate with each other.  The only required properties are the orientation, naturalSlideWidth, and naturalSlideHeight.  The naturalSlideWidth and naturalSlideHeight are used to create an aspect ratio for each slide.  Since the carousel is responsive by default, it will stretch to fill in the width of it's parent container.  The CarouselProvider must also have children.  We'll add the children in the next step.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
      ></CarouselProvider>
    );
  }
}
```

5. Place the components in any order you wish as long as they are children of a single CarouselProvider component. Some components have ancestor/descendant relationships but they don't have to be direct relatives.  For example: Slides need to go inside of a Slider.
Slides require an index.  Chances are, a lot of the time, you're going to be populating the slides from data and looping through the data, so it would be easy to add an index in your loop.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
      >
        <Slider>
          <Slide index={0}>I am the first Slide.</Slide>
          <Slide index={1}>I am the second Slide.</Slide>
          <Slide index={2}>I am the third Slide.</Slide>
        </Slider>
      </CarouselProvider>
    );
  }
}
```

6. Add some buttons so the user can navigate forward and backwards.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
      >        
        <Slider>
          <Slide index={0}>I am the first Slide.</Slide>
          <Slide index={1}>I am the second Slide.</Slide>
          <Slide index={2}>I am the third Slide.</Slide>
        </Slider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
      </CarouselProvider>
    );
  }
}
```


That's it. You have a super basic Carousel.  

There are other components you can add, like ButtonFirst, ButtonLast, an Image component, and even an ImageWithZoom component that zooms on mouse hover or finger tap.  

Obviously, you can customize the heck out of the layout.  If you need to bury your Slider component in 18 parent divs, go for it.  It will still do it's job.  Feel free to add the className property to any of the Components to further customize your carousel.  Or, hook into the many BEM named default CSS class names built into the carousel components.

Some components have a ancestor / descendant relationship but they don't have to be direct descendants of the parent.  For example, Slide needs to be a descendant of Slider, but you can put a bunch of div wrappers around slide if you need to.  A good analogy are the html tags `table` and `tr`.  The `tr` tag needs to be a descendant of `table`, but it doesn't have to be a direct descendant.  You can have a `tbody` between them in the tree.

## Docs

**A general note:**  You can append your own className to every single component in this library.  Also, any props not consumed by a component are passed through to the root element of each component. This makes all the components in this library HIGHLY configurable.  You can, for example, add your one event handlers, or change aria tags, etc.

### \<CarouselProvider />
| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string\|node] | | **Yes** | Children is a special React property.  Basically, the CarouselProvider needs to wrap other Carousel components and HTML |
| className | [string\|null] | null | No | Optional className string that will be appended to the component's className string |
| currentSlide | number | 0 | No | \<Slide \> to display on initial render. The indexing of \<Slide /> components starts with 0. |
| hasMasterSpinner | bool | false | No | When true, a spinner will cover \<Slider /> component until all \<Image \> and \<ImageWithZoom \> are done loading images.  If there are no \<Image /> or \<ImageWithZoom> components, the spinner will spin until this property is set to false |
| **naturalSlideHeight** | number | | **Yes** | The natural height of each <\Slide > component. ** |
| **naturalSlideWidth** | number | | **Yes** | The natural width of each <\Slide > component. ** |
| orientation | string | "horizontal" | No | Possible values are "horizontal" and "vertical".  Let's you have a horizontal or vertical carousel. |
| step | number | 1 | No | The number of slides to move when pressing the \<ButtonBack /> and \<ButtonNext /> buttons.|
| tag | string | 'div' | No | The HTML element to use for the provider. |
| **totalSlides** | number |  | **Yes** | Always set this to match the total number of \<Slide > components in your carousel |
| touchEnabled | boolean | true | No | Set to true to enable touch events |
| visibleSlides | number | 1 | No | The number of slides to show at once.  This number should be <= totalSlides |

#### The CarouselProvider component creates the following pseudo HTML by default:

```HTML
<props.tag|div class="carousel [props.className]" ...props>
  [props.children]
</props.tag|div>
```

**__More about naturalSlideWidth and naturalSlideHeight__
The carousel is responsive and by default will flex to the full width of the <Slider \> parent container.  It's up to you to contain the carousel width via css.  Each slide will be the same height to width ratio ([intrinsic ratio](https://alistapart.com/d/creating-intrinsic-ratios-for-video/example2.html)). CarouselProvider needs to know the default size of each \<Slide />.  Note: you can make the carousel non-responsive by setting the width of <Slider \>to a fixed css unit, like pixels. There are many other ways to make the carousel non-responsive.

### \<Slider />
A Slider is a viewport that masks slides.  The Slider component must wrap one or more Slide components.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string\|node] | | **Yes** | Children is a special React property.  Basically, the CarouselProvider needs to wrap other components and/or HTML |
| className | [string\|null] | null | No | Optional className string that will be appended to the component's className string. |
| style | object | {} | No | Optional css styles to add to the Slider.  Note: internal css properties take precedence over any styles specified in the styles object |
| trayTag | string | 'ul' | No | The HTML tag to used for the tray (the thing that holds all the slides and moves the slides back and forth.) |  
| onMasterSpinner | [function\|null] | null | No | Optional callback function that is called when the Master Spinner is visible.  Requires that \<CarouselProvider /> set hasMasterSpinner to true |

#### The Slider component creates the following pseudo HTML by default.

```HTML
<div class="carousel__slider [carousel__slider--vertical|carousel__slider--horizontal] [props.className]" aria-live="polite" style="[props.style]" ...props>
  <div class="carousel__slider-tray-wrapper [carousel__slider-tray-wrap--vertical|carousel__slider-tray-wrap--horizontal]">
    <props.trayTag|ul class="carousel__slider-tray [carousel__slider-tray--vertical|carousel__slider-tray--horizontal]">
      [props.children]
    </props.trayTag|ul>
    <div class="carousel__master-spinner-container">
      <div class="carousel__spinner" />
    </div>
  </div>
</div>
```

### \<Slide />
The Slide component is a container with an intrinsic ratio computed by the CarouselProvider naturalSlideWidth and naturalSlideHeight properties.  By default, only one slide is visible in the Slider at a time.  You can change this by altering the visibleSlides property of the CarouselProvider.  Slide components also contain a div that acts as an aria compliant focus ring when the Slide receives focus either by using a keyboard tab, mouse click, or touch.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| className | [string\|null] | null | No | Optional className string that will be appended to the component's className string. |
| **index** | number | | **Yes** | You must consecutively number the \<Slide > components in order starting with zero. |
| innerClassName | [string\|null] | null | No | Optional className string that will be appended to an internal HTML element created by the Component. Best to just use Chrome Dev Tools to inspect the demo app or check the source code for \<Slide /> |
| innerTag | string | 'div' | No | The inner HTML element for each Slide. |
| onBlur | [function\|null] | null | No | Optional callback function that is called after the internal onBlur function is called. It is passed the React synthetic event |
| onFocus | [function\|null] | null | No | Optional callback function that is called after the internal onFocus function is called. It is passed the React synthetic event |
| tabIndex | [number\|null] | null | No | When null, the Carousel will set this automatically.  99.9% of the time, you're going to want to leave this alone and let the carousel handle tabIndex automatically. |
| tag | string | 'li' | No | The root HTML element for each Slide. |

#### The Slide component creates the following pseudo HTML by default:
```HTML
<props.tag|li class="carousel__slide [carousel__slide--focused] [props.className]" tabIndex="[props.tabIndex]" aria-hidden="[computed internally]" onFocus="[props.onFocus]" onBlur="[props.onBlur]" style="[props.style]" ...props>
  <props.innerTag|div class="carousel__inner-slide [props.innerClassName]">
    [props.children]
    <div class="carousel__slide-focus-ring" />
  <props.innerTag|div>
</props.tag|li>
```

### Dot
A Dot component is a HTML button.  Dots directly correlate to slides.  Clicking on a slide causes it to scroll into the left-most visible slot of slider. Currently visible slides cause the correlating Dot to become disabled.  You can override the auto-disable feature by setting disabled to false (see table below)

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string\|node] | | **Yes** | Children is a special React property.  Basically, the CarouselProvider needs to wrap other components and/or HTML |
| className | [string\|null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean\|null] | null | No | Null means Dot will automatically determine if this button is disabled. Setting this to true will force the button to be disabled.  Setting this to false will prevent the button from ever being disabled. |
| onClick | [function\|null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |
| **slide** | number | | **Yes** | There must be a matching \<Slide /> component with a matching index property. Example: `<Dot slide={0} />` will match `<Slide index={0} />`|

#### The Dot component creates the following pseudo HTML by default:

```HTML
<button class="carousel__dot carousel__dot--[slide] [carousel__dot--selected] [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.children]
</button>
```

### DotGroup
A compound component that creates a bunch of Dot's automatically for you.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| children | [string\|node\|null] | null | Yes | Any child HTML will appear AFTER the dots. |
| className | [string\|null] | null | No | Optional className string that will be appended to the component's className string. |
| dotNumbers | boolean | false | No | Setting to true automatically adds text numbers the dot buttons starting at 1. |

#### The DotGroup component creates the following pseudo HTML by default:

```HTML
<div class="carousel__dot-group [props.className]" ...props>
  <!-- button repeats for each slide -->
  <button class="carousel__dot carousel__dot--[slide] [carousel__dot--selected]">
    [numbers or blank]
  </button>
  [props.children]
</div>
```

## More Documentation to Come
I promise to add docs for every component.  In the meantime, feel free to download and run the demo app.  Looking at the code might help you out.

## Dev Workflow
- `npm run dev` starts a local development server, opens the dev page with your default browser, and watches for changes via livereload
- `npm run build` compiles commonjs and ES modules and places them in the dist directory
- `npm test` runs test using Jest + Enzyme.
