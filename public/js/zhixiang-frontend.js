// Get modal elements
const modal = document.getElementById('editGameModal');
const closeModalButton = document.getElementById('closeModalBtn');
const cancelModalButton = document.getElementById('cancelModalBtn');
const updateButton = document.getElementById('updateButton');
const editMessage = document.getElementById('editMessage');

// Open the modal and populate the form
function openEditModal(game) {
    // Set form fields with game data
    document.getElementById('editName').value = game.name;
    document.getElementById('editPrice').value = game.price;
    document.getElementById('editImage').value = game.image;

    // Show the modal by removing 'hidden' class
    modal.classList.remove('hidden');
}

// Close the modal
function closeModal() {
    modal.classList.add('hidden');
}

// Add event listeners
closeModalButton.addEventListener('click', closeModal);

function getGames() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/get-games', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = ''
        for (var i = 0; i < response.length; i++) {
            html += '<div class="product">' +
                '<img src="' + response[i].image + '" alt="" width="100%" height="100%">' +
                '<div class="product-details">' +
                '<h2 class="product-title">' + response[i].name + '</h2>' +
                '<p class="product-price">$' + response[i].price + '</p>' +
                '</div>' +
                '<button type="button" class="btn btn-warning" onclick = "editGame(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') +
                '\')">Edit </button> ' +
                '<button type="button" class="btn btn-danger" onclick = "deleteGame(' +
                response[i].id + ')" > Delete</button > ' + '</td>' + '</tr>' +
                '</div>';
        }

        document.getElementById('gameContainer').innerHTML = html;
    };

    request.send();
}

function editGame(data) {
    var selectedGame = JSON.parse(data);

    document.getElementById("editName").value = selectedGame.name;
    document.getElementById("editPrice").value = selectedGame.price;
    document.getElementById("editImage").image = selectedGame.image;

    document.getElementById("updateButton").setAttribute("onclick", 'updateGame("' + selectedGame.id + '")');
    modal.classList.remove('hidden');
}

function updateGame(id) {
    var response = "";

    var jsonData = new Object();
    jsonData.name = document.getElementById("editName").value;
    jsonData.price = document.getElementById("editPrice").value;
    jsonData.image = document.getElementById("editImage").value;

    var fileInput = document.getElementById("editImage");
    var file = fileInput.files[0];
    var maxFileSize = 2 * 1024 * 1024;
    console.log(file.size);
    console.log(maxFileSize);

    if (jsonData.name == "" || jsonData.price == "" || jsonData.image == "") {
        document.getElementById("editMessage").innerHTML = 'All fields are required!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    else if (isNaN(jsonData.price) || jsonData.price <= 0) {
        document.getElementById("editMessage").innerHTML = 'Price must be numeric and above $0!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    else if (file.size > maxFileSize) {
        document.getElementById("editMessage").innerHTML = 'File size must be less than 2MB!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }
    else if (file) {
        var reader = new FileReader();
        reader.onloadend = function () {
            jsonData.image = reader.result;


            sendUpdateRequest(id, jsonData);
        };

        reader.readAsDataURL(file);
    } else {
        sendUpdateRequest(id, jsonData);
    }
}


function sendUpdateRequest(id, jsonData) {
    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-game/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        var response = JSON.parse(request.responseText);
        if (response.message == "Game modified successfully!") {
            alert("Successfully updated game!")
            document.getElementById("editMessage").innerHTML = 'Edited Resource: ' + jsonData.name + '!';
            document.getElementById("editMessage").setAttribute("class", "text-success");
            window.location.href = 'edit-product.html';
        } 
        else if (response.message == "Error: Game already exist!") {
            document.getElementById("editMessage").innerHTML = 'Game already Exist!';
        }
        else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit resource!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}

function deleteGame(id) {
    var response = "";
    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-game/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Game deleted successfully!") {
            alert("Successfully deleted game!")
            window.location.href = 'edit-product.html';
        }
        else {
            alert('Unable to delete game!');
        }
    };
    request.send();
}