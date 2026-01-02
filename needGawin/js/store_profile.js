const storeId = document.getElementById("storeIdInp").value;

const storePhoto = document.getElementById("storePhoto");

const changeStorePhotoModal = document.getElementById("changeStorePhotoModal");
const changePhotoBtn = document.getElementById("changePhotoBtn");
changePhotoBtn.addEventListener("click", () => {
    openPhotoModal();
});

const changeStorePhotoForm = changeStorePhotoModal.querySelector("form");
changeStorePhotoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    asynchronousUpdate(changeStorePhotoForm);
    closePhotoModal();
});

const photoModalCloseBtn = changeStorePhotoModal.querySelector(".close");
photoModalCloseBtn.addEventListener("click", () => {
    closePhotoModal();
});

const editDescModal = document.getElementById("editDescModal");
const editDescBtn = document.getElementById("editDescBtn");
editDescBtn.addEventListener("click", () => {
    openDescModal();
});

const descModalCloseBtn = editDescModal.querySelector(".close");
descModalCloseBtn.addEventListener("click", () => {
    closeDescModal();
});

const changeStoreDescForm = editDescModal.querySelector("form");
changeStoreDescForm.addEventListener("submit", (e) => {
    e.preventDefault();
    asynchronousUpdate(changeStoreDescForm);
    closeDescModal();
});

getStoreInformation();

function renderStoreInformation(info) {
    const storeInfo = info.filter(store => store.store_id.toString() === storeId);

    storeInfo.forEach(data => {
        if (data.store_name) {
            document.getElementById("storeName").textContent = data.store_name;
        }

        if (data.store_description) {
            const description = data.store_description;
            document.getElementById("storeDesc").textContent = description;
            document.getElementById("storeDescInp").value = description;
        }

        storePhoto.alt = "Store Profile Picture.";
        if (data.store_photo) {
            storePhoto.src = data.store_photo;
        }
    });
}

function getStoreInformation() {
    fetch("store_info.json")
    .then(res => res.json())
    .then(data => {
        renderStoreInformation(data);
    });
}

function openPhotoModal() {
    changeStorePhotoModal.style.display = "block";
}

function closePhotoModal() {
    changeStorePhotoModal.style.display = "none";
}

function openDescModal() {
    editDescModal.style.display = "block";
}

function closeDescModal() {
    editDescModal.style.display = "none";
}

function asynchronousUpdate(updateForm) {
    const formData = new FormData(updateForm);

    var xhttpUpdate = new XMLHttpRequest();
    xhttpUpdate.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            getStoreInformation();
            updateForm.reset();
        }
    };
    xhttpUpdate.open("POST","functions.php",true);
    xhttpUpdate.send(formData);
}