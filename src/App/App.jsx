import React from 'react';
import {
  Example1,
  Example2,
  Example3,
  Example4,
  Example5,
  Example6,
  Example7,
  Example8,
  Example9,
} from './examples';
import s from './style.scss';


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
    const { value } = this.state;

    return (
      <div>
        <h1>Carousel Examples</h1>
        <p>
          Use the Select input below to switch between views.  This is usefull for testing to make
          sure that mount and unmount happens cleanly.
        </p>
        <select className={s.select} value={value} onChange={this.handleChange}>
          <option value="0">Show All</option>
          <option value="1">Carousel (With Master Loading Spinner)</option>
          <option value="2">Carousel (With Individual Spinners)</option>
          <option value="3">Carousel (Just One Image)</option>
          <option value="4">Vertical Carousel (With Master Loading Spinner)</option>
          <option value="5">Horizontal Carousel (With Master Loading Spinner)</option>
          <option value="6">Simple Carousel with vertically alligned nav buttons</option>
          <option value="7">Simple Carousel with react-redux</option>
          <option value="8">Horizontal Carousel (With lockOnWindowScroll set to TRUE)</option>
          <option value="9">Horizontal Carousel Auto Play</option>
        </select>
        <hr />
        { (value === '0' || value === '1') && (
          <section id="example--1">
            <Example1 />
          </section>
        )}

        { (value === '0' || value === '2') && (
          <section id="example--2">
            <Example2 />
          </section>
        )}

        { (value === '0' || value === '3') && (
          <section id="example--3">
            <Example3 />
          </section>
        )}

        { (value === '0' || value === '4') && (
          <section id="example--4">
            <Example4 />
          </section>
        )}

        { (value === '0' || value === '5') && (
          <section id="example--5">
            <Example5 />
          </section>
        )}

        { (value === '0' || value === '6') && (
          <section id="example--6">
            <Example6 />
          </section>
        )}

        { (value === '0' || value === '7') && (
          <section id="example--7">
            <Example7 />
          </section>
        )}

        { (value === '0' || value === '8') && (
          <section id="example--8">
            <Example8 />
          </section>
        )}

        { (value === '0' || value === '9') && (
          <section id="example--9">
            <Example9 />
          </section>
        )}

      </div>
    );
  }
}
export default DevelopmentApp;
