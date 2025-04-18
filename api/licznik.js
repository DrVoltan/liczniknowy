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

    // Usuń tagi <script> i <style> z zawartością
    const bezSkryptow = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');

    // Zamień pozostałe znaczniki HTML na nowe linie
    const text = bezSkryptow.replace(/<[^>]+>/g, '\n');

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    // Zlicz tylko linie zaczynające się od godziny i zawierające minimum jedno słowo po niej
    const regex = /^\d{2}:\d{2}\s+\S+/;
    const matches = lines.filter(line => regex.test(line));

    res.status(200).json({ data: `${year}-${month}-${day}`, liczba: matches.length });
  } catch (error) {
    console.error("Błąd backendu:", error);
    res.status(500).json({ error: 'Nie udało się pobrać danych.' });
  }
}
