// ========== APP STATE ==========

const STORAGE_KEY = 'smartservice_app_state';

const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
  loggedIn: false,
  user: null
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}


// ========== SHOW MESSAGE ==========

function showMsg(id, message, success = true) {

  const el = document.getElementById(id);

  if (!el) return;

  el.textContent = message;

  el.classList.remove(
    'hidden',
    'bg-success',
    'bg-danger',
    'text-success',
    'text-danger'
  );

  el.classList.add(
    'block',
    success ? 'bg-success/10' : 'bg-danger/10'
  );

  el.style.display = 'block';

}


// ========== NAVIGATION ==========

function navigate(page) {

  const routes = {
    home: 'index.html',
    login: 'login.html',
    register: 'register.html',
    dashboard: 'dashboard.html',
    services: 'services.html',
    contact: 'contact.html',
    profile: 'profile.html',
    booking: 'booking.html',
    detail: 'service-details.html'
  };

  if (routes[page]) {
    window.location.href = routes[page];
  }

}


// ========== SERVICES DATA ==========

const SERVICES = [

  { id: 1, name: 'Plumbing', category: 'home', price: '$50-150', rating: 4.8 },

  { id: 2, name: 'Electrical', category: 'home', price: '$75-200', rating: 4.9 },

  { id: 3, name: 'AC Repair', category: 'home', price: '$100-250', rating: 4.7 },

  { id: 4, name: 'Carpentry', category: 'home', price: '$60-180', rating: 4.6 },

  { id: 5, name: 'Web Development', category: 'tech', price: '$500-2000', rating: 4.9 },

  { id: 6, name: 'Mobile App Dev', category: 'tech', price: '$800-3000', rating: 4.8 },

  { id: 7, name: 'IT Support', category: 'tech', price: '$40-100', rating: 4.7 },

  { id: 8, name: 'Hair Cut', category: 'beauty', price: '$10-30', rating: 4.8 },

  { id: 9, name: 'Massage', category: 'beauty', price: '$30-80', rating: 4.9 },

  { id: 10, name: 'Spa Treatment', category: 'beauty', price: '$50-150', rating: 4.8 },

  { id: 11, name: 'Car Wash', category: 'auto', price: '$15-50', rating: 4.7 },

  { id: 12, name: 'Oil Change', category: 'auto', price: '$20-60', rating: 4.8 }

];

function createServiceCard(service) {
  return `
    <div class="bg-card rounded-3xl p-6 border border-border hover:border-primary transition">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm uppercase tracking-[.2em] text-primary font-semibold">${service.category}</span>
        <span class="text-sm text-muted">${service.rating} ★</span>
      </div>
      <h3 class="text-xl font-semibold mb-3">${service.name}</h3>
      <p class="text-muted mb-6">Starting from <span class="text-white font-semibold">${service.price}</span></p>
      <div class="flex gap-3 flex-wrap">
        <button onclick="navigateToDetail(${service.id})" class="w-full sm:w-auto px-4 py-3 bg-card hover:bg-card-hover border border-border text-white rounded-2xl text-sm font-semibold transition">View Details</button>
        <button onclick="navigateToBooking(${service.id})" class="w-full sm:w-auto px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl text-sm font-semibold transition">Book Now</button>
      </div>
    </div>
  `;
}

function renderHomeServices() {
  const homeContainer = document.getElementById('home-services');

  if (!homeContainer) return;

  const featured = SERVICES.slice(0, 4);
  homeContainer.innerHTML = featured.map(createServiceCard).join('');
}

function renderServicesGrid(services = SERVICES) {
  const servicesGrid = document.getElementById('services-grid');
  const noResults = document.getElementById('no-results');

  if (!servicesGrid) return;

  if (services.length === 0) {
    servicesGrid.innerHTML = '';
    if (noResults) {
      noResults.classList.remove('hidden');
    }
    return;
  }

  if (noResults) {
    noResults.classList.add('hidden');
  }

  servicesGrid.innerHTML = services.map(createServiceCard).join('');
}

function filterServices() {
  const searchInput = document.getElementById('service-search');
  const categorySelect = document.getElementById('service-filter');

  if (!searchInput || !categorySelect) {
    return;
  }

  const query = searchInput.value.trim().toLowerCase();
  const filter = categorySelect.value;

  const filtered = SERVICES.filter(service => {
    const matchesText = service.name.toLowerCase().includes(query) || service.category.toLowerCase().includes(query);
    const matchesCategory = filter === 'all' || service.category === filter;
    return matchesText && matchesCategory;
  });

  renderServicesGrid(filtered);
}

function initServicesPage() {
  renderServicesGrid();

  const searchInput = document.getElementById('service-search');
  const categorySelect = document.getElementById('service-filter');

  if (searchInput) {
    searchInput.addEventListener('input', filterServices);
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', filterServices);
  }
}


// ========== LOGIN ==========

async function handleLogin(e) {

  e.preventDefault();

  const email = document.getElementById("login-email")?.value;

  const password = document.getElementById("login-password")?.value;

  try {

    const response = await fetch("https://smartservice-navy.vercel.app/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        password
      })

    });

    const data = await response.json();

    if (response.ok) {

      state.loggedIn = true;

      state.user = {
        name: data.user.name,
        email: data.user.email,
        phone: ''
      };

      saveState();

      showMsg('login-msg', 'Login successful!', true);

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);

    } else {

      showMsg('login-msg', data.message, false);

    }

  } catch (error) {

    console.log(error);

    showMsg(
      'login-msg',
      'Server error. Please try again.',
      false
    );

  }

}


// ========== REGISTER ==========

async function handleRegister(e) {

  e.preventDefault();

  const name = document.getElementById("reg-name")?.value;

  const email = document.getElementById("reg-email")?.value;

  const password = document.getElementById("reg-pass")?.value;

  const confirm = document.getElementById("reg-confirm")?.value;

  if (password !== confirm) {

    showMsg(
      'register-msg',
      'Passwords do not match.',
      false
    );

    return;

  }
  try {

    const response = await fetch(
      "https://smartservice-navy.vercel.app/register",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          password
        })

      }
    );

    const data = await response.text();

    if (response.ok) {

      state.loggedIn = true;

      state.user = {
        name,
        email,
        phone: ''
      };

      saveState();

      showMsg(
        'register-msg',
        'Registration successful!',
        true
      );

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);

    } else {

      showMsg('register-msg', data, false);

    }

  } catch (error) {

    console.log(error);

    showMsg(
      'register-msg',
      'Server error. Please try again.',
      false
    );

  }

}


// ========== BOOKING ==========

async function handleBooking(e) {

  e.preventDefault();

  if (!state.loggedIn || !state.user) {

    showMsg(
      'booking-msg',
      'Please login first.',
      false
    );

    return;

  }

  const booking_date =
    document.getElementById("booking-date")?.value;

  const booking_time =
    document.getElementById("booking-time")?.value;

  const serviceEl =
    document.getElementById("booking-service-info");

  const service =
    serviceEl?.dataset?.service || "General Service";

  const messageEl =
    document.querySelector("textarea");

  const message = messageEl?.value || "";

  try {

    const response = await fetch(
      "https://smartservice-navy.vercel.app/booking",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          user_email: state.user.email,

          service,

          booking_date,

          booking_time,

          message

        })

      }
    );

    const data = await response.text();

    if (response.ok) {

      showMsg(
        'booking-msg',
        'Booking confirmed!',
        true
      );

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);

    } else {

      showMsg('booking-msg', data, false);

    }

  } catch (error) {

    console.log(error);

    showMsg(
      'booking-msg',
      'Server error.',
      false
    );

  }

}


// ========== CONTACT ==========

async function handleContact(e) {

  e.preventDefault();

  const inputs =
    e.target.querySelectorAll('input, textarea');

  const name = inputs[0].value;

  const email = inputs[1].value;

  const message = inputs[2].value;

  try {

    const response = await fetch(
      "https://smartservice-navy.vercel.app/contact",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          message
        })

      }
    );

    const data = await response.text();

    if (response.ok) {

      showMsg(
        'contact-msg',
        'Message sent successfully!',
        true
      );

      e.target.reset();

    } else {

      showMsg('contact-msg', data, false);

    }

  } catch (error) {

    console.log(error);

    showMsg(
      'contact-msg',
      'Server error.',
      false
    );

  }

}



// ========== DASHBOARD ==========

async function loadDashboardData() {

  if (!state.loggedIn || !state.user) return;

  const greeting =
    document.getElementById('dash-greeting');

  if (greeting) {

    greeting.textContent =
      `Welcome back, ${state.user.name}! `;

  }

  try {

    const response = await fetch(
      `https://smartservice-navy.vercel.app/my-bookings?email=${state.user.email}`
    );

    const bookings = await response.json();

    // ===== TOTAL BOOKINGS =====
    const statTotal =
      document.getElementById('stat-total');

    if (statTotal) {
      statTotal.textContent = bookings.length;
    }

    // ===== UPCOMING BOOKINGS =====
    const upcomingBookings = bookings.filter(
      booking => booking.status && booking.status.toLowerCase() === "upcoming"
    );

    const statUpcoming =
      document.getElementById('stat-upcoming');

    if (statUpcoming) {
      statUpcoming.textContent = upcomingBookings.length;
    }

    // ===== COMPLETED BOOKINGS =====
    const completedBookings = bookings.filter(
      booking => booking.status && booking.status.toLowerCase() === "completed"
    );

    const statCompleted =
      document.getElementById('stat-completed');

    if (statCompleted) {
      statCompleted.textContent = completedBookings.length;
    }

  } catch (error) {

    console.log(error);

  }

}


// ========== MY BOOKINGS ==========

async function loadMyBookings() {

  if (!state.loggedIn || !state.user) return;

  try {

    const response = await fetch(
      `https://smartservice-navy.vercel.app/my-bookings?email=${state.user.email}`
    );

    const bookings = await response.json();

    const container =
      document.getElementById('all-bookings');

    if (!container) return;

    if (bookings.length === 0) {

      container.innerHTML =
        `<p class="text-muted p-4">No bookings yet.</p>`;

      return;

    }

    container.innerHTML = bookings.map(b => `

      <div class="bg-card p-4 rounded-xl border border-border mb-4">

        <h3 class="font-semibold">${b.service}</h3>

        <p class="text-sm text-muted">
          ${b.booking_date}
        </p>

        <p class="text-sm text-muted">
          ${b.booking_time}
        </p>

        <p class="text-sm mt-2">
          ${b.message || ''}
        </p>

        <p class="text-sm mt-2">
         Status:
           <span class="${b.status && b.status.toLowerCase() === 'completed' ? 'text-green-400' : 'text-yellow-400'}">
            ${b.status}
        </span>
       </p>
       ${
  b.status && b.status.toLowerCase() === "upcoming"
    ? `
    <button
      onclick="markCompleted(${b.id})"
      class="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm"
    >
      Mark Completed
    </button>
  `
    : `
    <p class="text-green-400 text-sm mt-3">
      Booking Completed
    </p>
  `
}

      </div>

    `).join('');

  } catch (error) {

    console.log(error);

  }

}


// ========== PROFILE ==========

function loadProfile() {

  if (!state.loggedIn || !state.user) {
    window.location.href = 'login.html';
    return;
  }

  const nameEl =
    document.getElementById('profile-name');

  const emailEl =
    document.getElementById('profile-email');

  if (nameEl) {
    nameEl.textContent = state.user.name;
  }

  if (emailEl) {
    emailEl.textContent = state.user.email;
  }

}


// ========== LOGOUT ==========

function handleLogout() {

  state.loggedIn = false;

  state.user = null;

  saveState();

  window.location.href = 'login.html';

}


// ========== SERVICE DETAILS ==========

function navigateToBooking(id) {

  const service =
    SERVICES.find(s => s.id === id);

  if (!service) return;

  sessionStorage.setItem(
    'selectedService',
    JSON.stringify(service)
  );

  navigate('booking');

}

function navigateToDetail(id) {
  const service =
    SERVICES.find(s => s.id === id);

  if (!service) return;

  sessionStorage.setItem(
    'selectedService',
    JSON.stringify(service)
  );

  navigate('detail');
}

function loadServiceDetails() {
  const detailContent = document.getElementById('detail-content');

  if (!detailContent) return;

  const service = JSON.parse(
    sessionStorage.getItem('selectedService') || 'null'
  );

  if (!service) {
    detailContent.innerHTML = `
      <div class="p-8 text-center">
        <p class="text-muted mb-4">No service selected.</p>
        <button onclick="navigate('services')" class="px-5 py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl text-sm font-semibold transition">Back to Services</button>
      </div>
    `;
    return;
  }

  detailContent.innerHTML = `
    <div class="p-10 lg:p-14">
      <div class="mb-8">
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[.2em] font-semibold">${service.category}</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">${service.name}</h1>
      <p class="text-muted mb-6">Rating: <span class="text-white font-semibold">${service.rating} ★</span> · Price: <span class="text-white font-semibold">${service.price}</span></p>
      <p class="text-muted mb-8">Experience professional ${service.name.toLowerCase()} with our trusted experts. We provide reliable service, fast response, and excellent customer support for every booking.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-card rounded-3xl p-6 border border-border">
          <h3 class="font-semibold mb-3">What’s included</h3>
          <ul class="space-y-2 text-sm text-muted">
            <li>Expert professionals</li>
            <li>Flexible scheduling</li>
            <li>Service guarantee</li>
          </ul>
        </div>
        <div class="bg-card rounded-3xl p-6 border border-border">
          <h3 class="font-semibold mb-3">Why choose this service</h3>
          <p class="text-sm text-muted">Our team delivers quality work with transparency and timely updates. Book with confidence and enjoy a smooth service experience.</p>
        </div>
      </div>
      <div class="mt-10 flex flex-col sm:flex-row gap-3">
        <button onclick="navigateToBooking(${service.id})" class="w-full sm:w-auto px-6 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl text-sm font-semibold transition">Book This Service</button>
        <button onclick="navigate('services')" class="w-full sm:w-auto px-6 py-4 bg-card hover:bg-card-hover border border-border text-white rounded-2xl text-sm font-semibold transition">Back to Services</button>
      </div>
    </div>
  `;
}


// ========== DASHBOARD TAB SWITCHING ==========

function showDashTab(tabName) {
  const overview = document.getElementById('dash-overview');
  const bookings = document.getElementById('dash-bookings');
  const tabs = document.querySelectorAll('.dash-tab');

  if (tabName === 'overview') {
    if (overview) overview.classList.remove('hidden');
    if (bookings) bookings.classList.add('hidden');
    tabs.forEach(tab => tab.classList.remove('active', 'bg-card-hover', 'text-white'));
    tabs[0].classList.add('active', 'bg-card-hover', 'text-white');
  } else if (tabName === 'bookings') {
    if (overview) overview.classList.add('hidden');
    if (bookings) bookings.classList.remove('hidden');
    tabs.forEach(tab => tab.classList.remove('active', 'bg-card-hover', 'text-white'));
    tabs[1].classList.add('active', 'bg-card-hover', 'text-white');
    loadMyBookings();
  }
}


// ========== PAGE INIT ==========

if (document.getElementById('dash-overview')) {
  loadDashboardData();
}

if (document.getElementById('all-bookings')) {
  loadMyBookings();
}

if (document.getElementById('page-profile')) {
  loadProfile();
}

if (document.getElementById('page-detail')) {
  loadServiceDetails();
}


// ========== MOBILE MENU ==========

document.addEventListener('DOMContentLoaded', () => {

  const mobileToggle =
    document.getElementById('mobile-toggle');

  const mobileMenu =
    document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {

    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

  }

  renderHomeServices();
  initServicesPage();

});
async function markCompleted(id) {

  try {

    const response = await fetch(
      `https://smartservice-navy.vercel.app/update-booking-status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "completed"
        })
      }
    );

    const data = await response.text();

    alert(data);

    loadMyBookings();
    loadDashboardData();

  } catch (error) {

    console.log(error);

  }

}