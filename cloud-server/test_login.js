
async function testLogin() {
    try {
        console.log('Testing Login...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'superadmin',
                password: 'admin123'
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Login Successful!');
            console.log('User:', data.user.username);
            console.log('Role:', data.user.role);
            console.log('Permissions Count:', data.permissions.length);
            if (data.permissions.length > 0) {
                console.log('Sample Permission:', data.permissions[0]);
            }
        } else {
            console.log('Login Failed:', data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();
