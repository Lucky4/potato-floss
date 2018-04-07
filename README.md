Potato Floss
===

Getting Start
---

### Ingredients
#### Tools
```sh
npm install potato-floss
```

#### A complete potato
```js
/**
 * Add up from 0 to 10,000,000
 * use decimal.js for high precision
 * https://github.com/MikeMcl/decimal.js
 */
function calculate() {
  let sum = new Decimal(0);
  const max = new Decimal('10000000');
  for (let i = new Decimal(0); i.lt(max); i = i.plus(1)) {
    sum = sum.plus(i);
  }
  return sum;
}
```

### Instructions
#### Wash the potato
```js
/*
 * Use generator function
 */
function* calculate() {
  let sum = new Decimal(0);
  const max = new Decimal('10000000');
  for (let i = new Decimal(0); i.lt(max); i = i.plus(1)) {
    sum = sum.plus(i);
  }
  return sum;
}
```

#### Cut into shreds
```js
function* calculate() {
  let sum = new Decimal(0);
  const max = new Decimal('10000000');
  for (let i = new Decimal(0); i.lt(max); i = i.plus(1)) {
    sum = sum.plus(i);
    // yield per 100 loops
    if (i.mod(100).equals(0)) {
      yield `${i.mul(100).div(max).toFixed(1)}`;
    }
  }
  return sum;
}
```

#### Cook
```js
const worker = new window.PotatoFloss(calculate, function (percent) {
  // percent from `yield`
  console.log(`${percent}% finished`);
});
worker.start().then(function (sum) {
  // sum from `return`
  console.log(sum);
});
```

#### Finish
[Potato Floss Demo](https://means88.github.io/potato-floss/)

## LICENSE
MIT
