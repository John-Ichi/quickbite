const storesDiv = document.getElementById("storesDiv");

const viewCartBtn = document.getElementById("viewCart");
const cartModal = document.getElementById("cartModal");
const cartDiv = document.getElementById("cartDiv");

const cartModalCloseBtn = cartModal.querySelector(".close");
cartModalCloseBtn.addEventListener("click", () => {
    closeCart();
});

const viewOrdersBtn = document.getElementById("viewOrders");
const ordersModal = document.getElementById("ordersModal");
const ordersDiv = document.getElementById("ordersDiv");

const ordersModalCloseBtn = ordersModal.querySelector(".close");
ordersModalCloseBtn.addEventListener("click", () => {
    closeOrders();
});

const cancelOrderForm = document.getElementById("cancelOrderForm");
const orderIdInp = document.getElementById("orderIdInp");

fetch("stores.json")
.then(res => res.json())
.then(data => {
    renderStores(data);

    viewCartBtn.addEventListener("click", () => {
        viewCart();
    });

    viewOrdersBtn.addEventListener("click", () => {
        viewOrders();
    })
});

function renderStores(stores) {
    stores.forEach(store => {
        const storeDiv = document.createElement("div");
        storeDiv.classList.add("store");

        const cardProfile = document.createElement("img");
        if (store.store_photo) cardProfile.src = store.store_photo;
        cardProfile.alt = "Profile Picture";

        const cardHeader = document.createElement("h4");
        cardHeader.textContent = store.store_name;

        const cardContent = document.createElement("p");
        cardContent.textContent = store.store_description;

        storeDiv.appendChild(cardProfile);
        storeDiv.appendChild(cardHeader);
        storeDiv.appendChild(cardContent);

        storesDiv.appendChild(storeDiv);

        storeDiv.addEventListener("click", () => {
            window.location.href = `store.php?store_id=${store.store_id}`;
        });
    });
}

function renderCart(cart) {
    if (!cart) {
        cartDiv.innerHTML = "No items in cart yet.";
        cartModal.style.display = "block";
        return;
    }

    cartDiv.innerHTML = "";
    cartModal.style.display = "block";

    cart.forEach(store => {
        const customerId = store.customer_id;

        const cartItem = document.createElement("div");

        const cartStore = document.createElement("h4");
        cartStore.textContent = store.store_name;

        const itemsContainer = document.createElement("div");

        let storeCheckOutPrice = 0;

        let missingStock = false;

        store.items.forEach(item => {
            const maxStock = item.stock;
            if (maxStock === 0) {
                missingStock = true;
                cartStore.textContent += ` (Missing Stock)`;
            }

            const itemDetails = document.createElement("p");
            let outOfStockIndicator = (maxStock === 0) ? "(Out of Stock)" : "";
            itemDetails.innerHTML =
                `${item.name} ${outOfStockIndicator}<br>
                Quantity: ${item.quantity}<br>
                Price: ${Number(item.quantity * item.price).toFixed(2)}<br>`;
            itemsContainer.appendChild(itemDetails);

            let quantityAcc = 0;
            quantityAcc += item.quantity;

            const updateQuantityForm = document.createElement("form"); // Update quantity form
            updateQuantityForm.action = "functions.php";
            updateQuantityForm.method = "POST";

            const customerIdInp = document.createElement("input");
            customerIdInp.type = "hidden";
            customerIdInp.name = "customer_id";
            customerIdInp.value = customerId;
            updateQuantityForm.appendChild(customerIdInp);

            const cartIdInpQuanUpd = document.createElement("input");
            cartIdInpQuanUpd.type = "hidden";
            cartIdInpQuanUpd.name = "order_id";
            cartIdInpQuanUpd.value = item.cart_id;
            updateQuantityForm.appendChild(cartIdInpQuanUpd);

            const newQuanInp = document.createElement("input");
            newQuanInp.type = "hidden";
            newQuanInp.name = "quantity";
            updateQuantityForm.appendChild(newQuanInp);

            const reqInp = document.createElement("input");
            reqInp.type = "hidden";
            reqInp.name = "update_cart_item_quantity";
            updateQuantityForm.appendChild(reqInp); // End of update quantity form

            cartItem.appendChild(updateQuantityForm);

            const reduceQuanBtn = document.createElement("button");
            reduceQuanBtn.textContent = "-";
            itemDetails.appendChild(reduceQuanBtn);

            reduceQuanBtn.addEventListener("click", () => {
                if (quantityAcc > 1) {
                    quantityAcc -= 1;
                    newQuanInp.value = quantityAcc;
                    updateCartItemQuantity(updateQuantityForm);
                }
            });

            const addQuanBtn = document.createElement("button");
            addQuanBtn.textContent = "+";
            itemDetails.appendChild(addQuanBtn);

            addQuanBtn.addEventListener("click", () => {
                if (quantityAcc < maxStock) {
                    quantityAcc += 1;
                    newQuanInp.value = quantityAcc;
                    updateCartItemQuantity(updateQuantityForm);
                }
            });

            const deleteItemBtn = document.createElement("button");
            deleteItemBtn.textContent = "Delete";
            itemDetails.appendChild(deleteItemBtn);

            deleteItemBtn.addEventListener("click", () => {
                document.getElementById("cartIdInp").value = item.cart_id;
                removeCartItem(document.getElementById("deleteForm"));
            });

            storeCheckOutPrice += Number(item.price * item.quantity);
        });

        const checkOutBtn = document.createElement("button");
        checkOutBtn.textContent = "Total: " + storeCheckOutPrice.toFixed(2)
        checkOutBtn.addEventListener("click", () => {
            if (missingStock) {
                alert("Missing stock for certain items.");
            } else {
                document.getElementById("storeIdInp").value = store.store_id;
                proceedToCheckout(document.getElementById("checkOut"));
            }
        });

        cartItem.appendChild(cartStore);
        cartItem.appendChild(itemsContainer);
        cartItem.appendChild(checkOutBtn);

        cartDiv.appendChild(cartItem);
    });
}

function viewCart() {
    fetch("cart.json")
    .then(res => res.json())
    .then(data => {
        const cart = data;
        renderCart(cart);
    });
}

function updateCartItemQuantity(updateForm) {
    const formData = new FormData(updateForm);

    var xhttpUpdate = new XMLHttpRequest();
    xhttpUpdate.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            viewCart();
        }
    };
    xhttpUpdate.open("POST","functions.php",true);
    xhttpUpdate.send(formData);
}

function removeCartItem(deleteForm) {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
        const formData = new FormData(deleteForm);

        var xhttpDelete = new XMLHttpRequest();
        xhttpDelete.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                viewCart();
            }
        };
        xhttpDelete.open("POST","functions.php",true);
        xhttpDelete.send(formData);
    }
}

function closeCart() {
    cartModal.style.display = "none";
    cartDiv.innerHTML = "";
}

function proceedToCheckout(checkoutForm) {
    if (confirm("Proceed to checkout?")) {
        const formData = new FormData(checkoutForm);

        var xhttpCheckOut = new XMLHttpRequest();
        xhttpCheckOut.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.href = "students_checkout.php";
            }
        };
        xhttpCheckOut.open("POST","functions.php",true);
        xhttpCheckOut.send(formData);
    }
}

function renderOrders(orders) {
    if (!orders) {
        ordersDiv.innerHTML = "No orders yet.";
        ordersModal.style.display = "block";
        return;
    }

    ordersDiv.innerHTML = "";
    ordersModal.style.display = "block";

    orders.forEach(order => {
        const dateToday = new Date();
        const dateOrdered = new Date(order.order_created_at);
        const dateExpired = new Date(dateOrdered);
        dateExpired.setHours(dateExpired.getHours() + 12);

        if (dateToday > dateExpired && order.status === "completed") return;
        if (dateToday > dateExpired && order.status === "cancelled") return;

        const orderEntry = document.createElement("div");

        const orderCheckoutId = document.createElement("h4");
        orderCheckoutId.textContent = "Order ID: " + order.checkout_id;

        const orderDetails = document.createElement("p");
        orderDetails.innerHTML =
            `Payment Method: ${order.payment_method}<br>
            Total Price: ${order.total_sale}<br>
            Status: ${order.status}<br>
            Date Ordered: ${order.order_created_at}`;

        const orderItemsDiv = document.createElement("div");
        order.items.forEach(orderItem => {
            const itemDetails = document.createElement("p");
            itemDetails.innerHTML =
                `${orderItem.item_name}<br>
                Quantity: ${orderItem.quantity}<br>
                Price: ${orderItem.subtotal}`;
            orderItemsDiv.appendChild(itemDetails);
        });

        const cancelOrderBtn = document.createElement("button");
        cancelOrderBtn.textContent = "Cancel";
        cancelOrderBtn.addEventListener("click", () => {
            orderIdInp.value = order.checkout_id;
            
            if (confirm("Cancel order?")) {
                cancelOrder(cancelOrderForm);
            }
        });

        orderEntry.appendChild(orderCheckoutId);
        orderEntry.appendChild(orderDetails);
        orderEntry.appendChild(orderItemsDiv);

        if (order.status !== 'cancelled' && order.status !== 'completed') orderEntry.appendChild(cancelOrderBtn);

        ordersDiv.appendChild(orderEntry);
    });
}

function viewOrders() {
    fetch("students_orders.json")
    .then(res => res.json())
    .then(data => {
        orders = data;
        renderOrders(orders);
    });
}

function cancelOrder(cancelOrderForm) {
    const formData = new FormData(cancelOrderForm);

    var xhttpCancel = new XMLHttpRequest();
    xhttpCancel.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            viewOrders();
            cancelOrderForm.reset();
        }
    };
    xhttpCancel.open("POST","functions.php",true);
    xhttpCancel.send(formData);
}

function closeOrders() {
    ordersModal.style.display = "none";
    ordersDiv.innerHTML = "";
}