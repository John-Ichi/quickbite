const storesDiv = document.getElementById("storesDiv");

fetch("stores.json")
.then(res => res.json())
.then(data => {
    renderStores(data);
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