
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Oaxaca");

  async function searchWeather(params, name) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/weather?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error === "city not found"
            ? "No se encontró esa ciudad."
            : data.error || "No se pudo obtener el clima."
        );
      }

      setWeather(data);
      setLocationName(name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchWeather("city=Oaxaca%2CMX", "Oaxaca");
  }, []);

  function handleSearch(e) {
    e.preventDefault();

    if (!city.trim()) {
      setError("Escribe el nombre de una ciudad.");
      return;
    }

    searchWeather(
      `city=${encodeURIComponent(city.trim())}`,
      city.trim()
    );
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Tu navegador no permite obtener la ubicación.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        searchWeather(
          `lat=${lat}&lon=${lon}`,
          "Mi ubicación actual"
        );
      },
      () => {
        setLoading(false);
        setError(
          "No se pudo obtener tu ubicación. Revisa los permisos del navegador."
        );
      }
    );
  }

  return (
    <main className="min-h-screen p-6">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">
          Clima App
        </h1>

        <p className="mt-2">
          Consulta el clima de cualquier ciudad.
        </p>

        <div className="mt-8 rounded-2xl p-6 shadow-sm">

          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Escribe una ciudad..."
              className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none focus:border-sky-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Buscar clima
            </button>
          </form>

          <button
            onClick={useMyLocation}
            disabled={loading}
            className="mt-3 w-full rounded-lg bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
          >
            Usar mi ubicación actual
          </button>

          {loading && (
            <p className="mt-5 text-center">
              Consultando clima...
            </p>
          )}

          {error && (
            <p className="mt-5 text-center text-red-400">
              {error}
            </p>
          )}

          {weather && !loading && (
            <div className="mt-8 text-center">
              <p className="mb-2 text-sm text-slate-400">
                {locationName}
              </p>

              <h2 className="text-2xl font-bold">
                {weather.name}, {weather.sys.country}
              </h2>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto"
              />

              <p className="text-5xl font-bold text-sky-400">
                {Math.round(weather.main.temp)} °C
              </p>

              <p className="mt-2 capitalize">
                {weather.weather[0].description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl p-4">
                  <p className="text-sm text-slate-400">
                    Sensación térmica
                  </p>
                  <p className="text-xl font-semibold">
                    {Math.round(weather.main.feels_like)} °C
                  </p>
                </div>

                <div className="rounded-xl p-4">
                  <p className="text-sm text-slate-400">Humedad</p>
                  <p className="text-xl font-semibold">
                    {weather.main.humidity} %
                  </p>
                </div>

                <div className="rounded-xl p-4">
                  <p className="text-sm text-slate-400">Viento</p>
                  <p className="text-xl font-semibold">
                    {weather.wind.speed} m/s
                  </p>
                </div>

                <div className="rounded-xl p-4">
                  <p className="text-sm text-slate-400">Presión</p>
                  <p className="text-xl font-semibold">
                    {weather.main.pressure} hPa
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
