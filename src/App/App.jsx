import React from 'react';
import {
  Example1,
  Example2,
  Example3,
  Example4,
  Example5,
  Example6,
  // Example7,
  Example8,
  Example9,
  Example10,
  Example11,
  Example12,
  Example13,
  Example14,
  Example15,
} from './examples';
import s from './style.scss';

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
    const { value } = this.state;

    return (
      <div>
        <div className={s.firstSlide}>
          <div className={s.firstSlideCenterVert}>
            <div className={s.firstSlideCenterHoriz}>
              <h1 className={s.heroHeadline}>Pure React Carousel</h1>
              <p className={s.heroText}>
                Pure React Carousel is a suite of unopinionated React components that a developer
                can use to create robust carousels with almost no limits on DOM structure or
                styling.
              </p>
              <p className={s.heroText}>
                If you&apos;re tired of fighting some other developer&apos;s CSS and DOM structure,
                this carousel is for you.
              </p>
              <ul className={s.heroList}>
                <li>
                  <a href="#un">What is &quot;unopinionated?&quot;</a>
                </li>
                <li>
                  <a href="#rw">Real World Example</a>
                </li>
                <li>
                  <a href="#de">Demo Examples</a>
                </li>
                <li>
                  <a href="https://github.com/express-labs/pure-react-carousel">
                    Documentation
                    <svg
                      className={s.externalLink}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path d="M5 3c-1.093 0-2 .907-2 2v14c0 1.093.907 2 2 2h14c1.093 0 2-.907 2-2v-7h-2v7H5V5h7V3H5zm9 0v2h3.586l-9.293 9.293 1.414 1.414L19 6.414V10h2V3h-7z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#el">Express Labs</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="un" className={s.secondSlide}>
          <h2 className={s.headline}>What is &quot;unopinionated?&quot;</h2>
          <p>
            The Pure React Carousel suite of React components is not a turn-key solution. Rather,
            think of these as a set of new suite of HTML tags similar in relationship to table tags
            like table, tr, th, td, tbody, thead, tfoot.
          </p>
          <p>
            The components in Pure React Carousel provide the bare-minimum of styling and javascript
            required to function correctly as a carousel. Just like using table HTML tags will give
            you a bare-bones table that you will need to style, Pure React Carousel requires that
            you provide additional styles and optional javascript in order to meet your
            project&apos;s specific functionality and branding requirements.
          </p>
          <p>
            The benefit of Pure React Carousel is that our components are focused on one task: being
            an WCAG accessible carousel. Besides that, our goal is to get out of your way.
          </p>
        </div>
        <div id="rw" className={s.examples}>
          <div className={s.examplesInnerCenter}>
            <h2 className={s.headline}>Real World Example</h2>
            <p>
              Here are two examples of what can be achieved with Pure React Carousel. This is how we
              use the suite of components on the Express.com website.
            </p>
            <p>
              <img
                className={s.responsiveImg}
                src="./media/pdp-women.gif"
                alt="example of pure react carousel on the product detail page for a dress on Express.com"
              />
            </p>
            <p>
              <img
                className={s.responsiveImg}
                src="./media/pdp-men.gif"
                alt="example of pure react carousel on the product detail page for a shirt on Express.com"
              />
            </p>
          </div>
        </div>
        <div id="de" className={s.examplesDemo}>
          <div className={s.examplesInner}>
            <h2 className={s.headline}>Default Carousel Examples</h2>
            <h3 className={s.headline}>Why are these examples so... ugly?</h3>
            <p>
              These examples are completely un-styled. Pure React Carousel does not come with styles
              that must be defeated in order to match your organization&apos;s branding. So, to
              distract you from the seeming lack of finesse, most of our examples involve pictures
              of cats!
            </p>
            <p>
              <label>
                Please choose a demo. &nbsp;
                <select className={s.select} value={value} onChange={this.handleChange}>
                  <option value="0">Show All</option>
                  <option value="1">Carousel (With Master Loading Spinner)</option>
                  <option value="2">Carousel (With Individual Spinners)</option>
                  <option value="3">Carousel (Just One Image)</option>
                  <option value="4">Vertical Carousel (With Master Loading Spinner)</option>
                  <option value="5">Horizontal Carousel (With Master Loading Spinner)</option>
                  <option value="6">Simple Carousel with vertically alligned nav buttons</option>
                  <option value="7">Simple Carousel with react-redux</option>
                  <option value="8">
                    Horizontal Carousel (With lockOnWindowScroll set to TRUE)
                  </option>
                  <option value="9">Horizontal Carousel Auto Play</option>
                  <option value="10">Carousel with custom spinner component.</option>
                  <option value="11">Simple carousel with event callbacks on Slider.</option>
                  <option value="12">Infinite Carousel</option>
                  <option value="13">Using Intrinsic Axis Dimension</option>
                </select>
              </label>
            </p>

            <div className={s.example}>
              {(value === '0' || value === '1') && (
                <section id="example--1">
                  <hr />
                  <Example1 />
                </section>
              )}

              {(value === '0' || value === '2') && (
                <section id="example--2">
                  <hr />
                  <Example2 />
                </section>
              )}

              {(value === '0' || value === '3') && (
                <section id="example--3">
                  <hr />
                  <Example3 />
                </section>
              )}

              {(value === '0' || value === '4') && (
                <section id="example--4">
                  <hr />
                  <Example4 />
                </section>
              )}

              {(value === '0' || value === '5') && (
                <section id="example--5">
                  <hr />
                  <Example5 />
                </section>
              )}

              {(value === '0' || value === '6') && (
                <section id="example--6">
                  <hr />
                  <Example6 />
                </section>
              )}

              {/* {(value === '0' || value === '7') && (
                <section id="example--7">
                  <hr />
                  <Example7 />
                </section>
              )} */}

              {(value === '0' || value === '8') && (
                <section id="example--8">
                  <hr />
                  <Example8 />
                </section>
              )}

              {(value === '0' || value === '9') && (
                <section id="example--9">
                  <hr />
                  <Example9 />
                </section>
              )}

              {(value === '0' || value === '10') && (
                <section id="example--10">
                  <hr />
                  <Example10 />
                </section>
              )}

              {(value === '0' || value === '11') && (
                <section id="example--11">
                  <hr />
                  <Example11 />
                </section>
              )}

              {(value === '0' || value === '12') && (
                <section id="example--12">
                  <hr />
                  <Example12 />
                </section>
              )}

              {(value === '0' || value === '13') && (
                <section id="example--13">
                  <hr />
                  <Example13 />
                </section>
              )}

              {(value === '0' || value === '14') && (
                <section id="example--14">
                  <hr />
                  <Example14 />
                </section>
              )}

              {(value === '0' || value === '15') && (
                <section id="example--15">
                  <hr />
                  <Example15 />
                </section>
              )}
            </div>
          </div>
        </div>
        <div id="el" className={s.express}>
          <h2 className={s.headline}>Express Labs</h2>
          <p>Created by the React developers at Express</p>
          <div className={s.logo}>
            <svg width="164" height="27" xmlns="http://www.w3.org/2000/svg">
              <g className={s.logofill} fillRule="evenodd">
                <path d="M0 25.827V1.02h18.249v4.807H6.196v4.532h11.246v4.804H6.196v5.85h13.09v4.815H0M30.608 12.478l-8.183-11.46h7.52l4.527 7.56 4.49-7.56h7.414l-8.15 11.46 9.511 13.35h-7.59l-5.714-9.271-5.877 9.27h-7.492l9.544-13.349M49.652 25.827h6.268V17.81h4.84c8.491 0 10.336-5.087 10.336-8.394 0-4.916-2.47-8.397-9.155-8.397H49.652v24.808zm6.19-20.21h5.05c2.828 0 4.006 1.36 4.006 3.835 0 1.91-1.01 3.76-3.83 3.76h-5.225V5.617zM72.768 25.827h6.198v-8.923H82.9l4.874 8.923h6.931l-5.679-9.968c3.1-.905 5.12-3.485 5.12-6.692 0-5.57-3.41-8.148-8.978-8.148h-12.4v24.808zm6.198-20.21h5.675c1.985.034 3.31 1.045 3.31 3.345 0 2.297-1.325 3.306-3.31 3.344h-5.675V5.617zM96.606 25.827V1.02h18.244v4.807h-12.047v4.532h11.246v4.804h-11.246v5.85h13.089v4.815H96.606M122.174 18.403c2.157 1.952 4.215 3.099 7.174 3.099 1.635 0 4.632-.694 4.632-2.857 0-1.254-.946-1.88-2.79-2.194l-5.152-.836c-4.6-.731-7.102-3.169-7.102-6.825 0-5.995 4.84-8.47 10.128-8.47 4.11 0 8.149 1.675 10.937 4.776l-4.7 3.377a8.562 8.562 0 0 0-6.65-3.133c-1.427 0-3.519.905-3.519 2.508 0 1.32 1.083 1.984 3.447 2.37l2.372.38c4.94.798 9.018 2.333 9.018 7.073 0 7.455-6.727 8.85-11.358 8.85-4.207 0-7.797-1.357-11.173-5.052l4.736-3.066M146.027 18.403c2.155 1.952 4.21 3.099 7.167 3.099 1.643 0 4.631-.694 4.631-2.857 0-1.254-.937-1.88-2.789-2.194l-5.147-.836c-4.6-.731-7.108-3.169-7.108-6.825 0-5.995 4.848-8.47 10.14-8.47 4.103 0 8.145 1.675 10.93 4.776l-4.704 3.377a8.561 8.561 0 0 0-6.65-3.133c-1.422 0-3.514.905-3.514 2.508 0 1.32 1.078 1.984 3.45 2.37l2.363.38c4.944.798 9.018 2.333 9.018 7.073 0 7.455-6.722 8.85-11.35 8.85-4.214 0-7.8-1.357-11.173-5.052l4.736-3.066" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
export default DevelopmentApp;
