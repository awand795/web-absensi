import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { loadModels } from '../lib/faceModels';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/login', {
                email,
                password,
                device_name: 'web_browser'
            });
            localStorage.setItem('auth_token', res.data.token);

            // Fetch user data dan preload model secara paralel
            const [userRes] = await Promise.all([
                api.get('/users/me'),
                loadModels(),
            ]);
            localStorage.setItem('user', JSON.stringify(userRes.data.data));

            navigate('/attendance');
        } catch (err) {
            alert('Login Gagal: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: 400 }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Login Absensi</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
