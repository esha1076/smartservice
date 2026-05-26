// ===== LOAD ALL BOOKINGS =====

async function loadAllBookings() {

  try {

    const response = await fetch(
      "https://smartservice-navy.vercel.app/all-bookings"
    );

    const bookings = await response.json();

    const container =
      document.getElementById("admin-bookings");

    if (!container) return;

    if (bookings.length === 0) {

      container.innerHTML =
        "<p>No bookings found.</p>";

      return;

    }

    container.innerHTML = bookings.map(b => `

      <div class="bg-zinc-900 p-5 rounded-xl mb-4 border border-zinc-700">

        <h3 class="text-xl font-semibold mb-2">
          ${b.service}
        </h3>

        <p>User: ${b.user_email}</p>

        <p>Date: ${b.booking_date}</p>

        <p>Time: ${b.booking_time}</p>

        <p class="mt-2">
          Status:
          <span class="${
            (b.status || 'upcoming').toLowerCase() === 'completed'
              ? 'text-green-400'
              : 'text-yellow-400'
          }">
            ${b.status || 'upcoming'}
          </span>
        </p>

        ${
          (b.status || 'upcoming').toLowerCase() === 'upcoming'
            ? `
            <button
              onclick="markCompleted(${b.id})"
              class="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Mark Completed
            </button>
          `
            : `
            <p class="text-green-400 mt-4">
              Completed
            </p>
          `
        }

      </div>

    `).join("");

  } catch (error) {

    console.log(error);

  }

}


// ===== LOAD CONTACTS =====

async function loadContacts() {

  try {

    const response = await fetch(
      "https://smartservice-navy.vercel.app/all-contacts"
    );

const text = await response.text();

console.log("SERVER RESPONSE:");
console.log(text);

return;

    const container =
      document.getElementById("admin-contacts");

    if (!container) return;

    if (contacts.length === 0) {

      container.innerHTML =
        "<p>No contact messages found.</p>";

      return;

    }

    container.innerHTML = contacts.map(c => `

      <div class="bg-zinc-900 p-5 rounded-xl mb-4 border border-zinc-700">

        <h3 class="text-xl font-semibold mb-2">
          ${c.name}
        </h3>

        <p>Email: ${c.email}</p>

        <p class="mt-3">
          ${c.message}
        </p>

      </div>

    `).join("");

  } catch (error) {

    console.log(error);

  }

}


// ===== MARK COMPLETED =====

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

    loadAllBookings();

  } catch (error) {

    console.log(error);

  }

}


// ===== PAGE LOAD =====

loadAllBookings();

loadContacts();