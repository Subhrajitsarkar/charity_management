// public/js/donationHistory.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in.');
        window.location.href = '/login';
        return;
    }
    try {
        const res = await axios.get('http://localhost:4000/donations/history', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const historyDiv = document.getElementById('history');
        const donations = res.data;
        if (!donations.length) {
            historyDiv.innerHTML = '<p>No donation history found.</p>';
            return;
        }
        // Build a table without showing donation IDs
        let html = '<table border="1"><tr><th>Charity</th><th>Amount</th><th>Date</th><th>Status</th></tr>';
        donations.forEach(donation => {
            const charityName = donation.charity && donation.charity.name ? donation.charity.name : 'N/A';
            html += `<tr>
                <td>${charityName}</td>
                <td>${donation.amount}</td>
                <td>${donation.date}</td>
                <td>${donation.paymentStatus}</td>
            </tr>`;
        });
        html += '</table>';
        historyDiv.innerHTML = html;
    } catch (err) {
        console.error(err);
        alert('Error fetching donation history.');
    }
});

function download() {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/donations/download', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            if (response.status === 200) {
                const fileUrl = response.data.fileURL;
                const a = document.createElement("a");
                a.href = fileUrl;
                a.setAttribute('download', 'donationHistory.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                throw new Error(response.data.message);
            }
        })
        .catch((err) => {
            console.log('Download error:', err.message);
        });
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
