# react-carousel
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

1. Import only the required components into your project.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'react-carousel';
```  

2. Put a CarouselProvider component in your code.  This allows the other carousel components to communicate with each other.  The only required properties are the orientation, naturalSlideWidth, and naturalSlideHeight.  And it must have children, of course.  We'll add children in the next step.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'react-carousel';

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider orientation="horizontal" naturalSlideWidth="100" naturalSlideHeight="125"></CarouselProvider>
    );
  }
}
```

3. Place the components in any order you wish as long as they are children of a single CarouselProvider component. Some components have ancestor/descendant relationships but they don't have to be direct relatives.  For example: Slides need to go inside of a Slider.
Slides require an index.  Chances are, a lot of the time, you're going to be populating the slides from data and looping through the data, so it would be easy to add an index in your loop.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'react-carousel';

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider>
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

4. Add some buttons so the user can navigate forward and backwards.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'react-carousel';

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider>
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

4. Make sure to set the required properties for the \<CarouselProvider> component.

```javascript
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'react-carousel';

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

## Docs
###\<CarouselProvider />
| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string \| node] | | **Yes** | Children is a special React property.  Basically, the CarouselProvider needs to wrap other Carousel components and HTML |
| className | string | null | No | Optional className string that will be appended to the component's className string |
| currentSlide | number | 0 | No | \<Slide \> to display on initial render. The indexing of \<Slide /> components starts with 0. |
| hasMasterSpinner | bool | false | No | When true, a spinner will cover \<Slider /> component until all \<Image \> and \<ImageWithZoom \> are done loading images.  If there are no \<Image /> or \<ImageWithZoom> components, the spinner will spin until this property is set to false |
| **naturalSlideHeight** | number | | **Yes** | The natural height of each <\Slide > component. ** |
| **naturalSlideWidth** | number | | **Yes** | The natural width of each <\Slide > component. ** |
| orientation | string | "horizontal" | No | Possible values are "horizontal" and "vertical".  Let's you have a horizontal or vertical carousel. |
| step | number | 1 | No | The number of slides to move when pressing the \<ButtonBack /> and \<ButtonNext /> buttons.|
| **totalSlides** | number |  | **Yes** | Always set this to match the total number of \<Slide > components in your carousel |
| touchEnabled | boolean | true | No | Set to true to enable touch events |
| visibleSlides | number | 1 | No | The number of slides to show at once.  This number should be <= totalSlides |


**__More about naturalSlideWidth and naturalSlideHeight__
The carousel is responsive and by default will flex to the full width of the <Slider \> parent container.  It's up to you to contain the carousel width via css.  Each slide will be the same height to width ratio ([intrinsic ratio](https://alistapart.com/d/creating-intrinsic-ratios-for-video/example2.html)). CarouselProvider needs to know the default size of each \<Slide />.  Note: you can make the carousel non-responsive by setting the width of <Slider \>to a fixed css unit, like pixels. There are many other ways to make the carousel non-responsive.

###\<Slider />
The Slide component creates the following pseudo HTML by default.
```HTML
<div class="X" aria-live="polite" style="X" ...props>
  <div class="X" style="X">
    <div class="X" style="X" onTouchStart="X" onTouchMove="X" onTouchEnd="X">
      [content goes here]
    </div>
    <div></div><!-- Master Spinner -->
  </div>
</div>
```
| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| **children** | [string \| node] | | **Yes** | Children is a special React property.  Basically, the CarouselProvider needs to wrap other components and/or HTML |
| className | string | null | No | Optional className string that will be appended to the component's className string. |
| style | object | {} | No | Optional css styles to add to the Slider.  Note: internal css properties take precedence over any styles specified in the styles object |
| onMasterSpinner | [function \| null] | null | No | Optional callback function that is called when the Master Spinner is visible.  Requires that \<CarouselProvider /> set hasMasterSpinner to true |

###\<Slide />
The Slide component creates the following pseudo HTML by default.
```HTML
<div tabIndex="X" aria-hidden="X" onFocus="X" onBlur="X" class="X" style="X" ...props>
  <div class="X">
    [content goes here]
    <div></div><!-- focus ring -->
  </div>
</div>
```
| property | type | default | required | purpose |
| -------- | ---- | ------- | -------- | ------- |
| className | string | null | No | Optional className string that will be appended to the component's className string. |
| **index** | number | | **Yes** | You must consecutively number the \<Slide > components in order starting with zero. |
| innerClassName | string | null | No | Optional className string that will be appended to an internal HTML element created by the Component. Best to just use Chrome Dev Tools to inspect the demo app or check the source code for \<Slide /> |
| innerTag | string | 'div' | No | The inner HTML element for each Slide. |
| onBlur | [ function \| null ] | null | No | Optional callback function that is called after the internal onBlur function is called. It is passed the React synthetic event |
| onFocus | [ function \| null ] | null | No | Optional callback function that is called after the internal onFocus function is called. It is passed the React synthetic event |
| tabIndex | [ number \| null ] | null | No | When null, the Carousel will set this automatically.  99.9% of the time, you're going to want to leave this alone and let the carousel handle tabIndex automatically. |
| tag | string | 'div' | No | The inner HTML element for each Slide. |


## More Documentation to Come
I promise to add docs for every component.  In the meantime, feel free to download and run the demo app.  Looking at the code might help you out.

## Dev Workflow
- `npm run dev` starts a local development server, opens the dev page with your default browser, and watches for changes via livereload
- `npm run build` compiles commonjs and ES modules and places them in the dist directory
- `npm test` runs jest (not configured yet)
