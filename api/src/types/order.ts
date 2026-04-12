
interface Order {
    price: number,
    quantity: number,
    orderId: string,
}

interface Bid extends Order { //buy order
    side: 'bid'
}

interface Ask extends Order { //sell order
    side: 'ask'
}

interface OrderBook {
    bids: Bid[],
    asks: Ask[]
}

export const orderbook: OrderBook = { // list of all pending BUY & SELL orders
    bids: [],
    asks: [],
}

//it is used to show "Total qty per price" & "Showing market depth"
export const bookWithQuantity: { bids: {[price: number]: number}; asks: {[price: number]: number}} = {
    bids: {},
    asks: {}
}