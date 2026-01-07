const returnAnchor = document.getElementById("returnToDashboard");

returnAnchor.addEventListener("click", (e) => {
    e.preventDefault();

    if (confirm("Cancel checkout?")) {
        window.location.href = "students_dashboard.php";
    }
});

const orderSummaryDiv = document.getElementById("orderSummaryDiv");

const checkoutForm = document.getElementById("checkoutForm");
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (confirm("Confirm checkout?")) {
        const formData = new FormData(checkoutForm);

        var xhttpCheckOut = new XMLHttpRequest();
        xhttpCheckOut.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.responseText);
                if (response.status === 'success' && response.redirect_url) {
                    window.location.href = response.redirect_url;
                } else {
                    window.location.href = "students_dashboard.php";
                }
            }
        };
        xhttpCheckOut.open("POST","functions.php",true);
        xhttpCheckOut.send(formData);
    }
});

const totalSaleInp = document.getElementById("totalSaleInp");

const checkoutStoreId = document.getElementById("checkoutStoreIdInp");

viewCartSummary();

function viewCartSummary() {
    fetch("cart.json")
    .then(res => res.json())
    .then(cart => {
        if (cart === null) window.location.href = "students_dashboard.php"; // No cart

        const filteredCartByStore = cart.filter(store => store.store_id == checkoutStoreId.value);
        const store = filteredCartByStore[0];

        if (!store || !Array.isArray(store.items)) window.location.href = "students_dashboard.php"; // No items

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
    });
}