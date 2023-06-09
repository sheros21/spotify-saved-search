function LoginPage(){
    const CLIENT_ID = "cf13126c4938401daf4e9e6dbefe887e";
    const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const REDIRECT_URI = "https://spotify-saved-search.vercel.app/search";
    const SPACE_DELIMITER = "%20";
    const SCOPES = ["user-library-read"];
    const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true` as any;
    };

    return (
        <div className="bg-gradient-to-b from-gray-700 to-gray-900 min-h-screen">
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-black rounded-lg p-10 md:p-20 lg:p-32 h-[125%] md:h-[130%]">
                <h1 className="font-bold mb-5 text-2xl md:mb-7 md:text-3xl">Spotify Saved Search</h1>
                <div className="flex justify-center"> 
                    <button onClick={handleLogin} className="bg-transparent border border-white rounded-l-full rounded-r-full text-white px-4 py-2 hover:bg-white hover:text-black transition duration-300 ease-in-out">
                    Login with Spotify
                    </button>
                </div>
                </div>
            </div>
        </div>
      );

}

export default LoginPage;
