const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartModal = document.getElementById("cart-modal");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("adress");
const addressWarn = document.getElementById("adress-warn");

let cart = [];
//abrir e fechar o modal do carrinho
if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", function () {
        cartModal.classList.remove("hidden");
        updateCartCounter
    });
}

if (closeModalBtn && cartModal) {
    closeModalBtn.addEventListener("click", function () {
        cartModal.classList.add("hidden");
    });
}

// Fechar modal ao clicar fora do conteúdo
if (cartModal) {
    cartModal.addEventListener("click", function (e) {
        if (e.target === cartModal) {
            cartModal.classList.add("hidden");
        }
    });
}
closeModalBtn.addEventListener("click", function () {
    cartModal.classList.add("hidden");
}); 

menu.addEventListener("click", function (e) {
    let parentButton = e.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    console.log(`Adicionando ao carrinho: ${name} - R$${price.toFixed(2)}`);
    addToCart(name, price);
    //adcionar no carrinho
    }   
});

//função adicionar no carrinho
function   addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    //se o item ja existir no carrinho, só aumenta a quantidade
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
        name,
        price,
        quantity: 1
    });
    }
    
    updateCartCounter();
     
}


//atualizar o contador do carrinho
function updateCartCounter() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartTotal.textContent = "R$ 0,00";
        cartCounter.innerHTML = "0";
        return;
    }

    cart.forEach(item => {
        const cartItemElements=document.createElement   ("div");
        cartItemElements.classList.add("flex", "justify-between", "mb-6", "flex-col");
        cartItemElements.innerHTML = `
        <div class="flex items-center justify-between">
            <div> 
            <p class="font-bold">${item.name}</p>
            <p>Quantidade: ${item.quantity}</p>
            <p class="font-medium" mt-2 >Preço: R$${(item.price * item.quantity).toFixed(2)}</p>
            </div> 
            <button class="remove-from-cart-btn" data-name="${item.name}">
             Remover
            </button>
            </div>
        `;
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElements);
    });
    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho
function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        if (item.quantity > 1) {
            item.quantity -= 1;
       updateCartCounter();
       return;
    }
        cart.splice(itemIndex, 1);
        updateCartCounter();
    }
}
// Event listener para o botão de remover itens do carrinho
cartItemsContainer.addEventListener("click", function(e) {
    const btn = e.target.closest(".remove-from-cart-btn");
    if (btn) {
        const name = btn.getAttribute("data-name");
        removeFromCart(name);
        console.log(name);
    }
})

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});
//mensagem se enviar sem endereço
checkoutBtn.addEventListener("click", function () { 
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops! o restaurante está fechado. Nosso horário de funcionamento é das 10h às 22h.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            }
        }).showToast();
        return;
    }

    if (cart.length === 0)return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.remove("border-green-500", "border-blue-500", "border-gray-300", "border-red-500");
        addressInput.classList.add("border-2", "border-red-500", "!border-red-500");
        addressInput.focus();
        return;
    } else {
        addressWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-500", "!border-red-500");
        addressInput.classList.add("border-green-500");
    }

    // Enviar pedido via WhatsApp
    if (cart.length > 0 && addressInput.value !== "") {
        const cartItems = cart.map(item => {
            return `${item.name} Quantidade: ${item.quantity} preço: R$${(item.price * item.quantity).toFixed(2)}`;
        }).join(" | ");
        const phone = "5511983860594";
        const message = encodeURIComponent(cartItems + " Endereço: " + addressInput.value);
        window.open(`https://wa.me/${phone}?text=${message}`,"_blank");
        // Limpar carrinho após envio
        cart.length = 0;
        updateCartCounter();
    }
});

//função para verificar se o restaurante está aberto
function checkRestaurantOpen() {
    const data = new Date();
    const hora =    data.getHours();
    return hora >= 10&& hora < 22;
    //true restaurante aberto

}

const spanItem =  document.getElementById("date-span");
const isOpen = checkRestaurantOpen();
if (isOpen) {
   spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}