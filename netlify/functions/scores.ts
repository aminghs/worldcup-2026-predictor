interface FdMatch {
  utcDate: string;
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: {
    fullTime: { home: number | null; away: number | null };
  };
}

interface FdResponse {
  matches: FdMatch[];
}

export default async () => {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) return new Response('Missing FOOTBALL_DATA_API_KEY', { status: 500 });

  const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
    headers: { 'X-Auth-Token': key },
  });

  if (!res.ok) return new Response(`Upstream error ${res.status}`, { status: 502 });

  const data = (await res.json()) as FdResponse;

  const matches = data.matches
    .filter((m) => m.score?.fullTime?.home !== null && m.score?.fullTime?.home !== undefined)
    .map((m) => ({
      date: m.utcDate.slice(0, 10),
      team1: m.homeTeam.name,
      team2: m.awayTeam.name,
      score: { ft: [m.score.fullTime.home!, m.score.fullTime.away!] as [number, number] },
    }));

  return Response.json(
    { matches },
    { headers: { 'Cache-Control': 'public, max-age=300' } },
  );
};

export const config = { path: '/api/scores' };
