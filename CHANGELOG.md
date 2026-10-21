# Changelog

## [3.5.1](https://github.com/express-labs/pure-react-carousel/compare/v3.5.0...v3.5.1) (2026-10-21)


### Bug Fixes

* **demo:** add WCAG landmarks, named regions, and accessible SVG labels ([#522](https://github.com/express-labs/pure-react-carousel/issues/522)) ([c2e52dc](https://github.com/express-labs/pure-react-carousel/commit/c2e52dc12cd92d28ced6ee79ede5c2a61bff08c3))
* **demo:** modernize typography, WCAG 2.2 AA contrast, and mobile responsiveness ([#524](https://github.com/express-labs/pure-react-carousel/issues/524)) ([32b8bd4](https://github.com/express-labs/pure-react-carousel/commit/32b8bd47a4cbb47d4f0b3697d37bdd3c079e98c8))
* **demo:** resolve WAVE accessibility alerts and polish demo layout ([#525](https://github.com/express-labs/pure-react-carousel/issues/525)) ([18a68bb](https://github.com/express-labs/pure-react-carousel/commit/18a68bbc8c9122b4033734874cee6ce806b92be3))

## [3.5.0](https://github.com/express-labs/pure-react-carousel/compare/v3.4.0...v3.5.0) (2026-10-21)


### Features

* **a11y:** forward refs, add wrapper escape hatches, and improve WCAG 2.2 AA compliance ([#520](https://github.com/express-labs/pure-react-carousel/issues/520)) ([e1d67f3](https://github.com/express-labs/pure-react-carousel/commit/e1d67f39c6e7e5a253602f47a5b99edeb6a33a09))
* **demo:** add responsive carousel example and section anchor links ([#516](https://github.com/express-labs/pure-react-carousel/issues/516)) ([fa388da](https://github.com/express-labs/pure-react-carousel/commit/fa388da148179ac8fbc004c7d6453ddce8b5fff3))


### Bug Fixes

* **demo:** remove invalid &lt;p&gt; wrapper around Example17 control grid ([#521](https://github.com/express-labs/pure-react-carousel/issues/521)) ([0ade028](https://github.com/express-labs/pure-react-carousel/commit/0ade028ab28f82fc3bd89a6277b96468289194e5))

## [3.4.0](https://github.com/express-labs/pure-react-carousel/compare/v3.3.1...v3.4.0) (2026-10-19)


### Features

* **native-slider:** add NativeSlider component with CSS scroll snap support ([#514](https://github.com/express-labs/pure-react-carousel/issues/514)) ([781bfc3](https://github.com/express-labs/pure-react-carousel/commit/781bfc307b40955a3f5889717c22563cada18b32))

## [3.3.1](https://github.com/express-labs/pure-react-carousel/compare/v3.3.0...v3.3.1) (2026-10-18)


### Bug Fixes

* **slider:** prevent scroll-lock layout shift and remove idle will-change layer ([#512](https://github.com/express-labs/pure-react-carousel/issues/512)) ([7c7e187](https://github.com/express-labs/pure-react-carousel/commit/7c7e187f5e0141830998bfa5a6800c865ec57e83))
* **slider:** suppress live drag translation when animation is disabled ([825c2a0](https://github.com/express-labs/pure-react-carousel/commit/825c2a0899e3735e1b9153a0b272f269c2e26e90)), closes [#322](https://github.com/express-labs/pure-react-carousel/issues/322)

## [3.3.0](https://github.com/express-labs/pure-react-carousel/compare/v3.2.1...v3.3.0) (2026-10-18)


### Features

* **slider:** suppress child click events on drag with configurable dragClickThreshold ([#508](https://github.com/express-labs/pure-react-carousel/issues/508)) ([65c1062](https://github.com/express-labs/pure-react-carousel/commit/65c1062f4223d7c7cd853e544884afdbd0328a1b))

## [3.2.1](https://github.com/express-labs/pure-react-carousel/compare/v3.2.0...v3.2.1) (2026-10-18)


### Bug Fixes

* **slider:** use display flex on sliderTray and align CSS module classes ([#506](https://github.com/express-labs/pure-react-carousel/issues/506)) ([9437d38](https://github.com/express-labs/pure-react-carousel/commit/9437d389343258190f29dbe15b9f43fcee940307))

## [3.2.0](https://github.com/express-labs/pure-react-carousel/compare/v3.1.1...v3.2.0) (2026-10-18)


### Features

* **autoplay:** add pauseOnInteract prop to reset interval on interaction ([#504](https://github.com/express-labs/pure-react-carousel/issues/504)) ([7e64367](https://github.com/express-labs/pure-react-carousel/commit/7e64367b70a995c62efe5c5fb1438b103c0002d0)), closes [#456](https://github.com/express-labs/pure-react-carousel/issues/456)

## [3.1.1](https://github.com/express-labs/pure-react-carousel/compare/v3.1.0...v3.1.1) (2026-10-18)


### Bug Fixes

* **provider:** prevent touch scroll threshold props from leaking to DOM ([#501](https://github.com/express-labs/pure-react-carousel/issues/501)) ([be3d649](https://github.com/express-labs/pure-react-carousel/commit/be3d649846553a17b13426b89f6ea52b343b3747))
* **slider:** respect dynamic playDirection and interval changes during autoplay ([#502](https://github.com/express-labs/pure-react-carousel/issues/502)) ([84ffa13](https://github.com/express-labs/pure-react-carousel/commit/84ffa13ca577d7b2bcf6c3109c52e3f9ab6309e3)), closes [#170](https://github.com/express-labs/pure-react-carousel/issues/170)

## [3.1.0](https://github.com/express-labs/pure-react-carousel/compare/v3.0.0...v3.1.0) (2026-10-16)


### Features

* automate TypeScript declaration generation, harden SSR compatibility, and add agent conventions ([#493](https://github.com/express-labs/pure-react-carousel/issues/493)) ([9d820ae](https://github.com/express-labs/pure-react-carousel/commit/9d820aeef56ebf0b299123b519f92b804ae956fb))
* **compat:** add react compatibility test suite and demo chart page ([#496](https://github.com/express-labs/pure-react-carousel/issues/496)) ([b36fe38](https://github.com/express-labs/pure-react-carousel/commit/b36fe383945771826ae904b60e61978718cf3af2))
* restored-development-app ([#495](https://github.com/express-labs/pure-react-carousel/issues/495)) ([3528391](https://github.com/express-labs/pure-react-carousel/commit/3528391d0fed76706ab65103b9ee419c0e3e78f8))
