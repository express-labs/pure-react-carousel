[![Build Status](https://travis-ci.org/express-labs/pure-react-carousel.svg?branch=master)](https://travis-ci.org/express-labs/pure-react-carousel)
[![Known Vulnerabilities](https://snyk.io/test/github/express-labs/pure-react-carousel/badge.svg)](https://snyk.io/test/github/express-labs/pure-react-carousel)

Created by  
[![Express Logo](/dev/media/express-logo.svg)](http://www.express.com)

# pure-react-carousel


A highly impartial suite of React components that can be assembled by the consumer to create a responsive and aria compliant carousel with almost no limits on DOM structure or CSS styles.

My goal was to create a 100% ReactJS carousel that doesn't try to impose structure or styles that need to be defeated in order to match your site's design standards. Are you tired of fighting some other developer's CSS or DOM structure?  If so, this carousel is for you.

Carousels: Love them or hate them.  However, if you are a React developer, and you have to use a carousel, why not use one that was...

- Developed from the ground-up in React.
- Is not a wrapper or port of some non-react carousel like Slick or Flickity.
- Fully supports touch events.
- Is aria compliant.
- Is responsive by default.
- Lets you assemble the carousel components in the DOM in any order you desire so long as they are all children of a single &lt;CarouselProvider /> component.
- Lets you put any class names, properties, attributes, or styles on any of the components that you need.
- Supports ES6 and commonjs.
- Has 100% test coverage. Solid!

### ghpage
https://express-labs.github.io/pure-react-carousel/

# Table of contents
  * [🛠 Tutorial](#-tutorial)
  * [Component Properties (props)](#component-properties-props)
  * [Components](#components)
    * [&lt;CarouselProvider /&gt;](#carouselprovider-)
    * [&lt;Slider /&gt;](#slider-)
    * [&lt;Slide /&gt;](#slide-)
    * [&lt;Dot /&gt;](#dot-)
    * [&lt;DotGroup /&gt;](#dotgroup-)
    * [&lt;Image /&gt;](#image-)
    * [&lt;ButtonBack /&gt;](#buttonback-)
    * [&lt;ButtonNext /&gt;](#buttonnext-)
    * [&lt;ButtonFirst /&gt;](#buttonfirst-)
    * [&lt;ButtonLast /&gt;](#buttonlast-)
    * [&lt;ButtonPlay /&gt;](#buttonplay-)
    * [WithStore() Higher Order Component](#withstore-higher-order-component)
  * [TypeScript usage](#typescript-usage)
    * [WithStore() Higher Order Component](#withstore-higher-order-component-1)
    * [Examples](#examples)
  * [Dev Workflow](#dev-workflow)

## 🛠 Tutorial
Let's make a simple carousel with three slides, a next button, and a back button.

1. Add the module to your project.

  `npm i -S pure-react-carousel`

2. Import only the required components into your project.

  ```JSX
  import React from 'react';
  import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
  ```  

3. Using Webpack or Rollup?  Does your Webpack config have a loader for "css" files?  If so, import the css as well.

  ```JSX
  import React from 'react';
  import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
  import 'pure-react-carousel/dist/react-carousel.es.css';
  ```   

4. Put a CarouselProvider component in your code.  This allows the other carousel components to communicate with each other.  The only required properties are the orientation, naturalSlideWidth, and naturalSlideHeight.  The naturalSlideWidth and naturalSlideHeight are used to create an aspect ratio for each slide.  Since the carousel is responsive by default, it will stretch to fill in the width of it's parent container.  The CarouselProvider must also have children.  We'll add the children in the next step.

  ```JSX
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

5. Place the components in any order you wish as long as they are children of a single CarouselProvider component. Some components have ancestor/descendant relationships but they don't have to be direct relatives.  For example: Slides need to go inside of a Slider. Slides also require a sequentially numbered index prop starting at zero.  Chances are, a lot of the time, you're going to be populating the slides from data and looping through the data, so it would be easy to add an index in your loop.

  ```JSX
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

  ```JSX
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

## Component Properties (props)

#### classname
You can attach your own className property to each and every component in this library and it will be appended to the list of classes.  It's appended so that it has more specificity in a tie, allowing your CSS to more easily override any internal styles without resorting to using !important.

#### styles
You can attach your own styles property to each component in this library, however, any styles generated by the component take precedence over any styles you provide.  Some components, like the `<Slider />`, need their internal styles to function correctly.

#### event props (onClick, onFocus, onBlur, etc)
You can supply your own event callbacks to any component.  Your event callbacks are called after a component's internal event handling.  Basically, your callback becomes a callback to our callback.  Say that 10 times fast. :-)

#### all other props
Any remaining props not consumed by the component are passed directly to the root element of a component unless otherwise noted in that component's documentation. This makes all the components in this library HIGHLY configurable.  You can, for example, add your own event handlers, or change aria tags, etc.

## Components

### &lt;CarouselProvider />
| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property.  Basically, the CarouselProvider needs to wrap other Carousel components and JSX |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string |
| currentSlide | number | 0 | No | &lt;Slide \> to display ONLY when CarouselProvider mounts. The indexing of &lt;Slide /> components starts with 0.  This is a poorly named variable and will be deprecated in a future version. |
| hasMasterSpinner | bool | false | No | When true, a spinner will cover &lt;Slider /> component until all &lt;Image \> and &lt;ImageWithZoom \> are done loading images.  If there are no &lt;Image /> or &lt;ImageWithZoom> components, the spinner will spin until this property is set to false |
| interval | number | 5000 | No | Number of milliseconds to wait when the auto slideshow is active |
| isPlaying | bool | false | No | Setting this to true starts an auto slideshow. After "interval" milliseconds, the slider will move by "step" slides either forward or backwards depending on the value of "playDirection". |
| lockOnWindowScroll | bool | false | No | When set to true, scrolling of the carousel slides are disabled while the browser window is scrolling |
| **naturalSlideHeight** | number | | **Yes** | The natural height of each <\Slide > component. ** |
| **naturalSlideWidth** | number | | **Yes** | The natural width of each <\Slide > component. ** |
| orientation | string | "horizontal" | No | Possible values are "horizontal" and "vertical".  Let's you have a horizontal or vertical carousel. |
| playDirection | ['forward'&#124;'backward' ] | 'forward' | No | The direction for the auto slideshow |
| step | number | 1 | No | The number of slides to move when pressing the &lt;ButtonBack /> and &lt;ButtonNext /> buttons.|
| dragStep | number | 1 | No | The number of slides to move when performing a short touch drag.|
| tag | string | 'div' | No | The HTML element to use for the provider. |`
| **totalSlides** | number |  | **Yes** | Always set this to match the total number of &lt;Slide > components in your carousel |
| touchEnabled | boolean | true | No | Set to true to enable touch events |
| dragEnabled | boolean | true | No | Set to true to enable mouse dragging events |
| visibleSlides | number | 1 | No | The number of slides to show at once.  This number should be <= totalSlides |

#### The CarouselProvider component creates the following pseudo HTML by default:

```HTML
<props.tag|div class="carousel [props.className]" ...props>
  [props.children]
</props.tag|div>
```

**__More about naturalSlideWidth and naturalSlideHeight__**
The carousel is responsive and by default will flex to the full width of the <Slider \> parent container.  It's up to you to contain the carousel width via css.  Each slide will be the same height to width ratio ([intrinsic ratio](https://alistapart.com/d/creating-intrinsic-ratios-for-video/example2.html)). CarouselProvider needs to know the default size of each &lt;Slide />.  Note: you can make the carousel non-responsive by setting the width of <Slider \>to a fixed css unit, like pixels. There are many other ways to make the carousel non-responsive.

### &lt;Slider />
A Slider is a viewport that masks slides.  The Slider component must wrap one or more Slide components.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property.  Basically, the Slider needs to wrap other components and/or JSX |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| classNameAnimation| [string&#124;null] | null | No |Optional className string. The slider uses the css transform property, applying translateX to move the slider tray east and west for a horizontal slider, and translateY to move the slider north and south for a vertical slider.   The actual animation is the result of applying a CSS3 transition effect.  If you supply your own classNameAnimation class, the default transition is disabled and ONLY the transitions specified by the classNameAnimation class are applied. Learn more about [CSS3 transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions). |
| classNameTray | [string&#124;null] | null | No | Optional className string that is applied to the Slider's tray. The "tray" is the DOM element that contains the slides. The type of DOM element is specified by the trayTag property |
| classNameTrayWrap | [string&#124;null] | null | No | Optional className string that is applied to a div that surrounds the Slider's tray |
| moveThreshold | number | 0.1 | No | Threshold to control the drag distance that triggers a scroll to the next or previous slide. (slide width or height * moveThreshold = drag pixel distance required to scroll) |
| onMasterSpinner | [function&#124;null] | null | No | Optional callback function that is called when the Master Spinner is visible.  Requires that &lt;CarouselProvider /> set hasMasterSpinner to true |
| spinner | function | null | No |  Optional inline JSX (aka "render props") to render your own custom spinner.  Example `() => <MyCustomSpinnerComponent />`  If left blank, the default spinner is used. |
| style | object | {} | No | Optional css styles to add to the Slider.  Note: internal css properties take precedence over any styles specified in the styles object |
| trayTag | string | 'ul' | No | The HTML tag to used for the tray (the thing that holds all the slides and moves the slides back and forth.) |

#### The Slider component creates the following pseudo HTML by default.

```HTML
<div class="carousel__slider [carousel__slider--vertical|carousel__slider--horizontal] [props.className]" aria-live="polite" style="[props.style]" ...props>
  <div class="carousel__slider-tray-wrapper [carousel__slider-tray-wrap--vertical|carousel__slider-tray-wrap--horizontal][props.classNameTrayWrap]">
    <props.trayTag|ul class="carousel__slider-tray [props.classNameAnimation] [carousel__slider-tray--vertical|carousel__slider-tray--horizontal] [props.classNameTray]">
      [props.children]
    </props.trayTag|ul>
    <div class="carousel__master-spinner-container">
      <div class="carousel__spinner" />
    </div>
  </div>
</div>
```

#### How to Change the Default Transition Animation

- Read the documentation for the classNameAnimation property on the Slider component.
- Read about [CSS3 transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions).
- Create your own CSS class that uses a CSS3 transition.
- Pass the CSS class you create to the classNameAnimation property of Slider.

### &lt;Slide />
The Slide component is a container with an intrinsic ratio computed by the CarouselProvider naturalSlideWidth and naturalSlideHeight properties.  By default, only one slide is visible in the Slider at a time.  You can change this by altering the visibleSlides property of the CarouselProvider.  Slide components also contain a div that acts as an aria compliant focus ring when the Slide receives focus either by using a keyboard tab, mouse click, or touch.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| classNameHidden | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string when the slide is not visible. |
| classNameVisible | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string when the slide is visible. |
| **index** | number | | **Yes** | You must consecutively number the &lt;Slide > components in order starting with zero. |
| innerClassName | [string&#124;null] | null | No | Optional className string that will be appended to an internal HTML element created by the Component. Best to just use Chrome Dev Tools to inspect the demo app or check the source code for &lt;Slide /> |
| innerTag | string | 'div' | No | The inner HTML element for each Slide. |
| onBlur | [function&#124;null] | null | No | Optional callback function that is called after the internal onBlur function is called. It is passed the React synthetic event |
| onFocus | [function&#124;null] | null | No | Optional callback function that is called after the internal onFocus function is called. It is passed the React synthetic event |
| tabIndex | [number&#124;null] | null | No | When null, the Carousel will set this automatically.  99.9% of the time, you're going to want to leave this alone and let the carousel handle tabIndex automatically. |
| tag | string | 'li' | No | The root HTML element for each Slide. |

#### The Slide component creates the following pseudo HTML by default:
```HTML
<props.tag|li class="carousel__slide [carousel__slide--focused] [props.className] [props.classNameVisible|props.classNameHidden] [carousel__slide--hidden|carousel__slide--visible]" tabIndex="[props.tabIndex]" aria-hidden="[computed internally]" onFocus="[props.onFocus]" onBlur="[props.onBlur]" style="[props.style]" ...props>
  <props.innerTag|div class="carousel__inner-slide [props.innerClassName]">
    [props.children]
    <div class="carousel__slide-focus-ring" />
  <props.innerTag|div>
</props.tag|li>
```

### &lt;Dot />
A Dot component is a HTML button.  Dots directly correlate to slides.  Clicking on a dot causes it's correlating slide to scroll into the left-most visible slot of slider. The dots for currently visible slides cause are disabled.  You can override the auto-disable feature by setting disabled to false (see table below)

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property.  Basically, the Dot component needs to wrap other components and/or JSX |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean&#124;null] | null | No | Null means Dot will automatically determine if this button is disabled. Setting this to true will force the button to be disabled.  Setting this to false will prevent the button from ever being disabled. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |
| **slide** | number | | **Yes** | There must be a matching &lt;Slide /> component with a matching index property. Example: `<Dot slide={0} />` will match `<Slide index={0} />`|

#### The Dot component creates the following pseudo HTML by default:

```HTML
<button class="carousel__dot carousel__dot--[slide] [carousel__dot--selected] [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.children]
</button>
```

### &lt;DotGroup />
A compound component that creates a bunch of Dot's automatically for you.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| children | [string&#124;node&#124;null] | null | No | Any JSX wrapped by this component will appear AFTER the dots. |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
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

### &lt;Image />

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| alt | string | "" | No | Specifies an alternate text for an image, if the image cannot be displayed. |
| children | [string&#124;node&#124;null] | null | Yes | Any optional JSX wrapped by the Image component |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| **hasMasterSpinner** | **bool** |  | **Yes** | **If set to true, a spinner will cover the entire slider viewport until all Image components with hasMasterSpinner set to true are finished loading images. It only takes one Image component with hasMasterSpinner to enable the master spinner. **  |
| isBgImage | bool | false | No | Setting this to true makes the image load as a background image.  Any child JSX (see children property) will appear on top of the image. If set to false, no image will appear unless your child JSX displays the image via an image tag or some other means. |
| onError | [func&#124;null] | null | No | Callback function called if the image defined by the src property fails to load.  This Callback is fired after the Image component's internal handleImageError method. |
| onLoad |  [func&#124;null] | null | No | Callback function called if the image defined by the src property loads successfully.  This Callback is fired after the Image component's internal renderSuccess method. |
| renderError| [func&#124;null] | null | No | When defined, if an image fails to load, this function is called.  It must return JSX which will be rendered instead of the broken image. |
| renderLoading | [func&#124;null] | null | No | When defined, this function is called while the image is loading.  It must return JSX which will be rendered instead of the loading image. |
| **src** | **string** | | **Yes** | **URL of the image** |
| tag | string | "img" | No | The element that will receive the image. Another option might be to set this to "div". Any tag besides "img" will result in the image being loaded as the css background-image for that tag. |

### &lt;ButtonBack />
A button for moving the slider backwards. Backwards on a horizontal carousel means "move to the left".  Backwards on a vertical carousel means "move to the top".  The slider will traverse an amount of slides determined by the step property of CarouselProvider.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property.  Basically, the ButtonnBack component needs to wrap other components and/or JSX |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean&#124;null] | null | No | Null means ButtonBack will automatically determine if this button is disabled. Setting this to true will force the button to be disabled.  Setting this to false will prevent the button from ever being disabled. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |

#### The ButtonBack component creates the following pseudo HTML by default:

```HTML
<button class="carousel__back-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.children]
</button>
```

### &lt;ButtonNext />
A button for moving the slider forwards. Forwards on a horizontal carousel means "move to the right".  Backwards on a vertical carousel means "move to the bottom".  The slider will traverse an amount of slides determined by the step property of CarouselProvider.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property.  Basically, the ButtonNext component needs to wrap other components and/or JSX |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean&#124;null] | null | No | Null means ButtonNext will automatically determine if this button is disabled. Setting this to true will force the button to be disabled.  Setting this to false will prevent the button from ever being disabled. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |

#### The ButtonNext component creates the following pseudo HTML by default:

```HTML
<button class="carousel__next-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.children]
</button>
```

### &lt;ButtonFirst />
Moves the slider to the beginning of the slides.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property.  Basically, the ButtonFirst component needs to wrap other components and/or JSX |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean&#124;null] | null | No | Null means ButtonFirst will automatically determine if this button is disabled. Setting this to true will force the button to be disabled.  Setting this to false will prevent the button from ever being disabled. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |

#### The ButtonFirst component creates the following pseudo HTML by default:

```HTML
<button class="carousel__first-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.children]
</button>
```

### &lt;ButtonLast />
Moves the slider to the end of the slides (totalSlides - visibleSlides).

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property.  Basically, the ButtonLast component needs to wrap other components and/or JSX |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean&#124;null] | null | No | Null means ButtonLast will automatically determine if this button is disabled. Setting this to true will force the button to be disabled.  Setting this to false will prevent the button from ever being disabled. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |

#### The ButtonLast component creates the following pseudo HTML by default:

```HTML
<button class="carousel__last-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.children]
</button>
```

### &lt;ButtonPlay />
Pressing this button causes the slides to automatically advance by CarouselProvider's step property after an interval determined by CarouselProvider's interval property.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| children | [string&#124;node] | null | No | Children is a special React property.  Content wrapped by ButtonPlay will appear AFTER the content of childrenPaused and childrenPlaying |
| childrenPaused | [string&#124;node] | null | No | Content to display when the slide show is paused. |
| childrenPlaying | [string&#124;node] | null | No | Content to display when the slide show is playing |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean&#124;null] | null | No | Null means ButtonPlay will automatically determine if this button is disabled. Setting this to true will force the button to be disabled.  Setting this to false will prevent the button from ever being disabled. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |

#### The ButtonPlay component creates the following pseudo HTML by default:

```HTML
<button class="carousel__play-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.childrenPaused]
  [props.childrenPlaying]
  [props.children]
</button>
```

### WithStore() Higher Order Component

__NOTE: ADVANCED USE ONLY.__

Use this HOC to pass CarouselProvider state properties as props to a component. Basically, Your custom component must be an descendant of `<CarouselProvider>`.  It doesn't have to be a direct descendant, it just needs to be between some the opening and closing CarouselProvider tags somewhere. For example...

```html
// pseudocode example
<CarouselProvider>
  <YourComponentHere />
</CarouselProvider>
```

WithStore has two arguments:  

`WithStore([component], [mapstateToProps])`

- The first argument is the component to wrap (ex: YourComponentHere) and it's required.

- The second argument is optional. It is a "map state to props" function that you must create.  This function maps the state of the CarouselProvider to props used by your component.  Your "map state to props" function will receive one argument: an object with the current CarouselProvider state.  Your function must return an object where the keys are names of props to pass to your component and the values map to properties of the CarouselProvider's state.

Here's more pseudocode.  I've listed a bunch of properties that exist in the CarouselProvider.

```javascript
  import React from 'react';
  import { WithStore } from 'pure-react-carousel';

  class YourComponentHere extends React.Component {
    // ... stuff
  }

  export default WithStore(YourComponentHere, state => ({
    // these are read only properties.  we use the "deepFreeze"
    // npm package to make these properties immutable. You don't have to use
    // all of these, just pick the ones you need.
    currentSlide: state.currentSlide,
    disableAnimation: state.disableAnimation,
    hasMasterSpinner: state.hasMasterSpinner,
    imageErrorCount: state.imageErrorCount,
    imageSuccessCount: state.imageSuccessCount,
    lockOnWindowScroll: state.lockOnWindowScroll,
    masterSpinnerThreshold: state.masterSpinnerThreshold,
    naturalSlideHeight: state.naturalSlideHeight,
    naturalSlideWidth: state.naturalSlideWidth,
    orientation: state.orientation,
    slideSize: state.slideSize,
    slideTraySize: state.slideTraySize
    step: state.step,
    dragStep: state.dragStep,
    totalSlides: state.totalSlides,
    touchEnabled: state.touchEnabled,
    dragEnabled: state.dragEnabled,
    visibleSlides: state.visibleSlides,
  }));
```

Any component wrapped with WithStore will also receive a prop called `carouselStore` which contains the method setStoreState which  you can use to "safely" (use at your own risk) mutate the CarouselProvider's state.  There are other methods in carouselStore.  Don't use them.

__setStoreState__: 🦄 🌈 🎂 Use this to mutate any of the properties listed in the WithStore example above. For example, if you want to skip to slide 2 you can put `this.props.carouselStore.setStoreState({ currentSlide: 2 })` inside a class method in your component.

More pseudocode.

```javascript
  import React from 'react';
  import { WithStore } from 'pure-react-carousel';

  class YourComponentHere extends React.Component {
    // ... stuff

    handleClick() {
      this.props.carouselStore.setStoreState({ currentSlide: 2 });
    }
  }

  export default WithStore(YourComponentHere);
```

Fun fact: you can add any arbitrary values that you want to the CarouselProvider's state.  So, if you have several custom components that need to share data, have at it.

__masterSpinnerError__: 💀 DON'T USE THIS.

__masterSpinnerSuccess__: ⚠️ DON'T USE THIS.

__subscribeMasterSpinner__: 💩 DON'T USE THIS.

__unsubscribeMasterSpinner__: 🔥 DON'T USE THIS.

__unsubscribeAllMasterSpinner__: Don't call this manually unless you have some sort of super-customized carousel. This is called internally once all `<Image hasMasterSpinner />` and all `<ImageWithZoom hasMasterSpinner />` components are finished loading their images.  Calling this directly will force a "success" state and the master spinner (the spinner that covers the entire carousel while loading) will turn off.

## TypeScript usage
The current bundled Typescript definitions are mostly complete. Certain edge case could have been not accounted for! Pull requests to improve them are welcome and appreciated.

If you've never contributed to open source before, then you may find [this free video course](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) helpful.

In case of provided components, it is pretty straightforward. Simply import them and pass necessary props. At the moment types will not prevent you from using the library incorrectly (for example rendering Slider outside CarouselProvider) therefore please check the documentation if something goes wrong.

### WithStore() Higher Order Component

Following the documentation above, only props safe to use are exposed:

```TypeScript
interface CarouselState {
  readonly currentSlide: number
  readonly disableAnimation: boolean
  readonly disableKeyboard: boolean
  readonly hasMasterSpinner: boolean
  readonly imageErrorCount: number
  readonly imageSuccessCount: number
  readonly lockOnWindowScroll: boolean
  readonly masterSpinnerThreshold: number
  readonly naturalSlideHeight: number
  readonly naturalSlideWidth: number
  readonly orientation: 'horizontal' | 'vertical'
  readonly slideSize: number
  readonly slideTraySize: number
  readonly step: number
  readonly dragStep: number
  readonly totalSlides: number
  readonly touchEnabled: boolean
  readonly dragEnabled: boolean
  readonly visibleSlides: number
}

export interface CarouselInjectedProps {
  readonly carouselStore: {
    readonly setStoreState: (state: CarouselState) => void
    readonly unsubscribeAllMasterSpinner: () => void
  }
}
```

**Also the first argument which is the component to wrap, needs to be a `React.ComponentClass` to render properly and therefore stateless component are not possible.**


### Examples:

*  Both with MapStateToProps and custom props

```TypeScript
import {
  CarouselInjectedProps,
  WithStore,
} from 'pure-react-carousel'

interface UpdateCheckProps extends CarouselInjectedProps {
  readonly name: string,
}

interface UpdateCheckCarouselState {
  readonly currentSlide: number,
  readonly disableAnimation: boolean,
}

class InjectedComponent extends Component<
  UpdateCheckProps & UpdateCheckCarouselState
> {
  public render() {
    console.log(this.props)
    return <div>I am a fancy class</div>
  }
}

const DecoratedComponent = WithStore<UpdateCheckProps, UpdateCheckCarouselState>(
  InjectedComponent,
  state => ({
    currentSlide: state.currentSlide,
    disableAnimation: state.disableAnimation,
  }),
)

<CarouselProvider>
  <DecoratedComponent name="NewName" />
</CarouselProvider>
```

* No MapStateToProps

```TypeScript

interface UpdateCheckProps extends CarouselInjectedProps {
  readonly name: string,
}

class InjectedComponent extends Component<UpdateCheckProps> {
  public render() {
    console.log(this.props)
    return <div>I am a fancy class</div>
  }
}

const DecoratedComponent = WithStore<UpdateCheckProps>(InjectedComponent)

// This will work too, with or without custom props

const DecoratedComponent = WithStore(InjectedComponent)
```

## More Documentation to Come
I promise to add docs for every component.  In the meantime, feel free to download and run the demo app.  Looking at the code might help you out.

## Dev Workflow
- `npm start` starts a local development server, opens the dev page with your default browser, and watches for changes via livereload<br><br>
- `npm run build` compiles commonjs and ES modules and places them in the dist directory<br><br>
- `npm test` runs unit and integration tests using Jest + Enzyme.  Also does coverage reporting.<br><br>
- `npm lint` runs linting tests using eslint & airbnb linting.<br><br>
- `npm test:watch` same as `npm test` but it will watch for updates and auto-run tests. Does not do coverage reporting.<br><br>
