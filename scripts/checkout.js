import { cart, deleteFromCart, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

let cartItemHTML = '';

// Düzeltme 1: Fonksiyon parametrelerini doğru alıyor
function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${deliveryOption.priceCents / 100} -`;

        // cartItem burada artık undefined değil
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `
            <div class="delivery-option js-delivery-option"
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}">
                <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                    >
                <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} - Shipping</div>
                </div>
            </div>
        `
    });

    return html;
}





cart.forEach((cartItem) => {
    const matchingProduct = products.find(product => product.id === cartItem.productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }

    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');



    cartItemHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">

            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${(matchingProduct.priceCents / 100).toFixed(2)}
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                        Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                        Delete
                    </span>
                </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
        </div>
    </div>
    `;
});

document.querySelector('.js-order-summary').innerHTML = cartItemHTML;

document.querySelectorAll('.js-delete-link')
    .forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            const productId = deleteButton.dataset.productId;
            deleteFromCart(productId);

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
        });
    });

document.querySelectorAll('.js-delivery-option')
    .forEach((optionElement) => {
        optionElement.addEventListener('click', () => {
            const { productId, deliveryOptionId } = optionElement.dataset;

            updateDeliveryOption(productId, deliveryOptionId);

            location.reload();
        })
    })