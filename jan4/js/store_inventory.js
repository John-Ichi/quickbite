const storeId = document.getElementById("storeId").value;

const invTable = document.getElementById("inventoryTable");

const inventoryForm = document.getElementById("inventoryForm");

const itemIdInp = document.getElementById("itemIdInp");
const oldQuantityInp = document.getElementById("oldQuantityInp");
const oldDatetimeInp = document.getElementById("oldDatetimeInp");
const newQuantityInp = document.getElementById("newQuantityInp");
const newPriceInp = document.getElementById("newPriceInp");
const totalPriceInp = document.getElementById("totalPriceInp");
const needRestockInp = document.getElementById("needRestockInp");
const newRemarksInp = document.getElementById("remarksInp");
const itemDeleteInp = document.getElementById("itemDeleteInp");

fetch("inventory.json")
.then(res => res.json())
.then(inventory => {
    renderInventory(inventory);
});

function renderInventory(inventory) {
    invTable.innerHTML = "";

    const thRow = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = "Item Name";
    
    const tdSupplier = document.createElement("td");
    tdSupplier.textContent = "Supplier";

    const tdCategory = document.createElement("td");
    tdCategory.textContent = "Category";

    const tdUnit = document.createElement("td");
    tdUnit.textContent = "Unit";

    const tdQty = document.createElement("td");
    tdQty.textContent = "Quantity";

    const tdLastRestocked = document.createElement("td");
    tdLastRestocked.textContent = "Last Restocked";

    const tdPricePerUnit = document.createElement("td");
    tdPricePerUnit.textContent = "Price Per Unit";

    const tdTotalPrice = document.createElement("td");
    tdTotalPrice.textContent = "Total Price";

    const tdNeedRestock = document.createElement("td");
    tdNeedRestock.textContent = "Restock";

    const tdRemarks = document.createElement("td");
    tdRemarks.textContent = "Remarks";

    const tdDelete = document.createElement("td");

    thRow.appendChild(tdName);
    thRow.appendChild(tdSupplier);
    thRow.appendChild(tdCategory);
    thRow.appendChild(tdUnit);
    thRow.appendChild(tdQty);
    thRow.appendChild(tdLastRestocked);
    thRow.appendChild(tdPricePerUnit);
    thRow.appendChild(tdTotalPrice);
    thRow.appendChild(tdNeedRestock);
    thRow.appendChild(tdRemarks);
    thRow.appendChild(tdDelete);

    invTable.appendChild(thRow);

    if (!inventory) {
        const tdNoItems = document.createElement("td");
        tdNoItems.colSpan = 11;
        
        const noItemsText = document.createElement("p");
        noItemsText.textContent = "No items yet.";
        
        tdNoItems.appendChild(noItemsText);
        invTable.appendChild(tdNoItems);
        return;
    }

    const storeInventory = inventory.filter(inventory => inventory.store_id.toString() === storeId);

    if (storeInventory.length === 0) {
        const tdNoItems = document.createElement("td");
        tdNoItems.colSpan = 11;
        
        const noItemsText = document.createElement("p");
        noItemsText.textContent = "No items yet.";
        
        tdNoItems.appendChild(noItemsText);
        invTable.appendChild(tdNoItems);
        return;
    }

    storeInventory.forEach(item => {
        const itemRow = document.createElement("tr");

        const itemName = document.createElement("td");
        itemName.textContent = item.item_name;

        const itemSupplier = document.createElement("td");
        itemSupplier.textContent = item.supplier;

        const itemCategory = document.createElement("td");
        itemCategory.textContent = item.category;

        const itemUnit = document.createElement("td");
        itemUnit.textContent = item.unit;

        const itemQuantity = document.createElement("td");
        const itemQuantityText = document.createElement("p");
        itemQuantityText.textContent = item.quantity_per_unit;
        itemQuantity.appendChild(itemQuantityText);

        const updQuantityInp = document.createElement("input");
        updQuantityInp.type = "number";
        updQuantityInp.min = 1;

        itemQuantityText.addEventListener("click", () => {
            oldQuantityInp.value = item.quantity_per_unit;
            oldDatetimeInp.value = item.last_restocked;
            updQuantityInp.value = item.quantity_per_unit;
            newQuantityInp.value = item.quantity_per_unit;
            totalPriceInp.value = item.total_price;
            itemIdInp.value = item.id;
            
            itemQuantity.removeChild(itemQuantityText);
            itemQuantity.appendChild(updQuantityInp);
            updQuantityInp.focus();

            let submittedByEnter = false;

            updQuantityInp.addEventListener("keydown", (e) => {
                if (e.key === "Enter") submittedByEnter = true;
            });

            updQuantityInp.addEventListener("input", () => {
                newQuantityInp.value = updQuantityInp.value;
                const newTotalPrice = Number(newQuantityInp.value * item.price_per_unit);
                totalPriceInp.value = newTotalPrice.toFixed(2);
            });

            updQuantityInp.addEventListener("focusout", () => {
                itemQuantity.removeChild(updQuantityInp);
                itemQuantity.appendChild(itemQuantityText);
                
                if (!submittedByEnter) itemQuantity.closest("form").reset();
            });

            inventoryForm.addEventListener("submit", (e) => {
                e.preventDefault();
                updateInventory(inventoryForm);
            });
        });

        const itemLastRestocked = document.createElement("td");
        itemLastRestocked.textContent = item.last_restocked;

        const itemPricePerUnit = document.createElement("td");
        const pricePerUnitText = document.createElement("p");
        pricePerUnitText.textContent = item.price_per_unit;
        itemPricePerUnit.appendChild(pricePerUnitText);

        const updatePriceInp = document.createElement("input");
        updatePriceInp.type = "number";
        updatePriceInp.step = 0.01;
        updatePriceInp.min = 0.01;

        pricePerUnitText.addEventListener("click", () => {
            updatePriceInp.value = item.price_per_unit;
            newPriceInp.value = item.price_per_unit;
            totalPriceInp.value = item.total_price;
            itemIdInp.value = item.id;

            itemPricePerUnit.removeChild(pricePerUnitText);
            itemPricePerUnit.appendChild(updatePriceInp);
            updatePriceInp.focus();

            let submittedByEnter = false;

            updatePriceInp.addEventListener("keydown", (e) => {
                if (e.key === "Enter") submittedByEnter = true;
            });

            updatePriceInp.addEventListener("input", () => {
                newPriceInp.value = updatePriceInp.value;
                const newTotalPrice = Number(newPriceInp.value * item.quantity_per_unit);
                totalPriceInp.value = newTotalPrice.toFixed(2);
            });

            updatePriceInp.addEventListener("focusout", () => {
                itemPricePerUnit.removeChild(updatePriceInp);
                itemPricePerUnit.appendChild(pricePerUnitText);

                if (!submittedByEnter) itemPricePerUnit.closest("form").reset();
            });

            inventoryForm.addEventListener("submit", (e) => {
                e.preventDefault();
                updateInventory(inventoryForm);
            });
        });

        const itemTotalPrice = document.createElement("td");
        itemTotalPrice.textContent = item.total_price;

        const itemNeedRestock = document.createElement("td");
        const itemRestockText = document.createElement("p");
        if (item.need_restock !== 0) itemRestockText.textContent = "Yes";
        else itemRestockText.textContent = "No";
        itemNeedRestock.appendChild(itemRestockText);

        itemRestockText.addEventListener("click", () => {
            needRestockInp.value = itemRestockText.textContent;
            itemIdInp.value = item.id;
            updateInventory(inventoryForm);
        });

        const itemRemarks = document.createElement("td");
        const itemRemarksText = document.createElement("p");
        if (item.remarks) itemRemarksText.textContent = item.remarks;
        else itemRemarksText.textContent = "No remarks for this item.";
        itemRemarks.appendChild(itemRemarksText);

        const updRemarksInp = document.createElement("textarea");

        itemRemarksText.addEventListener("click", () => {
            let prevRemarks = "";
            
            if (item.remarks) {
                updRemarksInp.value = itemRemarksText.textContent;
                newRemarksInp.value = itemRemarksText.textContent;
                prevRemarks = item.remarks;
            }

            itemIdInp.value = item.id;

            itemRemarks.removeChild(itemRemarksText);
            itemRemarks.appendChild(updRemarksInp);
            updRemarksInp.focus();

            updRemarksInp.addEventListener("input", () => {
                newRemarksInp.value = updRemarksInp.value; 
            });

            updRemarksInp.addEventListener("focusout", () => {
                if (newRemarksInp.value === "" || newRemarksInp.value.toLowerCase().trim() === "null") newRemarksInp.value = "null"; // Cannot set remarks to "null" or "Null"

                if (prevRemarks != updRemarksInp.value) updateInventory(inventoryForm);

                itemRemarks.removeChild(updRemarksInp);
                itemRemarks.appendChild(itemRemarksText);
                itemRemarks.closest("form").reset();
            });
        });

        const itemDelete = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            if (confirm("Delete inventory item?")) {
                itemDeleteInp.value = true; // Set delete true
                itemIdInp.value = item.id; // Select item ID
                updateInventory(inventoryForm);
            }
        });

        itemDelete.appendChild(deleteBtn);

        itemRow.appendChild(itemName);
        itemRow.appendChild(itemSupplier);
        itemRow.appendChild(itemCategory);
        itemRow.appendChild(itemUnit);
        itemRow.appendChild(itemQuantity);
        itemRow.appendChild(itemLastRestocked);
        itemRow.appendChild(itemPricePerUnit);
        itemRow.appendChild(itemTotalPrice);
        itemRow.appendChild(itemNeedRestock);
        itemRow.appendChild(itemRemarks);
        itemRow.appendChild(itemDelete);

        invTable.appendChild(itemRow);
    });
}

function updateInventory(inventoryForm) {
    const formData = new FormData(inventoryForm);

    var xhttpUpdate = new XMLHttpRequest();
    xhttpUpdate.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            fetch("inventory.json")
            .then(res => res.json())
            .then(data => {
                inventory = data;
                renderInventory(data);
                inventoryForm.reset();
            });
        }
    };
    xhttpUpdate.open("POST","functions.php",true);
    xhttpUpdate.send(formData);
}