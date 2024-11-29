const getSearches = () =>
  JSON.parse(window.localStorage.getItem("searches")) || [];

const storeSearch = (search) => {
  const searches = getSearches();
  searches.push(search);
  window.localStorage.setItem("searches", JSON.stringify(searches));
};

const renderSearches = () => {
  const $previousPrompts = document.getElementById("previous-prompts");
  $previousPrompts.innerHTML = "";
  const searches = getSearches();

  searches.forEach((search) => {
    const $li = document.createElement("li");
    $li.className = "previous-prompt";
    $li.textContent = search;
    $li.onclick = () => {
      document.getElementById("text-input").value = search;
      displayImage();
    };
    $previousPrompts.appendChild($li);
  });
};

renderSearches();

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

    const params = new Map();
    if (width) params.set("width", width);
    if (height) params.set("height", height);
    if (seed) params.set("seed", seed);

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
    image.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      text
    )}?${new URLSearchParams(params).toString()}`;
    document.getElementById("image-container").appendChild(image);

    storeSearch(text);
    renderSearches();

    const imageRecord = {
      prompt: text,
      imageUrl: image.src,
      timestamp: new Date().toISOString(),
      width: width || null,
      height: height || null,
      seed: seed || null,
    };

    const client = algoliasearch(
      config.ALGOLIA_APP_ID,
      config.ALGOLIA_ADMIN_KEY
    );
    const index = client.initIndex("SPEC_IMAGES");

    index
      .saveObject({
        ...imageRecord,
        objectID: Date.now().toString(),
      })
      .catch((err) => {
        console.error(err);
      });
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
  customOptions.style.display =
    customOptions.style.display === "block" ? "none" : "block";
}
