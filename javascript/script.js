async function getJSON(url) {
    try {
        let response = await fetch(url);
        let result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
    }
}

function clearContainer(className) {
    while (document.querySelector(`.${className}`).firstChild) {
        document.querySelector(`.${className}`).removeChild(document.querySelector(`.${className}`).firstChild);
    }
}
function printShops(shops) {
    shops.forEach(shop => {
        const li = document.createElement("li");

        li.innerText = `shopname: ${shop.shopname}\n
            region: ${shop.region}\n
            address: ${shop.address}\n
            openHour: ${shop.openHour}\n
            ratingsAverage: ${shop.ratingsAverage}\n
            ratingQuantity: ${shop.ratingQuantity}\n
            comments: ${shop.comments}\n
            `

        shopsEl.appendChild(li);
    });
}

function printProducts(products) {
    products.forEach(product => {
        const li = document.createElement("li");

        li.innerText = `name: ${product.name}\n
            brand: ${product.region}\n
            price: ${product.price}\n
            category: ${product.category}\n
            description: ${product.description}\n
            ratingsAverage: ${product.ratingsAverage}\n
            ratingQuantity: ${product.ratingQuantity}\n
            comments: ${product.comments}\n
            `

        productsEl.appendChild(li);
    });
}

function printQuestions(questions) {
    questions.forEach(question => {
        const li = document.createElement("li");
        li.innerText = `Question: ${question.question}\nAnswer: ${question.answer}\n`
        questionsEl.appendChild(li);
    })
}

let shopsEl = document.querySelector(".shops");
let productsEl = document.querySelector(".products");
let questionsEl = document.querySelector(".questions");
let inputShops = document.querySelector(".input-shops");
let inputProducts = document.querySelector(".input-products");
let inputMinPrice = document.querySelector(".input-minPrice");
let inputMaxPrice = document.querySelector(".input-maxPrice");
let btnSearchShops = document.querySelector(".btn-search-shops");
let btnSearchProducts = document.querySelector(".btn-search-products");
let selectRegion = document.querySelector(".region");

// http://localhost:8000/api/shops

let searchShops = async function () {
    console.log(selectRegion.value);
    let result = await getJSON("http://localhost:8000/api/shops");
    let shopsObj = result.data.shops;
    let input = inputShops.value.trim().toLowerCase();
    let searchResult;
    console.log(input);

    if (selectRegion.value == "中環") {
        searchResult = shopsObj.filter((el) => {
            return el.region.includes("中環");
        });
    } else if (selectRegion.value == "上環") {
        searchResult = shopsObj.filter((el) => {
            return el.region.includes("上環");
        });
    } else {
        searchResult = shopsObj;
    }

    searchResult = searchResult.filter((el) => {
        return el.shopname.toLowerCase().includes(input) || el.region.toLowerCase().includes(input) || el.address.toLowerCase().includes(input);
    });

    if (input == "" || searchResult.length == 0) {
        const message = document.createElement("li");
        message.textContent = "Sorry, no results for your search."
        shopsEl.appendChild(message);
    } else {
        printShops(searchResult);
    }

}

let searchProducts = async function () {
    let result = await getJSON("http://localhost:8000/api/products");
    let productsObj = result.data.products;
    let input = inputProducts.value.trim();
    let minPrice = Number(inputMinPrice.value);
    let maxPrice = Number(inputMaxPrice.value);
    console.log(minPrice, maxPrice);


    let searchResult = productsObj.filter(el => {
        return el.name.toLowerCase().includes(input) || el.brand.toLowerCase().includes(input) || el.category.toLowerCase().includes(input) || el.description.toLowerCase().includes(input);
    });

    if (minPrice && maxPrice && (minPrice <= maxPrice)) {
        searchResult = searchResult.filter(el => {
            return el.price >= minPrice && el.price <= maxPrice;
        });
    } else if (minPrice && !maxPrice) {
        searchResult = searchResult.filter(el => {
            return el.price >= minPrice;
        });
    } else if (!minPrice && maxPrice) {
        searchResult = searchResult.filter(el => {
            return el.price <= maxPrice;
        });
    } else if (minPrice && maxPrice && (minPrice > maxPrice) || minPrice < 0 || maxPrice < 0) {
        const message = document.createElement("li");
        message.innerHTML = "<b>Please enter currect min price and max price.</b> "
        productsEl.appendChild(message);
    }

    if (input == "" || searchResult.length == 0) {
        const message = document.createElement("li");
        message.textContent = "Sorry, no results for your search."
        productsEl.appendChild(message);
    } else {
        printProducts(searchResult);
    }
}

let createQuestions = async function() {
    let result = await getJSON("http://localhost:8000/api/questions");
    let questionsObj = result.data.questions;
    console.log(questionsObj);
    printQuestions(questionsObj);
}
createQuestions();

btnSearchShops.addEventListener("click", () => {
    clearContainer("shops");
    searchShops();
});

btnSearchProducts.addEventListener("click", () => {
    clearContainer("products");
    searchProducts();
});



