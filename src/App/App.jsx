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
} from './examples';
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
          <option value="6">Simple Carousel with vertically alligned nav buttons</option>
          <option value="7">Simple Carousel with react-redux</option>
          <option value="8">Horizontal Carousel (With lockOnWindowScroll set to TRUE)</option>
        </select>
        <hr />
        { (this.state.value === '0' || this.state.value === '1') && (
          <section id="example--1">
            <Example1 />
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '2') && (
          <section id="example--2">
            <Example2 />
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '3') && (
          <section id="example--3">
            <Example3 />
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '4') && (
          <section id="example--4">
            <Example4 />
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '5') && (
          <section id="example--5">
            <Example5 />
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '6') && (
          <section id="example--6">
            <Example6 />
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '7') && (
          <section id="example--7">
            <Example7 />
          </section>
        )}

        { (this.state.value === '0' || this.state.value === '8') && (
          <section id="example--8">
            <Example8 />
          </section>
        )}

      </div>
    );
  }
}
export default DevelopmentApp;
