function viewGame() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/view-game', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = ''
        for (var i = 0; i < response.length; i++) {
            html += '<div class="product">' +
                        '<img src="' + response[i].image + '" alt="' + response[i].name + '">' +
                        '<div class="product-details">' +
                            '<h2 class="product-title">' + response[i].name + '</h2>' +
                            '<p class="product-price">$' + response[i].price + '</p>' +
                        '</div>' +
                    '</div>';
        }
        document.getElementById('gameContainer').innerHTML = html;
    };

    request.send();
}