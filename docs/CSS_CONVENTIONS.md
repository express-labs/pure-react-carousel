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

---

## Sub-element Styling: Use `className*` Props

If you need to apply a class to an element deep within the component, create a camelCase formatted prop `className*` on the top level of the component and pass it to the targeted element.

**Bad - forcing descendant selectors to style inner elements:**

```typescript
// ❌ BAD: Component only accepts a top-level className prop
const Card = ({ className, children }) => (
  <div className={cn(s.card, className)}>
    <div className={s.body}>{children}</div>
  </div>
);
```

```scss
// ❌ BAD: Consumer must use nested or descendant selectors to target inner elements
.myCustomCard {
  .body {
    background-color: #f5f5f5;
  }
}
```

**Good - exposing targeted camelCase `className*` props:**

```typescript
// ✅ GOOD: Component defines camelCase className* props for internal elements
interface CardProps {
  className?: string;
  classNameBody?: string;
  children: React.ReactNode;
}

const Card = ({ className, classNameBody, children }: CardProps) => (
  <div className={cn(s.card, "carousel__card", className)}>
    <div className={cn(s.body, "carousel__card-body", classNameBody)}>
      {children}
    </div>
  </div>
);
```

```typescript
// ✅ GOOD: Consumer passes specific classes directly
<Card
  className={s.customCard}
  classNameBody={s.customBody}
>
  Content
</Card>
```

```scss
// ✅ GOOD: Selectors remain flat and independent
.customCard {
  border: 1px solid #ccc;
}

.customBody {
  background-color: #f5f5f5;
}
```

> **Note**: This pattern is used throughout the library (for example, `Slider` accepts `classNameTray` and `classNameTrayWrap` to allow direct styling of internal track wrappers without nested selectors).

