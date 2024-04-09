import { CheckOut, DISCOUNT_TYPE, DiscountModel, StoreItems } from "../src/checkout"; // Import classes and interfaces from your TypeScript file

describe("Checkout", () => {

  let checkOut: CheckOut;
  
  const items: StoreItems[] = [
    { sku: "ipd", name: "Super Ipad", price: 549.99 },
    { sku: "mpb", name: "Macbook pro", price: 1399.99 },
    { sku: "atv", name: "Apple Tv", price: 109.5 },
    { sku: "vga", name: "Adapter", price: 30.0 },
  ];

  const discountRules: DiscountModel = {
    ipd: [{ minimumQuantity: 4, type: DISCOUNT_TYPE.EACH, benefit: 499.99 }],
    atv: [{ minimumQuantity: 3, type: DISCOUNT_TYPE.REDUCE, benefit: 2 }, { minimumQuantity: 5, type: DISCOUNT_TYPE.EACH, benefit: 40 }],
  }

  // const checkOut = new CheckOut(items, discountRules);

  beforeEach(() => {
    checkOut = new CheckOut(items, discountRules);
  })


  test("checking out invalid item throws error", () => {
    try {
      checkOut.scan("random");
    } catch (error) {
      expect(error.message).toEqual("Invalid Item Added in cart");
    }
  });

  test("checkOut function should return correct in case of no discount", () => {
    checkOut.scan("vga");
    checkOut.scan("vga");
    const total = checkOut.total();
    expect(total).toEqual(items.find((item) => item?.sku === "vga").price * 2);
  });

  test("Ipad and Atv mix discount apply", () => {
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("ipd");
    checkOut.scan("ipd");
    checkOut.scan("ipd");
    checkOut.scan("ipd");
    checkOut.scan("ipd");
    const total = checkOut.total();
    expect(total).toEqual(2718.95);
  })


  test("System considering a better discount in case of another one being applied", () => {
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("ipd")
    const total = checkOut.total();
    expect(total).toEqual(8*40 + 549.99)
  })



  test("rolling item price reduce for buy 3 pay for 2 kind of scenario", () => {
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("atv");
    checkOut.scan("atv");
    const total = checkOut.total();
    expect(total).toEqual(items.find((item) => item?.sku === "atv").price * 3)
  })

});
