import { useEffect, useState } from 'react';
import axios from "axios";



//TODO add is loading 

//TODO hide these in local storage, update gitignore
const CLIENT_ID = "cf13126c4938401daf4e9e6dbefe887e";
const CLIENT_SECRET = "4f28abe2fa6b4d2cb274afb4c650d38c";


function SearchPage(){
    const [accessToken, setAccessToken] = useState("");
    const [filteredUserData, setFilteredUserData] = useState<{ name: any; images: any; genres: any; type: string; }[]>([]);
    const [searchParam, setSearchParam] = useState("");
    const [userData, setUserData] = useState<{ name: any; images: any; genres: any; type: string; }[]>([]);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchParam(value);
      
      const filteredData = userData.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
      setFilteredUserData(filteredData);
    };
    
    useEffect(() => {
      setFilteredUserData(userData);
    }, [userData]);
    
  
    useEffect(() => {
      const storedAccessToken = localStorage.getItem('accessToken');
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      } else {
        if (window.location.hash) {
          console.log("window hash");
          console.log(window.location.hash)
          const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
          setAccessToken(access_token);
          localStorage.setItem('accessToken', access_token);
        }
      }
      console.log("ACCESS TOKEN ON FIRST REFRESH");
      console.log(accessToken)
      fetchSavedData();

    }, [accessToken]);

//    fetch the user data from spotify endpoint
    async function fetchSavedData() {
      console.log("in fetch data")

      // TODO add expires in functionality from tut

      if (window.location.hash) {
        const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
        setAccessToken(access_token);
        localStorage.setItem('accessToken', access_token);
      }
      console.log(accessToken);
      try {
        const params = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        };
    
        // Clear userData before adding new data
        setUserData([]);
    
        // TODO add try catch handling for each fetch statement
        // TODO add load state until everything is parsed 

        // Parsing for tracks
        const response = await fetch("https://api.spotify.com/v1/me/tracks", params);
        const data = await response.json();
        // Process the retrieved data here
        console.log(data);
        parseTrackData(data.items);
    
        const albumResponse = await fetch("https://api.spotify.com/v1/me/albums", params);
        const albumData = await albumResponse.json();
        parseAlbumData(albumData.items);
    
        const episodeResponse = await fetch("https://api.spotify.com/v1/me/episodes", params);
        const episodeData = await episodeResponse.json();
        console.log(episodeData);
        parseEpisodeData(episodeData.items);

        console.log("userdata:");
        console.log(userData);
      } catch (error) {
        console.log("error caught");
        console.log(error); 
      }
    }

    // parse string to get the access token from spotify
    const getReturnedParamsFromSpotifyAuth = (hash : any) => {
      const stringAfterHashtag = hash.substring(1);
      const paramsInUrl = stringAfterHashtag.split("&");
      const paramsSplitUp = paramsInUrl.reduce((accumulater : any, currentValue : any) => {
        // console.log(currentValue);
        const [key, value] = currentValue.split("=");
        accumulater[key] = value;
        return accumulater;
      }, {});
    
      return paramsSplitUp;
    };

  function parseTrackData(data: any) {
  console.log("parsing track data");
  console.log(data);

  if (Array.isArray(data)) {
    const newItems = data.map((item: any) => {
      const { name } = item.track;
      const { genres, images } = item.track.album;

      return {
        name,
        images,
        genres,
        type: 'track'
      };
    });

    setUserData((prevData) => {
      const updatedData = [...prevData];
      newItems.forEach((newItem) => {
        // Check if the item already exists in userData
        const isDuplicate = updatedData.some(
          (existingItem) => existingItem.name === newItem.name && existingItem.type === newItem.type
        );

        // Add the item to userData if it's not a duplicate
        if (!isDuplicate) {
          updatedData.push(newItem);
        }
      });
      return updatedData;
    });
  } else {
    console.log("Invalid data format. Expected an array.");
  }
}

    
  function parseAlbumData(data: any) {
    console.log("parsing data");
    console.log(data);
  
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        const { name, genres, images } = item.album;
  
        // Check if the item already exists in userData
        const isDuplicate = userData.some((existingItem) => existingItem.name === name);
  
        // Add the item to userData if it's not a duplicate
        if (!isDuplicate) {
          const newItem = {
            name,
            images,
            genres,
            type: 'album'
          };
  
          setUserData((prevData: any) => [...prevData, newItem]);
        }
      });
    } else {
      console.log("Invalid data format. Expected an array.");
    }
  }

  function parseEpisodeData(data: any) {
    console.log("parsing data");
    console.log(data);
  
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        const { name, genres, images } = item.episode;
  
        // Check if the item already exists in userData
        const isDuplicate = userData.some((existingItem) => existingItem.name === name);
  
        // Add the item to userData if it's not a duplicate
        if (!isDuplicate) {
          const newItem = {
            name,
            images,
            genres,
            type: 'episode'
          };
  
          setUserData((prevData: any) => [...prevData, newItem]);
        }
      });
    } else {
      console.log("Invalid data format. Expected an array.");
    }
  }

    return(
      <div>
          {/* add form instead of div for auto refresh? */}
          {/*  */}
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

      </div>

      <div>
        {filteredUserData.map((item, index) => (
          <div key={index} className="bg-white shadow-md rounded p-4 mb-4">
            <h3 className="text-gray-600">{item.name}</h3>
            <p className="text-gray-600">{item.genres}</p>
            <p className="text-gray-600">{item.type}</p>
            <img src={item.images[0].url} alt={item.name} className="w-20 h-20 mt-2" />
          </div>
        ))}

      </div>

      </div>
      </div>
    );
}

export default SearchPage;