import { getEnv } from '../env'

export const credentials = {
  spotify: {
    public: getEnv("SPOTIFY_PUBLIC"),
    secret: getEnv("SPOTIFY_SECRET"),
    scopes: [
      "user-read-private",
      "user-read-email",
      "user-read-recently-played",
      "user-modify-playback-state",
      "playlist-modify-private",
      "playlist-modify-public",
    ].join(" "),
    redirectUri: `${getEnv("API_ENDPOINT")}/api/auth/spotify/callback`,
  },
};
