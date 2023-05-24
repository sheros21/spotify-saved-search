import { useEffect, useState } from 'react';


//TODO add is loading 

//TODO hide these in local storage, update gitignore
const CLIENT_ID = "cf13126c4938401daf4e9e6dbefe887e";
const CLIENT_SECRET = "4f28abe2fa6b4d2cb274afb4c650d38c";

// interface UserItem {
//   name: string;
//   artist?: string;
//   images: any;
//   genres: any;
//   type: string;
// }

// Define UserItem interface for better type checking
interface UserItem {
  name: string;
  artist: string;
  images: any;
  genres: any;
  type: string;
}


function SearchPage(){
    const [accessToken, setAccessToken] = useState("");
    const [filteredUserData, setFilteredUserData] = useState<UserItem[]>([]);
    const [searchParam, setSearchParam] = useState("");
    const [userData, setUserData] = useState<UserItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      getAccessToken();
      fetchSavedData();
    }, []);

    const getAccessToken = () => {
      if (window.location.hash) {
        const { access_token } = getReturnedParamsFromSpotifyAuth(window.location.hash);
        setAccessToken(access_token);
        localStorage.setItem('accessToken', access_token);
      } else {
        const storedAccessToken = localStorage.getItem('accessToken');
        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
        }
      }
    };
    

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParam(event.target.value);

      const filteredData = userData.filter(item => item.name.toLowerCase().includes(searchParam));
      setFilteredUserData(filteredData);
    };
    
    useEffect(() => {
      setFilteredUserData(userData);
    }, [userData]);
    
  

  const refreshToken = async () => {
    try {
      const authParams = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      };

      const response = await fetch('https://accounts.spotify.com/api/token', authParams);
      const data = await response.json();
      setAccessToken(data.access_token);
      console.log('access token:', accessToken);
      // fetchSavedData();
    } catch (error) {
      // Handle error here 
      console.error('Error fetching access token:', error);
    }
  };


//    fetch the user data from spotify endpoint
const fetchSavedData = async () => {
  setIsLoading(true);
  const params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  };
  setUserData([]);
  const endpoints = ["https://api.spotify.com/v1/me/tracks", "https://api.spotify.com/v1/me/albums", "https://api.spotify.com/v1/me/episodes"];
  const parsers = [parseTrackData, parseAlbumData, parseEpisodeData];

  for (let i = 0; i < endpoints.length; i++) {
    try{
      const response = await fetch(endpoints[i], params);
      const data = await response.json();
      parsers[i](data.items);
    }
    catch(error){
      console.log(error);
      refreshToken(); // TODO call refresh when there's a status 401 or 400 error
    }
  }
  setIsLoading(false);
};

const getReturnedParamsFromSpotifyAuth = (hash : string) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater : any, currentValue : any) => {
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});
  return paramsSplitUp;
};


const parseData = (data: any, selector: (item: any) => UserItem | null) => {
  if (Array.isArray(data)) {
    const newItems = data.map(selector).filter(item => item) as UserItem[];
    setUserData(prevData => [...prevData, ...newItems]);
  } else {
    console.error("Invalid data format. Expected an array.");
  }
};


const parseTrackData = (data: any) =>
  parseData(data, (item: any) => {
    const { name, album, artists } = item.track;
    const genres = album?.genres || [];
    const images = album?.images || [];
    const artist = artists && artists[0]?.name || "";
    return { name, artist, images, genres, type: 'Song' };
  });

const parseAlbumData = (data: any) =>
  parseData(data, (item: any) => {
    const { name, genres, images, artists } = item.album;
    const artist = artists[0].name || [];
    return { name, artist, images, genres, type: 'Album' };
  });

const parseEpisodeData = (data: any) =>
  parseData(data, (item: any) => {
    const { name, genres, images } = item.episode;
    const artist = "";
    return { name, artist, images, genres, type: 'Episode' };
  });

// ...

    
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
          <p className="text-white">{item.artist}</p>
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