
function displayImage() {
    var text = document.getElementById("text-input").value.trim();
    var width = document.getElementById("width-input").value.trim();
    var height = document.getElementById("height-input").value.trim();
    var seed = document.getElementById("seed-input").value.trim();
    var spinner = document.getElementById("loading-spinner");
    var imageContainer = document.getElementById("image-container");

    if (text !== "") {
        spinner.style.display = "block";
        imageContainer.style.display = "block";

        var imageUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(text);

        if (width !== "") {
            imageUrl += "?width=" + encodeURIComponent(width);
        }
        if (height !== "") {
            imageUrl += "&height=" + encodeURIComponent(height);
        }
        if (seed !== "") {
            imageUrl += "&seed=" + encodeURIComponent(seed);
        }

        var existingImage = document.getElementById("displayed-image");
        if (existingImage) {
            existingImage.remove();
        }

        var image = document.createElement("img");
        image.id = "displayed-image";
        image.onload = function () {
            spinner.style.display = "none";
        };
        image.onerror = function () {
            spinner.style.display = "none";
            alert("Failed to load image. Please try again.");
        };
        image.src = imageUrl;
        document.getElementById("image-container").appendChild(image);
    } else {
        alert("Please, insert some text.");
    }
}

function handleKeyDown(event) {
    if (event.key === "Enter") {
        displayImage();
    }
}

function toggleCustom() {
    var customOptions = document.getElementById("custom-options");
    customOptions.style.display = customOptions.style.display === "block" ? "none" : "block";
}