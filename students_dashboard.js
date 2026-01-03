async function loadJSON(path){
    try{
        const resp = await fetch(path + '?_=' + Date.now());
        if(!resp.ok) return null;
        return await resp.json();
    }catch(e){return null}
}

document.addEventListener('DOMContentLoaded', async ()=>{
    const studentNumber = document.getElementById('studentNumberInp')?.value || null;
    const stores = await loadJSON('stores.json') || [];
    const cart = await loadJSON('cart.json') || [];
    const orders = await loadJSON('student_orders.json') || [];

    const storesDiv = document.getElementById('storesDiv');
    const cartDiv = document.getElementById('cartDiv');
    const ordersDiv = document.getElementById('ordersDiv');

    function renderStores(list){
        storesDiv.innerHTML = '';
        if(!list.length) { storesDiv.innerHTML = '<p>No stores available</p>'; return }
        const grid = document.createElement('div'); grid.className='stores-grid';
        list.forEach(s=>{
            const card = document.createElement('div'); card.className='store-card';
            card.innerHTML = `<div class="store-name">${s.store_name}</div><div style="opacity:.85;font-size:13px">${s.created_at || ''}</div>`;
            card.addEventListener('click', ()=>openStore(s.id));
            grid.appendChild(card);
        });
        storesDiv.appendChild(grid);
    }

    function renderCart(list){
        cartDiv.innerHTML='';
        if(!list || !list.length){ cartDiv.innerHTML='<p>Cart is empty</p>'; return }
        const cont = document.createElement('div'); cont.className='cart-list';
        list.forEach(item=>{
            const el = document.createElement('div'); el.className='cart-item';
            el.innerHTML = `<img src="${item.photo || 'https://via.placeholder.com/64'}"><div style="flex:1"><div style="font-weight:700">${item.name}</div><div style="opacity:.8">${item.quantity} × ₱${item.price}</div></div><div style="font-weight:700">₱${(item.quantity*item.price).toFixed(2)}</div>`;
            cont.appendChild(el);
        });
        cartDiv.appendChild(cont);
    }

    function renderOrders(list){
        ordersDiv.innerHTML='';
        if(!list || !list.length){ ordersDiv.innerHTML='<p>No orders yet</p>'; return }
        const cont = document.createElement('div'); cont.className='orders-list';
        list.forEach(o=>{
            const el = document.createElement('div'); el.className='cart-item';
            el.innerHTML = `<div style="flex:1"><div style="font-weight:700">Order ${o.checkout_id}</div><div style="opacity:.85">${o.status} • ${o.created_at}</div></div><div style="font-weight:700">₱${o.total_sale}</div>`;

            // If order is pending, allow cancellation
            try {
                const status = (o.status || '').toString().toLowerCase();
                if (status === 'pending' || status === 'awaiting payment') {
                    const cancelBtn = document.createElement('button');
                    cancelBtn.className = 'btn';
                    cancelBtn.style.background = 'transparent';
                    cancelBtn.style.border = '1px solid rgba(255,255,255,0.06)';
                    cancelBtn.style.color = 'var(--muted)';
                    cancelBtn.style.padding = '6px 8px';
                    cancelBtn.style.marginLeft = '8px';
                    cancelBtn.textContent = 'Cancel';
                    cancelBtn.addEventListener('click', ()=>{
                        if (confirm('Cancel this order?')) {
                            document.getElementById('orderIdInp').value = o.id;
                            document.getElementById('cancelOrderForm').submit();
                        }
                    });
                    el.appendChild(cancelBtn);
                }
            } catch(e){}

            cont.appendChild(el);
        });
        ordersDiv.appendChild(cont);
    }

    renderStores(stores || []);
    renderCart(cart || []);
    renderOrders(orders || []);

    // modal controls
    const cartModal = document.getElementById('cartModal');
    const ordersModal = document.getElementById('ordersModal');
    const logoutModal = document.getElementById('logoutModal');

    document.getElementById('viewCart')?.addEventListener('click', ()=>cartModal.classList.add('show'));
    document.getElementById('viewOrders')?.addEventListener('click', ()=>ordersModal.classList.add('show'));
    document.getElementById('logoutBtn')?.addEventListener('click', ()=>logoutModal.classList.add('show'));

    document.querySelectorAll('.close').forEach(b=>b.addEventListener('click', (e)=>{
        e.target.closest('.modal').classList.remove('show');
    }));

    // open store -> go to store.php listing (existing flow)
    function openStore(storeId){
        window.location.href = 'store.php?store_id=' + storeId;
    }

    // Checkout from cart (simple flow: navigate to checkout page or show a modal)
    document.getElementById('checkoutFromCart')?.addEventListener('click', ()=>{
        window.location.href = 'students_checkout.php';
    });

    // logout confirm
    document.getElementById('confirmLogout')?.addEventListener('click', ()=>{
        window.location.href = 'students_logout.php';
    });
});