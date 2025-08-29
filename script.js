document.addEventListener('DOMContentLoaded', function () {
    // Logic for tab switching
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tabs and content
            tabs.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate the clicked tab and its corresponding content
            tab.classList.add('active');
            const targetContent = document.getElementById(tab.dataset.tab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Logic for expanding pizza details
    const pizzaRows = document.querySelectorAll('.pizza-row');
    pizzaRows.forEach(row => {
        row.addEventListener('click', () => {
            const pizzaName = row.dataset.pizza;
            const detailRow = document.querySelector(`.detail-row[data-pizza="${pizzaName}"]`);
            if (detailRow) {
                detailRow.classList.toggle('active');
            }
        });
    });

    // --- Admin Login Redirect Logic ---
    const logoElement = document.querySelector('.logo');
    let clickCount = 0;
    
    if (logoElement) {
        logoElement.addEventListener('click', () => {
            clickCount++;
            console.log(`Logo clicked ${clickCount} times.`); // For debugging
            
            // If 5 clicks are registered, go to the admin page
            if (clickCount >= 5) {
                console.log('Redirecting to admin-login.html'); // For debugging
                window.location.href = 'admin-login.html';
            }
            
            // Reset the count if the user pauses for more than 1.5 seconds
            setTimeout(() => {
                clickCount = 0;
            }, 1500);
        });
    } else {
        console.error('Logo element with class ".logo" was not found.');
    }
});