function addGameForm() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    let image =
      document.getElementById("image").value || "https://via.placeholder.com/150";
  
    if (!name || !price) {
      alert("Name and Price are required!");
      return;
    }
  
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert("Price must be a number greater than 0!");
      return;
    }
  
    const jsonData = { name, price: numericPrice, image };
    console.log(jsonData);
  
    const request = new XMLHttpRequest();
    request.open("POST", "/add-game", true);
    request.setRequestHeader("Content-Type", "application/json");
  
    request.onload = function () {
      try {
        const response = JSON.parse(request.responseText);
        if (response.message) {
          alert("Error: " + response.message);
        } else {
          alert("Resource added successfully!");
          window.location.href = "index.html";
        }
      } catch (error) {
        alert("An unexpected error occurred.");
        console.error("Parsing error:", error);
      }
    };
  
    request.onerror = function () {
      alert("Network error. Please try again later.");
    };
  
    request.send(JSON.stringify(jsonData));
  }
  