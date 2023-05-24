import { useEffect, useState } from 'react';


//TODO add is loading 

//TODO hide these in local storage, update gitignore
const CLIENT_ID = "cf13126c4938401daf4e9e6dbefe887e";
const CLIENT_SECRET = "4f28abe2fa6b4d2cb274afb4c650d38c";


function SearchPage(){
    const [accessToken, setAccessToken] = useState("");
    const [filteredUserData, setFilteredUserData] = useState<{ name: any; images: any; genres: any; type: string; }[]>([]);
    const [searchParam, setSearchParam] = useState("");
    const [userData, setUserData] = useState<{ name: any; images: any; genres: any; type: string; }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);

    }, [accessToken]);

//    fetch the user data from spotify endpoint
    async function fetchSavedData() {
      console.log("in fetch data")
      setIsLoading(true);

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
      setIsLoading(false);
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
<div className="black min-h-screen px-8 py-16">

<h1 className="font-bold mb-5 text-2xl md:mb-7 md:text-3xl">Spotify Saved Search</h1>
    <input
      className="shadow appearance-none border border-white rounded w-full mb-4 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-transparent focus:bg-gray-800"
      id="Search"
      type="text"
      placeholder="Username"
      value={searchParam}
      onChange={handleSearchChange}
    />

{isLoading && <div className='text-2xl'>Loading...</div>}
<div className="flex flex-wrap -mx-1 md:-mx-2 lg:-mx-3">
  {filteredUserData.map((item, index) => (
    <div
      key={index}
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-1 md:px-2 lg:px-3 mb-2 md:mb-3 lg:mb-4 relative"
    >
      <div className="bg-gray-800 shadow-md rounded-lg p-3 flex hover:bg-gray-700 transition-colors duration-300 ease-in-out group">
        <img src={item.images[0].url} alt={item.name} className="w-20 h-20 mt-2 mr-3" />
        <div className="flex flex-col">
          <h3 className="text-white font-bold">{item.name}</h3>
          <p className="text-white">{item.genres}</p>
          <p className="text-white">{item.type}</p>
        </div>
      </div>
    </div>
  ))}
</div>

  </div>
  );
}

export default SearchPage;