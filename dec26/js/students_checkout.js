const orderSummaryDiv = document.getElementById("orderSummaryDiv");

fetch("cart.json")
.then(res => res.json())
.then(data => {
    cart = data;
    viewCartSummary(cart);
});

function viewCartSummary(cart) {
    orderSummaryDiv.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement("div");

        const itemHeader = document.createElement("h3");
        itemHeader.textContent = item.name;

        const itemPhoto = document.createElement("img");
        if (item.photo) itemPhoto.src = item.photo;
        else itemPhoto.alt = "A photo of " + item.name;

        const itemQuantity = document.createElement("p");
        itemQuantity.textContent = "Quantity: " + item.quantity;

        const itemPrice = document.createElement("p");
        itemPrice.textContent = "Price: " + item.price;

        subtotal += Number(item.price);

        itemDiv.appendChild(itemHeader);
        itemDiv.appendChild(itemPhoto);
        itemDiv.appendChild(itemQuantity);
        itemDiv.appendChild(itemPrice);

        orderSummaryDiv.appendChild(itemDiv);
    });

    const totalPrice = document.createElement("h3");
    totalPrice.textContent = "Total Price: " + subtotal.toFixed(2);
    orderSummaryDiv.appendChild(totalPrice);
}