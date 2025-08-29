document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (localStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    // --- Logout Button ---
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('isAdmin');
        window.location.href = 'index.html';
    });

    // --- Tab Switching Logic ---
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // --- Modal Logic ---
    const modal = document.getElementById('edit-modal');
    const closeModalButton = document.querySelector('.close-button');
    closeModalButton.onclick = () => {
        modal.style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    let menuData = {};
    let currentItem = null;
    let currentCategory = '';

    // --- Fetch Menu Data ---
    async function loadMenuData() {
        try {
            const response = await fetch('menu-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            menuData = await response.json();
            renderAllSections();
            document.getElementById('currency-selector').value = menuData.currency || '$';
        } catch (error) {
            console.error("Could not load menu data:", error);
            alert("Error: Could not load menu data. Please check the console for details.");
        }
    }

    // --- Render Functions ---
    function renderAllSections() {
        renderItems('pizzas');
        renderItems('extras');
        renderItems('drinks');
    }

    function renderItems(category) {
        const container = document.getElementById(`${category}-list`);
        container.innerHTML = '';
        if (menuData[category]) {
            menuData[category].forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';
                
                let priceInfo = '';
                if (category === 'pizzas' && item.prices) {
                    priceInfo = `S: ${item.prices.s} | M: ${item.prices.m} | L: ${item.prices.l}`;
                } else {
                    priceInfo = `${item.price}`;
                }

                card.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                    <div class="price">${menuData.currency} ${priceInfo}</div>
                    <div class="actions">
                        <button class="edit-btn">Edit</button>
                    </div>
                `;
                card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(item, category));
                container.appendChild(card);
            });
        }
    }

    // --- Modal and Form Logic ---
    function openEditModal(item, category, isNew = false) {
        currentItem = item;
        currentCategory = category;
        modal.style.display = 'block';
        document.getElementById('modal-title').textContent = isNew ? `Add New ${category.slice(0, -1)}` : `Edit ${item.name}`;
        document.getElementById('delete-button').style.display = isNew ? 'none' : 'block';
        
        const form = document.getElementById('edit-form');
        form.innerHTML = createFormFields(item, category);
    }
    
    function createFormFields(item, category) {
        let fields = `
            <label for="name">Name:</label>
            <input type="text" id="name" value="${item.name || ''}" required>
            <label for="image">Image Path:</label>
            <input type="text" id="image" value="${item.image || ''}">
        `;

        if (category === 'pizzas') {
            fields += `
                <label for="name_arabic">Arabic Name:</label>
                <input type="text" id="name_arabic" value="${item.name_arabic || ''}">
                <label for="description">Description:</label>
                <textarea id="description">${item.description || ''}</textarea>
                <label for="ingredients">Ingredients:</label>
                <textarea id="ingredients">${item.ingredients || ''}</textarea>
                <label for="price_s">Price (S):</label>
                <input type="number" id="price_s" value="${item.prices ? item.prices.s : ''}" step="0.01">
                <label for="price_m">Price (M):</label>
                <input type="number" id="price_m" value="${item.prices ? item.prices.m : ''}" step="0.01">
                <label for="price_l">Price (L):</label>
                <input type="number" id="price_l" value="${item.prices ? item.prices.l : ''}" step="0.01">
            `;
        } else { // Extras and Drinks
            fields += `
                <label for="price">Price:</label>
                <input type="text" id="price" value="${item.price || ''}">
            `;
        }
        return fields;
    }
    
    // --- "Add New" Button Listeners ---
    document.querySelectorAll('.add-new-btn').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            const newItem = { id: `new-${Date.now()}` };
            openEditModal(newItem, category, true);
        });
    });

    // --- Save and Delete Logic ---
    document.getElementById('save-button').addEventListener('click', () => {
        const isNew = currentItem.id.startsWith('new-');
        
        // Collect data from form
        const updatedItem = { ...currentItem };
        updatedItem.name = document.getElementById('name').value;
        updatedItem.image = document.getElementById('image').value;

        if (currentCategory === 'pizzas') {
            updatedItem.name_arabic = document.getElementById('name_arabic').value;
            updatedItem.description = document.getElementById('description').value;
            updatedItem.ingredients = document.getElementById('ingredients').value;
            updatedItem.prices = {
                s: parseFloat(document.getElementById('price_s').value),
                m: parseFloat(document.getElementById('price_m').value),
                l: parseFloat(document.getElementById('price_l').value)
            };
        } else {
            updatedItem.price = document.getElementById('price').value;
        }

        if (isNew) {
            menuData[currentCategory].push(updatedItem);
        } else {
            const index = menuData[currentCategory].findIndex(i => i.id === currentItem.id);
            menuData[currentCategory][index] = updatedItem;
        }

        saveMenuData();
        modal.style.display = 'none';
        renderItems(currentCategory);
    });

    document.getElementById('delete-button').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete ${currentItem.name}?`)) {
            menuData[currentCategory] = menuData[currentCategory].filter(i => i.id !== currentItem.id);
            saveMenuData();
            modal.style.display = 'none';
            renderItems(currentCategory);
        }
    });
    
    // --- Save Data Function ---
    function saveMenuData() {
        menuData.currency = document.getElementById('currency-selector').value;
        console.log("Saving data (simulation):", JSON.stringify(menuData, null, 2));
        alert("Your changes have been prepared! In a real application, this would be saved to the server.");
        // In a real web server environment, you would use an API call here:
        // fetch('/api/save-menu', { method: 'POST', body: JSON.stringify(menuData), headers: {'Content-Type': 'application/json'}})
    }
    
    document.getElementById('currency-selector').addEventListener('change', saveMenuData);

    // Initial load
    loadMenuData();
});