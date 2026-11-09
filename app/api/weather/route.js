
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Falta configurar la API Key." },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      appid: apiKey,
      units: "metric",
      lang: "es"
    });

    if (lat !== null && lon !== null) {
      const latitude = Number(lat);
      const longitude = Number(lon);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return Response.json(
          { error: "Coordenadas inválidas." },
          { status: 400 }
        );
      }

      params.set("lat", latitude.toString());
      params.set("lon", longitude.toString());
    } else if (city) {
      params.set("q", city);
    } else {
      params.set("q", "Oaxaca,MX");
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?${params}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.message || "Error al consultar el clima." },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Error al consultar el servicio meteorológico." },
      { status: 500 }
    );
  }
}
