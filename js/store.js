const storeInfoDiv = document.getElementById("storeInfoDiv");
const storeMenuTable = document.getElementById("storeMenuTable");

const addToCartModal = document.getElementById("addToCartModal");
const addToCartForm = addToCartModal.querySelector("form");
addToCartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addToCart();
});

const addToCartModalCloseBtn = addToCartModal.querySelector(".close");
addToCartModalCloseBtn.addEventListener("click", () => {
    closeAddToCartModal();
});

const cartModal = document.getElementById("cartModal");
const cartDiv = document.getElementById("cartDiv");

const viewCartBtn = document.getElementById("viewCart");

const cartModalCloseBtn = cartModal.querySelector(".close");
cartModalCloseBtn.addEventListener("click", () => {
    closeCart();
});

const foodIdInp = document.getElementById("foodIdInp");
const foodNameInp = document.getElementById("foodNameInp");
const foodQuanInp = document.getElementById("foodQuanInp");
const foodPriceInp = document.getElementById("foodPriceInp");

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

                viewCartBtn.addEventListener("click", () => {
                    viewCart();
                });
            });
    });

function renderStoreInfo(store) {
    storeInfoDiv.innerHTML = "";

    store.forEach(data => {
        const storeName = data.store_name;
        const storeDesc = data.store_description;
        const storeProfile = data.store_photo;

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
    });
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
        const itemRow = document.createElement("tr");

        const itemId = menu_item.id;
        const itemName = menu_item.name;
        const itemDesc = menu_item.description;
        const itemPrice = menu_item.price;
        const itemStock = menu_item.stock;
        const itemPhoto = menu_item.photo;

        const tdName = document.createElement("td");
        tdName.textContent = itemName;

        const tdDesc = document.createElement("td");
        if (itemDesc) tdDesc.textContent = itemDesc;
        else tdDesc.textContent = "No description provided.";

        const tdPrice = document.createElement("td");
        tdPrice.textContent = itemPrice;

        const tdStock = document.createElement("td");
        tdStock.textContent = itemStock;

        const tdPhoto = document.createElement("td");
        if (itemPhoto) tdPhoto.innerHTML = `<img src="${itemPhoto}" alt="A picture of ${itemName}"></img>`;
        else tdPhoto.textContent = "No photo provided.";

        const tdAction = document.createElement("td");
        tdAction.innerHTML = `<button class="addToCart">Add To Cart</button>`;

        itemRow.appendChild(tdName);
        itemRow.appendChild(tdDesc);
        itemRow.appendChild(tdPrice);
        itemRow.appendChild(tdStock);
        itemRow.appendChild(tdPhoto);
        itemRow.appendChild(tdAction);

        storeMenuTable.appendChild(itemRow);

        const addToCartBtns = document.querySelectorAll(".addToCart");
        addToCartBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                addToCartModal.style.display = "block";

                // Initialize add to cart form values
                foodIdInp.value = itemId;
                foodNameInp.value = itemName;
                foodPriceInp.value = itemPrice;
                foodPriceInp.dataset.baseprice = itemPrice;
                foodQuanInp.value = 1;
            });
        });
    });

    foodQuanInp.addEventListener("input", () => {
        const quan = Number(foodQuanInp.value);
        const price = Number(foodPriceInp.dataset.baseprice);

        const newPrice = (price * quan).toFixed(2);
        foodPriceInp.value = newPrice;
    });
}

function closeAddToCartModal() {
    addToCartModal.style.display = "none";
    addToCartForm.reset();
}

function addToCart() {
    const formData = new FormData(addToCartForm);

    var xhttpAddToCart = new XMLHttpRequest();
    xhttpAddToCart.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            closeAddToCartModal();
        }
    };
    xhttpAddToCart.open("POST", "functions.php", true);
    xhttpAddToCart.send(formData);
}

function viewCart() {
    fetch("cart.json")
        .then(res => res.json())
        .then(data => {
            cart = data;

            cartDiv.innerHTML = "";
            cartModal.style.display = "block";

            let overallTotalPrice = 0;

            cart.forEach(item => {
                const cartItem = document.createElement("div");

                const cartPhoto = document.createElement("img");
                cartPhoto.src = item.photo;
                cartItem.appendChild(cartPhoto);

                const cartHeader = document.createElement("h4");
                cartHeader.textContent = item.name;
                cartItem.appendChild(cartHeader);

                const cartContent = document.createElement("p");
                cartContent.textContent = item.description;
                cartItem.appendChild(cartContent);

                let quantityAcc = 0;

                const cartQuan = document.createElement("h5");
                cartQuan.textContent = item.quantity;
                quantityAcc += item.quantity;
                cartItem.appendChild(cartQuan);

                const updateQuantityForm = document.createElement("form");
                updateQuantityForm.action = "functions.php";
                updateQuantityForm.method = "POST";

                const customerIdInp = document.createElement("input");
                customerIdInp.type = "hidden";
                customerIdInp.name = "customer_id";
                customerIdInp.value = item.customer_id;
                updateQuantityForm.appendChild(customerIdInp);

                const orderIdInp = document.createElement("input");
                orderIdInp.type = "hidden";
                orderIdInp.name = "order_id";
                orderIdInp.value = item.id;
                updateQuantityForm.appendChild(orderIdInp);

                const newQuanInp = document.createElement("input");
                newQuanInp.type = "hidden";
                newQuanInp.name = "quantity";
                updateQuantityForm.appendChild(newQuanInp);

                const reqInp = document.createElement("input");
                reqInp.type = "hidden";
                reqInp.name = "update_cart_item_quantity";
                updateQuantityForm.appendChild(reqInp);

                cartItem.appendChild(updateQuantityForm);

                const reduceQuanBtn = document.createElement("button");
                reduceQuanBtn.textContent = "-";
                cartItem.appendChild(reduceQuanBtn);

                reduceQuanBtn.addEventListener("click", () => {
                    if (quantityAcc > 1) {
                        quantityAcc -= 1;
                        newQuanInp.value = quantityAcc;
                        cartQuan.textContent = quantityAcc;
                        updateCartItemQuantity(updateQuantityForm);
                    }
                });

                const addQuanBtn = document.createElement("button");
                addQuanBtn.textContent = "+";
                cartItem.appendChild(addQuanBtn);

                addQuanBtn.addEventListener("click", () => {
                    quantityAcc += 1;
                    newQuanInp.value = quantityAcc;
                    cartQuan.textContent = quantityAcc;
                    updateCartItemQuantity(updateQuantityForm);
                });

                updateQuantityForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    updateCartItemQuantity(updateQuantityForm);
                });

                // Delete from cart function

                const cartPrice = document.createElement("h5");
                const itemPrice = Number(item.price);
                const itemQuan = Number(item.quantity);
                const totalPrice = itemPrice * itemQuan;
                cartPrice.textContent = totalPrice.toFixed(2);
                overallTotalPrice += totalPrice;
                cartItem.appendChild(cartPrice);

                const checkOutBtn = document.createElement("button"); // Add function
                checkOutBtn.textContent = overallTotalPrice.toFixed(2);
                cartItem.appendChild(checkOutBtn);

                cartDiv.appendChild(cartItem);
            });

        });
}

function updateCartItemQuantity(updateForm) {
    const formData = new FormData(updateForm);

    var xhttpUpdate = new XMLHttpRequest();
    xhttpUpdate.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            viewCart();
        }
    };
    xhttpUpdate.open("POST", "functions.php", true);
    xhttpUpdate.send(formData);
}

function closeCart() {
    cartModal.style.display = "none";
    cartDiv.innerHTML = "";
}