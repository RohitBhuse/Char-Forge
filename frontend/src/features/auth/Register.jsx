import React, { useState } from 'react';

const Register = ({ onSwitch, API_URL }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: name, user_email: email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');

      setSuccess('Registration successful! Initializing access...');
      setTimeout(() => onSwitch(), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <header className="bg-[#0e1512] flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-[#59de9b] font-headline">
          Character Forge
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface-container-low p-8 lg:p-12 shadow-[0px_24px_48px_rgba(0,57,33,0.4)]">
            <div className="mb-10">
              <span className="font-label text-xs tracking-[0.2em] text-tertiary uppercase mb-2 block">New Architect</span>
              <h2 className="font-headline text-4xl font-bold text-on-surface tracking-tight">Create Account</h2>
            </div>

            {error && <div className="bg-error-container text-on-error-container p-3 rounded mb-6 text-sm">{error}</div>}
            {success && <div className="bg-primary-container text-on-primary-container p-3 rounded mb-6 text-sm">{success}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest text-outline uppercase ml-1">Creator Name</label>
                <input
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface p-4 rounded-sm transition-all focus:placeholder-transparent placeholder:text-outline/50"
                  placeholder="The Weaver"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest text-outline uppercase ml-1">Universal Identity</label>
                <input
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface p-4 rounded-sm transition-all focus:placeholder-transparent placeholder:text-outline/50"
                  placeholder="identity@weaver.io"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest text-outline uppercase ml-1">Access Cipher</label>
                <input
                  className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface p-4 rounded-sm transition-all focus:placeholder-transparent placeholder:text-outline/50"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-6">
                <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-md" type="submit">
                  FORGE ACCOUNT
                </button>
              </div>
            </form>
            <div className="mt-10 pt-8 border-t border-outline-variant/20 text-center">
              <p className="text-sm text-on-surface-variant font-body">
                Already registered?
                <button className="text-primary font-bold ml-1 hover:underline underline-offset-4" onClick={onSwitch}>Sign In</button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
