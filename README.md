# 🔐 key-secure-manage

A simple, secure, browser-based key vault that encrypts and stores key-label pairs locally using AES encryption. Includes IP-based access control and an auto-lock feature for enhanced security. Implemented select IP addressing to allow select IP addresses to access the key management application.

## ✨ Features

- 🔑 Store sensitive keys with labels (e.g., "AWS Key", "SSH Key", etc).
- 🔒 AES-encrypted vault using a master password.
- 🌐 Access restricted to a specific IP address.
- 🕒 Auto-lock after 5 minutes of inactivity.
- 🗑 Delete individual keys securely.
- 🔐 Manual lock/unlock functionality.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/yourusername/key-secure-manage.git
cd key-secure-manage
npm install
npm run dev
