# react-carousel
A highly impartial suite of React components that can be assembled by the consumer to create a carousel with almost no limits on DOM structure or CSS styles.

My goal was to create a 100% ReactJS carousel that doesn't try to impose structure or styles that have to be defeated in order to match your site's design standards. Tired of fighting some other developer's CSS or DOM structure?  If so, this carousel is for you.

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

```
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'react-carousel';
```  

2. Put a CarouselProvider component in your code.  This allows the other carousel components to communicate with each other.  The only required properties are the orientation, naturalSlideWidth, and naturalSlideHeight.  And it must have children, of course.  We'll add children in the next step.

```
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

```
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'react-carousel';

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider>
        <Slider>
          <Slide index={0}>I'm the first Slide.</Slide>
          <Slide index={1}>I'm the second Slide.</Slide>
          <Slide index={2}>I'm the third Slide.</Slide>
        </Slider>
      </CarouselProvider>
    );
  }
}
```

4. Add some buttons so they can go forward or backwards.

```
import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'react-carousel';

export default class extends React.Component {
  render() {
    return (
      <CarouselProvider>
        <Slider>
          <Slide index={0}>I'm the first Slide.</Slide>
          <Slide index={1}>I'm the second Slide.</Slide>
          <Slide index={2}>I'm the third Slide.</Slide>
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

## More Documentation to Come
I promise to add docs for every component.  In the meantime, feel free to download and run the demo app.  Looking at the code might help you out.

## Dev Workflow
- `npm run dev` starts a local development server, opens the dev page with your default browser, and watches for changes via livereload
- `npm run build` compiles commonjs and ES modules and places them in the dist directory
- `npm test` runs jest (not configured yet)
