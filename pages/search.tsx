import { useEffect, useState } from 'react';

const CLIENT_ID = "a";
const CLIENT_SECRET = "a";

function SearchPage(){

    const [acessToken, setAccessToken] = useState("");
    const [searchParam, setSearchParam] = useState("");


    const handleSearchChange = (event) => {
        setSearchParam(event.target.value);
        console.log(searchParam);
      };

    useEffect(() => {
        // API access Token (running twice in dev mode but should be expected..?)
        var authParams = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        // TODO add error handling for fetch later
        fetch('https://accounts.spotify.com/api/token', authParams)
            .then(result => result.json())
            .then(data => setAccessToken(data.acess_token))
            
    }, [])

    // const handleSubmit = (event) => {
    //     //event.preventDefault(); // not sure if this is necessary
    //     console.log(searchParam); 
    //   };

    // serach [] needs to be async since we're gonna have a lot of fetch statements
    async function search(){
        
        console.log("searching for " + searchParam);

        // get request using search to get the saved tracks
        var savedTracks = await fetch("https://api.spotify.com/v1/me/tracks")
        var savedAlbums = await fetch("https://api.spotify.com/v1/me/tracks")
        var savedTracks = await fetch("https://api.spotify.com/v1/me/episodes")
    }



    return(
        <div>
            {/* add form instead of div for auto refresh? */}
     <div
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        // onSubmit={search}
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Search
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Search"
          type="text"
          placeholder="Username"
          value={searchParam}
          onChange={handleSearchChange}
        />
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            onClick={search}
          >
            Search
          </button>
        </div>
    </div>
        </div>
    );
}

export default SearchPage;