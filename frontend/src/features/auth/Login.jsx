import React, { useState } from 'react';

const Login = ({ onSwitch, onLogin, API_URL }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');

      localStorage.setItem('token', data.access_token);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Celestial Nebula"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0ATe22-6BvM7NmxGOGCQFMF3nA8UmaKcG-y6JIGtdOjNBHrpKsTOLKKtsDZpgzG3Vi2a62QiR41RLFQRqwffYI7QpCUgjNnZ4E1g1nyW7cCGocjrfS2QgWCNiK8nt_u4-osCxGoPDr5JO-U3XD7HXdyUsP96jKEl8ffNqCiZGl6U33sKN4uZGoRJHu6ImgZcX-WwAuxDq9GdAD4g5aUGX3Fj0Gnf-7H2okdZ9hbJ3q084Wa1-E6efMu4kq223C1t2RlM7xTpHBylq"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1512]/40 via-[#0e1512]/80 to-[#0e1512]"></div>
      </div>

      <header className="relative z-10 flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-[#59de9b] font-headline">
          Character Forge
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col lg:flex-row items-center max-w-7xl mx-auto w-full px-8 gap-12">
        <div className="lg:w-1/2 text-left space-y-6 pt-12 lg:pt-0">
          <h1 className="font-headline text-6xl lg:text-7xl font-bold text-primary tracking-tighter leading-tight drop-shadow-2xl">
            Weave the <br />Unexpected.
          </h1>
          <p className="text-on-surface-variant text-xl max-w-md drop-shadow-lg">
            Access the forge where digital matter meets celestial intent. Your narrative journey resumes at the speed of light.
          </p>
        </div>

        <div className="lg:w-1/2 flex justify-center lg:justify-end w-full py-12">
          <div className="w-full max-w-md">
            <div className="bg-surface-container-low/80 backdrop-blur-xl p-8 lg:p-12 shadow-[0px_32px_64px_rgba(0,0,0,0.6)] border border-outline-variant/30 rounded-2xl">
              <div className="mb-10 text-center lg:text-left">
                <span className="font-label text-xs tracking-[0.2em] text-tertiary uppercase mb-2 block">Identity Verification</span>
                <h2 className="font-headline text-4xl font-bold text-on-surface tracking-tight">Access Cipher</h2>
              </div>

              {error && <div className="bg-error-container text-on-error-container p-3 rounded mb-6 text-sm">{error}</div>}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="font-label text-xs tracking-widest text-outline uppercase ml-1">Universal Identity</label>
                  <div className="relative group">
                    <input
                      className="w-full bg-surface-container-highest/40 border-none focus:ring-0 text-on-surface p-4 rounded-lg transition-all focus:placeholder-transparent placeholder:text-outline/50"
                      placeholder="identity@weaver.io"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-focus-within:w-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="font-label text-xs tracking-widest text-outline uppercase">Access Cipher</label>
                  </div>
                  <div className="relative group">
                    <input
                      className="w-full bg-surface-container-highest/40 border-none focus:ring-0 text-on-surface p-4 rounded-lg transition-all focus:placeholder-transparent placeholder:text-outline/50"
                      placeholder="••••••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-focus-within:w-full"></div>
                  </div>
                </div>
                <div className="pt-6">
                  <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-xl shadow-[0px_8px_16px_rgba(0,168,107,0.2)] hover:shadow-[0px_12px_24px_rgba(0,168,107,0.3)] active:scale-[0.98] transition-all duration-200" type="submit">
                    INITIALIZE PROTOCOL
                  </button>
                </div>
              </form>
              <div className="mt-10 pt-8 border-t border-outline-variant/20 text-center lg:text-left">
                <p className="text-sm text-on-surface-variant font-body">
                  New architect?
                  <button className="text-primary font-bold ml-1 hover:underline underline-offset-4" onClick={onSwitch}>Create New Account</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
