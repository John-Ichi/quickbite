const registeredUsersDiv = document.getElementById("registeredUsers");
const registeredUsersTable = registeredUsersDiv.querySelector("table");

fetch("registered_users.json")
.then(res => res.json())
.then(data => {
    renderRegisteredUsers(data);
});

function renderRegisteredUsers(users) {
    if (users === null) {
        const noUsersMsg = document.createElement("tr");
        noUsersMsg.style.columnSpan = "2";
        noUsersMsg.textContent = "No registered users yet.";
        
        registeredUsersTable.appendChild(noUsersMsg);
        return;
    }

    users.forEach(user => {
        const row = document.createElement("tr");
        const studentNumber = document.createElement("td");
        studentNumber.textContent = user.student_number;
        
        const name = document.createElement("td");
        name.textContent = user.name;

        row.appendChild(studentNumber);
        row.appendChild(name);

        registeredUsersTable.appendChild(row);
    });
}