export interface StoreItems {
    sku: string,
    name: string,
    price: number
}

export interface ItemPrice {
    [sku: string]: number;
}

export interface ItemName {
    [sku: string]: string;
}

export interface UserCart {
    [sku: string]: number;
}


export enum DISCOUNT_TYPE {
    REDUCE = "REDUCE",
    EACH = "EACH"
}

export interface DiscountDescription {
    minimumQuantity: number,
    benefit: number,
    type: DISCOUNT_TYPE,
    pairSku?: string,
    pairMinimum?: number
}

export interface DiscountModel {
    [sku: string]: DiscountDescription[]
}



export class CheckOut {
    private items: StoreItems[];

    private discountModel: DiscountModel;

    private itemPrices: ItemPrice = {};

    private cart: UserCart = {};

    private static MIN_AMOUNT_DISCOUNT = 10;

    constructor(items: StoreItems[], discountModel: DiscountModel) {
        this.items = items;
        items.forEach(item => {
            this.itemPrices[item.sku] = item.price;
        })
        this.discountModel = discountModel;
    }

    private applyDiscount(cart: UserCart, maxAmount: number): number {
        
        let discountedTotal = 0;
        const userItems = Object.keys(cart);

        for(let index = 0; index < userItems.length; index++) {

            const currentItem = userItems[index];
            const itemPrice = this.itemPrices[currentItem];
            const itemDiscountRule = this.discountModel[currentItem];

            const itemQuantity = cart[currentItem];
            let price = itemQuantity * itemPrice;

            if(!itemDiscountRule) {
                discountedTotal += price;
                continue;
            } 

            

            for(let i = 0; i < itemDiscountRule.length; i++) {

                //If there is no discount available for the item
                const discountRule = itemDiscountRule[i];
                if(itemQuantity < discountRule.minimumQuantity) continue;

                switch(discountRule.type) {

                    case DISCOUNT_TYPE.EACH: {
                        price = Math.min(price, itemQuantity * discountRule.benefit);
                        break;
                    }

                    case DISCOUNT_TYPE.REDUCE: {
                        let discountPrice = 0;
                        const totalItems = cart[currentItem];
                        const nonIncluded = totalItems % discountRule.minimumQuantity;
                        const discountedQuantity = discountRule.benefit *  Math.floor(totalItems / discountRule.minimumQuantity);  
                        discountPrice = (nonIncluded + discountedQuantity) * itemPrice;
                        price = Math.min(price, discountPrice);
                        break;

                    }

                }
            }

            discountedTotal += price;

        }

        return discountedTotal > 0 ? Math.min(maxAmount, discountedTotal): maxAmount;
    }

    public scan(item: string): void {
        if(!Number.isFinite(this.itemPrices[item])) throw new Error("Invalid Item Added in cart");
        this.cart[item] = (this.cart[item] || 0) + 1;
    }

    public resetCart(): void {
        this.cart = {};
    }

    public total(): number {
        const cart = this.cart;
        let total = 0;
        Object.keys(cart).forEach(item => {
            const quantity = cart[item];
            const price = this.itemPrices[item];
            total += quantity * price;
        })
        if(total > CheckOut.MIN_AMOUNT_DISCOUNT) return this.applyDiscount(cart, total);
        return total;
    }
}