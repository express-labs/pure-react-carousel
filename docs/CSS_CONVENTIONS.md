# CSS Conventions

Things to keep in mind when working with CSS, Sass and SCSS files.

---

## CSS: Keep Selectors Flat

Do **NOT** nest CSS class selectors to mirror the HTML structure of a component. Nested selectors raise specificity and prevent parent components from overriding styles via a passed-in `className` prop, which the component system relies on.

**Bad - nested selectors mirror HTML structure:**

```scss
.card {
  .card__header {
    font-weight: bold;
  }
  .card__body {
    padding: 1.6rem;
  }
}
```

**Good - flat selectors, one class per rule:**

```scss
.card {
  // card root styles
}

.card__header {
  font-weight: bold;
}

.card__body {
  padding: 1.6rem;
}
```

Flat selectors keep specificity at the lowest level and make each rule independently overridable.

---

Do **not** use HTML tag names as css selectors. We should only add class names to HTML elements as a matter of policy. If you need to apply CSS to a specific element, add the className directly to the React code for that element.

**Bad - using HTML tag as css selector to access a nested element:**

```typescript
import s from './MyComponent.scss';

const MyComponent = ({className}) => (
  <div className={s.wrapper}>
    <p>Hello World</p>
  </div>
)
```

```scss
.wrapper {
  padding: 1em;
}

// ❌ BAD: Do Not use the P HTML tag as a CSS selector
p {
  color: red;
}
```

**Good - updating the React component code to add a new className prop as needed**

```typescript
import s from './MyComponent.scss';

const MyComponent = ({className}) => (
  <div className={s.wrapper}>
    <p className={s.text}>Hello World</p>
  </div>
)
```

```scss
// ✅ GOOD: using a class selector
.text {
  color: red;
}
```
