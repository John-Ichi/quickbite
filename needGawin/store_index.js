const storeId = document.getElementById("storeIdInp").value;

const storeNameHeader = document.getElementById("storeName");

const logOutStore = document.getElementById("logOut");
logOutStore.addEventListener("click", (e) => {
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

const menuIdInp = document.getElementById("menuIdInp");

renderStoreName();

function renderStoreName() {
    fetch("store_info.json")
    .then(res => res.json())
    .then(data => {
        const storeData = data.filter(store => store.store_id.toString() === storeId);
        storeNameHeader.textContent = storeData[0].store_name;
    });
}

getStoreMenu();

function getStoreMenu() {
    fetch("menu.json")
    .then(res => res.json())
    .then(data => {
        renderFoodMenu(data);
        initializeEditMenuForm();
        updateMenuTable(data);
        deleteMenuItem();
    });
}

function renderFoodMenu(menu) {
    const storeMenu = menu.filter(store => store.store_id.toString() === storeId);

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

    storeMenu.forEach(item => {
        const itemId = item.id;
        const itemName = item.name;
        const itemDesc = item.description;
        const itemPrice = item.price;
        const itemStock = item.stock;
        const itemPhoto = item.photo;

        const tr = document.createElement("tr");
        tr.id = itemId;

        const tdName = document.createElement("td");
        tdName.classList.add("menu_name");
        tdName.textContent = itemName;

        const tdDesc = document.createElement("td");
        tdDesc.classList.add("menu_desc");
        if (itemDesc !== "") {
            tdDesc.textContent = itemDesc;
        } else {
            tdDesc.textContent = "No description provided.";
        }
        
        const tdPrice = document.createElement("td");
        tdPrice.classList.add("menu_price");
        tdPrice.textContent = itemPrice;
        
        const tdStock = document.createElement("td");
        tdStock.classList.add("menu_stock");
        tdStock.textContent = itemStock;
        
        const tdPhoto = document.createElement("td");
        if (itemPhoto !== null) {
            tdPhoto.innerHTML = `<img src="${itemPhoto}">`;
        } else {
            tdPhoto.textContent = "No image provided.";
        }

        const tdAction = document.createElement("td");
        tdAction.innerHTML = `<button class="editMenu">Edit</button><button class="deleteMenu">Delete</button>`;

        tr.appendChild(tdName);
        tr.appendChild(tdDesc);
        tr.appendChild(tdPrice);
        tr.appendChild(tdStock);
        tr.appendChild(tdPhoto);
        tr.appendChild(tdAction);

        menuTable.appendChild(tr);
    });
}

function initializeEditMenuForm() {
    const editBtns = document.querySelectorAll(".editMenu");
    editBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            editMenuItemModal.style.display = "block";

            const parentRow = btn.closest("tr");

            idInp.value = parentRow.id;
            nameInp.value = parentRow.querySelector(".menu_name").textContent;
            descInp.value = parentRow.querySelector(".menu_desc").textContent;
            priceInp.value = parentRow.querySelector(".menu_price").textContent;
            stockInp.value = parentRow.querySelector(".menu_stock").textContent;
        });
    });
}

// Refresh menu with cache busting to get latest data
async function refreshMenu() {
    try {
        const res = await fetch("menu.json", { cache: "no-store" });
        const data = await res.json();
        renderFoodMenu(data);
        initializeEditMenuForm();
        updateMenuTable();
        deleteMenuItem();
    } catch (e) {
        console.error("Error refreshing menu:", e);
    }
}

function updateMenuTable() {
    editMenuItemModalForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(editMenuItemModalForm);

        var xhttpUpdate = new XMLHttpRequest();
        xhttpUpdate.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                refreshMenu();
                closeEditMenu();
            }
        };
        xhttpUpdate.open("POST","functions.php",true);
        xhttpUpdate.send(formData);
    });
}

function deleteMenuItem() {
    const deleteBtns = document.querySelectorAll(".deleteMenu");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const parentRow = btn.closest("tr");
            const menuId = parentRow.id;

            menuIdInp.value = menuId;

            if (confirm("Are you sure you want to delete this menu item?")) {
                const formData = new FormData(document.getElementById("deleteMenu"));

                var xhttpDelete = new XMLHttpRequest();
                xhttpDelete.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        refreshMenu();
                    }
                };
                xhttpDelete.open("POST","functions.php",true);
                xhttpDelete.send(formData);
            }
        });
    })
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