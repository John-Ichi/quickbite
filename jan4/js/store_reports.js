if (!!window.EventSource) {
    const source = new EventSource('order_stream.php');

    source.addEventListener('update', (e) => {
        const data = JSON.parse(e.data);
        
        if (data.updated) {
            console.log("Refreshing...");
            renderItemsAnalytics();
        }
    });

    source.onerror = function() {
        console.log("Error...");
    }
} else {
    setInterval(renderItemsAnalytics(), 10000);
}

const storeId = document.getElementById("storeId").value;

const itemSalesDiv = document.getElementById("itemSalesDiv");

const salesSummaryDiv = document.getElementById("salesSummaryDiv");

renderItemsAnalytics();

function renderItemsAnalytics() {
    fetch("store_orders.json")
    .then(res => res.json())
    .then(orders => {
        if (!orders) {
            itemSalesDiv.innerHTML = `
                <h2>Item Sales</h2>
                <i>No items sold yet.</i>
            `;
            salesSummaryDiv.innerHTML = `
                <h2>Sales Report</h2>
                <i>No sale made yet.</i>
            `;
            return;
        }

        const store = orders.find(store => store.store_id.toString() === storeId);

        if (!store) {
            itemSalesDiv.innerHTML = `
                <h2>Item Sales</h2>
                <i>No items sold yet.</i>
            `;
            salesSummaryDiv.innerHTML = `
                <h2>Sales Report</h2>
                <i>No sale made yet.</i>
            `;
            return;
        }

        const storeOrders = store.orders;

        if (storeOrders.length === 0) {
            itemSalesDiv.innerHTML = `
                <h2>Item Sales</h2>
                <i>No items sold yet.</i>
            `;
            salesSummaryDiv.innerHTML = `
                <h2>Sales Report</h2>
                <i>No sale made yet.</i>
            `;
            return;
        }

        itemSalesDiv.innerHTML = "";
        salesSummaryDiv.innerHTML = "";

        const completedOrdersItems = {};
        const weeklyOrdersItems = {};
        const todayOrdersItems = {};

        const dailySales = {};
        let weeklyTotalSales = 0;
        const weekDaysWithSales = new Set();

        const today = new Date();

        storeOrders.forEach(order => {
            if (order.status === "completed") {
                const dateCompleted = new Date(order.status_updated_at);
                const saleAmount = Number(order.total_sale);
                const dateKey = dateCompleted.toISOString().split("T")[0];

                // Sales per day
                if (!dailySales[dateKey]) {
                    dailySales[dateKey] = 0;
                }
                dailySales[dateKey] += saleAmount;

                // Sales this week
                if (checkSameWeek(dateCompleted, today)) {
                    weeklyTotalSales += saleAmount;
                    weekDaysWithSales.add(dateKey);
                }

                order.items.forEach(item => {
                    const foodId = item.food_id;
                    const quantity = Number(item.quantity);

                    if (!completedOrdersItems[foodId]) { // All time food item sales
                        completedOrdersItems[foodId] = {
                            name: item.item_name,
                            soldQty: 0
                        };
                    }
                    completedOrdersItems[foodId].soldQty += quantity;

                    if (checkSameWeek(dateCompleted, today)) { // Weekly food item sales
                        if (!weeklyOrdersItems[foodId]) {
                            weeklyOrdersItems[foodId] = {
                                name: item.item_name,
                                soldQty: 0
                            };
                        }
                        weeklyOrdersItems[foodId].soldQty += quantity;
                    }

                    if (checkSameDay(dateCompleted, today)) { // Daily food item sales
                        if (!todayOrdersItems[foodId]) {
                            todayOrdersItems[foodId] = {
                                name: item.item_name,
                                soldQty: 0
                            };
                        }
                        todayOrdersItems[foodId].soldQty += quantity;
                    }
                });
            }
        });

        // Most sold items of all time section
        renderSalesSection("Most Sold Items of All Time", completedOrdersItems);

        // Most sold items of the week
        renderSalesSection("Most Sold Items of the Week", weeklyOrdersItems);

        // Most sold items of today section
        renderSalesSection("Most Sold Items of Today", todayOrdersItems);

        renderSalesSummary(dailySales, weeklyTotalSales, weekDaysWithSales.size);
    });
}

function renderSalesSection(title, items) {
    const mostToLeastSoldItems = Object.values(items).sort((a, b) => b.soldQty - a.soldQty);

    const sectionDiv = document.createElement("div");
    const header = document.createElement("h2");
    header.textContent = title;

    sectionDiv.appendChild(header);
    itemSalesDiv.appendChild(sectionDiv);

    if (mostToLeastSoldItems.length === 0) {
        sectionDiv.innerHTML += `<i>No sold items yet.</i>`;
        return;
    } else {
        let index = 1;
        mostToLeastSoldItems.forEach(item => {
            sectionDiv.innerHTML += `${index}. ${item.name}, Amount Sold: ${item.soldQty}.<br>`;
            index++
        });
    }
}

function renderSalesSummary(dailySales, weeklyTotalSales, daysWithSales) {
    salesSummaryDiv.innerHTML = "";

    const header = document.createElement("h2");
    header.textContent = "Sales Summary";
    salesSummaryDiv.appendChild(header);

    const dailyHeader = document.createElement("h3");
    dailyHeader.textContent = "Sales Per Day";
    salesSummaryDiv.appendChild(dailyHeader);

    if (Object.keys(dailySales).length === 0) {
        salesSummaryDiv.innerHTML += "<i>No sales yet.</i>";
    } else {
        Object.entries(dailySales)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .forEach(([date, total]) => {
                salesSummaryDiv.innerHTML += `${date}: ₱${total.toFixed(2)}<br>`;
            });
    }

    const weeklyHeader = document.createElement("h3");
    weeklyHeader.textContent = "Sales this week";
    salesSummaryDiv.appendChild(weeklyHeader);

    salesSummaryDiv.innerHTML += `Total Sales this week: ₱${weeklyTotalSales.toFixed(2)}<br>`;

    const avgHeader = document.createElement("h3");
    avgHeader.textContent = "Average Daily Sales Per Week";
    salesSummaryDiv.appendChild(avgHeader);

    if (daysWithSales > 0 && weeklyTotalSales > 0) {
        const average = weeklyTotalSales / daysWithSales;
        salesSummaryDiv.innerHTML += `₱${average.toFixed(2)} per day`;
    } else {
        salesSummaryDiv.innerHTML += "<i>No sales this week.</i>";
    }
}

function checkSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function checkSameWeek(date1, date2) {
    // Create date copies
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Set date copies to date only
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    // Get the day of the week (Monday - Sunday: 1 - 7)
    const day1 = d1.getDay() || 7;
    const day2 = d2.getDay() || 7;

    // Set date to Monday or 1
    d1.setDate(d1.getDate() - day1 + 1);
    d2.setDate(d2.getDate() - day2 + 1);

    // Return if both timestamps belong to the same Monday
    return d1.getTime() === d2.getTime();
}