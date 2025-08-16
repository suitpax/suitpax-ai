import { type NextRequest, NextResponse } from "next/server"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!

export async function GET(request: NextRequest) {
  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
    "user-top-read",
  ].join(" ")

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: "suitpax_auth",
  })

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`

  return NextResponse.redirect(spotifyAuthUrl)
}
