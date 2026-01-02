const orderSummaryDiv = document.getElementById("orderSummaryDiv");

const checkoutForm = document.getElementById("checkoutForm");

const totalSaleInp = document.getElementById("totalSaleInp");

const checkoutStoreId = document.getElementById("checkoutStoreIdInp");

viewCartSummary();

function renderCartSummary(cart) {
    if (cart === null) window.location.href = "students_dashboard.php";

    const filteredCartByStore = cart.filter(store => store.store_id == checkoutStoreId.value);
    const store = filteredCartByStore[0];

    if (!store || !Array.isArray(store.items)) window.location.href = "students_dashboard.php";

    orderSummaryDiv.innerHTML = "";
    let subtotal = 0;

    store.items.forEach(item => {
        const itemDiv = document.createElement("div");

        const itemHeader = document.createElement("h3");
        itemHeader.textContent = item.name;

        const itemPhoto = document.createElement("img");
        if (item.photo) itemPhoto.src = item.photo;
        else itemPhoto.alt = "A photo of " + item.name;

        const itemQuantity = document.createElement("p");
        itemQuantity.textContent = "Quantity: " + item.quantity;

        const itemPrice = document.createElement("p");
        const totalItemPrice = Number(item.quantity * item.price);
        itemPrice.textContent = "Price: " + totalItemPrice.toFixed(2);

        subtotal += Number(totalItemPrice);

        itemDiv.appendChild(itemHeader);
        itemDiv.appendChild(itemPhoto);
        itemDiv.appendChild(itemQuantity);
        itemDiv.appendChild(itemPrice);

        orderSummaryDiv.appendChild(itemDiv);
    });

    const totalPrice = document.createElement("h3");
    totalPrice.textContent = "Total Price: " + subtotal.toFixed(2);
    totalSaleInp.value = subtotal.toFixed(2);
    orderSummaryDiv.appendChild(totalPrice);
}

function viewCartSummary() {
    fetch("cart.json")
    .then(res => res.json())
    .then(data => {
        cart = data;
        renderCartSummary(cart);
        confirmCheckout(checkoutForm);
    });
}

function confirmCheckout(checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (confirm("Confirm checkout?")) {
            const formData = new FormData(checkoutForm);

            var xhttpCheckout = new XMLHttpRequest();
            xhttpCheckout.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    window.location.href = "students_dashboard.php";
                }
            };
            xhttpCheckout.open("POST","functions.php",true);
            xhttpCheckout.send(formData)
        } else {
            window.location.href = "students_dashboard.php";
        }
    });
}