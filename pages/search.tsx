import { useEffect, useState } from 'react';
import axios from "axios";


//TODO hide these in local storage, update gitignore
const CLIENT_ID = "cf13126c4938401daf4e9e6dbefe887e";
const CLIENT_SECRET = "4f28abe2fa6b4d2cb274afb4c650d38c";


function SearchPage(){

    const [accessToken, setAccessToken] = useState("");
    const [searchParam, setSearchParam] = useState("");
    const [userData, setUserData] = useState({});

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
            .then(data => setAccessToken(data.access_token))
        
        // call to retrieve all saved data
        handleGetSaved();
            
    }, [])

    // const handleSubmit = (event) => {
    //     //event.preventDefault(); // not sure if this is necessary
    //     console.log(searchParam); 
    //   };

    // serach [] needs to be async since we're gonna have a lot of fetch statements

    //TODO: make this async?
    const handleGetSaved = () => {
        axios
            .get("https://api.spotify.com/v1/me/tracks", {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            })
            .then((response : any) => {
                setUserData(response.data);
                console.log(userData);
            })
            .catch((error : any) => {
                console.log(error);
            });
    };

    // async function getSaved() {
    //     console.log(accessToken);
    //     var savedSearchParams = {
    //       method: 'GET',
    //       headers: {
    //         // 'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + accessToken
    //       }
    //     };
      
    //     // get request to retrieve saved tracks
    //     try {
    //       const response = await fetch("https://api.spotify.com/v1/me/tracks", savedSearchParams);
    //       const data = await response.json();
    //       console.log(data);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    
    // string matching/search handler
    async function search(){
        console.log("searching for " + searchParam);      
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