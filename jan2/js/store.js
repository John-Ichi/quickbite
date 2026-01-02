const storeInfoDiv = document.getElementById("storeInfoDiv");

const storeMenuTable = document.getElementById("storeMenuTable");

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

const addToCartModal = document.getElementById("addToCartModal");
const addToCartForm = addToCartModal.querySelector("form");

const addToCartModalCloseBtn = addToCartModal.querySelector(".close");
addToCartModalCloseBtn.addEventListener("click", () => {
    closeAddToCartModal();
});

addToCartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addToCart();
});

const foodIdInp = document.getElementById("foodIdInp");
const foodNameInp = document.getElementById("foodNameInp");
const foodQuanInp = document.getElementById("foodQuanInp");
const foodStockInp = document.getElementById("foodStockInp");
const foodPriceInp = document.getElementById("foodPriceInp");

const cartIdInp = document.getElementById("cartIdInp");

const cancelOrderForm = document.getElementById("cancelOrderForm");
const orderIdInp = document.getElementById("orderIdInp");

fetch("store_info.json")
.then(res => res.json())
.then(data => {
    store_info = data;

    fetch("menu.json")
    .then(res => res.json())
    .then(data => {
        store_menu = data;

        renderStoreInfo(store_info);
        renderStoreMenu(store_menu);
        initializeAddToCartModal();

        viewCartBtn.addEventListener("click", () => {
            viewCart();
        });

        viewOrdersBtn.addEventListener("click", () => {
            viewOrders();
        });
    });
});

function renderStoreInfo(store) {
    storeInfoDiv.innerHTML = "";

    const storeName = store[0].store_name;
    const storeDesc = store[0].store_description;
    const storeProfile = store[0].store_photo;

    if (storeProfile) {
        const cardProfile = document.createElement("img");
        cardProfile.src = storeProfile;
        storeInfoDiv.appendChild(cardProfile);
    }

    if (storeName) {
        const cardHeader = document.createElement("h2");
        cardHeader.textContent = storeName;
        storeInfoDiv.appendChild(cardHeader);
    }

    if (storeDesc) {
        const cardContent = document.createElement("p");
        cardContent.textContent = storeDesc;
        storeInfoDiv.appendChild(cardContent);
    }
}

function renderStoreMenu(menu) {
    const tableHeader = document.createElement("tr");
    
    const thName = document.createElement("th");
    thName.textContent = "Name";

    const thDesc = document.createElement("th");
    thDesc.textContent = "Description";

    const thPrice = document.createElement("th");
    thPrice.textContent = "Price";
    
    const thStock = document.createElement("th");
    thStock.textContent = "Stock";

    const thPhoto = document.createElement("th");
    thPhoto.textContent = "Photo";

    const thActions = document.createElement("th");
    thActions.textContent = "Actions";

    tableHeader.appendChild(thName);
    tableHeader.appendChild(thDesc);
    tableHeader.appendChild(thPrice);
    tableHeader.appendChild(thStock);
    tableHeader.appendChild(thPhoto);
    tableHeader.appendChild(thActions);

    storeMenuTable.appendChild(tableHeader);

    menu.forEach(menu_item => {
        const itemId = menu_item.id;
        const itemName = menu_item.name;
        const itemDesc = menu_item.description;
        const itemPrice = menu_item.price;
        const itemStock = menu_item.stock;
        const itemPhoto = menu_item.photo;

        const itemRow = document.createElement("tr");
        itemRow.id = itemId;

        const tdName = document.createElement("td");
        tdName.classList.add("menu_name");
        tdName.textContent = itemName;

        const tdDesc = document.createElement("td");
        tdDesc.classList.add("menu_desc");
        if (itemDesc) tdDesc.textContent = itemDesc;
        else tdDesc.textContent = "No description provided.";

        const tdPrice = document.createElement("td");
        tdPrice.classList.add("menu_price");
        tdPrice.textContent = itemPrice;

        const tdStock = document.createElement("td");
        tdStock.classList.add("menu_stock");
        tdStock.textContent = itemStock;

        const tdPhoto = document.createElement("td");
        tdPhoto.classList.add("menu_photo");
        if (itemPhoto) tdPhoto.innerHTML = `<img src="${itemPhoto}" alt="A picture of ${itemName}"></img>`;
        else tdPhoto.textContent = "No photo provided.";

        const tdAction = document.createElement("td");
        tdAction.classList.add("menu_action");
        if (itemStock !== 0) tdAction.innerHTML = `<button class="addToCart">Add To Cart</button>`;
        else tdAction.innerHTML = `<button disabled>Out Of Stock</button>`;

        tdAction.addEventListener("click", async (e) => {
            const cartQty = await getCartItemStock(itemId);
            const remainingStock = itemStock - cartQty;
            foodStockInp.value = remainingStock;
            setFoodQuanInpMaxValue(itemStock);
        });

        itemRow.appendChild(tdName);
        itemRow.appendChild(tdDesc);
        itemRow.appendChild(tdPrice);
        itemRow.appendChild(tdStock);
        itemRow.appendChild(tdPhoto);
        itemRow.appendChild(tdAction);

        storeMenuTable.appendChild(itemRow);
    });
}

// Cart functions

function initializeAddToCartModal() {
    const addToCartBtns = document.querySelectorAll(".addToCart");
    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            addToCartModal.style.display = "block";

            const parentRow = btn.closest("tr");

            const price = parentRow.querySelector(".menu_price").textContent;

            foodIdInp.value = parentRow.id;
            foodNameInp.value = parentRow.querySelector(".menu_name").textContent;
            foodPriceInp.value = price
            foodPriceInp.dataset.baseprice = price;
            foodQuanInp.value = 1;

            foodQuanInp.addEventListener("input", () => {
                const quan = Number(foodQuanInp.value);
                const price = Number(foodPriceInp.dataset.baseprice);
                
                const newPrice = (price*quan).toFixed(2);
                foodPriceInp.value = newPrice;
            });
        });
    });
}

function setFoodQuanInpMaxValue(maxValue) {
    foodQuanInp.max = maxValue;
}

function closeAddToCartModal() {
    addToCartModal.style.display = "none";
    addToCartForm.reset();
}

function addToCart() {
    const formData = new FormData(addToCartForm);

    var xhttpAddToCart = new XMLHttpRequest();
    xhttpAddToCart.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            closeAddToCartModal();
        }
    };
    xhttpAddToCart.open("POST","functions.php",true);
    xhttpAddToCart.send(formData);
}

function viewCart() {
    fetch("cart.json")
    .then(res => res.json())
    .then(data => {
        if (!data) {
            cartDiv.innerHTML = "No items in cart yet.";
            cartModal.style.display = "block";
            return;
        }

        cart = data;

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
                const itemDetails = document.createElement("p");
                itemDetails.innerHTML =
                    `${item.name}<br>
                    Quantity: ${item.quantity}<br>
                    Price: ${Number(item.quantity * item.price).toFixed(2)}<br>`;
                itemsContainer.appendChild(itemDetails);

                const maxStock = item.stock;
                if (maxStock === 0) {
                    cartStore.textContent += " (Out of Stock)";
                    missingStock = true;
                }

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

                    if (confirm("Are you sure you want to remove this item from your cart?")) {
                        removeCartItem(document.getElementById("deleteForm"));
                    }
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
    });
}

async function getCartItemStock(foodId) {
    const res = await fetch("cart.json", { cache: "no-store" });
    const cart = await res.json();

    if (!cart) return 0;

    let quantity = 0;

    cart.forEach(store => {
        store.items.forEach(item => {
            if (item.food_id === Number(foodId)) {
                quantity += Number(item.quantity);
            }
        });
    });

    return quantity;
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

// Orders functions

function renderOrders(orders) {
    if (!orders) {
        ordersDiv.innerHTML = "No orders yet.";
        ordersModal.style.display = "block";
        return;
    }

    ordersDiv.innerHTML = "";
    ordersModal.style.display = "block";

    orders.forEach(order => {
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

        if (order.status === 'cancelled' || order.status === 'completed') {
            console.log("Cancelled order: " + order.checkout_id); // To be removed or changed
        } else {
            orderEntry.appendChild(cancelOrderBtn);
        }

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