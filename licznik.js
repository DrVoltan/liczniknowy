import https from 'https';

export default async function handler(req, res) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const url = `https://www.money.pl/archiwum/data/${year}-${month}-${day}/`;

  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
      const textOnly = data.replace(/<[^>]+>/g, '\n');
      const lines = textOnly.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      const regex = /^\d{2}:\d{2}/;
      const matches = lines.filter(line => regex.test(line));
      res.status(200).json({ data: `${year}-${month}-${day}`, liczba: matches.length });
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Błąd podczas pobierania strony.' });
  });
}