if (!!window.EventSource) {
    const source = new EventSource('order_stream.php');

    source.addEventListener('update', (e) => {
        const data = JSON.parse(e.data);
        
        if (data.updated) {
            console.log("Refreshing...");
            renderStoreOrders();
        }
    });

    source.onerror = function() {
        console.log("Error...");
    }
} else {
    setInterval(renderStoreOrders(), 10000);
}

const storeId = document.getElementById("storeId").value;

const ordersDiv = document.getElementById("ordersDiv");

// Forms
const updateOrderForm = document.getElementById("updateOrderForm");
const cancelOrderForm = document.getElementById("cancelOrderForm");

// Inputs

const customerContactInp = document.getElementById("customerContactInp");
const updateCheckoutIdInp = document.getElementById("orderCheckoutIdInp");
const updateOrderInp = document.getElementById("updateOrderInp");

const cancelCustomerContact = document.getElementById("cancelCustomerContact");
const cancelCheckoutIdInp = document.getElementById("cancelCheckoutIdInp");
const cancelOrderInp = document.getElementById("cancelOrderInp");

renderStoreOrders();

function renderStoreOrders() {
    fetch("store_orders.json")
    .then(res => res.json())
    .then(orders => {
        if (!orders) {
            ordersDiv.innerHTML = `<i>No orders yet.</i>`; // Subject to change
            return;
        }

        const store = orders.find(store => store.store_id.toString() === storeId);
        
        if (!store) {
            ordersDiv.innerHTML = `<i>No orders yet.</i>`;
            return;
        }

        const storeOrders = store.orders;

        if (storeOrders.length === 0) {
            ordersDiv.innerHTML = `<i>No orders yet.</i>`; // Subject to change
            return;
        }

        ordersDiv.innerHTML = "";

        storeOrders.forEach(order => {
            const orderContainer = document.createElement("div");

            const orderHeader = document.createElement("h3");

            const orderDetailsDiv = document.createElement("div");

            const orderDetails = document.createElement("p");
            orderDetails.innerHTML = `
                Student Number: ${order.customer_id}<br>
                Payment Method: ${order.payment_method}<br>
                Status: ${order.status}<br>
                Contact Number: ${order.customer_contact}<br>
                Date Ordered: ${order.order_created_at}<br>
                Order ID: ${order.checkout_id}<br>
            `;

            orderDetailsDiv.appendChild(orderDetails);

            const itemsContainer = document.createElement("div");
            const orderItems = document.createElement("p");

            order.items.forEach(item => {
                orderHeader.innerHTML += `${item.item_name}<br>`;
                orderItems.innerHTML += `Item: ${item.item_name} *${item.quantity} Total: ${item.subtotal}<br>`;
            });

            itemsContainer.appendChild(orderItems);

            const totalSale = document.createElement("h4");
            totalSale.textContent = order.total_sale;

            const cancelOrderBtn = document.createElement("button");
            cancelOrderBtn.textContent = "Cancel";

            cancelOrderBtn.addEventListener("click", () => {
                cancelCheckoutIdInp.value = order.checkout_id;
                cancelCustomerContact.value = order.customer_contact;
                cancelOrderInp.value = "cancelled";

                updateOrder(cancelOrderForm);
            });

            const updateStatusBtn = document.createElement("button");

            if (order.status == "pending") {
                updateStatusBtn.textContent = `Mark as Ready`;
            } else if (order.status == "ready") {
                updateStatusBtn.textContent = `Mark as Done`;
            }

            updateStatusBtn.addEventListener("click", () => {
                updateCheckoutIdInp.value = order.checkout_id;
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

            orderContainer.appendChild(orderHeader);
            orderContainer.appendChild(orderDetailsDiv);
            orderContainer.appendChild(itemsContainer);
            orderContainer.appendChild(totalSale);

            if (order.status === "pending") orderContainer.appendChild(cancelOrderBtn);
            if (order.status !== "cancelled" && order.status !== "completed") orderContainer.appendChild(updateStatusBtn);

            ordersDiv.appendChild(orderContainer);
        });
    });
}

function updateOrder(form) {
    const formData = new FormData(form);

    var xhttpUpdate = new XMLHttpRequest();
    xhttpUpdate.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            renderStoreOrders();
            form.reset();
        }
    };
    xhttpUpdate.open("POST","functions.php",true);
    xhttpUpdate.send(formData);
}