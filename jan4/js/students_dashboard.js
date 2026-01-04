const studentNumber = document.getElementById("studentNumberInp").value;

const storesDiv = document.getElementById("storesDiv");

const viewCartBtn = document.getElementById("viewCart");
const cartModal = document.getElementById("cartModal");
const cartDiv = document.getElementById("cartDiv");

const cartModalCloseBtn = cartModal.querySelector(".close");
cartModalCloseBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
    cartDiv.innerHTML = "";
});

const viewOrdersBtn = document.getElementById("viewOrders");
const ordersModal = document.getElementById("ordersModal");
const ordersDiv = document.getElementById("ordersDiv");

const ordersModalCloseBtn = ordersModal.querySelector(".close");
ordersModalCloseBtn.addEventListener("click", () => {
    ordersModal.style.display = "none";
    ordersDiv.innerHTML = "";
});

const cancelOrderForm = document.getElementById("cancelOrderForm");
const orderIdInp = document.getElementById("orderIdInp");

renderStores();

viewCartBtn.addEventListener("click", () => {
    refreshCart();
});

viewOrdersBtn.addEventListener("click", () => {
    viewOrders();
});

function renderStores() {
    fetch("stores.json")
    .then(res => res.json())
    .then(stores => {
        if (!stores) { // If stores is null
            storesDiv.innerHTML = `<i>No stores yet.</i>`;
            return;
        }

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
    });
}

// Cart functions
function viewCart() {
    fetch("cart.json")
    .then(res => res.json())
    .then(carts => {
        if (!carts) {
            cartDiv.innerHTML = "No items in cart yet.";
            cartModal.style.display = "block";
            return;
        }

        const studentCart = carts.filter(cart => cart.customer_id.toString() === studentNumber);

        if (studentCart.length === 0) {
            cartDiv.innerHTML = "No items in cart yet.";
            cartModal.style.display = "block";
            return;
        }

        cartDiv.innerHTML = "";
        cartModal.style.display = "block";

        studentCart.forEach(store => {
            const customerId = store.customer_id;

            const cartItem = document.createElement("div");

            const cartStore = document.createElement("h4");
            cartStore.textContent = store.store_name;

            const itemsContainer = document.createElement("div");

            let storeCheckOutPrice = 0;
            let missingStock = false;

            store.items.forEach(item => {
                const itemQuan = item.quantity;
                const maxStock = item.stock;
                const outOfStockIndicator = maxStock === 0 ? "(Out of Stock)" : "";

                const itemDetails = document.createElement("p");
                itemDetails.innerHTML =
                    `${item.name} ${outOfStockIndicator}<br>
                    Quantity: ${item.quantity}<br>
                    Price: ${Number(item.quantity * item.price).toFixed(2)}<br>`;
                itemsContainer.appendChild(itemDetails);

                if (maxStock === 0) {
                    cartStore.textContent += ` (Missing Stock)`;
                    missingStock = true;
                }

                let quantityAcc = itemQuan;

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

                if (maxStock < itemQuan) {   
                    newQuanInp.value = maxStock;
                    updateCart(updateQuantityForm);
                }

                const reduceQuanBtn = document.createElement("button");
                reduceQuanBtn.textContent = "-";
                itemDetails.appendChild(reduceQuanBtn);

                reduceQuanBtn.addEventListener("click", () => {
                    refreshCart();

                    if (quantityAcc > 1) {
                        quantityAcc -= 1;
                        newQuanInp.value = quantityAcc;
                        updateCart(updateQuantityForm);
                    }
                });

                const addQuanBtn = document.createElement("button");
                addQuanBtn.textContent = "+";
                itemDetails.appendChild(addQuanBtn);

                addQuanBtn.addEventListener("click", () => {
                    refreshCart();

                    if (quantityAcc < maxStock) {
                        quantityAcc += 1;
                        newQuanInp.value = quantityAcc;
                        updateCart(updateQuantityForm);
                    }
                });

                const deleteItemBtn = document.createElement("button");
                deleteItemBtn.textContent = "Delete";
                itemDetails.appendChild(deleteItemBtn);

                deleteItemBtn.addEventListener("click", () => {
                    document.getElementById("cartIdInp").value = item.cart_id;

                    if (confirm("Are you sure you want to remove this item from you cart?")) {
                        updateCart(document.getElementById("deleteForm"));
                    }
                });

                storeCheckOutPrice += Number(item.price * item.quantity);
            });

            const checkOutBtn = document.createElement("button");
            checkOutBtn.type = "button";
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
    });
}

function updateCart(form) {
    const formData = new FormData(form);

    var xhttpUpdate = new XMLHttpRequest();
    xhttpUpdate.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            viewCart();
        }
    };
    xhttpUpdate.open("POST","functions.php",true);
    xhttpUpdate.send(formData);
}

async function proceedToCheckout(checkoutForm) {
    // Get latest stock
    const stockRes = await fetch("menu.json", { cache: "no-store" });
    const latestMenu = await stockRes.json();

    // Get cart
    const cartRes = await fetch("cart.json", { cache: "no-store"} );
    const carts = await cartRes.json();
    const studentCart = carts.find(cart => cart.customer_id.toString() === studentNumber);

    if (!studentCart) return;

    let stockErr = false;
    let errMessages = [];

    studentCart.items.forEach(item => {
        const menuItem = latestMenu.find(m => m.id === item.food_id);

        if (!menuItem || menuItem.stock === 0) {
            stockErr = true;
            errMessages.push(`Only ${menuItem.stock} left of ${item.name} (You have ${item.quantity}).`);
        } else if (item.quantity > menuItem.stock) {
            stockErr = true;
            errMessages.push(`Only ${menuItem.stock} left of ${item.name} (You have ${item.quantity}).`);
        }
    });

    if (stockErr) {
        alert("Stock levels have changed:\n\n" + errMessages.join("\n"));
        refreshCart();
        return;
    }

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

// Order functions
function viewOrders() {
    fetch("students_orders.json")
    .then(res => res.json())
    .then(orders => {
        if (!orders) {
            ordersDiv.innerHTML = "No orders yet.";
            ordersModal.style.display = "block";
            return;
        }

        const studentOrders = orders.filter(order => order.customer_id.toString() === studentNumber);

        if (studentOrders.length === 0) {
            ordersDiv.innerHTML = "No orders yet.";
            ordersModal.style.display = "block";
            return;
        }

        ordersDiv.innerHTML = "";
        ordersModal.style.display = "block";

        const today = new Date();
        const twelveHoursAgo = new Date(today.getTime() - (12 * 60 * 60 * 1000));

        studentOrders.forEach(order => {
            const dateOrdered = new Date(order.order_created_at);
            
            // Omit if order is completed or cancelled 12 hours before now
            if ((twelveHoursAgo > dateOrdered) && (order.status === "completed" || order.status === "cancelled")) return; 

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

// Refresh function
function refreshCart() {
    var xhttpRefresh = new XMLHttpRequest();
    xhttpRefresh.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            viewCart();
        }
    };
    xhttpRefresh.open("GET","store.php",true);
    xhttpRefresh.send();
}