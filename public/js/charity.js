// public/js/charity.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Decode token to check if user is admin.
    try {
        const decoded = parseJwt(token);

        if (decoded && decoded.role && decoded.role.toLowerCase() === 'admin') {
            document.getElementById('adminLink').style.display = 'inline';
        }
    } catch (err) {
        console.error('Error decoding token:', err);
    }

    // Fetch and populate user profile data
    try {
        const profileResponse = await axios.get('http://localhost:4000/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { name, email, number } = profileResponse.data;
        document.getElementById('name').value = name;
        document.getElementById('email').value = email;
        document.getElementById('number').value = number;
    } catch (err) {
        console.error(err);
        alert('Error fetching profile. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }

    // Fetch donation history and show only successful donations
    try {
        const donationResponse = await axios.get('http://localhost:4000/user/donations', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const donationHistoryDiv = document.getElementById('donationHistory');
        const donations = donationResponse.data;

        // This line of code creates a new array containing only those donation objects from the original array where the paymentStatus property is exactly 'SUCCESS'.
        const successfulDonations = donations.filter(
            donation => donation.paymentStatus === 'SUCCESS');

        if (!successfulDonations.length) {
            donationHistoryDiv.innerHTML = '<p>No donation history available.</p>';
        } else {
            let html = '<ul class="donation-list">';
            successfulDonations.forEach(donation => {
                html += `
            <li class="donation-item">
              <div class="donation-item-inner">
                <span><strong>Date:</strong> ${donation.date}</span>
                <span><strong>Amount:</strong> ₹${donation.amount}</span>
<span><strong>Charity:</strong> ${donation.charityName || 'N/A'}</span>
                <span><strong>Status:</strong> ${donation.paymentStatus}</span>
              </div>
            </li>
          `;
            });
            html += '</ul>';
            donationHistoryDiv.innerHTML = html;
        }
    } catch (err) {
        console.error(err);
        alert('Error fetching donation history.');
    }

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    });
});

// Update profile on form submission using async/await and try/catch
async function updateProfile(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('number').value;

    try {
        const response = await axios.put('http://localhost:4000/user/profile',
            { name, email, number },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(response.data.message);
    } catch (err) {
        console.error(err);
        alert('Error updating profile.');
    }
}

// Helper: Decode JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}
