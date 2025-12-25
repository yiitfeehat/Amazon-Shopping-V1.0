import { cart, resetCart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { addOrder } from "../../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


export function renderPaymentSummary() {

  let totalItemsPriceCents = 0;
  let totalShippingPriceCents = 0;
  let totalBeforeTaxPriceCents = 0;
  let totalTaxCents = 0;
  let totalOrderPriceCents = 0;
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    totalItemsPriceCents += product.priceCents * cartItem.quantity;
    totalShippingPriceCents += (getDeliveryOption(cartItem.deliveryOptionId).priceCents);
    cartQuantity += cartItem.quantity;

  })
  totalBeforeTaxPriceCents = totalItemsPriceCents + totalShippingPriceCents;

  totalTaxCents = totalBeforeTaxPriceCents * 0.1;

  totalOrderPriceCents = totalTaxCents + totalBeforeTaxPriceCents;
  document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
  document.querySelector('.js-payment-summary').innerHTML = `
        <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${cartQuantity}):</div>
          <div class="payment-summary-money JSpayment-summary-money">$${(totalItemsPriceCents / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$${(totalShippingPriceCents / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${(totalBeforeTaxPriceCents / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${(totalTaxCents / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${(totalOrderPriceCents / 100).toFixed(2)}</div>
        </div>

        <button class="place-order-button js-place-order-button button-primary">
          Place your order
        </button>
    `



  document.querySelector('.js-place-order-button').addEventListener('click', async () => {
    const today = dayjs();

    const order = {
      id: crypto.randomUUID(),
      orderTime: today.format('MMMM D'),
      totalCostCents: totalOrderPriceCents,
      products: cart.map(cartItem => {
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

        return {
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          estimatedDeliveryTime: deliveryDate.format('MMMM D')
        }
      })
    };

    addOrder(order);
    window.location.href = 'orders.html'
    resetCart();


  })
}

