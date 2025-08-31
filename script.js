document.addEventListener('DOMContentLoaded', () => {
    // --- Admin Login Redirect Logic ---
    let clickCount = 0;
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
        logoElement.addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                window.location.href = 'admin-login.html';
            }
            setTimeout(() => { clickCount = 0; }, 1500);
        });
    }

    // --- Tab Switching Logic ---
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    let menuData = {};

    // --- Fetch and Render Menu Data ---
    async function loadMenu() {
        try {
            const response = await fetch('http://localhost:3000/menu-data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            menuData = await response.json();
            
            renderPizzas();
            renderExtras();
            renderDrinks();
        } catch (error) {
            console.error("Could not load menu data:", error);
            document.querySelector('.menu-container').innerHTML = '<h2>Could not load menu. Please try again later.</h2>';
        }
    }

    // --- Render Pizza Section ---
    function renderPizzas() {
        const container = document.querySelector('#pizza .menu-table tbody');
        container.innerHTML = '';
        menuData.pizzas.forEach(pizza => {
            const row = document.createElement('tr');
            row.className = 'pizza-row';
            row.dataset.pizza = pizza.id;
            row.innerHTML = `
                <td class="item-name">
                    <img src="${pizza.image}" alt="${pizza.name}" class="item-thumbnail">
                    <div class="item-details">
                        <div>${pizza.name}</div>
                        <div class="item-name-arabic">${pizza.name_arabic}</div>
                    </div>
                </td>
                <td class="price-col price-s">${menuData.currency}${pizza.prices.s}</td>
                <td class="price-col price-m">${menuData.currency}${pizza.prices.m}</td>
                <td class="price-col price-l">${menuData.currency}${pizza.prices.l}</td>
            `;

            const detailRow = document.createElement('tr');
            detailRow.className = 'detail-row';
            detailRow.dataset.pizza = pizza.id;
            detailRow.innerHTML = `
                <td colspan="4">
                    <div class="detail-content">
                        <div class="detail-grid">
                            <div class="detail-section">
                                <h4>Ingredients</h4>
                                <p>${pizza.ingredients}</p>
                            </div>
                            <div class="detail-section">
                                <h4>Description</h4>
                                <p>${pizza.description}</p>
                            </div>
                        </div>
                    </div>
                </td>
            `;
            
            container.appendChild(row);
            container.appendChild(detailRow);
        });

        // Re-add event listeners for the new pizza rows
        document.querySelectorAll('.pizza-row').forEach(row => {
            row.addEventListener('click', () => {
                const detailRow = document.querySelector(`.detail-row[data-pizza="${row.dataset.pizza}"]`);
                if (detailRow) {
                    detailRow.classList.toggle('active');
                }
            });
        });
    }

    // --- Render Extras Section ---
    function renderExtras() {
        const container = document.querySelector('#extras .menu-table tbody');
        container.innerHTML = '';
        menuData.extras.forEach(extra => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="item-name">
                    <img src="${extra.image}" alt="${extra.name}" class="item-thumbnail">
                    <div class="item-details">
                        <div>${extra.name || ''}</div>
                    </div>
                </td>
                <td class="price-col">${menuData.currency}${extra.price || ''}</td>
            `;
            container.appendChild(row);
        });
    }

    // --- Render Drinks Section ---
    function renderDrinks() {
        const container = document.querySelector('#drinks .menu-table tbody');
        container.innerHTML = '';
        menuData.drinks.forEach(drink => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="item-name">
                    <img src="${drink.image}" alt="${drink.name}" class="item-thumbnail">
                    <div class="item-details">
                        <div>${drink.name || ''}</div>
                    </div>
                </td>
                <td class="price-col">${menuData.currency}${drink.price || ''}</td>
            `;
            container.appendChild(row);
        });
    }

    // --- Initial Load ---
    loadMenu();
});
