




export const orders = JSON.parse(localStorage.getItem('orders')) || [];

function saveToLocale() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

export function addOrder(order) {
    orders.unshift(order);
    saveToLocale();
}
