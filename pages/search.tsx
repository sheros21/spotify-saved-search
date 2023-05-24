import { useEffect, useState } from 'react';
import Image from 'next/image';

function SearchPage(){
  const [accessToken, setAccessToken] = useState("");
  const [filteredUserData, setFilteredUserData] = useState<{ name: string; artist: string; images: any; genre: any; type: string; }[]>([]);
  const [searchParam, setSearchParam] = useState("");
  const [userData, setUserData] = useState<{ name: string; artist: string; images: any; genre: any; type: string; }[]>([]);
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
        const { access_token } = getReturnedParamsFromSpotifyAuth(window.location.hash);
        setAccessToken(access_token);
        localStorage.setItem('accessToken', access_token);
      }
    }
    fetchSavedData();
    setIsLoading(true);

  }, [accessToken]);

  // parse string to get the access token from spotify
  const getReturnedParamsFromSpotifyAuth = (hash : any) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater : any, currentValue : any) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});

    return paramsSplitUp;
  };

  async function fetchData(url: string, params: any) {
    try {
      const response = await fetch(url, params);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.log(error);
      throw error; 
    }
  }

  // fetch the user data from spotify endpoint
  async function fetchSavedData() {
    setIsLoading(true);
    // retrieve most updated access token    
    if (window.location.hash) {
      const { access_token} = getReturnedParamsFromSpotifyAuth(window.location.hash);
      setAccessToken(access_token);
      localStorage.setItem('accessToken', access_token);
    }
    try {
      const params = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      };
      setUserData([]); // clear userData before adding new data

      
      const [tracksData, albumsData, episodesData] = await Promise.all([
        fetchData("https://api.spotify.com/v1/me/tracks", params),
        fetchData("https://api.spotify.com/v1/me/albums", params),
        fetchData("https://api.spotify.com/v1/me/episodes", params)
      ]);

      // parse all fetched data
      parseTrackData(tracksData.items);
      parseAlbumData(albumsData.items);
      parseEpisodeData(episodesData.items);
    } catch (error) {
      console.log(error); 
    }
    setIsLoading(false);
  }

  // prevent duplicate adding to the data list
  function pushToUserData(parsedData: any){
    setUserData((prevData: any) => {
      const updatedData = [...prevData];
      parsedData.forEach((newItem: any) => {
        // check if the item already exists in userData
        const isDuplicate = updatedData.some(
          (existingItem) => existingItem.name === newItem.name && existingItem.type === newItem.type
        );

        // add the item to userData if it's not a duplicate
        if (!isDuplicate) {
          updatedData.push(newItem);
        }
      });
      return updatedData;
    });
  }

  function parseTrackData(data: any) {    
    if (Array.isArray(data)) {
      const parsedTracks = data.map((item: any) => {
        const { name, album, artists } = item.track;
        const images = album?.images || [];
        const artist = artists[0].name

        return {
          name,
          artist,
          images,
          genre: '',
          type: 'Song'
        };
      });
      pushToUserData(parsedTracks)
      
    } else {
      console.log("Invalid data format, expected an array.");
    }
  }

  function parseAlbumData(data: any) {
    if (Array.isArray(data)) {
      const parsedAlbums = data.map((item: any) => {
        const { name, genres, images } = item.album;
        const artist = item.album.artists[0].name;
        const genre = genres[0];
        return {
          name,
          artist,
          images,
          genre,
          type: 'Album'
        };
      });
      pushToUserData(parsedAlbums);
    } else {
      console.log("Invalid data format, expected an array.");
    }
  }

  function parseEpisodeData(data: any) {
    if (Array.isArray(data)) {
      const parsedEpisodes = data.map((item: any) => {
      const { name, images } = item.episode;
      const artist = item.episode.show.name
      return {
          name,
          artist,
          images,
          genre: '',
          type: 'Episode'

        };
      });
      pushToUserData(parsedEpisodes);
    } else {
      console.log("Invalid data format, expected an array.");
    }
  }
  
  return(
    <div className="black min-h-screen px-8 py-16">
      <h1 className="font-bold mb-5 text-2xl md:mb-7 md:text-3xl">Spotify Saved Search</h1>
      <input
        className="shadow appearance-none border border-white rounded w-full mb-4 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-transparent focus:bg-gray-800"
        id="Search"
        type="text"
        placeholder="Search"
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
          <div className="flex-shrink-0">
            <Image
              src={item.images[0].url}
              alt={item.name}
              width={100}
              height={100}
              className="object-cover mt-2 mr-3"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-white font-bold">{item.name}</h3>
            <p className="text-white">{item.artist}</p>
            <p className="text-white">{item.genre}</p>
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
