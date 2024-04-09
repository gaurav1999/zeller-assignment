## Steps to Installation
- git clone
- use node version 18 (Volta pin dropped already to assist you if you use volta)
- npm install
- npm run test

Example -->

```
zeller-assignment ±|master ✗|→ npm run test
Debugger attached.

> zeller-assignment@1.0.0 test
> npx jest

Debugger attached.
Debugger attached.
 PASS  tests/store.test.spec.ts
  Checkout
    ✓ checking out invalid item throws error (1 ms)
    ✓ checkOut function should return correct in case of no discount
    ✓ Ipad and Atv mix discount apply
    ✓ System considering a better discount in case of another one being applied
    ✓ rolling item price reduce for buy 3 pay for 2 kind of scenario

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.718 s, estimated 1 s
Ran all test suites.

```