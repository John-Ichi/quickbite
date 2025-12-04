const logout = document.getElementById("logOut");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    logOut();
});

const menuTable = document.getElementById("menuTable");

const editMenuItemModal = document.getElementById("editMenuItemModal");
const editMenuItemModalCloseBtn = editMenuItemModal.querySelector(".close");
const editMenuItemModalForm = editMenuItemModal.querySelector("form");

editMenuItemModalCloseBtn.addEventListener("click", () => {
    closeEditMenu();
});

const idInp = document.getElementById("menuItemId");
const nameInp = document.getElementById("editNameInp");
const descInp = document.getElementById("editDescInp");
const priceInp = document.getElementById("editPriceInp");
const stockInp = document.getElementById("editStockInp");

fetch("menu.json")
.then(res => res.json())
.then(data => {
    renderFoodMenu(data);
    updateMenuTable(data);
});

function renderFoodMenu(menu) {
    menuTable.innerHTML = "";

    const tbHeader = document.createElement("tr");
    
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

    tbHeader.appendChild(thName);
    tbHeader.appendChild(thDesc);
    tbHeader.appendChild(thPrice);
    tbHeader.appendChild(thStock);
    tbHeader.appendChild(thPhoto);
    tbHeader.appendChild(thActions);

    menuTable.appendChild(tbHeader);

    menu.forEach(item => {
        const itemId = item.id;
        const itemName = item.name;
        const itemDesc = item.description;
        const itemPrice = item.price;
        const itemStock = item.stock;
        const itemPhoto = item.photo;

        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.textContent = itemName;

        const tdDesc = document.createElement("td");
        if (itemDesc !== "") {
            tdDesc.textContent = itemDesc;
        } else {
            tdDesc.textContent = "No description provided.";
        }
        
        const tdPrice = document.createElement("td");
        tdPrice.textContent = itemPrice;
        
        const tdStock = document.createElement("td");
        tdStock.textContent = itemStock;
        
        const tdPhoto = document.createElement("td");
        if (itemPhoto !== null) {
            tdPhoto.innerHTML = `<img src="${itemPhoto}">`;
        } else {
            tdPhoto.textContent = "No image provided.";
        }

        const tdAction = document.createElement("td");
        tdAction.innerHTML = `<button class="editMenu">Edit Menu Item</button>`;

        tr.appendChild(tdName);
        tr.appendChild(tdDesc);
        tr.appendChild(tdPrice);
        tr.appendChild(tdStock);
        tr.appendChild(tdPhoto);
        tr.appendChild(tdAction);

        menuTable.appendChild(tr);

        const editBtns = document.querySelectorAll(".editMenu");
        editBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                editMenuItemModal.style.display = "block";

                idInp.value = itemId;
                nameInp.value = itemName;
                descInp.value = itemDesc;
                priceInp.value = itemPrice;
                stockInp.value = itemStock;
            });
        });
    });
}

function updateMenuTable() {
    editMenuItemModalForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(editMenuItemModalForm);

        var xhttpUpdate = new XMLHttpRequest();
        xhttpUpdate.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                fetch("menu.json")
                .then(res => res.json())
                .then(data => {
                    renderFoodMenu(data);
                    updateMenuTable(data);
                    closeEditMenu();
                });
            }
        };
        xhttpUpdate.open("POST","functions.php",true);
        xhttpUpdate.send(formData);
    });
}

function closeEditMenu() {
    editMenuItemModal.style.display = "none";
    editMenuItemModalForm.reset();
}

function logOut() {
    var xhttpLogout = new XMLHttpRequest();
    xhttpLogout.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "store_login.php";
        }
    };
    xhttpLogout.open("GET","store_logout.php",true);
    xhttpLogout.send();
}