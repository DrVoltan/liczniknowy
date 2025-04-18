import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const url = `https://www.money.pl/archiwum/data/${year}-${month}-${day}/`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Nie udało się pobrać strony: ${response.status}`);
    }

    const html = await response.text();
    console.log("=== HTML długość:", html.length, "===");
    console.log("=== HTML FRAGMENT START
