

const test = async () => {
    try {
        const payload = {
            email: 'testuser@axiom.com',
            name: 'Test User',
            role: 'Tester',
            location: 'Localhost',
            bio: 'Testing backend',
            avatar: 'https://github.com/shadcn.png',
            banner: '',
            experience: [],
            skills: ['Testing'],
            socials: []
        };

        const response = await fetch('http://localhost:3000/api/users/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Server returned ${response.status}: ${err}`);
        }

        const data = await response.json();
        console.log('SUCCESS: Saved user:', data);

    } catch (error) {
        console.error('FAILURE:', error.message);
    }
};

test();
