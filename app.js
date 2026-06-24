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

    // ======================================
    // 3. TAB SWITCHING (Airport / Province)
    // ======================================
    const tabBtns = document.querySelectorAll('.booking-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            
            // Remove active from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activate clicked tab
            btn.classList.add('active');
            document.getElementById('content-' + target).classList.add('active');
        });
    });

    // 4. AIRPORT ROUTE SWAP LOGIC
    const pickupSelect = document.getElementById('pickup');
    const dropoffSelect = document.getElementById('dropoff');
    const swapRouteBtn = document.getElementById('swap-route');

    if (swapRouteBtn && pickupSelect && dropoffSelect) {
        swapRouteBtn.addEventListener('click', () => {
            const tempVal = pickupSelect.value;
            pickupSelect.value = dropoffSelect.value;
            dropoffSelect.value = tempVal;
            
            pickupSelect.style.borderColor = 'var(--secondary)';
            dropoffSelect.style.borderColor = 'var(--secondary)';
            setTimeout(() => {
                pickupSelect.style.borderColor = '';
                dropoffSelect.style.borderColor = '';
            }, 300);
            
            updatePrice();
        });
    }

    // 5. AIRPORT PRICE ESTIMATION
    const serviceType = document.getElementById('service-type');
    const estimatedPriceEl = document.getElementById('estimated-price');

    const AIRPORT_PRICING = {
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
        const direction = (pickup === 'Hà Nội') ? 'to_airport' : 'from_airport';
        const price = AIRPORT_PRICING[direction][type] || 0;
        estimatedPriceEl.textContent = formatCurrency(price);
    }

    if (pickupSelect) pickupSelect.addEventListener('change', updatePrice);
    if (dropoffSelect) dropoffSelect.addEventListener('change', updatePrice);
    if (serviceType) serviceType.addEventListener('change', updatePrice);

    // 6. PROVINCE PRICE ESTIMATION
    const provinceToSelect = document.getElementById('province-to');
    const provinceCarType = document.getElementById('province-car-type');
    const provinceEstimatedPrice = document.getElementById('province-estimated-price');

    // Province pricing rules:
    // sedan-4 / sedan-5 : giá gốc (data-price)
    // suv-7             : giá gốc + 100.000đ
    // transit-16        : km x 11.000đ
    function calcProvincePrice(basePrice, km, carType) {
        if (!basePrice) return 0;
        if (carType === 'transit-16') return km * 11000;
        if (carType === 'suv-7') return basePrice + 100000;
        return basePrice; // sedan-4 và sedan-5 cùng giá gốc
    }

    function updateProvincePrice() {
        if (!provinceToSelect || !provinceCarType || !provinceEstimatedPrice) return;
        const selectedOption = provinceToSelect.options[provinceToSelect.selectedIndex];
        const basePrice = parseInt(selectedOption.getAttribute('data-price') || 0);
        const km = parseInt(selectedOption.getAttribute('data-km') || 0);
        
        if (!basePrice) {
            provinceEstimatedPrice.textContent = '-- Chọn tỉnh --';
            return;
        }

        const finalPrice = calcProvincePrice(basePrice, km, provinceCarType.value);
        provinceEstimatedPrice.textContent = formatCurrency(finalPrice);
    }

    if (provinceToSelect) provinceToSelect.addEventListener('change', updateProvincePrice);
    if (provinceCarType) provinceCarType.addEventListener('change', updateProvincePrice);

    // 7. SET DEFAULT DATES & TIMES
    function setDefaultDateTime(dateId, timeId) {
        const dateInput = document.getElementById(dateId);
        const timeInput = document.getElementById(timeId);
        
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const yyyy = tomorrow.getFullYear();
            const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const dd = String(tomorrow.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
            dateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
        
        if (timeInput) {
            const now = new Date();
            now.setHours(now.getHours() + 2);
            timeInput.value = `${String(now.getHours()).padStart(2, '0')}:00`;
        }
    }

    setDefaultDateTime('travel-date', 'travel-time');
    setDefaultDateTime('province-date', 'province-time');
    updatePrice();

    // 8. PRICING CARDS - CHOOSE VEHICLE (Airport)
    const pricingSelectBtns = document.querySelectorAll('.btn-pricing-select');
    pricingSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            if (serviceType && type) {
                serviceType.value = type;
                updatePrice();
                // Scroll to form
                document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 9. PROVINCE QUICK BOOK BUTTONS (Route cards & table)
    const provinceBookBtns = document.querySelectorAll('.province-book-btn');
    provinceBookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const province = btn.getAttribute('data-province');
            
            // Switch to province tab
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById('tab-province').classList.add('active');
            document.getElementById('content-province').classList.add('active');
            
            // Set province dropdown
            if (provinceToSelect && province) {
                for (let i = 0; i < provinceToSelect.options.length; i++) {
                    if (provinceToSelect.options[i].value === province) {
                        provinceToSelect.selectedIndex = i;
                        break;
                    }
                }
                updateProvincePrice();
            }
            
            // Scroll to booking form
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 10. AIRPORT BOOKING SUBMISSION & MODAL
    const bookingForm = document.getElementById('booking-form');
    const confirmModal = document.getElementById('confirm-modal');
    const modalClose = document.getElementById('modal-close');
    const btnModalDone = document.getElementById('btn-modal-done');

    const detailRoute = document.getElementById('modal-detail-route');
    const detailType = document.getElementById('modal-detail-type');
    const detailTime = document.getElementById('modal-detail-time');
    const detailFlight = document.getElementById('modal-detail-flight');
    const detailName = document.getElementById('modal-detail-name');
    const detailPrice = document.getElementById('modal-detail-price');
    const travelDateInput = document.getElementById('travel-date');
    const travelTimeInput = document.getElementById('travel-time');

    if (bookingForm && confirmModal) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const pickup = pickupSelect.value;
            const dropoff = dropoffSelect.value;
            const typeVal = serviceType.value;
            const flightVal = document.getElementById('flight-number').value.trim() || '-';
            const dateVal = travelDateInput ? travelDateInput.value : '';
            const timeVal = travelTimeInput ? travelTimeInput.value : '';
            const nameVal = document.getElementById('passenger-name').value;
            const phoneVal = document.getElementById('passenger-phone').value;

            let typeText = 'Xe 4 chỗ (Nhỏ gọn)';
            if (typeVal === 'sedan-5') typeText = 'Xe 5 chỗ (Cốp rộng)';
            if (typeVal === 'suv-7') typeText = 'Xe 7 chỗ (SUV rộng)';
            if (typeVal === 'transit-16') typeText = 'Xe 16 chỗ (Transit)';

            let formattedDate = dateVal;
            if (dateVal) {
                const parts = dateVal.split('-');
                if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }

            if (detailRoute) detailRoute.textContent = `${pickup} ➔ ${dropoff}`;
            if (detailType) detailType.textContent = typeText;
            if (detailTime) detailTime.textContent = `${formattedDate} lúc ${timeVal}`;
            if (detailFlight) detailFlight.textContent = flightVal;
            if (detailName) detailName.textContent = `${nameVal} (${phoneVal})`;
            
            const direction = (pickup === 'Hà Nội') ? 'to_airport' : 'from_airport';
            const price = AIRPORT_PRICING[direction][typeVal] || 0;
            if (detailPrice) detailPrice.textContent = formatCurrency(price);

            // Google Sheet Integration
            const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwtL-UFLn0Oy4ZC0Vg6f6iJjGgHWhheLI74a3CZetwdTN92GQldGxBN7VM4SQ9ZODM7/exec";

            if (GOOGLE_SHEET_WEB_APP_URL) {
                const urlEncodedData = new URLSearchParams();
                urlEncodedData.append('service_type', 'Xe Sân Bay');
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
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: urlEncodedData.toString()
                })
                .then(() => console.log('Airport booking sent!'))
                .catch(err => console.error('Error:', err));
            }

            confirmModal.classList.add('open');
        });
    }

    // 11. PROVINCE BOOKING SUBMISSION
    const provinceForm = document.getElementById('province-form');

    if (provinceForm && confirmModal) {
        provinceForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const provinceTo = provinceToSelect ? provinceToSelect.value : '';
            const carType = provinceCarType ? provinceCarType.value : 'sedan-4';
            const dateVal = document.getElementById('province-date').value;
            const timeVal = document.getElementById('province-time').value;
            const noteVal = document.getElementById('province-note').value.trim() || '-';
            const nameVal = document.getElementById('province-name').value;
            const phoneVal = document.getElementById('province-phone').value;

            let typeText = 'Xe 4 chỗ (Nhỏ gọn)';
            if (carType === 'sedan-5') typeText = 'Xe 5 chỗ (Cốp rộng)';
            if (carType === 'suv-7') typeText = 'Xe 7 chỗ (SUV rộng)';
            if (carType === 'transit-16') typeText = 'Xe 16 chỗ (Transit)';

            let formattedDate = dateVal;
            if (dateVal) {
                const parts = dateVal.split('-');
                if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }

            const selectedOption = provinceToSelect ? provinceToSelect.options[provinceToSelect.selectedIndex] : null;
            const basePrice = selectedOption ? parseInt(selectedOption.getAttribute('data-price') || 0) : 0;
            const km = selectedOption ? parseInt(selectedOption.getAttribute('data-km') || 0) : 0;
            const finalPrice = calcProvincePrice(basePrice, km, carType);

            if (detailRoute) detailRoute.textContent = `Hà Nội ➔ ${provinceTo}`;
            if (detailType) detailType.textContent = typeText;
            if (detailTime) detailTime.textContent = `${formattedDate} lúc ${timeVal}`;
            if (detailFlight) detailFlight.textContent = noteVal;
            if (detailName) detailName.textContent = `${nameVal} (${phoneVal})`;
            if (detailPrice) detailPrice.textContent = formatCurrency(finalPrice);

            // Google Sheet Integration
            const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwtL-UFLn0Oy4ZC0Vg6f6iJjGgHWhheLI74a3CZetwdTN92GQldGxBN7VM4SQ9ZODM7/exec";

            if (GOOGLE_SHEET_WEB_APP_URL) {
                const urlEncodedData = new URLSearchParams();
                urlEncodedData.append('service_type', 'Xe Liên Tỉnh');
                urlEncodedData.append('date', formattedDate);
                urlEncodedData.append('time', timeVal);
                urlEncodedData.append('pickup', 'Hà Nội');
                urlEncodedData.append('dropoff', provinceTo);
                urlEncodedData.append('type', typeText);
                urlEncodedData.append('flight', noteVal);
                urlEncodedData.append('name', nameVal);
                urlEncodedData.append('phone', phoneVal);
                urlEncodedData.append('price', formatCurrency(finalPrice));

                fetch(GOOGLE_SHEET_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: urlEncodedData.toString()
                })
                .then(() => console.log('Province booking sent!'))
                .catch(err => console.error('Error:', err));
            }

            confirmModal.classList.add('open');
        });
    }

    // Modal Close
    const closeModalFunc = () => {
        if (confirmModal) {
            confirmModal.classList.remove('open');
            if (bookingForm) bookingForm.reset();
            if (provinceForm) provinceForm.reset();
            updatePrice();
            if (provinceEstimatedPrice) provinceEstimatedPrice.textContent = '-- Chọn tỉnh --';
        }
    };

    if (modalClose) modalClose.addEventListener('click', closeModalFunc);
    if (btnModalDone) btnModalDone.addEventListener('click', () => {
        closeModalFunc();
        // Mobile: gọi điện thẳng | Desktop: mở Zalo chat
        const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = 'tel:0355146637';
        } else {
            window.open('https://zalo.me/0355146637', '_blank');
        }
    });

    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) closeModalFunc();
        });
    }

    // 12. ACTIVE NAV LINK ON SCROLL
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
