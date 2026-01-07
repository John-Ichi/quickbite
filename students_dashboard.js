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

cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
});

const viewOrdersBtn = document.getElementById("viewOrders");
const ordersModal = document.getElementById("ordersModal");
const ordersDiv = document.getElementById("ordersDiv");

const ordersModalCloseBtn = ordersModal.querySelector(".close");
ordersModalCloseBtn.addEventListener("click", () => {
    ordersModal.style.display = "none";
    ordersDiv.innerHTML = "";
});

ordersModal.addEventListener("click", (e) => {
    if (e.target === ordersModal) ordersModal.style.display = "none";
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
            const card = document.createElement("div");
            card.classList.add("store-card");

            const photo = document.createElement("img");
            photo.className = "store-photo";
            if (store.store_photo && store.store_photo.trim() !== "") {
                photo.src = store.store_photo;
            } else {
                photo.src = "css/placeholder-store.png"; // fallback if you want a local placeholder
            }
            photo.alt = store.store_name + " photo";

            const info = document.createElement("div");
            
            const nameEl = document.createElement("div");
            nameEl.className = "store-name";
            nameEl.textContent = store.store_name;

            const descEl = document.createElement("p");
            descEl.className = "store-desc";
            descEl.textContent = store.store_description || "";

            info.appendChild(nameEl);
            info.appendChild(descEl);

            card.appendChild(photo);
            card.appendChild(info);

            storesDiv.appendChild(card);

            card.addEventListener("click", () => {
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
            cartModal.style.display = "flex";
            return;
        }

        const studentCart = carts.filter(cart => cart.customer_id.toString() === studentNumber);

        if (studentCart.length === 0) {
            cartDiv.innerHTML = "No items in cart yet.";
            cartModal.style.display = "flex";
            return;
        }

        cartDiv.innerHTML = "";
        cartModal.style.display = "flex";

        studentCart.forEach(store => {
            const customerId = store.customer_id;

            const cartStore = document.createElement("div");
            cartStore.classList.add("cart-item");

            const cartStoreHeader = document.createElement("h4");
            cartStoreHeader.textContent = store.store_name;
            cartStore.appendChild(cartStoreHeader);

            let storeCheckOutPrice = 0;
            let missingStock = false;

            store.items.forEach(item => {
                const itemQuan = item.quantity;
                const maxStock = item.stock;
                const outOfStockIndicator = maxStock === 0 ? "(Out of Stock)" : "";

                const itemBlock = document.createElement("div");
                itemBlock.style.paddingBottom = "10px";
                itemBlock.style.borderBottom = "1px solid #e8e8e8";
                itemBlock.style.marginBottom = "10px";

                const itemName = document.createElement("p");
                itemName.textContent = `${item.name} ${outOfStockIndicator}`;
                itemName.style.margin = "0 0 4px";
                itemName.style.fontWeight = "500";
                itemBlock.appendChild(itemName);

                const itemMeta = document.createElement("p");
                itemMeta.textContent = `Qty: ${item.quantity} × ₱${Number(item.price).toFixed(2)} = ₱${Number(item.quantity * item.price).toFixed(2)}`;
                itemMeta.style.margin = "0 0 8px";
                itemMeta.style.fontSize = "0.9rem";
                itemMeta.style.color = "#767676";
                itemBlock.appendChild(itemMeta);

                if (maxStock === 0) {
                    cartStoreHeader.textContent += ` (Missing Stock)`;
                    missingStock = true;
                }

                let quantityAcc = itemQuan;

                const updateQuantityForm = document.createElement("form");
                updateQuantityForm.action = "functions.php";
                updateQuantityForm.method = "POST";
                updateQuantityForm.style.display = "none";

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
                updateQuantityForm.appendChild(reqInp);

                cartStore.appendChild(updateQuantityForm);

                if (maxStock < itemQuan) {
                    newQuanInp.value = maxStock;
                    updateCart(updateQuantityForm);
                }

                const actions = document.createElement("div");
                actions.style.display = "flex";
                actions.style.gap = "6px";
                actions.style.alignItems = "center";

                const reduceQuanBtn = document.createElement("button");
                reduceQuanBtn.textContent = "−";
                reduceQuanBtn.className = "btn-qty";
                reduceQuanBtn.type = "button";
                actions.appendChild(reduceQuanBtn);

                reduceQuanBtn.addEventListener("click", () => {
                    if (quantityAcc > 1) {
                        quantityAcc -= 1;
                        newQuanInp.value = quantityAcc;
                        updateCart(updateQuantityForm);
                    }
                });

                const qtyDisplay = document.createElement("span");
                qtyDisplay.textContent = quantityAcc;
                qtyDisplay.style.minWidth = "20px";
                qtyDisplay.style.textAlign = "center";
                actions.appendChild(qtyDisplay);

                const addQuanBtn = document.createElement("button");
                addQuanBtn.textContent = "+";
                addQuanBtn.className = "btn-qty";
                addQuanBtn.type = "button";
                actions.appendChild(addQuanBtn);

                addQuanBtn.addEventListener("click", () => {
                    if (quantityAcc < maxStock) {
                        quantityAcc += 1;
                        newQuanInp.value = quantityAcc;
                        updateCart(updateQuantityForm);
                    }
                });

                const deleteItemBtn = document.createElement("button");
                deleteItemBtn.textContent = "Remove";
                deleteItemBtn.className = "btn-delete";
                deleteItemBtn.type = "button";
                deleteItemBtn.style.marginLeft = "auto";
                actions.appendChild(deleteItemBtn);

                deleteItemBtn.addEventListener("click", () => {
                    document.getElementById("cartIdInp").value = item.cart_id;

                    if (confirm("Remove this item from your cart?")) {
                        updateCart(document.getElementById("deleteForm"));
                    }
                });

                itemBlock.appendChild(actions);
                cartStore.appendChild(itemBlock);

                storeCheckOutPrice += Number(item.price * item.quantity);
            });

            const checkOutBtn = document.createElement("button");
            checkOutBtn.type = "button";
            checkOutBtn.className = "btn-checkout";
            checkOutBtn.textContent = "Checkout: ₱" + storeCheckOutPrice.toFixed(2);
            checkOutBtn.style.width = "100%";
            checkOutBtn.style.padding = "12px";
            checkOutBtn.style.marginTop = "12px";
            
            checkOutBtn.addEventListener("click", () => {
                if (missingStock) {
                    alert("Missing stock for certain items.");
                } else {
                    document.getElementById("storeIdInp").value = store.store_id;
                    proceedToCheckout(document.getElementById("checkOut"));
                }
            });

            cartStore.appendChild(checkOutBtn);

            cartDiv.appendChild(cartStore);
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
            ordersModal.style.display = "flex";
            return;
        }

        const studentOrders = orders.filter(order => order.customer_id.toString() === studentNumber);

        if (studentOrders.length === 0) {
            ordersDiv.innerHTML = "No orders yet.";
            ordersModal.style.display = "flex";
            return;
        }

        ordersDiv.innerHTML = "";
        ordersModal.style.display = "flex";

        const today = new Date();
        const twelveHoursAgo = new Date(today.getTime() - (12 * 60 * 60 * 1000));

        studentOrders.forEach(order => {
            const dateOrdered = new Date(order.order_created_at);
            
            // Omit if order is completed or cancelled 12 hours before now
            if ((twelveHoursAgo > dateOrdered) && (order.status === "completed" || order.status === "cancelled")) return; 

            const orderEntry = document.createElement("div");
            orderEntry.classList.add("order-item");

            const orderHeader = document.createElement("div");
            orderHeader.style.marginBottom = "8px";

            const orderCheckoutId = document.createElement("h4");
            orderCheckoutId.textContent = "Order #" + order.checkout_id;
            orderCheckoutId.style.margin = "0 0 4px";
            orderHeader.appendChild(orderCheckoutId);

            const orderMeta = document.createElement("p");
            const statusBadge = order.status === "completed" ? "✓" : order.status === "pending" ? "⏳" : order.status === "cancelled" ? "✕" : "→";
            orderMeta.textContent = `${statusBadge} ${order.status.charAt(0).toUpperCase() + order.status.slice(1)} • ${order.payment_method} • ${order.order_created_at}`;
            orderMeta.style.margin = "0";
            orderMeta.style.fontSize = "0.9rem";
            orderMeta.style.color = "#767676";
            orderHeader.appendChild(orderMeta);
            orderEntry.appendChild(orderHeader);

            const itemsList = document.createElement("div");
            itemsList.style.paddingBottom = "8px";
            itemsList.style.borderBottom = "1px solid #e8e8e8";
            itemsList.style.marginBottom = "8px";

            order.items.forEach(orderItem => {
                const itemLine = document.createElement("p");
                itemLine.textContent = `${orderItem.item_name} (×${orderItem.quantity}) • ₱${Number(orderItem.subtotal).toFixed(2)}`;
                itemLine.style.margin = "4px 0";
                itemLine.style.fontSize = "0.95rem";
                itemsList.appendChild(itemLine);
            });

            orderEntry.appendChild(itemsList);

            const orderTotal = document.createElement("p");
            orderTotal.textContent = `Total: ₱${Number(order.total_sale).toFixed(2)}`;
            orderTotal.style.margin = "0 0 8px";
            orderTotal.style.fontWeight = "600";
            orderEntry.appendChild(orderTotal);

            if (order.status !== 'cancelled' && order.status !== 'completed') {
                const cancelOrderBtn = document.createElement("button");
                cancelOrderBtn.textContent = "Cancel Order";
                cancelOrderBtn.className = "btn-cancel";
                cancelOrderBtn.type = "button";
                cancelOrderBtn.style.width = "100%";
                cancelOrderBtn.addEventListener("click", () => {
                    orderIdInp.value = order.checkout_id;
                    
                    if (confirm("Cancel this order?")) {
                        cancelOrder(cancelOrderForm);
                    }
                });
                orderEntry.appendChild(cancelOrderBtn);
            }

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