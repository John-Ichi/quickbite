const storesDiv = document.getElementById("storesDiv");

const viewCartBtn = document.getElementById("viewCart");

const cartModal = document.getElementById("cartModal");
const cartDiv = document.getElementById("cartDiv");

const cartModalCloseBtn = cartModal.querySelector(".close");
cartModalCloseBtn.addEventListener("click", () => {
    closeCart();
});

fetch("stores.json")
.then(res => res.json())
.then(data => {
    renderStores(data);

    viewCartBtn.addEventListener("click", () => {
        viewCart();
    });
});

function renderStores(stores) {
    stores.forEach(store => {
        const storeDiv = document.createElement("div");
        storeDiv.classList.add("store");

        const cardProfile = document.createElement("img");
        cardProfile.src = store.store_photo;

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

        let overallTotalPrice = 0;
        const checkOutBtn = document.createElement("button");

        cart.forEach(item => {
            const cartItem = document.createElement("div");

            const cartPhoto = document.createElement("img");
            if (item.photo) cartPhoto.src = item.photo;
            else cartPhoto.alt = `A picture of ${item.name}`;
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

            const deleteItemBtn = document.createElement("button");
            deleteItemBtn.textContent = "Remove";
            cartItem.appendChild(deleteItemBtn);

            deleteItemBtn.addEventListener("click", () => {
                cartIdInp.value = item.id;

                if (confirm("Are you sure you want to remove this item from you cart?")) {
                    removeCartItem(document.getElementById("deleteForm"));
                }
            });

            const cartPrice = document.createElement("h5");
            const itemPrice = Number(item.price);
            const itemQuan = Number(item.quantity);
            const totalPrice = itemPrice * itemQuan;
            cartPrice.textContent = totalPrice.toFixed(2);
            overallTotalPrice += totalPrice;
            cartItem.appendChild(cartPrice);

            checkOutBtn.textContent = `Total: ${overallTotalPrice.toFixed(2)}`;

            cartDiv.appendChild(cartItem);
        });
        cartDiv.appendChild(checkOutBtn);

        checkOutBtn.addEventListener("click", () => {
            proceedToCheckout(document.getElementById("checkOut"));
        });
    })
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
/**
const menuTable = document.getElementById("menuTable");

const orderModal = document.getElementById("orderModal");
const closeOrderModalBtn = orderModal.querySelector(".close");

closeOrderModalBtn.addEventListener("click", () => {
    orderModal.style.display = "none";
    orderModalForm.reset();
});

let orderSummary = [];

const orderModalForm = orderModal.querySelector("form");
const orderFormCode = document.getElementById("itemCode");
const orderFormName = document.getElementById("itemName");
const orderFormCount = document.getElementById("itemCount");
const addItemBtn = document.getElementById("addItem");

addItemBtn.addEventListener("click", () => {
    addToCart();
});

const cartModal = document.getElementById("cartModal");
const viewCartBtn = document.getElementById("viewCart");
const closeCartBtn = cartModal.querySelector(".close");
const orderSummaryDiv = document.getElementById("orderSummary");

closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
});

viewCartBtn.addEventListener("click", () => {
    viewCart();
});

fetch("menu.json")
.then(res => res.json())
.then(data => {
    renderFoodMenu(data);
});

function renderFoodMenu(menu) {
    menu.forEach(item => {
        const itemCode = item.code;
        const itemName = item.name;

        const tr = document.createElement("tr");

        const tdCode = document.createElement("td");
        tdCode.textContent = itemCode;

        const tdName = document.createElement("td");
        tdName.textContent = itemName;

        const tdDesc = document.createElement("td");
        tdDesc.textContent = item.description;
        
        const tdPrice = document.createElement("td");
        tdPrice.textContent = item.price;
        
        const tdStock = document.createElement("td");
        tdStock.textContent = item.stock;
        
        const tdPhoto = document.createElement("td");
        if (item.photo !== null) {
            tdPhoto.innerHTML = `<img src="${item.photo}">`;
        } else {
            tdPhoto.textContent = "No image provided.";
        }

        // Student order function
        const orderBtn = document.createElement("button");
        orderBtn.id = "addToCart";
        orderBtn.textContent = "Add To Cart";
        orderBtn.addEventListener("click", () => {
            orderModal.style.display = "block";

            orderFormCode.value = itemCode;
            orderFormName.value = itemName;
            orderFormCount.value = 1;
        });

        const tdOrderAction = document.createElement("td");
        tdOrderAction.appendChild(orderBtn);


        tr.appendChild(tdCode);
        tr.appendChild(tdName);
        tr.appendChild(tdDesc);
        tr.appendChild(tdPrice);
        tr.appendChild(tdStock);
        tr.appendChild(tdPhoto);
        tr.appendChild(tdOrderAction);

        menuTable.appendChild(tr);
    });
}

function addToCart() {
    let order = [];

    order.push(orderFormCode.value);
    order.push(orderFormName.value);
    order.push(orderFormCount.value);
    orderSummary.push(order);
    
    orderModal.style.display = "none";
    orderModalForm.reset();
}

function viewCart() {
    cartModal.style.display = "block";

    if (orderSummary.length === 0) {
        orderSummaryDiv.innerHTML = `<p>No orders yet.</p>`;
        return;
    }

    orderSummaryDiv.innerHTML = `
        <table id="orderSummaryTable">
            <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Quantity</th>
            </tr>
        </table>
    `;

    const orderSummaryTable = document.getElementById("orderSummaryTable");
    console.log(orderSummaryTable);
    orderSummary.forEach(order => {
        console.log(order);
    });
}
*/