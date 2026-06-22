/* ==========================================
   INTERACTIVE LOGIC - NOIBAI CONNECT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. STICKY HEADER
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. MOBILE MENU TOGGLE
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openMenu = () => mobileNavMenu.classList.add('open');
    const closeMenu = () => mobileNavMenu.classList.remove('open');

    if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMenu);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 3. ROUTE SWAP LOGIC
    const pickupSelect = document.getElementById('pickup');
    const dropoffSelect = document.getElementById('dropoff');
    const swapRouteBtn = document.getElementById('swap-route');

    if (swapRouteBtn && pickupSelect && dropoffSelect) {
        swapRouteBtn.addEventListener('click', () => {
            const tempVal = pickupSelect.value;
            pickupSelect.value = dropoffSelect.value;
            dropoffSelect.value = tempVal;
            
            // Highlight effect on swap
            pickupSelect.style.borderColor = 'var(--secondary)';
            dropoffSelect.style.borderColor = 'var(--secondary)';
            setTimeout(() => {
                pickupSelect.style.borderColor = '';
                dropoffSelect.style.borderColor = '';
            }, 300);
            
            updatePrice();
        });
    }

    // 4. PRICE ESTIMATION
    const serviceType = document.getElementById('service-type');
    const estimatedPriceEl = document.getElementById('estimated-price');

    // Price configuration
    // to_airport: Hanoi -> Noi Bai
    // from_airport: Noi Bai -> Hanoi
    const PRICING = {
        to_airport: {
            'sedan-4': 180000,
            'sedan-5': 200000,
            'suv-7': 250000,
            'transit-16': 450000
        },
        from_airport: {
            'sedan-4': 230000,
            'sedan-5': 250000,
            'suv-7': 300000,
            'transit-16': 500000
        }
    };

    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    }

    function updatePrice() {
        if (!pickupSelect || !serviceType || !estimatedPriceEl) return;
        
        const pickup = pickupSelect.value;
        const type = serviceType.value;
        
        // Determine direction
        const direction = (pickup === 'Hà Nội') ? 'to_airport' : 'from_airport';
        const price = PRICING[direction][type] || 0;

        estimatedPriceEl.textContent = formatCurrency(price);
    }

    if (pickupSelect) pickupSelect.addEventListener('change', updatePrice);
    if (dropoffSelect) dropoffSelect.addEventListener('change', updatePrice);
    if (serviceType) serviceType.addEventListener('change', updatePrice);

    // Set default date to today or tomorrow
    const travelDateInput = document.getElementById('travel-date');
    if (travelDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format YYYY-MM-DD
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        
        travelDateInput.value = `${yyyy}-${mm}-${dd}`;
        travelDateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    // Set default time to current hour + 2
    const travelTimeInput = document.getElementById('travel-time');
    if (travelTimeInput) {
        const today = new Date();
        today.setHours(today.getHours() + 2);
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = '00';
        travelTimeInput.value = `${hours}:${minutes}`;
    }

    // Initialize default price estimation
    updatePrice();

    // 5. PRICING CARDS - CHOOSE VEHICLE
    const pricingSelectBtns = document.querySelectorAll('.btn-pricing-select');
    pricingSelectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = btn.getAttribute('data-type');
            if (serviceType && type) {
                serviceType.value = type;
                updatePrice();
            }
        });
    });

    // 6. BOOKING SUBMISSION & MODAL
    const bookingForm = document.getElementById('booking-form');
    const confirmModal = document.getElementById('confirm-modal');
    const modalClose = document.getElementById('modal-close');
    const btnModalDone = document.getElementById('btn-modal-done');

    // Modal details element references
    const detailRoute = document.getElementById('modal-detail-route');
    const detailType = document.getElementById('modal-detail-type');
    const detailTime = document.getElementById('modal-detail-time');
    const detailFlight = document.getElementById('modal-detail-flight');
    const detailName = document.getElementById('modal-detail-name');
    const detailPrice = document.getElementById('modal-detail-price');

    if (bookingForm && confirmModal) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const pickup = pickupSelect.value;
            const dropoff = dropoffSelect.value;
            const typeVal = serviceType.value;
            const flightVal = document.getElementById('flight-number').value.trim() || '-';
            const dateVal = travelDateInput ? travelDateInput.value : '';
            const timeVal = travelTimeInput ? travelTimeInput.value : '';
            const nameVal = document.getElementById('passenger-name').value;
            const phoneVal = document.getElementById('passenger-phone').value;

            // Format Type Text
            let typeText = 'Xe 4 chỗ (Nhỏ gọn)';
            if (typeVal === 'sedan-5') typeText = 'Xe 5 chỗ (Cốp rộng)';
            if (typeVal === 'suv-7') typeText = 'Xe 7 chỗ (SUV rộng)';
            if (typeVal === 'transit-16') typeText = 'Xe 16 chỗ (Transit)';

            // Format date: DD/MM/YYYY
            let formattedDate = dateVal;
            if (dateVal) {
                const parts = dateVal.split('-');
                if (parts.length === 3) {
                    formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                }
            }

            // Set modal values
            if (detailRoute) detailRoute.textContent = `${pickup} ➔ ${dropoff}`;
            if (detailType) detailType.textContent = typeText;
            if (detailTime) detailTime.textContent = `${formattedDate} lúc ${timeVal}`;
            if (detailFlight) detailFlight.textContent = flightVal;
            if (detailName) detailName.textContent = `${nameVal} (${phoneVal})`;
            
            // Calculate final price
            const direction = (pickup === 'Hà Nội') ? 'to_airport' : 'from_airport';
            const price = PRICING[direction][typeVal] || 0;
            if (detailPrice) detailPrice.textContent = formatCurrency(price);

            // ========================================================
            // GOOGLE SHEET INTEGRATION (OPTIONAL)
            // ========================================================
            const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxY1TUbjeaGPutbaTkK5G_a_OSqXNmVHG39De_M3zZx3sshVPuQJNIe8K5f5uFZWnmd/exec"; // DÁN URL WEB APP CỦA GOOGLE APPS SCRIPT VÀO ĐÂY

            if (GOOGLE_SHEET_WEB_APP_URL) {
                const urlEncodedData = new URLSearchParams();
                urlEncodedData.append('date', formattedDate);
                urlEncodedData.append('time', timeVal);
                urlEncodedData.append('pickup', pickup);
                urlEncodedData.append('dropoff', dropoff);
                urlEncodedData.append('type', typeText);
                urlEncodedData.append('flight', flightVal);
                urlEncodedData.append('name', nameVal);
                urlEncodedData.append('phone', phoneVal);
                urlEncodedData.append('price', formatCurrency(price));

                fetch(GOOGLE_SHEET_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: urlEncodedData.toString()
                })
                .then(() => console.log('Booking sent to Google Sheet!'))
                .catch(err => console.error('Error sending to Google Sheet:', err));
            }

            // Open Modal
            confirmModal.classList.add('open');
        });
    }

    // Modal Close triggers
    const closeModalFunc = () => {
        if (confirmModal) {
            confirmModal.classList.remove('open');
            if (bookingForm) bookingForm.reset();
            updatePrice();
        }
    };

    if (modalClose) modalClose.addEventListener('click', closeModalFunc);
    if (btnModalDone) btnModalDone.addEventListener('click', closeModalFunc);

    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                closeModalFunc();
            }
        });
    }

    // 7. ACTIVE NAV LINK ON SCROLL
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

});
