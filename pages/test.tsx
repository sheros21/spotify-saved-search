import { useEffect, useState } from 'react';
import axios from "axios";



//TODO add is loading 

//TODO hide these in local storage, update gitignore
const CLIENT_ID = "cf13126c4938401daf4e9e6dbefe887e";
const CLIENT_SECRET = "4f28abe2fa6b4d2cb274afb4c650d38c";


function SearchPage(){

  

    const [accessToken, setAccessToken] = useState("");
    // const [refreshToken, setRefreshToken] = useState("");
    const [searchParam, setSearchParam] = useState("");
    const [userData, setUserData] = useState<{ name: any; images: any; genres: any; type: string; }[]>([]);


    const handleSearchChange = (event: any) => {
        setSearchParam(event.target.value);
        console.log(searchParam);
      };
  
    

    // refresh the token upon 401 error
    useEffect(() => {
      const getAccessToken = async () => {
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
  
      getAccessToken();
    }, []);
    

    useEffect(() => {
      const fetchSavedData = async () => {
        try {
          const params = {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          };
  
          const trackResponse = await fetch('https://api.spotify.com/v1/me/tracks', params);
          const trackData = await trackResponse.json();
          parseTrackData(trackData.items);
  
          const albumResponse = await fetch('https://api.spotify.com/v1/me/albums', params);
          const albumData = await albumResponse.json();
          parseAlbumData(albumData.items);
  
          const episodeResponse = await fetch('https://api.spotify.com/v1/me/episodes', params);
          const episodeData = await episodeResponse.json();
          parseEpisodeData(episodeData.items);
        } catch (error) {
          console.log(error);
        }
      };
  
      if (accessToken) {
        fetchSavedData();
      }
    }, [accessToken]);


    // useEffect(() => {
    //   const storedAccessToken = localStorage.getItem('accessToken');
    //   if (storedAccessToken) {
    //     setAccessToken(storedAccessToken);
    //     fetchSavedData(storedAccessToken);
    //   } else {
    //     if (window.location.hash) {
    //       const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
    //       setAccessToken(access_token);
    //       localStorage.setItem('accessToken', access_token);
    //       fetchSavedData(access_token);
    //     }
    //   }
    // }, [accessToken]);

    // fetch the user data from spotify endpoint
    // async function fetchSavedData() {
    //   console.log("in fetch data")
    //   console.log(accessToken);
    //   try {
    //     const params = {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${accessToken}`
    //       }
    //     };
    
    //     // Clear userData before adding new data
    //     setUserData([]);
    
    //     // Parsing for tracks
    //     const response = await fetch("https://api.spotify.com/v1/me/tracks", params);
    //     const data = await response.json();
    //     // Process the retrieved data here
    //     parseTrackData(data.items);
    
    //     const albumResponse = await fetch("https://api.spotify.com/v1/me/albums", params);
    //     const albumData = await albumResponse.json();
    //     parseAlbumData(albumData.items);
    
    //     const episodeResponse = await fetch("https://api.spotify.com/v1/me/episodes", params);
    //     const episodeData = await episodeResponse.json();
    //     console.log(episodeData);
    //     parseEpisodeData(episodeData.items);

    //     console.log("userdata:");
    //     console.log(userData);
    //   } catch (error) {
    //     console.log(error); 
    //   }
    // }

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
    //
      
  
    async function getSaved() {
      console.log("in get saved");
      console.log(accessToken);
      var params = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${accessToken}`
          'Authorization': 'Bearer ' + accessToken
        }
      };
    
      try {
        var savedTracks = await fetch("https://api.spotify.com/v1/me/tracks", params)
          .then(response => response.json())
          .then(data => {
                console.log(data.items);
                parseTrackData(data.items);
          })
          var savedAlbums = await fetch("https://api.spotify.com/v1/me/albums", params)
          .then(response => response.json())
          .then(data => {
                console.log(data.items);
                parseAlbumData(data.items);
          })
          var savedEpisodes = await fetch("https://api.spotify.com/v1/me/episodes", params)
          .then(response => response.json())
          .then(data => {
                console.log(data.items);
                // parseEpisodeData(data.items);
          })
        // var savedAlbums = await fetch("https://api.spotify.com/v1/me/albums", params)
        // var savedEpisodes = await fetch("https://api.spotify.com/v1/me/episodes", params)

      } catch (error) {
        console.log(error);
      }
    }



    
      // var trackArray = savedTracks.map(item => ({ track: item.track }));
      // console.log(trackArray);

    // useEffect(() => {
    //     // API access Token (running twice in dev mode but should be expected..?)
    //     var authParams = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    //     }
    //     // TODO add error handling for fetch later
    //     fetch('https://accounts.spotify.com/api/token', authParams)
    //         .then(result => result.json())
    //         .then(data => setAccessToken(data.access_token))
        
    //     // call to retrieve all saved data
    //     getSaved();
            
    // }, [])


    async function searchArtists() {
      console.log("in search artists")
      console.log(accessToken)
      var params = {
        method: 'GET',
        headers: {
          'Content-Type': 'applications/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
      var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchParam + '&type=artist', params)
        .then(response => response.json())
        .then(data => console.log(data))
    }
//    serach [] needs to be async since we're gonna have a lot of fetch statements
    // const handleGetSaved = () => {
    //   console.log("in handleGetSaved")

    //   var getParams = {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`
    //     }
    // }


    //   fetch("https://api.spotify.com/v1/me/tracks", getParams)
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //       return response.json();
    //     })
    //     .then(data => {
    //       setUserData(data);
    //       console.log("userData:");
    //       console.log(userData);
    //     })
    //     .catch(error => {
    //       console.log("error");
    //       console.log(error);
    //     });
    // };
    

    //TODO: make this async?
    // const handleGetSaved = () => {
    //     axios
    //         .get("https://api.spotify.com/v1/me/tracks", {
    //             headers: {
    //                 'Authorization': 'Bearer ' + accessToken,
    //             },
    //         })
    //         .then((response : any) => {
    //             setUserData(response.data);
    //             console.log(userData);
    //         })
    //         .catch((error : any) => {
    //             console.log(error);
    //         });
    // };


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
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={search}
        >
          Search
        </button>
      </div>
{/*  */}
      <div>
        {userData.map((item, index) => (
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