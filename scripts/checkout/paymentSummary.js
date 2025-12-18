import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";


let renderOrderSummaryHTML = '';
export function renderPaymentSummary() {
    let totalItemsPriceCents = 0;
    let totalShippingPriceCents = 0;
    let totalBeforeTaxPriceCents = 0;
    let totalTaxCents = 0;
    let totalOrderPriceCents = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        totalItemsPriceCents += product.priceCents * cartItem.quantity;
        totalShippingPriceCents += (getDeliveryOption(cartItem.deliveryOptionId).priceCents);


    })
    totalBeforeTaxPriceCents = totalItemsPriceCents + totalShippingPriceCents;

    totalTaxCents = totalBeforeTaxPriceCents * 0.1;

    totalOrderPriceCents = totalTaxCents + totalBeforeTaxPriceCents;

    document.querySelector('.js-payment-summary').innerHTML = `
        <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (3):</div>
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

        <button class="place-order-button button-primary">
          Place your order
        </button>
    `

}
renderPaymentSummary();

