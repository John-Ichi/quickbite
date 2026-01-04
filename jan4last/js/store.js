const studentNumber = document.getElementById("studentNumberInp").value;
const storePageId = document.getElementById("storeId").value;

// Main HTML elements
const storeInfoDiv = document.getElementById("storeInfoDiv");
const storeMenuTable = document.getElementById("storeMenuTable");

// View cart section
const viewCartBtn = document.getElementById("viewCart");
const cartModal = document.getElementById("cartModal");
const cartDiv = document.getElementById("cartDiv");

const cartModalCloseBtn = cartModal.querySelector(".close");
cartModalCloseBtn.addEventListener("click", () => {
    cartModal.style.display = "none"; // Close cart modal
    cartDiv.innerHTML = "";
});

// View orders section
const viewOrdersBtn = document.getElementById("viewOrders");
const ordersModal = document.getElementById("ordersModal");
const ordersDiv = document.getElementById("ordersDiv");

const ordersModalCloseBtn = ordersModal.querySelector(".close");
ordersModalCloseBtn.addEventListener("click", () => {
    ordersModal.style.display = "none"; // Close orders modal
    ordersDiv.innerHTML = "";
});

// Add to cart section
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

// Inputs
const foodIdInp = document.getElementById("foodIdInp");
const foodNameInp = document.getElementById("foodNameInp");
const foodQuanInp = document.getElementById("foodQuanInp");
const foodStockInp = document.getElementById("foodStockInp");
const foodPriceInp = document.getElementById("foodPriceInp");
const cartIdInp = document.getElementById("cartIdInp");
const orderIdInp = document.getElementById("orderIdInp");

// Forms
const cancelOrderForm = document.getElementById("cancelOrderForm");

// Initialization
renderStoreInfo();
renderStoreMenu();

viewCartBtn.addEventListener("click", () => {
    refreshCart();
});

viewOrdersBtn.addEventListener("click", () => {
    viewOrders();
});


// Render store
function renderStoreInfo() {
    fetch("store_info.json")
    .then(res => res.json())
    .then(stores => {
        const storeInfo = stores.filter(store => store.store_id.toString() === storePageId);

        storeInfoDiv.innerHTML = "";

        const storeName = storeInfo[0].store_name;        
        const storeProfile = storeInfo[0].store_photo;
        const storeDesc = storeInfo[0].store_description;

        if (storeName) {
            const cardHeader = document.createElement("h1");
            cardHeader.textContent = storeName;
            storeInfoDiv.appendChild(cardHeader);
        }

        if (storeProfile) {
            const cardProfile = document.createElement("img");
            cardProfile.src = storeProfile;
            storeInfoDiv.appendChild(cardProfile);
        }

        if (storeDesc) {
            const cardContent = document.createElement("p");
            cardContent.textContent = storeDesc;
            storeInfoDiv.appendChild(cardContent);
        }
    });
}

function renderStoreMenu() {
    fetch("menu.json")
    .then(res => res.json())
    .then(menu_items => {
        if (!menu_items) {
            console.log("Test");
        }

        const storeMenu = menu_items.filter(menu => menu.store_id.toString() === storePageId);

        if (storeMenu.length === 0) {
            console.log("Test");
        }

        storeMenuTable.innerHTML = "";

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

        storeMenu.forEach(menu_item => {
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
                foodQuanInp.max = remainingStock;

                if (remainingStock === 0) {
                    foodQuanInp.min = 0;
                    foodQuanInp.value = 0;
                }
            });

            itemRow.appendChild(tdName);
            itemRow.appendChild(tdDesc);
            itemRow.appendChild(tdPrice);
            itemRow.appendChild(tdStock);
            itemRow.appendChild(tdPhoto);
            itemRow.appendChild(tdAction);

            storeMenuTable.appendChild(itemRow);
        });
        initializeAddToCartModal();
    });
}

// Cart functions
function initializeAddToCartModal() {
    const addToCartBtns = document.querySelectorAll(".addToCart");
    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            refreshMenu(); // Needs minor fix
            
            const parentRow = btn.closest("tr");

            const id = parentRow.id;
            const name = parentRow.querySelector(".menu_name").textContent;
            const price = parentRow.querySelector(".menu_price").textContent;
            const stock = parentRow.querySelector(".menu_stock").textContent;

            foodIdInp.value = id;
            foodNameInp.value = name;
            foodPriceInp.value = price;
            foodPriceInp.dataset.baseprice = price;
            foodQuanInp.value = 1;
            foodQuanInp.max = stock;

            addToCartModal.style.display = "block";
        });
    });
}

foodQuanInp.addEventListener("input", () => {
    const quan = Number(foodQuanInp.value);
    const price = Number(foodPriceInp.dataset.baseprice);
    foodPriceInp.value = (price*quan).toFixed(2);
});

function closeAddToCartModal() {
    addToCartModal.style.display = "none";
    addToCartForm.reset();
}

async function addToCart() {
    const itemId = Number(foodIdInp.value);
    const requestedQty = Number(foodQuanInp.value);

    const stockRes = await fetch("menu.json", { cache: "no-store" });
    const latestMenu = await stockRes.json();
    const menuItem = latestMenu.find(m => m.id === itemId);

    const currentInCart = await getCartItemStock(itemId);

    if (!menuItem) {
        alert("This item is no longer available.");
        closeAddToCartModal();
        refreshMenu();
        return;
    }

    if ((currentInCart + requestedQty) > menuItem.stock) {
        const remainingPossible = menuItem.stock - currentInCart;

        if (remainingPossible <= 0) {
            alert(`You already have ${currentInCart} in your cart, which is the maximum available stock.`);
            closeAddToCartModal();
            refreshMenu();
        } else {
            alert(`Only ${menuItem.stock} total items available. You have ${currentInCart} in your cart, so you can only add ${remainingPossible} more,`);
            foodQuanInp.value = remainingPossible;
            foodQuanInp.max = remainingPossible;
        }
        return;
    }

    const formData = new FormData(addToCartForm);

    var xhttpAddToCart = new XMLHttpRequest();
    xhttpAddToCart.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            closeAddToCartModal();
            refreshMenu();
        }
    };
    xhttpAddToCart.open("POST","functions.php",true);
    xhttpAddToCart.send(formData);
}

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
                    Quantity: ${itemQuan}<br>
                    Price: ${Number(itemQuan * item.price).toFixed(2)}<br>`;
                itemsContainer.appendChild(itemDetails);

                if (maxStock === 0) {
                    cartStore.textContent += " (Missing Stock)";
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

                    if (confirm("Are you sure you want to remove this item from your cart?")) {
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

async function getCartItemStock(foodId) {
    const res = await fetch("cart.json", { cache: "no-store" });
    const cart = await res.json();

    if (!cart) return 0;

    let quantity = 0;

    const studentCart = cart.filter(entry => entry.customer_id.toString() === studentNumber);

    studentCart.forEach(store => {
        store.items.forEach(item => {
            if (item.food_id === Number(foodId)) {
                quantity += Number(item.quantity);
            }
        });
    });

    return quantity;
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

// Orders functions
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

// Refresh functions

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

function refreshMenu() {
    var xhttpRefresh = new XMLHttpRequest();
    xhttpRefresh.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            renderStoreMenu();
        }
    };
    xhttpRefresh.open("GET","store.php",true);
    xhttpRefresh.send();
}