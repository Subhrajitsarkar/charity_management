// public/js/donation.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        window.location.href = '/login';
        return;
    }

    // If a saved query exists, re-populate and run the search.
    const savedQuery = localStorage.getItem('donationSearchQuery');
    if (savedQuery) {
        document.getElementById('searchQuery').value = savedQuery;
        searchCharities();
    }
});

// Clear donationSearchQuery from localStorage on navigation away (if not a reload)
// window.addEventListener('beforeunload', function () {
//     const navEntries = performance.getEntriesByType("navigation");
//     if (navEntries.length && navEntries[0].type !== "reload") {
//         localStorage.removeItem("donationSearchQuery");
//     }
// });

async function searchCharities() {
    const query = document.getElementById('searchQuery').value.trim();
    localStorage.setItem('donationSearchQuery', query);
    const listDiv = document.getElementById('charitiesList');

    if (!query) {
        listDiv.innerHTML = '';
        return;
    }
    listDiv.innerHTML = 'Searching...';
    try {
        const res = await axios.get(`http://localhost:4000/donations/search?q=${query}`);
        const charities = res.data;
        if (!charities.length) {
            listDiv.innerHTML = '<p>No charities found.</p>';
            return;
        }
        let html = '<ul class="donation-results-list">';
        charities.forEach(c => {
            html += `
          <li class="donation-result-item">
            <div class="donation-result-inner">
              <span><strong>Name:</strong> ${c.name}</span>
              <span><strong>Location:</strong> ${c.location || 'N/A'}</span>
              <span><strong>Category:</strong> ${c.category || 'N/A'}</span>
              <span><strong>Mission:</strong> ${c.mission || 'N/A'}</span>
              <input type="number" id="amount-${c.id}" placeholder="Enter amount" class="donation-amount-input">
              <button onclick="initiateDonation(${c.id})">Donate</button>
            </div>
          </li>
        `;
        });
        html += '</ul>';
        listDiv.innerHTML = html;
    } catch (err) {
        console.error('Error searching charities:', err);
        alert('Error searching charities.');
    }
}

async function initiateDonation(charityId) {
    const token = localStorage.getItem('token');

    const amountInput = document.getElementById(`amount-${charityId}`);
    if (!amountInput || !amountInput.value) {
        alert('Please enter a donation amount.');
        return;
    }
    const amount = amountInput.value;
    try {
        const res = await axios.post(
            'http://localhost:4000/donations/create-order',
            { charityId, amount },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const { order, key_id } = res.data;
        const currentOrderId = order.id;
        const options = {
            key: key_id,
            amount: order.amount,
            currency: 'INR',
            name: 'Charity Donation',
            description: 'Donation',
            order_id: currentOrderId,
            handler: async function (response) {
                await axios.post(
                    'http://localhost:3000/donations/update-transaction',
                    {
                        order_id: currentOrderId,
                        payment_id: response.razorpay_payment_id,
                        status: 'SUCCESS'
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Donation successful!');
                amountInput.value = '';
            },
            theme: { color: '#3399cc' }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', async function (resp) {
            console.error('Payment Failed:', resp);
            alert('Payment failed. Please try again.');
            try {
                await axios.post(
                    'http://localhost:4000/donations/update-transaction',
                    { order_id: currentOrderId, status: 'FAILED' },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) {
                console.error('Error updating donation status to FAILED:', err);
            }
        });
    } catch (err) {
        console.error('Error creating donation order:', err);
        alert(err.response?.data?.error || 'Error in donation process');
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
