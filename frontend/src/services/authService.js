import { parseErrorMessage } from '../utils/http'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081'

export async function registerStudent(body) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res))
  }
  return res.json()
}

export async function loginStudent(body) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res))
  }
  return res.json()
}

// Admin login is wallet-address based: the frontend connects MetaMask, then
// sends the connected address here. The backend checks the address against
// pre-registered admin wallets. Real signature-based proof-of-ownership
// (sign a challenge with the wallet's private key) lands with the Blockchain
// module — for now this only verifies "this address is a known admin".
export async function loginAdminWithWallet(walletAddress) {
  const res = await fetch(`${API_BASE}/api/auth/admin/wallet-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  })
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res))
  }
  return res.json()
}
