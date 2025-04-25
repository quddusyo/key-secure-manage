// File: src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './App.css';

const ALLOWED_IP = "142.110.34.125"; // Replace with IP of choice
const AUTO_LOCK_MINUTES = 5; // Auto-lock after 5 minutes

const encryptData = (data, password) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
};

const decryptData = (ciphertext, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    return null;
  }
};

const App = () => {
  const [ipAllowed, setIpAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [keys, setKeys] = useState([]);
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [lockTimeout, setLockTimeout] = useState(null);

  useEffect(() => {
    axios.get("https://api.ipify.org?format=json")
      .then(res => {
        const userIP = res.data.ip;
        if (userIP === ALLOWED_IP) {
          setIpAllowed(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      resetAutoLockTimer();
      window.addEventListener('mousemove', resetAutoLockTimer);
      window.addEventListener('keydown', resetAutoLockTimer);
    }
    return () => {
      window.removeEventListener('mousemove', resetAutoLockTimer);
      window.removeEventListener('keydown', resetAutoLockTimer);
      clearTimeout(lockTimeout);
    };
  }, [isUnlocked]);

  const resetAutoLockTimer = () => {
    if (lockTimeout) clearTimeout(lockTimeout);
    const timeout = setTimeout(() => {
      setIsUnlocked(false);
      setPassword('');
      setKeys([]);
      alert('Vault locked due to inactivity.');
    }, AUTO_LOCK_MINUTES * 60 * 1000);
    setLockTimeout(timeout);
  };

  const handleLogin = () => {
    const encrypted = localStorage.getItem('vault');
    if (encrypted) {
      const data = decryptData(encrypted, password);
      if (data) {
        setKeys(data);
        setIsUnlocked(true);
      } else {
        alert('Invalid password');
      }
    } else {
      setKeys([]);
      setIsUnlocked(true);
    }
  };

  const handleAddKey = () => {
    if (newKey.trim() === '' || newLabel.trim() === '') return;
    const updated = [...keys, { label: newLabel.trim(), key: newKey.trim() }];
    const encrypted = encryptData(updated, password);
    localStorage.setItem('vault', encrypted);
    setKeys(updated);
    setNewKey('');
    setNewLabel('');
  };

  const handleDeleteKey = (index) => {
    const updated = keys.filter((_, i) => i !== index);
    const encrypted = encryptData(updated, password);
    localStorage.setItem('vault', encrypted);
    setKeys(updated);
  };

  if (loading) return <div className="login-container">Checking IP address...</div>;
  if (!ipAllowed) return <div className="login-container">Access Denied: You dont have permissions to access this content</div>;

  if (!isUnlocked) {
    return (
      <div className="login-container">
        <h2>Enter Master Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Unlock</button>
      </div>
    );
  }

  return (
    <div className="vault-container">
      <h2>🔐 Key Vault</h2>
      <ul>
        {keys.map((item, index) => (
          <li key={index}>
            <strong>{item.label}:</strong> {item.key}
            <button onClick={() => handleDeleteKey(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Label (e.g., Amazon Server)"
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
      />
      <input
        type="text"
        placeholder="Add new key"
        value={newKey}
        onChange={(e) => setNewKey(e.target.value)}
      />
      <button onClick={handleAddKey}>Add Key</button>
      <button onClick={() => {
        setIsUnlocked(false);
        setPassword('');
        setKeys([]);
      }}>Lock</button>
    </div>
  );
};

export default App;