export async function GET(req) {
  try {
    const bondsURL = `${process.env.BACKEND_URL}/api/bonds/current-prices`;
    console.log("Fetching current bond prices from:", bondsURL);

    const response = await fetch(bondsURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching bond prices:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
    });
  }
}
