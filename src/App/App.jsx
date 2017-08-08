import React from 'react';
import {
  ButtonBack, ButtonFirst, ButtonLast, ButtonNext,
  CarouselProvider, DotGroup, ImageWithZoom, Image, Slide, Slider,
} from '../';
import s from './style.css';

// function demoClick(ev) {
//   console.log('ev', Object.assign({}, ev));
// }

class DevelopmentApp extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '0',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ev) {
    this.setState({
      value: ev.target.value,
    });
  }

  render() {
    return (
      <div>
        <h1>Carousel Examples</h1>
        <p>
          Use the Select input below to switch between views.  This is usefull for testing to make
          sure that mount and unmount happens cleanly.
        </p>
        <select className={s.select} value={this.state.value} onChange={this.handleChange}>
          <option value="0">Show All</option>
          <option value="1">Carousel (With Master Loading Spinner)</option>
          <option value="2">Carousel (With Individual Spinners)</option>
          <option value="3">Carousel (Just One Image)</option>
          <option value="4">Vertical Carousel (With Master Loading Spinner)</option>
          <option value="5">Horizontal Carousel (With Master Loading Spinner)</option>
        </select>
        <hr />
        { (this.state.value === '0' || this.state.value === '1') && (
          <section id="example--1">
            <CarouselProvider
              visibleSlides={3}
              totalSlides={6}
              step={3}
              naturalSlideWidth={400}
              naturalSlideHeight={500}
              hasMasterSpinner
            >
              <h1 className={s.headline}>Carousel (With Master Loading Spinner)</h1>
              <p>
                This spinner will go away after all the images have loaded. You might want to use
                Chrome dev tools to throttle the network connection so you can see the spinner.
              </p>
              <Slider className={s.slider}>
                <Slide index={0}>
                  <ImageWithZoom src="./media/img01.jpeg" />
                </Slide>
                <Slide index={1}>
                  <ImageWithZoom src="./media/img02.jpeg" />
                </Slide>
                <Slide index={2}>
                  <ImageWithZoom src="./media/img03.jpeg" />
                </Slide>
                <Slide index={3}>
                  <ImageWithZoom src="./media/img04.jpeg" />
                </Slide>
                <Slide index={4}>
                  <ImageWithZoom src="./media/img05.jpeg" />
                </Slide>
                <Slide index={5}>
                  <ImageWithZoom src="./media/img06.jpeg" />
                </Slide>
              </Slider>
              <ButtonFirst>First</ButtonFirst>
              <ButtonBack>Back</ButtonBack>
              <ButtonNext>Next</ButtonNext>
              <ButtonLast>Last</ButtonLast>
              <DotGroup />
            </CarouselProvider>
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '2') && (
          <section id="example--2">
            <CarouselProvider
              visibleSlides={2}
              totalSlides={6}
              step={2}
              naturalSlideWidth={400}
              naturalSlideHeight={500}
            >
              <h1 className={s.headline}>Carousel (With Individual Spinners)</h1>
              <p>
                Each ImageWithZoom component has it&apos;s own spinner. You might want to use Chrome
                dev tools to throttle the network connection so you can see the spinners.
              </p>
              <p>
                Also, we added the boolean prop dotNumbers to the DotGroup for displaying slide
                numbers.
              </p>
              <Slider className={s.slider}>
                <Slide index={0}>
                  <ImageWithZoom src="./media/img01.jpeg" />
                </Slide>
                <Slide index={1}>
                  <ImageWithZoom src="./media/img02.jpeg" />
                </Slide>
                <Slide index={2}>
                  <ImageWithZoom src="./media/img03.jpeg" />
                </Slide>
                <Slide index={3}>
                  <ImageWithZoom src="./media/img04.jpeg" />
                </Slide>
                <Slide index={4}>
                  <ImageWithZoom src="./media/img05.jpeg" />
                </Slide>
                <Slide index={5}>
                  <ImageWithZoom src="./media/img06.jpeg" />
                </Slide>
              </Slider>
              <ButtonFirst>First</ButtonFirst>
              <ButtonBack>Back</ButtonBack>
              <ButtonNext>Next</ButtonNext>
              <ButtonLast>Last</ButtonLast>
              <DotGroup dotNumbers />
            </CarouselProvider>
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '3') && (
          <section id="example--3">
            <CarouselProvider
              visibleSlides={2}
              totalSlides={1}
              step={2}
              naturalSlideWidth={400}
              naturalSlideHeight={500}
            >
              <h1 className={s.headline}>Carousel (Just One Image)</h1>
              <p>Single image</p>
              <Slider className={s.slider}>
                <Slide tag="a" index={0}>
                  <ImageWithZoom src="./media/img01.jpeg" />
                </Slide>
              </Slider>
              <ButtonFirst>First</ButtonFirst>
              <ButtonBack>Back</ButtonBack>
              <ButtonNext>Next</ButtonNext>
              <ButtonLast>Last</ButtonLast>
              <DotGroup />
            </CarouselProvider>
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '4') && (
          <section id="example--4">
            <CarouselProvider
              visibleSlides={2}
              totalSlides={6}
              orientation="vertical"
              naturalSlideWidth={400}
              naturalSlideHeight={500}
              step={2}
            >
              <h1 className={s.headline}>Vertical Carousel (With Master Loading Spinner)</h1>
              <p>
                This is a vertical carousel.
              </p>
              <p>
                TODO: make vertical carousels responsive based on image.  It can be done but
                it&apos;s not part of the requirements for now.
              </p>
              <Slider className={s.verticalSlider}>
                <Slide index={0}>
                  <ImageWithZoom src="./media/img01.jpeg" />
                </Slide>
                <Slide index={1}>
                  <ImageWithZoom src="./media/img02.jpeg" />
                </Slide>
                <Slide index={2}>
                  <ImageWithZoom src="./media/img03.jpeg" />
                </Slide>
                <Slide index={3}>
                  <ImageWithZoom src="./media/img04.jpeg" />
                </Slide>
                <Slide index={4}>
                  <ImageWithZoom src="./media/img05.jpeg" />
                </Slide>
                <Slide index={5}>
                  <ImageWithZoom src="./media/img06.jpeg" />
                </Slide>
              </Slider>
              <ButtonFirst>First</ButtonFirst>
              <ButtonBack>Back</ButtonBack>
              <ButtonNext>Next</ButtonNext>
              <ButtonLast>Last</ButtonLast>
              <DotGroup />
            </CarouselProvider>
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '5') && (
          <section id="example--5">
            <CarouselProvider
              visibleSlides={2}
              totalSlides={6}
              naturalSlideWidth={400}
              naturalSlideHeight={500}
            >
              <h1 className={s.headline}>Horizontal Carousel (With Master Loading Spinner)</h1>
              <p>
                Horizontal Carouisel with regular, non-zooming images and dotNumbers on the Dot
                Group.
              </p>
              <Slider className={s.slider}>
                <Slide tag="a" index={0}>
                  <Image src="./media/img01.jpeg" />
                </Slide>
                <Slide tag="a" index={1}>
                  <Image src="./media/img02.jpeg" />
                </Slide>
                <Slide tag="a" index={2}>
                  <Image src="./media/img03.jpeg" />
                </Slide>
                <Slide tag="a" index={3}>
                  <Image src="./media/img04.jpeg" />
                </Slide>
                <Slide tag="a" index={4}>
                  <Image src="./media/img05.jpeg" />
                </Slide>
                <Slide tag="a" index={5}>
                  <Image src="./media/img06.jpeg" />
                </Slide>
              </Slider>
              <ButtonFirst>First</ButtonFirst>
              <ButtonBack>Back</ButtonBack>
              <ButtonNext>Next</ButtonNext>
              <ButtonLast>Last</ButtonLast>
              <DotGroup dotNumbers />
            </CarouselProvider>
          </section>
        )}

      </div>
    );
  }
}
export default DevelopmentApp;
