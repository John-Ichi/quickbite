const invTable = document.getElementById("inventoryTable");

const inventoryForm = document.getElementById("inventoryForm");

const itemIdInp = document.getElementById("itemIdInp");
const quantityInp = document.getElementById("quantityInp");
const priceInp = document.getElementById("priceInp");

fetch("inventory.json")
.then(res => res.json())
.then(data => {
    inventory = data;

    renderInventory(data);
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

    invTable.appendChild(thRow);

    inventory.forEach(item => {
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
        const itemQuantityTextDisplay = document.createElement("p");
        itemQuantityTextDisplay.textContent = item.quantity_per_unit;
        itemQuantity.appendChild(itemQuantityTextDisplay);

        itemQuantityTextDisplay.addEventListener("click", () => {
            itemQuantity.innerHTML = `<input type="text" name="upd_inv_item_quan" value="${item.quantity_per_unit}">`;
            itemIdInp.value = item.id;
            quantityInp.value = item.quantity_per_unit;
            priceInp.value = item.price_per_unit;
        });

        inventoryForm.addEventListener("submit", (e) => {
            itemQuantity.innerHTML = "";
            itemQuantity.appendChild(itemQuantityTextDisplay);
            
            // Submit form asynch
            // e.preventDefault();
        });

        const itemLastRestocked = document.createElement("td");
        itemLastRestocked.textContent = item.last_restocked;

        const itemPricePerUnit = document.createElement("td");
        itemPricePerUnit.textContent = item.price_per_unit;

        const itemTotalPrice = document.createElement("td");
        itemTotalPrice.textContent = item.total_price;

        const itemNeedRestock = document.createElement("td");
        if (item.need_restock !== 0) itemNeedRestock.textContent = "Yes";
        else itemNeedRestock.textContent = "No";

        const itemRemarks = document.createElement("td");
        if (item.remarks) itemRemarks.textContent = item.remarks
        else itemRemarks.textContent = "No remarks for this item.";

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

        invTable.appendChild(itemRow);
    });
}