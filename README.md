<div align="center">
  <h1>Pure React Carousel</h1>

  Created By
  <br />
  <a href="http://www.express.com">
    <img
      height="27"
      width="164"
      alt="Express Logo"
      src="https://raw.github.com/express-labs/pure-react-carousel/master/dev/media/express-logo.svg?sanitize=true"
    />
  </a>
  <br />
  <p>A highly impartial suite of React components that can be assembled by the consumer to create a responsive and aria compliant carousel with almost no limits on DOM structure or CSS styles.</p>

  [**See Live Examples**](https://express-labs.github.io/pure-react-carousel/) |
  [See Example Code](dev/App/examples) |
  [React Compatibility Chart](https://express-labs.github.io/pure-react-carousel/compatibility.html)
</div>

<hr />

[![Build Status](https://github.com/express-labs/pure-react-carousel/actions/workflows/publish.yml/badge.svg)](https://github.com/express-labs/pure-react-carousel/actions/workflows/publish.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/express-labs/pure-react-carousel/badge.svg)](https://snyk.io/test/github/express-labs/pure-react-carousel)
[![version](https://img.shields.io/npm/v/pure-react-carousel.svg?style=flat-square)](https://www.npmjs.com/package/pure-react-carousel)
[![downloads](https://img.shields.io/npm/dm/pure-react-carousel.svg?style=flat-square)](http://www.npmtrends.com/pure-react-carousel)
[![MIT License](https://img.shields.io/npm/l/pure-react-carousel.svg?style=flat-square)](https://github.com/express-labs/pure-react-carousel/blob/master/LICENSE)

[![All Contributors](https://img.shields.io/badge/all_contributors-29-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](https://github.com/express-labs/pure-react-carousel/blob/master/CODE_OF_CONDUCT.md)

## Motivation

My goal was to create a 100% ReactJS carousel that doesn't try to impose structure or styles that need to be defeated in order to match your site's design standards. Are you tired of fighting some other developer's CSS or DOM structure?  If so, this carousel is for you.

Carousels: Love them or hate them.  However, if you are a React developer, and you have to use a carousel, why not use one that was...

- Developed from the ground-up in React with modern functional components, hooks, and native React Context.
- Written in TypeScript with complete bundled type definitions and zero runtime dependencies.
- Is not a wrapper or port of some non-React carousel like Slick or Flickity.
- Fully supports touch and mouse drag events.
- Is ARIA compliant.
- Is responsive by default.
- Lets you assemble the carousel components in the DOM in any order you desire so long as they are all children of a single &lt;CarouselProvider /> component.
- Lets you put any class names, properties, attributes, or styles on any of the components that you need.
- Supports ES Modules and CommonJS.
- Has 100% test coverage. Solid!

## Table of contents
  * [🛠 Tutorial](#-tutorial-)
  * [Component Properties (props)](#component-properties-props)
  * [Components](#components)
    * [&lt;CarouselProvider /&gt;](#carouselprovider-)
    * [&lt;Slider /&gt;](#slider-)
    * [&lt;Slide /&gt;](#slide-)
    * [&lt;Dot /&gt;](#dot-)
    * [&lt;DotGroup /&gt;](#dotgroup-)
    * [&lt;Image /&gt;](#image-)
    * [&lt;ImageWithZoom /&gt;](#imagewithzoom-)
    * [&lt;Spinner /&gt;](#spinner-)
    * [&lt;ButtonBack /&gt;](#buttonback-)
    * [&lt;ButtonNext /&gt;](#buttonnext-)
    * [&lt;ButtonFirst /&gt;](#buttonfirst-)
    * [&lt;ButtonLast /&gt;](#buttonlast-)
    * [&lt;ButtonPlay /&gt;](#buttonplay-)
    * [Hooks and `useContext`](#hooks-and-usecontext)
    * [WithStore() Higher Order Component](#withstore-higher-order-component)
  * [TypeScript usage](#typescript-usage)
    * [Hooks and `useContext`](#hooks-and-usecontext-1)
    * [WithStore() Higher Order Component](#withstore-higher-order-component-1)
    * [Examples](#examples)
  * [Advanced Concept: Accessing the "View" Components Directly](#advanced-concept-accessing-the-view-components-directly)
  * [Dev Workflow](#dev-workflow)
  * [Contributors](#contributors)

## 🛠 Tutorial 🛠

Let's make a simple carousel with three slides, a next button, and a back button.

1. Add the module to your project.

  `npm i -S pure-react-carousel`

2. Import only the required components into your project.

  ```jsx
  import React from 'react';
  import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
  ```

3. Using a bundler such as Webpack, Vite, or Rollup with a CSS loader? Import the stylesheet as well.

  ```jsx
  import React from 'react';
  import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
  import 'pure-react-carousel/dist/react-carousel.es.css';
  ```

4. Put a `CarouselProvider` component in your code. This allows the other carousel components to communicate with each other via React Context. The only required properties are `totalSlides`, `naturalSlideWidth`, and `naturalSlideHeight`. `naturalSlideWidth` and `naturalSlideHeight` are used to create an aspect ratio for each slide. Since the carousel is responsive by default, it will stretch to fill the width of its parent container. `CarouselProvider` must also have children. We'll add the children in the next step.

  ```jsx
  import React from 'react';
  import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
  import 'pure-react-carousel/dist/react-carousel.es.css';

  export default function MyCarousel() {
    return (
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
      />
    );
  }
  ```

5. Place the components in any order you wish as long as they are children of a single `CarouselProvider` component. Some components have ancestor/descendant relationships, but they don't have to be direct relatives. For example: `Slide` components need to go inside of a `Slider`. `Slide` components also require a sequentially numbered `index` prop starting at zero. Chances are, a lot of the time, you're going to be populating the slides from data and looping through the data, so it is easy to pass the index in your loop.

  ```jsx
  import React from 'react';
  import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
  import 'pure-react-carousel/dist/react-carousel.es.css';

  export default function MyCarousel() {
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
  ```

6. Add some buttons so the user can navigate forward and backward. In order to use left/right arrow keyboard navigation, the `Slider` component needs to be focused. See the example in the [Slider section](#slider-).

  ```jsx
  import React from 'react';
  import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
  import 'pure-react-carousel/dist/react-carousel.es.css';

  export default function MyCarousel() {
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
  ```

That's it. You have a super basic Carousel.

There are other components you can add, like `ButtonFirst`, `ButtonLast`, `ButtonPlay`, `Dot`, `DotGroup`, `Spinner`, an `Image` component, and even an `ImageWithZoom` component that zooms on mouse hover or two-finger pinch/touch.

Obviously, you can customize the heck out of the layout.  If you need to bury your Slider component in 18 parent divs, go for it.  It will still do its job.  Feel free to add the className property to any of the Components to further customize your carousel.  Or, hook into the many BEM named default CSS class names built into the carousel components.

Some components have a ancestor / descendant relationship but they don't have to be direct descendants of the parent.  For example, Slide needs to be a descendant of Slider, but you can put a bunch of div wrappers around slide if you need to.  A good analogy are the html tags `table` and `tr`.  The `tr` tag needs to be a descendant of `table`, but it doesn't have to be a direct descendant.  You can have a `tbody` between them in the tree.

## Component Properties (props)

#### className

You can attach your own `className` property to each and every component in this library and it will be appended to the list of classes. It's appended so that it has more specificity in a tie, allowing your CSS to more easily override any internal styles without resorting to using `!important`.

#### style

You can attach your own `style` property to components in this library; however, any required layout styles generated internally by a component take precedence where necessary for the carousel to function properly.

#### event props (onClick, onFocus, onBlur, etc)

You can supply your own event callbacks to any component.  Your event callbacks are called after a component's internal event handling.  Basically, your callback becomes a callback to our callback.  Say that 10 times fast. :-)

#### all other props

Any remaining props not consumed by the component are passed directly to the root element of a component unless otherwise noted in that component's documentation. This makes all the components in this library HIGHLY configurable.  You can, for example, add your own event handlers, or change aria tags, etc.

## Components

### &lt;CarouselProvider />

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property. Basically, the CarouselProvider needs to wrap other Carousel components and JSX. |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| currentSlide | number | 0 | No | Sets the active &lt;Slide /> index (0-indexed) on mount and dynamically updates the active slide whenever this prop changes. |
| disableAnimation | boolean | false | No | Disables the CSS transition animation when moving between slides. |
| disableKeyboard | boolean | false | No | When set to true, disables left/right arrow keyboard navigation on the &lt;Slider />. |
| hasMasterSpinner | boolean | false | No | When true, a spinner will cover the &lt;Slider /> component until all &lt;Image /> and &lt;ImageWithZoom /> components are done loading images. If there are no &lt;Image /> or &lt;ImageWithZoom /> components, the spinner will spin until this property is set to false. |
| interval | number | 5000 | No | Number of milliseconds to wait when the auto slideshow is active. |
| isPageScrollLocked | boolean | false | No | When true, locks scrolling on the nearest scrollable ancestor container (also managed automatically during vertical touch drags and pinch-zoom). |
| isPlaying | boolean | false | No | Setting this to true starts an auto slideshow. After `interval` milliseconds, the slider will move by `step` slides either forward or backward depending on the value of `playDirection`. |
| lockOnWindowScroll | boolean | false | No | When set to true, scrolling of the carousel slides is disabled while the browser window is scrolling. |
| **naturalSlideHeight** | number | | **Yes** | The natural height of each &lt;Slide /> component. |
| **naturalSlideWidth** | number | | **Yes** | The natural width of each &lt;Slide /> component. |
| orientation | ['horizontal'&#124;'vertical'] | 'horizontal' | No | Possible values are `'horizontal'` and `'vertical'`. Lets you have a horizontal or vertical carousel. |
| playDirection | ['forward'&#124;'backward'] | 'forward' | No | The direction for the auto slideshow. |
| step | number | 1 | No | The number of slides to move when pressing the &lt;ButtonBack /> and &lt;ButtonNext /> buttons. |
| dragStep | number | 1 | No | The number of slides to move when performing a short touch or mouse drag. |
| tag | string | 'div' | No | The HTML element to use for the provider wrapper. |
| **totalSlides** | number | | **Yes** | Always set this to match the total number of &lt;Slide /> components in your carousel. |
| touchEnabled | boolean | true | No | Set to true to enable touch drag events. |
| dragEnabled | boolean | true | No | Set to true to enable mouse dragging events. |
| visibleSlides | number | 1 | No | The number of slides to show at once. This number should be `<= totalSlides`. |
| infinite | boolean | false | No | Should the carousel continue (wrap around) or stop at the beginning or end of the slides. |
| isIntrinsicHeight | boolean | false | No | Disables the enforced height aspect ratio, and instead uses the intrinsic height of the slides. This option can only be active in `'horizontal'` orientation; it will throw an error in `'vertical'` orientation. |

#### The CarouselProvider component creates the following pseudo HTML by default:

```HTML
<props.tag|div class="carousel [props.className]" ...props>
  [props.children]
</props.tag|div>
```

**__More about naturalSlideWidth and naturalSlideHeight__**
The carousel is responsive and by default will flex to the full width of the &lt;Slider /> parent container.  It's up to you to contain the carousel width via css.  Each slide will be the same height to width ratio ([intrinsic ratio](https://alistapart.github.io/code-samples/creating-intrinsic-ratios-for-video/example2.html)). CarouselProvider needs to know the default size of each &lt;Slide />.  Note: you can make the carousel non-responsive by setting the width of &lt;Slider /> to a fixed css unit, like pixels. There are many other ways to make the carousel non-responsive.

### &lt;Slider />

A Slider is a viewport that masks slides.  The Slider component must wrap one or more Slide components.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property. Basically, the Slider needs to wrap other components and/or JSX. |
| ariaLabel | string | 'slider' | No | Optional string that sets the `aria-label` attribute. |
| backwardKeyCode | number | 37 | No | Key code for moving backward via keyboard (defaults to `37`, Left Arrow). |
| forwardKeyCode | number | 39 | No | Key code for moving forward via keyboard (defaults to `39`, Right Arrow). |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| classNameAnimation | [string&#124;null] | null | No | Optional className string. The slider uses the CSS `transform` property, applying `translateX` to move the slider tray horizontally and `translateY` to move the slider tray vertically. The animation is the result of applying a CSS transition effect. If you supply your own `classNameAnimation` class, the default transition is disabled and ONLY the transitions specified by your `classNameAnimation` class are applied. Learn more about [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions). |
| classNameTray | [string&#124;null] | null | No | Optional className string that is applied to the Slider's tray. The "tray" is the DOM element that contains the slides. The type of DOM element is specified by the `trayTag` property. |
| classNameTrayWrap | [string&#124;null] | null | No | Optional className string that is applied to the `div` that surrounds the Slider's tray. |
| disableAnimation | boolean | false | No | Inherited from `<CarouselProvider />` or overridden directly on `<Slider />` to disable slide transition animations. |
| disableKeyboard | boolean | false | No | Inherited from `<CarouselProvider />` or overridden directly on `<Slider />` to disable keyboard arrow navigation. |
| moveThreshold | number | 0.1 | No | Threshold to control the drag distance that triggers a scroll to the next or previous slide (`slideWidthOrHeight * moveThreshold` = drag pixel distance required to scroll). |
| preventVerticalScrollOnTouch | boolean | true | No | When set to true and touch is enabled, prevents vertical screen scroll during horizontal touch drag gestures on the carousel. |
| horizontalPixelThreshold | number | 15 | No | The minimum number of pixels moved horizontally by touch on the carousel to block vertical page scroll when `preventVerticalScrollOnTouch` is true. |
| verticalPixelThreshold | number | 10 | No | The maximum number of pixels moved vertically by touch on the carousel within which vertical page scroll will be blocked when `preventVerticalScrollOnTouch` is true. |
| onMasterSpinner | [function&#124;null] | null | No | Optional callback function that is called when the Master Spinner is visible. Requires that &lt;CarouselProvider /> has `hasMasterSpinner` set to true. |
| role | string | 'listbox' | No | Optional string that sets the ARIA `role` attribute on the slider viewport element. |
| spinner | [function&#124;null] | null | No | Optional render function to render your own custom spinner, e.g. `() => <MyCustomSpinnerComponent />`. If omitted, the default `<Spinner />` is used. |
| style | object | {} | No | Optional CSS styles to add to the Slider root element. |
| trayProps | object | {} | No | Any props you want to attach to the slider tray element, with the exception of `className`, `style`, and `ref`. `className` is handled via `classNameTray`, and `style`/`ref` are managed internally. Event handlers such as `onMouseDown`, `onTouchStart`, `onTouchMove`, `onTouchEnd`, `onTouchCancel`, and `onClickCapture` are called after the Slider's internal event handlers. |
| trayTag | string | 'div' | No | The HTML tag to use for the tray (the element that holds all the slides and moves them back and forth). |

#### The Slider component creates the following pseudo HTML by default.

```HTML
<div class="carousel__slider [carousel__slider--vertical|carousel__slider--horizontal] [props.className]" aria-live="polite" aria-label="[props.ariaLabel]" role="[props.role]" style="[props.style]" ...props>
  <div class="carousel__slider-tray-wrapper [carousel__slider-tray-wrap--vertical|carousel__slider-tray-wrap--horizontal] [props.classNameTrayWrap]">
    <props.trayTag|div class="carousel__slider-tray [props.classNameAnimation] [carousel__slider-tray--vertical|carousel__slider-tray--horizontal] [props.classNameTray]">
      [props.children]
    </props.trayTag|div>
    <div class="carousel__master-spinner-container">
      <div class="carousel__spinner" />
    </div>
  </div>
</div>
```

#### How to enable left/right arrow key navigation
While keyboard navigation to scroll between slides is supported by default, the `Slider` (or an element inside it) needs focus and a `tabIndex` in order to receive keyboard events. A simple solution looks like the following:

```jsx
import React, { useEffect } from 'react';
import { Slider } from 'pure-react-carousel';

export function FocusableSlider() {
  useEffect(() => {
    const slider = document.getElementById('mySlider');
    if (slider) {
      slider.focus();
    }
  }, []);

  return (
    <Slider id="mySlider" tabIndex={0}>
      {/* slides... */}
    </Slider>
  );
}
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
| ariaLabel | string | 'slide' | No | Optional string that sets the `aria-label` attribute. |
| children | [string&#124;node&#124;null] | null | No | Optional slide content. |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| classNameHidden | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string when the slide is not visible. |
| classNameVisible | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string when the slide is visible. |
| **index** | number | | **Yes** | You must consecutively number the &lt;Slide /> components in order starting with zero. |
| innerClassName | [string&#124;null] | null | No | Optional className string that will be appended to the inner slide wrapper element (`carousel__inner-slide`). |
| innerTag | string | 'div' | No | The inner HTML element for each Slide. |
| isIntrinsicHeight | boolean | false | No | Inherited from `<CarouselProvider />` or overridden on the Slide to use intrinsic height rather than aspect-ratio padding. |
| onBlur | [function&#124;null] | null | No | Optional callback function that is called after the internal `onBlur` handler is called. Passed the React synthetic focus event. |
| onFocus | [function&#124;null] | null | No | Optional callback function that is called after the internal `onFocus` handler is called. Passed the React synthetic focus event. |
| role | string | 'option' | No | Optional string that sets the ARIA `role` attribute on the slide element. |
| style | object | {} | No | Optional CSS styles to merge onto the outer slide element. |
| tabIndex | number | undefined | No | Optional `tabIndex` passed through to the root slide element. |
| tag | string | 'div' | No | The root HTML element for each Slide. |

#### The Slide component creates the following pseudo HTML by default:

```HTML
<props.tag|div class="carousel__slide [carousel__slide--focused] [props.classNameVisible|props.classNameHidden] [carousel__slide--visible|carousel__slide--hidden] [props.className]" aria-selected="[isVisible]" aria-label="[props.ariaLabel]" role="[props.role]" onFocus="[props.onFocus]" onBlur="[props.onBlur]" style="[props.style]" ...props>
  <props.innerTag|div class="carousel__inner-slide [props.innerClassName]">
    [props.children]
    <!-- rendered when focused -->
    <div class="carousel__slide-focus-ring" />
  </props.innerTag|div>
</props.tag|div>
```

### &lt;Dot />

A Dot component is an HTML button. Dots directly correlate to slides. Clicking on a dot causes its correlating slide to scroll into the left-most visible slot of the slider. The dots for currently visible slides are automatically disabled unless overridden via the `disabled` prop.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| children | [string&#124;null&#124;node] | null | No | Children is a special React property. Basically, the Dot component wraps other components and/or JSX. |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean&#124;null] | null | No | `null` means Dot will automatically determine if this button is disabled (disabled when the slide is currently visible). Setting this to `true` forces the button to be disabled. Setting this to `false` prevents the button from being disabled. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal `onClick` handler is called. It is passed the React synthetic event. |
| selected | [boolean&#124;null] | null | No | `null` means Dot will automatically determine if it is selected (when `slide` is within the currently visible range). Setting this to `true` or `false` overrides the selected state and `carousel__dot--selected` class. |
| **slide** | number | | **Yes** | There must be a matching &lt;Slide /> component with a matching `index` property. Example: `<Dot slide={0} />` matches `<Slide index={0} />`. |

#### The Dot component creates the following pseudo HTML by default:

```HTML
<button type="button" aria-label="slide dot" class="carousel__dot carousel__dot--[slide] [carousel__dot--selected] [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.children]
</button>
```

### &lt;DotGroup />

A compound component that creates a group of `<Dot />` buttons automatically for you.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| children | [string&#124;node&#124;null] | null | No | Any JSX wrapped by this component will appear AFTER the dots. |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| dotNumbers | boolean | false | No | Setting to `true` automatically adds text numbers to the dot buttons starting at `1`. |
| disableActiveDots | boolean | true | No | When `true` (default), dots for currently active/selected slides are disabled. Setting to `false` makes all dots, including active dots, enabled. |
| showAsSelectedForCurrentSlideOnly | boolean | false | No | Setting to `true` shows only the `currentSlide` dot as selected, rather than all `visibleSlides`. |
| renderDots | [function&#124;null] | null | No | Optional render function `(props) => ReactNode` that overrides the default dot rendering in &lt;DotGroup />. |

#### The DotGroup component creates the following pseudo HTML by default:

```HTML
<div class="carousel__dot-group [props.className]" ...props>
  <!-- button repeats for each slide -->
  <button type="button" aria-label="slide dot" class="carousel__dot carousel__dot--[slide] [carousel__dot--selected]">
    <span class="carousel__dot-group-dot">[numbers or blank]</span>
  </button>
  [props.children]
</div>
```

### &lt;Image />

An image component that preloads images in memory, applies loading/success/error CSS classes, optionally renders custom loading or error fallbacks, and integrates with `<CarouselProvider hasMasterSpinner />`.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| alt | string | '' | No | Specifies alternate text for an image if the image cannot be displayed. |
| children | [string&#124;node&#124;null] | null | No | Any optional JSX wrapped by the Image component. |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| hasMasterSpinner | boolean | false | No | Automatically inherited from `<CarouselProvider />` (or passed explicitly to `<ImageView />`). When `true`, the master spinner will cover the `<Slider />` viewport until all `<Image />` and `<ImageWithZoom />` components have finished loading. |
| isBgImage | boolean | false | No | When set to `true` with a non-`img` `tag` (such as `div`), appends the `carousel__image--with-background` class and renders the image as a CSS `background-image`. Note: do not use `isBgImage` with `tag="img"`. |
| onError | [function&#124;null] | null | No | Callback function called if the image defined by `src` fails to load. Fired after the Image component's internal error handler. |
| onLoad | [function&#124;null] | null | No | Callback function called if the image defined by `src` loads successfully. Fired after the Image component's internal load handler. |
| renderError | [function&#124;null] | null | No | When defined, if an image fails to load, this function is called and its returned JSX is rendered instead of `children`. |
| renderLoading | [function&#124;null] | null | No | When defined, this function is called while the image is loading and its returned JSX is rendered instead of `children`. |
| **src** | **string** | | **Yes** | **URL of the image.** |
| style | [object&#124;null] | null | No | Optional CSS inline styles applied to the element. |
| tag | string | 'img' | No | The element that will receive the image once loaded. While loading or in an error state, a `div` is rendered if `tag` is `'img'`. Any `tag` besides `'img'` (e.g. `'div'`) renders the loaded image via CSS `backgroundImage` and `backgroundSize: 'cover'`. |

#### The Image component creates the following pseudo HTML by default:

```HTML
<!-- While loading (or error): -->
<div class="carousel__image [carousel__image--with-background] carousel__image--loading|carousel__image--error [props.className]" src="[props.src]" alt="[props.alt]" ...props>
  [props.renderLoading() | props.renderError() | props.children]
</div>

<!-- When loaded with tag="img": -->
<img class="carousel__image carousel__image--success [props.className]" src="[props.src]" alt="[props.alt]" style="[props.style]" ...props />

<!-- When loaded with tag="div" and isBgImage: -->
<div class="carousel__image carousel__image--with-background carousel__image--success [props.className]" style="background-image: url('[props.src]'); background-size: cover; [props.style]" ...props>
  [props.children]
</div>
```

### &lt;ImageWithZoom />

A compound component that wraps `<Image />` to provide hover zoom on desktop (mouse events) and two-finger pinch-to-zoom on touch devices.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| alt | string | undefined | No | Alternate text passed to the underlying display `<Image />`. |
| bgImageProps | object | {} | No | Additional props spread onto the underlying display `<Image />` component. |
| bgImageTag | string | 'div' | No | The HTML tag used for the underlying display `<Image />` (e.g. `'div'` or `'img'`). |
| className | [string&#124;null] | null | No | Optional className string appended to the outer container element. |
| imageClassName | [string&#124;null] | null | No | Optional className string appended to the base `<Image />` (`carousel__zoom-image`). |
| overlayClassName | [string&#124;null] | null | No | Optional className string appended to the zoom overlay `<Image />` (`carousel__zoom-image-overlay`). |
| isPinchZoomEnabled | boolean | true | No | Enables two-finger pinch-to-zoom on touch-capable devices. |
| onError | [function&#124;null] | null | No | Optional callback function called if the image fails to load. |
| onLoad | [function&#124;null] | null | No | Optional callback function called when the image finishes loading. |
| spinner | [function&#124;null] | null | No | Optional render function `() => ReactNode` to render a custom loading spinner while the image loads. Defaults to `<Spinner />`. |
| **src** | **string** | | **Yes** | **URL of the standard resolution image.** |
| srcZoomed | [string&#124;null] | null | No | Optional URL of a higher-resolution image to use for the zoom overlay. If omitted, `src` is used. |
| tag | string | 'div' | No | The HTML tag to use for the outer wrapper element. |

#### The ImageWithZoom component creates the following pseudo HTML by default:

```HTML
<props.tag|div class="[props.className]" ...props>
  <props.bgImageTag|div class="carousel__image carousel__zoom-image [props.imageClassName]" ...props.bgImageProps />
  <div class="carousel__image carousel__image--with-background carousel__zoom-image-overlay [carousel__zoom-image-overlay--hovering] [carousel__zoom-image-overlay--zooming] [props.overlayClassName]" />
  <!-- rendered while image is loading -->
  <div class="carousel__image-loading-spinner-container">
    <div class="carousel__spinner" />
  </div>
</props.tag|div>
```

### &lt;Spinner />

The default loading spinner component used by `<Slider />` and `<ImageWithZoom />`. Can also be imported and used standalone.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| className | [string&#124;null] | null | No | Optional className string appended to the spinner element. |

#### The Spinner component creates the following pseudo HTML by default:

```HTML
<div class="carousel__spinner [props.className]" ...props />
```

### &lt;ButtonBack />

A button for moving the slider backwards. Backwards on a horizontal carousel means "move to the left".  Backwards on a vertical carousel means "move to the top".  The slider will traverse an amount of slides determined by the step property of CarouselProvider.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string&#124;node] | | **Yes** | Children is a special React property.  Basically, the ButtonBack component needs to wrap other components and/or JSX |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | [boolean&#124;null] | null | No | Null means ButtonBack will automatically determine if this button is disabled. Setting this to true will force the button to be disabled.  Setting this to false will prevent the button from ever being disabled. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |

#### The ButtonBack component creates the following pseudo HTML by default:

```HTML
<button type="button" aria-label="previous" class="carousel__back-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
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
<button type="button" aria-label="next" class="carousel__next-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
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
<button type="button" aria-label="first" class="carousel__first-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
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
<button type="button" aria-label="last" class="carousel__last-button [props.className]" onClick="[props.onClick]" disabled="[props.disabled]" ...props>
  [props.children]
</button>
```

### &lt;ButtonPlay />

Pressing this button causes the slides to automatically advance by CarouselProvider's step property after an interval determined by CarouselProvider's interval property.

| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| children | [string&#124;node] | null | No | Children is a special React property.  Content wrapped by ButtonPlay will appear AFTER the content of childrenPaused and childrenPlaying |
| childrenPaused | [string&#124;node] | null | No | Content to display when the slide show is paused. |
| childrenPlaying | [string&#124;node] | null | No | Content to display when the slide show is playing. |
| className | [string&#124;null] | null | No | Optional className string that will be appended to the component's className string. |
| disabled | boolean | false | No | Optional boolean passed to the underlying `<button>` element to disable the play/pause button. |
| onClick | [function&#124;null] | null | No | Optional callback function that is called after the internal onClick function is called. It is passed the React synthetic event |

#### The ButtonPlay component creates the following pseudo HTML by default:

```HTML
<button type="button" aria-label="play" class="carousel__play-button [props.className]" onClick="[props.onClick]" ...props>
  [props.childrenPlaying | props.childrenPaused]
  [props.children]
</button>
```

### Hooks and `useContext`

`CarouselProvider` uses React's native Context API (`CarouselContext`) and automatically triggers re-renders on consumers whenever the carousel store state updates.

You can consume `CarouselContext` directly with `useContext(CarouselContext)` in any functional component rendered inside `<CarouselProvider>`:

```jsx
import React, { useContext } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export function MyComponentUsingContext() {
  const carouselContext = useContext(CarouselContext);
  const { currentSlide, totalSlides } = carouselContext.state;

  return (
    <div>
      <p>Slide {currentSlide + 1} of {totalSlides}</p>
      <button
        type="button"
        onClick={() => carouselContext.setStoreState({ currentSlide: 0 })}
      >
        Back to First Slide
      </button>
    </div>
  );
}
```

For backwards compatibility (or if you need an imperative callback when state changes), `carouselContext.subscribe(callback)` and `carouselContext.unsubscribe(callback)` are also supported:

```jsx
import React, { useContext, useEffect, useState } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export function MySubscribedComponent() {
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);

  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  return `The current slide is: ${currentSlide}`;
}
```

### WithStore() Higher Order Component

__NOTE: ADVANCED USE ONLY.__ (For new functional components, prefer `useContext(CarouselContext)` above.)

Use this HOC to pass `CarouselProvider` state properties as props to a component (either a functional component or a class component). Your custom component must be a descendant of `<CarouselProvider>`. It doesn't have to be a direct descendant; it just needs to be rendered somewhere inside `<CarouselProvider>`:

```jsx
<CarouselProvider
  naturalSlideWidth={100}
  naturalSlideHeight={125}
  totalSlides={3}
>
  <YourComponentHere />
</CarouselProvider>
```

`WithStore` accepts two arguments:

`WithStore(Component, [mapStateToProps])`

- The first argument is the component to wrap (e.g., `YourComponentHere`) and is required. Both functional and class components are supported.
- The second argument is an optional `mapStateToProps` function `(state) => ({ ... })` that maps the current `CarouselProvider` state to props passed to your component.

Here is an example showing the properties available on `CarouselProvider` state:

```jsx
import React from 'react';
import { WithStore } from 'pure-react-carousel';

function YourComponentHere(props) {
  return <div>Current slide: {props.currentSlide}</div>;
}

export default WithStore(YourComponentHere, (state) => ({
  // State properties are deeply frozen (read-only).
  // Pick only the properties your component needs:
  currentSlide: state.currentSlide,
  disableAnimation: state.disableAnimation,
  disableKeyboard: state.disableKeyboard,
  hasMasterSpinner: state.hasMasterSpinner,
  imageErrorCount: state.imageErrorCount,
  imageSuccessCount: state.imageSuccessCount,
  infinite: state.infinite,
  interval: state.interval,
  isIntrinsicHeight: state.isIntrinsicHeight,
  isPageScrollLocked: state.isPageScrollLocked,
  isPlaying: state.isPlaying,
  lockOnWindowScroll: state.lockOnWindowScroll,
  masterSpinnerFinished: state.masterSpinnerFinished,
  masterSpinnerThreshold: state.masterSpinnerThreshold,
  naturalSlideHeight: state.naturalSlideHeight,
  naturalSlideWidth: state.naturalSlideWidth,
  orientation: state.orientation,
  playDirection: state.playDirection,
  slideSize: state.slideSize,
  slideTraySize: state.slideTraySize,
  step: state.step,
  dragStep: state.dragStep,
  totalSlides: state.totalSlides,
  touchEnabled: state.touchEnabled,
  dragEnabled: state.dragEnabled,
  visibleSlides: state.visibleSlides,
}));
```

Any component wrapped with `WithStore` also receives a prop called `carouselStore`, which exposes `getStoreState` and `setStoreState` to read or update the `CarouselProvider`'s state.

__setStoreState__: 🦄 🌈 🎂 Use this to update any of the state properties listed above. For example, to skip to slide 2:

```jsx
import React from 'react';
import { WithStore } from 'pure-react-carousel';

function YourComponentHere({ carouselStore }) {
  const handleClick = () => {
    carouselStore.setStoreState({ currentSlide: 2 });
  };

  return (
    <button type="button" onClick={handleClick}>
      Go to slide 3
    </button>
  );
}

export default WithStore(YourComponentHere);
```

Fun fact: you can add any arbitrary values that you want to the `CarouselProvider`'s state. So, if you have several custom components that need to share data, have at it.

__masterSpinnerError__: 💀 DON'T USE THIS (internal use only).

__masterSpinnerSuccess__: ⚠️ DON'T USE THIS (internal use only).

__subscribeMasterSpinner__: 💩 DON'T USE THIS (internal use only).

__unsubscribeMasterSpinner__: 🔥 DON'T USE THIS (internal use only).

__unsubscribeAllMasterSpinner__: Don't call this manually unless you have some sort of super-customized carousel. This is called internally once all `<Image hasMasterSpinner />` and all `<ImageWithZoom hasMasterSpinner />` components are finished loading their images. Calling this directly will force a "success" state and the master spinner (the spinner that covers the entire carousel while loading) will turn off.

## TypeScript usage

Pure React Carousel is written in TypeScript and ships with complete type definitions in `dist/types/index.d.ts`. Simply import components, hooks, or types directly from `'pure-react-carousel'`.

### Hooks and `useContext`

`CarouselContext` is typed as `React.Context<CarouselStoreInterface>`, giving full type inference for `state` (`CarouselState`) and `setStoreState`:

```tsx
import React, { useContext } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export function SlideCounter() {
  const carouselStore = useContext(CarouselContext);

  return (
    <button
      type="button"
      onClick={() => carouselStore.setStoreState({ currentSlide: 0 })}
    >
      Slide {carouselStore.state.currentSlide + 1} of {carouselStore.state.totalSlides}
    </button>
  );
}
```

### WithStore() Higher Order Component

Both functional components and class components (`React.ComponentType`) are supported by `WithStore`. The state and injected store interfaces are exported from `'pure-react-carousel'`:

```ts
export interface CarouselState {
  readonly currentSlide: number;
  readonly disableAnimation: boolean;
  readonly disableKeyboard: boolean;
  readonly hasMasterSpinner: boolean;
  readonly imageErrorCount: number;
  readonly imageSuccessCount: number;
  readonly infinite: boolean;
  readonly interval?: number;
  readonly isIntrinsicHeight: boolean;
  readonly isPageScrollLocked?: boolean;
  readonly isPlaying: boolean;
  readonly lockOnWindowScroll: boolean;
  readonly masterSpinnerFinished: boolean;
  readonly masterSpinnerThreshold?: number;
  readonly MasterSpinnerThreshold?: number;
  readonly naturalSlideHeight: number;
  readonly naturalSlideWidth: number;
  readonly orientation: 'horizontal' | 'vertical';
  readonly playDirection?: 'forward' | 'backward';
  readonly privateUnDisableAnimation?: boolean;
  readonly slideSize: number;
  readonly slideTraySize: number;
  readonly step: number;
  readonly dragStep: number;
  readonly totalSlides: number;
  readonly touchEnabled: boolean;
  readonly dragEnabled: boolean;
  readonly visibleSlides: number;
}

export interface CarouselInjectedProps {
  readonly carouselStore: Pick<
    CarouselStoreInterface,
    | 'getStoreState'
    | 'masterSpinnerError'
    | 'masterSpinnerSuccess'
    | 'setStoreState'
    | 'subscribeMasterSpinner'
    | 'unsubscribeAllMasterSpinner'
    | 'unsubscribeMasterSpinner'
  >;
}
```

### Examples:

- With `mapStateToProps` and custom props:

```tsx
import React from 'react';
import {
  CarouselInjectedProps,
  CarouselProvider,
  WithStore,
} from 'pure-react-carousel';

interface CustomProps {
  readonly name: string;
}

interface MappedStateProps {
  readonly currentSlide: number;
  readonly disableAnimation: boolean;
}

function InjectedComponent({
  name,
  currentSlide,
  disableAnimation,
  carouselStore,
}: CustomProps & MappedStateProps & CarouselInjectedProps) {
  return (
    <div>
      <span>{name}: Slide {currentSlide} (animation disabled: {String(disableAnimation)})</span>
      <button
        type="button"
        onClick={() => carouselStore.setStoreState({ currentSlide: 0 })}
      >
        Reset
      </button>
    </div>
  );
}

const DecoratedComponent = WithStore<CustomProps, MappedStateProps>(
  InjectedComponent,
  (state) => ({
    currentSlide: state.currentSlide,
    disableAnimation: state.disableAnimation,
  }),
);

// Usage inside <CarouselProvider>:
// <DecoratedComponent name="MyCarousel" />
```

- Without `mapStateToProps`:

```tsx
import React from 'react';
import { CarouselInjectedProps, WithStore } from 'pure-react-carousel';

interface CustomProps extends CarouselInjectedProps {
  readonly name: string;
}

function InjectedComponent({ name, carouselStore }: CustomProps) {
  return (
    <button
      type="button"
      onClick={() => carouselStore.setStoreState({ currentSlide: 0 })}
    >
      {name}
    </button>
  );
}

const DecoratedComponent = WithStore(InjectedComponent);
```

## Advanced Concept: Accessing the "View" Components Directly
All the components in Pure React Carousel were designed using the container (model) -> presentation (view) pattern.
The `index.ts` file for each component connects to `CarouselContext` via the `WithStore` HOC, selects the required state properties from the carousel store, and passes them to the presentation component as props.

For example, look at the structure of the `Slide` component folder:

```
Slide/
├─ index.ts (container / store connector)
├─ Slide.tsx (view)
```

The `index.ts` file uses the `WithStore` HOC to provide `Slide.tsx` (the view) with all the data it needs from the carousel state—such as `currentSlide`, `naturalSlideWidth`, `naturalSlideHeight`, `slideSize`, `totalSlides`, `visibleSlides`, etc.

If you want direct access to the unconnected view component (for example, in unit tests or custom state wrappers), you can import it directly by adding `View` to the end of the component name. This works for all components except `CarouselProvider`:

`import { SlideView } from 'pure-react-carousel';`

## Dev Workflow

### Prerequisites

- **Node.js**: **v24.18.0** (`>=24.0.0`), pinned in `.nvmrc`, `.node-version`, and `package.json`.
- **Vite Plus (`vp`)** *(optional global CLI)*: This repository uses **[Vite Plus](https://viteplus.dev)** (`vite-plus`) for its dev server, bundler, test runner, linter, formatter, and git hooks. All workflows run out of the box via standard `npm run <script>` commands using the local `vite-plus` dependency, or you can optionally install the global `vp` CLI (`npm install -g vite-plus`) to run `vp` commands directly.

### Contributor Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/express-labs/pure-react-carousel.git
cd pure-react-carousel

# 2. Activate the pinned Node.js version (v24.18.0)
nvm use # or: vp env use

# 3. Install dependencies (also configures pre-commit hooks via `vp config`)
npm install # or `npm ci` for a clean lockfile install

# 4. Start the local interactive demo app
npm start
```

### Project Structure

- `src/` — Published library source code, component SCSS modules, and co-located unit/SSR tests (`__tests__/`).
- `dev/` — Interactive local development and GitHub Pages demo SPA (`dev/index.html`, `dev/app.tsx`, `dev/compatibility.tsx`, and `dev/App/`). Excluded from the published npm package.
- `typings/` — Compile-time TypeScript consumer contract tests (`typings/index.test-d.tsx`).
- `vite.config.ts` — Unified **Vite Plus** configuration for the dev server (`vp dev`), demo build (`vp build`), library packaging (`vp pack`), Vitest (`vp test`), Oxlint (`vp lint`), Oxfmt (`vp fmt`), and pre-commit hooks (`staged`).

### Development Commands

- `npm start` (`vp dev`) — Starts the local development server for the interactive demo app (`dev/`).<br><br>
- `npm test` (`vp test run --coverage`) — Runs unit, integration, and SSR tests using **Vitest** and **React Testing Library (RTL)** with V8 coverage reporting.<br><br>
- `npm run test:watch` (`vp test`) — Runs Vitest in interactive watch mode.<br><br>
- `npm run typecheck` — Generates TypeScript declarations (`dist/types/index.d.ts`) and type-checks the library, demo app, and consumer typing contract (`tsconfig.json` & `tsconfig.consumer.json`).<br><br>
- `npm run lint` / `npm run lint:fix` (`vp lint`) — Runs linting across `src`, `dev`, `typings`, and `vite.config.ts` using **Oxlint**.<br><br>
- `npm run format` / `npm run format:check` (`vp fmt`) — Formats or checks formatting across `src`, `dev`, `typings`, and `vite.config.ts` using **Oxfmt**.<br><br>
- `npm run build` (`vp pack && npm run build:types`) — Bundles the ES module (`dist/index.es.js`), CommonJS (`dist/index.cjs.js`), CSS (`dist/react-carousel.es.css`, `dist/react-carousel.cjs.css`), and TypeScript declaration (`dist/types/index.d.ts`) artifacts into `dist/` using **Vite Plus (`vp pack`)** and **TypeScript (`tsc`)**.<br><br>
- `npm run build:demo` (`vp build`) — Builds the static demo SPA (`dev/`) into `dist-demo/` for GitHub Pages deployment.<br><br>
- `npm run test:compat` — Runs the automated multi-version React peer-dependency compatibility matrix across React 16.8, 17, 18, and 19.<br><br>
- `npm run prepublishOnly` — Runs all verification gates in sequence (`typecheck`, `lint`, `test`, `build`).<br><br>

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/mrbinky3000"><img src="https://avatars1.githubusercontent.com/u/161068?v=4" width="100px;" alt=""/><br /><sub><b>Matthew Toledo</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=mrbinky3000" title="Code">💻</a> <a href="#design-mrbinky3000" title="Design">🎨</a> <a href="https://github.com/express-labs/pure-react-carousel/pulls?q=is%3Apr+reviewed-by%3Amrbinky3000" title="Reviewed Pull Requests">👀</a> <a href="#ideas-mrbinky3000" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-mrbinky3000" title="Project Management">📆</a></td>
    <td align="center"><a href="http://www.whoistimsteele.com"><img src="https://avatars0.githubusercontent.com/u/1490225?v=4" width="100px;" alt=""/><br /><sub><b>Timothy Steele</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=tim-steele" title="Code">💻</a> <a href="#design-tim-steele" title="Design">🎨</a> <a href="https://github.com/express-labs/pure-react-carousel/pulls?q=is%3Apr+reviewed-by%3Atim-steele" title="Reviewed Pull Requests">👀</a> <a href="#ideas-tim-steele" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-tim-steele" title="Project Management">📆</a></td>
    <td align="center"><a href="http://www.thefullresolution.com/"><img src="https://avatars2.githubusercontent.com/u/11708648?v=4" width="100px;" alt=""/><br /><sub><b>Jedrzej Lewandowski</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=TheFullResolution" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/littlejustinh"><img src="https://avatars1.githubusercontent.com/u/7610833?v=4" width="100px;" alt=""/><br /><sub><b>Justin Little</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=littlejustinh" title="Code">💻</a></td>
    <td align="center"><a href="http://www.paax.se/"><img src="https://avatars0.githubusercontent.com/u/3884281?v=4" width="100px;" alt=""/><br /><sub><b>Christoffer Palm</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=NormySan" title="Code">💻</a></td>
    <td align="center"><a href="https://dylanpyle.com"><img src="https://avatars2.githubusercontent.com/u/806257?v=4" width="100px;" alt=""/><br /><sub><b>Dylan Pyle</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=dylanpyle" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/maps82"><img src="https://avatars1.githubusercontent.com/u/12223156?v=4" width="100px;" alt=""/><br /><sub><b>Martin Schwier</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=maps82" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/arnaudambro"><img src="https://avatars0.githubusercontent.com/u/31724752?v=4" width="100px;" alt=""/><br /><sub><b>Arnaud Ambroselli</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=arnaudambro" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/chungwong"><img src="https://avatars3.githubusercontent.com/u/1691249?v=4" width="100px;" alt=""/><br /><sub><b>Chung</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=chungwong" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fdionisi"><img src="https://avatars1.githubusercontent.com/u/8927326?v=4" width="100px;" alt=""/><br /><sub><b>Federico Dionisi</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=fdionisi" title="Code">💻</a></td>
    <td align="center"><a href="https://kubajastrz.com"><img src="https://avatars0.githubusercontent.com/u/6443113?v=4" width="100px;" alt=""/><br /><sub><b>Jakub Jastrzębski</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=KubaJastrz" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jpdelima"><img src="https://avatars2.githubusercontent.com/u/7547716?v=4" width="100px;" alt=""/><br /><sub><b>Jean-Paul Delimat</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=jpdelima" title="Code">💻</a></td>
    <td align="center"><a href="https://atmarty.com/"><img src="https://avatars2.githubusercontent.com/u/7387001?v=4" width="100px;" alt=""/><br /><sub><b>Martin</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=martinmckenna" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/perenstrom"><img src="https://avatars0.githubusercontent.com/u/765759?v=4" width="100px;" alt=""/><br /><sub><b>Per Enström</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=perenstrom" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/serafinomb"><img src="https://avatars2.githubusercontent.com/u/4272911?v=4" width="100px;" alt=""/><br /><sub><b>Serafino Messina</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=serafinomb" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/killia15"><img src="https://avatars2.githubusercontent.com/u/30830235?v=4" width="100px;" alt=""/><br /><sub><b>Seth Killian</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=killia15" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/timc13"><img src="https://avatars3.githubusercontent.com/u/74982?v=4" width="100px;" alt=""/><br /><sub><b>Tim Chen</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=timc13" title="Code">💻</a></td>
    <td align="center"><a href="http://pleo.io"><img src="https://avatars3.githubusercontent.com/u/13701719?v=4" width="100px;" alt=""/><br /><sub><b>Zoey Zou</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=zoeyzou" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/djshapiro"><img src="https://avatars0.githubusercontent.com/u/2005881?v=4" width="100px;" alt=""/><br /><sub><b>djshapiro</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=djshapiro" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bcarroll22"><img src="https://avatars2.githubusercontent.com/u/11020406?v=4" width="100px;" alt=""/><br /><sub><b>Brandon Carroll</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=bcarroll22" title="Code">💻</a> <a href="#maintenance-bcarroll22" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/jdconner"><img src="https://avatars2.githubusercontent.com/u/12697946?v=4" width="100px;" alt=""/><br /><sub><b>Justin Conner</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=jdconner" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://stephane-klein.info"><img src="https://avatars3.githubusercontent.com/u/54498080?v=4" width="100px;" alt=""/><br /><sub><b>Stéphane Klein</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=stephane-klein" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/kevynb"><img src="https://avatars1.githubusercontent.com/u/4941215?v=4" width="100px;" alt=""/><br /><sub><b>Kevyn Bruyere</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=kevynb" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/shoeman22"><img src="https://avatars3.githubusercontent.com/u/209510?v=4" width="100px;" alt=""/><br /><sub><b>Andy Schuler</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=shoeman22" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mariohoyos92"><img src="https://avatars1.githubusercontent.com/u/29843005?v=4" width="100px;" alt=""/><br /><sub><b>Mario Hoyos</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=mariohoyos92" title="Code">💻</a></td>
    <td align="center"><a href="http://www.nickrandall.com"><img src="https://avatars1.githubusercontent.com/u/1800460?v=4" width="100px;" alt=""/><br /><sub><b>Nick Randall</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/pulls?q=is%3Apr+reviewed-by%3Anicksrandall" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/CarsonF"><img src="https://avatars3.githubusercontent.com/u/932566?v=4" width="100px;" alt=""/><br /><sub><b>Carson Full</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=CarsonF" title="Code">💻</a></td>
    <td align="center"><a href="http://www.exile.lv"><img src="https://avatars1.githubusercontent.com/u/7768612?v=4" width="100px;" alt=""/><br /><sub><b>Kristaps</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=Hetachi" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://pavelivanov.net"><img src="https://avatars3.githubusercontent.com/u/202422?v=4" width="100px;" alt=""/><br /><sub><b>Pavel</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=paveli" title="Code">💻</a></td>
    <td align="center"><a href="https://seans.site"><img src="https://avatars3.githubusercontent.com/u/6496840?v=4" width="100px;" alt=""/><br /><sub><b>Sean LeBlanc</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=seleb" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/cbasJS"><img src="https://avatars2.githubusercontent.com/u/28812706?v=4" width="100px;" alt=""/><br /><sub><b>Sebastian Martha</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=cbasJS" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/reckter"><img src="https://avatars1.githubusercontent.com/u/1771450?v=4" width="100px;" alt=""/><br /><sub><b>Hannes Güdelhöfer</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=reckter" title="Code">💻</a></td>
    <td align="center"><a href="https://howchoo.com"><img src="https://avatars3.githubusercontent.com/u/4452484?v=4" width="100px;" alt=""/><br /><sub><b>Zach Levine</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=ZLevine" title="Code">💻</a></td>
    <td align="center"><a href="https://git.owls.io"><img src="https://avatars2.githubusercontent.com/u/2741569?v=4" width="100px;" alt=""/><br /><sub><b>Alec WM</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=alecdwm" title="Code">💻</a></td>
    <td align="center"><a href="http://www.zhongdeliu.de"><img src="https://avatars1.githubusercontent.com/u/1384870?v=4" width="100px;" alt=""/><br /><sub><b>zhongdeliu</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=zhongdeliu" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://savas.ca"><img src="https://avatars1.githubusercontent.com/u/5691564?v=4" width="100px;" alt=""/><br /><sub><b>Niko Savas</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=taurheim" title="Code">💻</a></td>
    <td align="center"><a href="https://bret.io"><img src="https://avatars1.githubusercontent.com/u/166301?v=4" width="100px;" alt=""/><br /><sub><b>Bret</b></sub></a><br /><a href="https://github.com/express-labs/pure-react-carousel/commits?author=bcomnes" title="Code">💻</a></td>
    <td align="center"><a href="http://superapps.com"><img src="https://avatars3.githubusercontent.com/u/337798?v=4" width="100px;" alt=""/><br /><sub><b>Brian B. Canin</b></sub></a><br /><a href="#question-cyphire" title="Answering Questions">💬</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
