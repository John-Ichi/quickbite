const logOutStore = document.getElementById("logOut");
logOutStore.addEventListener("click", (e) => {
    e.preventDefault();
    logOut();
});

const storeId = document.getElementById("storeIdInp").value;

const storeNameHeader = document.getElementById("storeName");

const menuTable = document.getElementById("menuTable");

const editMenuItemModal = document.getElementById("editMenuItemModal");
const editMenuItemModalCloseBtn = editMenuItemModal.querySelector(".close");
const editMenuItemModalForm = editMenuItemModal.querySelector("form");

editMenuItemModalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    updateMenu(editMenuItemModalForm);
    closeEditMenu();
});

editMenuItemModalCloseBtn.addEventListener("click", () => {
    closeEditMenu();
});

const idInp = document.getElementById("menuItemId"); // Edit menu
const nameInp = document.getElementById("editNameInp");
const descInp = document.getElementById("editDescInp");
const priceInp = document.getElementById("editPriceInp");
const stockInp = document.getElementById("editStockInp");

const menuIdInp = document.getElementById("menuIdInp"); // Delete menu

renderStoreName();

function renderStoreName() {
    fetch("store_info.json")
    .then(res => res.json())
    .then(data => {
        if (!data) return;

        const storeData = data.filter(store => store.store_id.toString() === storeId);
        storeNameHeader.textContent = storeData[0].store_name;
    });
}

renderFoodMenu();

function renderFoodMenu() {
    fetch("menu.json?t=" + new Date().getTime())
    .then(res => res.json())
    .then(menu => {
        if (!menu) {
            menuTable.innerHTML =
                `<tr>
                    <td colspan="6"><i>No menu items yet.</i></td>
                </tr>`;
        }

        const storeMenu = menu.filter(store => store.store_id.toString() === storeId);

        if (storeMenu.length === 0) {
            menuTable.innerHTML =
                `<tr>
                    <td colspan="6"><i>No menu items yet.</i></td>
                </tr>`;
        }

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
        initializeEditMenuForm();
        deleteMenuItem();
    });
}

function initializeEditMenuForm() {
    const editBtns = document.querySelectorAll(".editMenu");
    editBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const itemId = btn.closest("tr").id;

            try {
                const res = await fetch("menu.json?t=" + new Date().getTime());
                const menu = await res.json();

                renderFoodMenu();

                const latestItem = menu.find(item => item.id.toString() === itemId);

                if (latestItem) {
                    idInp.value = latestItem.id;
                    nameInp.value = latestItem.name;
                    descInp.value = latestItem.description;
                    priceInp.value = latestItem.price;
                    stockInp.value = latestItem.stock;

                    editMenuItemModal.style.display = "block";
                }
            } catch (err) {
                console.log("Error syncing data:",err);
            }
        });
    });
}

function deleteMenuItem() {
    const deleteBtns = document.querySelectorAll(".deleteMenu");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const parentRow = btn.closest("tr");
            const itemId = parentRow.id;

            try {
                const res = await fetch("menu.json?t=" + new Date().getTime());
                const menu = await res.json();

                renderFoodMenu();

                const itemExists = menu.some(item => item.id.toString() === itemId);

                if (itemExists) {
                    if (confirm("Are you sure you want to delete this menu item?")) {
                        menuIdInp.value = itemId;
                        updateMenu(document.getElementById("deleteMenu"));
                    }
                } else {
                    alert("This item has already been removed or updated.");
                }
            } catch (err) {
                console.log("Error during delete sync:",err);
            }
        });
    })
}

function updateMenu(form) {
    const formData = new FormData(form);

    var xhttpUpdate = new XMLHttpRequest();
    xhttpUpdate.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            renderFoodMenu();
        }
    };
    xhttpUpdate.open("POST","functions.php",true);
    xhttpUpdate.send(formData);
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