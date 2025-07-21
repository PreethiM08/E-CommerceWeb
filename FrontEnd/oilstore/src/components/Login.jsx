import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function Login(){
    const [form,setForm]=useState({email:'',password:''});
    const[loading,setLoading]=useState(false);
    const[errorMsg,setErrorMsg]=useState('');
    const navigate=useNavigate();

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    };
    const handleLogin=async (e)=>{
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try{
            const res=await axios.post('http://localhost:5000/api/auth/login',form);
            localStorage.setItem('user_id', res.data.user.user_id);
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('email',res.data.user.email);
            localStorage.setItem('role',res.data.user.role);

            if(res.data.user.role==='admin'){
                navigate('/admin');
            }else{
                navigate('/dashboard');
            }
        } catch(err) {
            setErrorMsg(
                err.response?.data?.msg || 'Login Failed');
        }finally{
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>

            {errorMsg && <p style={styles.error}>{errorMsg}</p>}
            <form onSubmit={handleLogin} style={styles.form}>
                <input type="text"
                       name="email"
                       placeholder="Email"
                       value={form.email}
                       onChange={handleChange}
                       required
                       style={styles.input}
                />
                <input type="password"
                       name="password"
                       placeholder="Password"
                       value={form.password}
                       onChange={handleChange}
                       required
                       style={styles.input}
                />
                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Logging in...':'Login'}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 400,
        margin: '60px auto',
        textAlign: 'center',
        padding: '40px 30px',
        borderRadius: '18px',
        backgroundColor: '#fff8dc', // light yellow / cornsilk
        boxShadow: 'inset 0 0 15px rgba(100, 100, 100, 0.15)',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        color: '#800000', // maroon text
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    input: {
        padding: '12px 0',
        fontSize: 16,
        border: 'none',
        borderBottom: '2px solid #800000',
        backgroundColor: 'transparent',
        outline: 'none',
        color: '#000', // input text black
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    inputFocus: {
        borderBottom: '2px solid #a52a2a', // focus maroon
    },
    button: {
        padding: '12px 16px',
        fontSize: 16,
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #ffcc70, #ffb347)',
        color: '#800000',
        border: '2px solid #800000',
        borderRadius: '30px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        transition: 'all 0.3s ease',
    },
    buttonHover: {
        background: 'linear-gradient(135deg, #ffd580, #ffc04d)',
        transform: 'scale(1.05)',
        boxShadow: '0 4px 12px rgba(128, 0, 0, 0.3)',
    },
    error: {
        color: '#b22222', // firebrick red
        fontWeight: '500',
        fontSize: '14px',
    },
};

export default Login;