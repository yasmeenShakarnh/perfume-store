let cart = [];

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.style.display = 'block';
    }
}

function showCategory(category) {
    $('#products').hide();
    $('#category-title').text(category === 'male' ? "Men's Perfumes" : "Women's Perfumes");

    $('#male-video').hide();
    $('#female-video').hide();

    if (category === 'male') {
        $('#male-video').show();
    } else if (category === 'female') {
        $('#female-video').show();
    }

    const maleImages = [
        'm1.jpeg',
        'm2.jpeg',
        'm3.jpeg',
        'm4.jpeg',
        'm5.jpeg',
        'm6.jpeg',
        'm7.jpeg',
        'm8.jpeg',
        'm9.jpeg',
        'm10.jpeg'
    ];

    const femaleImages = [
        'w1.jpeg',
        'w2.jpeg',
        'w3.jpeg',
        'w4.jpeg',
        'w5.jpeg',
        'w6.jpeg',
        'w7.jpeg',
        'w8.jpeg',
        'w9.jpeg',
        'w10.jpeg'
    ];

    const malePrices = [
        55.99, 60.50, 45.75, 70.00, 50.25, 65.00, 80.00, 55.75, 63.50, 58.25
    ];

    const femalePrices = [
        45.99, 60.00, 50.25, 65.00, 58.75, 52.50, 70.00, 55.50, 63.75, 60.00
    ];

    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts', 
        type: 'GET',
        success: function (data) {
            
            const categoryPerfumes = data.slice(0, 16).map((item, index) => ({
                name: category === 'male' ? `Men's Perfume ${index + 1}` : `Women's Perfume ${index + 1}`,
                description: item.body.substring(0, 50) + "...",
                price: category === 'male' ? malePrices[index] : femalePrices[index],
                image: category === 'male' ? maleImages[index] : femaleImages[index]
            }));

            const limitedData = categoryPerfumes.slice(0, 10);

            var productList = $('#products-list');
            productList.empty();

            limitedData.forEach(function (item) {
                var productHTML = `
                    <div class="product-item" style="border: 1px solid #ccc; padding: 10px; margin: 10px; text-align: center; width: 200px; display: inline-block;">
                        <img src="${item.image}" alt="${item.name}" style="width: 150px; height: 150px; object-fit: cover;">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p><strong>Price:</strong> $${item.price}</p>
                        <button class="add-to-cart" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">Add to Cart</button>
                    </div>
                `;
                productList.append(productHTML);
            });

            $('#category-products').show();

            
            $('.add-to-cart').click(function() {
                const name = $(this).data('name');
                const price = $(this).data('price');
                const image = $(this).data('image');
                addToCart(name, price, image);
            });
        },
        error: function () {
            alert('Error loading products.');
        }
    });
}

function goBack(sectionId) {
    $('#' + sectionId).show();
    $('#category-products').hide();
}

function addToCart(name, price, image) {
    const product = { name, price, image };
    cart.push(product);
    alert(`${name} has been added to your cart.`);
    updateCart();
}

function updateCart() {
    let cartItems = $('#cart-items');
    cartItems.empty();

    if (cart.length === 0) {
        cartItems.append("<p>Your cart is empty.</p>");
    } else {
        let totalPrice = 0;
        cart.forEach(function (item, index) {
            cartItems.append(`
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <p>${item.name}</p>
                    <p>$${item.price}</p>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            `);
            totalPrice += parseFloat(item.price);
        });

        $('#total-price').text(totalPrice.toFixed(2));
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    alert(`Your total is $${total.toFixed(2)}. Thank you for your purchase!`);
    cart = [];
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const address = document.getElementById('address').value.trim();
    const age = document.getElementById('age').value.trim();
    const hobbies = document.getElementById('hobbies').value.trim();
    const country = document.getElementById('city').value;
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!firstName || !lastName || !mobile || !address || !age || !hobbies || !city || !email || !message) {
        document.getElementById('form-message').textContent = 'Please fill out all fields.';
        document.getElementById('form-message').style.color = 'red';
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        document.getElementById('form-message').textContent = 'Mobile must be 10 digits.';
        document.getElementById('form-message').style.color = 'red';
        return;
    }

    if (age <= 0) {
        document.getElementById('form-message').textContent = 'Age must be a positive number.';
        document.getElementById('form-message').style.color = 'red';
        return;
    }

    document.getElementById('form-message').textContent = 'Thank you for your inquiry!';
    document.getElementById('form-message').style.color = 'green';

    
    document.getElementById('contact-form').reset();
});


function searchProducts() {
    let searchQuery = document.getElementById('search-input').value.toLowerCase();
    
    let productList = document.querySelectorAll('#products-list .product-item');
    
    let productFound = false;

    productList.forEach(product => {
        product.style.display = 'none';
    });

    
    productList.forEach(product => {
        let productName = product.querySelector('h3').textContent.toLowerCase(); 
        if (productName.includes(searchQuery)) {
            product.style.display = 'block'; 
            productFound = true;
        }
    });

    
    if (!productFound) {
        alert('No products found matching your search.');
    }
}

function displayPerfumeImage(perfumeName) {
    
    let productItems = document.querySelectorAll('#products-list .product-item');
    
    productItems.forEach(product => {
        let productName = product.querySelector('h3').textContent.toLowerCase(); 
        if (productName.includes(perfumeName.toLowerCase())) {
            let productImage = product.querySelector('img'); 
            if (productImage) {
                productImage.style.display = 'block';
            }
        }
    });
}


