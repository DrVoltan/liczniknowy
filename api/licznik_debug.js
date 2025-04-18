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
    console.log("=== HTML FRAGMENT START ===");
    console.log(html.slice(0, 1000));
    console.log("=== HTML FRAGMENT END ===");

    const regex = /<span class="archive__time">\d{2}:\d{2}<\/span>[\s\S]*?<a[^>]*class="archive__link"[^>]*>.*?<\/a>/g;
    const matches = html.match(regex) || [];

    console.log("Znaleziono publikacji:", matches.length);
    if (matches.length > 0) {
      console.log("Pierwszy wynik
