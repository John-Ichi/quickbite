const ordersDiv = document.getElementById("ordersDiv");

const updateOrderForm = document.getElementById("updateOrderForm");

const customerContactInp = document.getElementById("customerContactInp");

const updateOrderInp = document.getElementById("updateOrderInp");

viewStoreOrders();

function renderStoreOrders(orders) {
    if (!orders) {
        ordersDiv.innerHTML = `<i>No orders yet.</i>`; // Subject to change
    }

    ordersDiv.innerHTML = "";

    orders.forEach(order => {
        const orderContainer = document.createElement("div");

        const orderHeader = document.createElement("h3");
        const orderDetails = document.createElement("p");
        
        const orderId = document.createElement("p");
        orderId.textContent = `Order ID: ${order.checkout_id}`;

        const orderStatus = document.createElement("p");
        orderStatus.textContent = `Status: ${order.status}`;

        const updateStatusBtn = document.createElement("button");

        if (order.status == "pending") {
            updateStatusBtn.textContent = `Mark as Ready`;
        } else if (order.status == "ready") {
            updateStatusBtn.textContent = `Mark as Done`;
        }

        updateStatusBtn.addEventListener("click", () => {
            document.getElementById("orderCheckoutIdInp").value = order.checkout_id;
            customerContactInp.value = order.customer_contact;

            if (order.status == "pending") {
                updateOrderInp.value = "ready";
            } else if (order.status == "ready") {
                updateOrderInp.value = "completed";
            }

            if (confirm("Update order?")) {
                updateOrder(updateOrderForm);
            }
        });

        const orderItems = order.items;
        orderItems.forEach(item => {
            orderHeader.innerHTML += `${item.item_name}<br>`;
            orderDetails.innerHTML += `Item: ${item.item_name} *${item.quantity} Total: ${item.subtotal}<br>`;
        });

        orderContainer.appendChild(orderHeader);
        orderContainer.appendChild(orderDetails);
        orderContainer.appendChild(orderStatus);
        orderContainer.appendChild(orderId);

        if (order.status != "cancelled" && order.status != "completed") orderContainer.appendChild(updateStatusBtn);

        ordersDiv.appendChild(orderContainer);
    });
}

function viewStoreOrders() {
    fetch("store_orders.json")
    .then(res => res.json())
    .then(data => {
        orders = data;
        renderStoreOrders(orders);
    });
}

function updateOrder(updateOrderForm) {
    const formData = new FormData(updateOrderForm);

    var xhttpUpdate = new XMLHttpRequest();
    xhttpUpdate.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            viewStoreOrders();
            updateOrderForm.reset();
        }
    };
    xhttpUpdate.open("POST","functions.php",true);
    xhttpUpdate.send(formData);
}