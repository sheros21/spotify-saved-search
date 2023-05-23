import { access } from 'fs';
import { useState, useEffect} from 'react';




function LoginPage(){
//TODO hide these in local storage, update gitignore
const CLIENT_ID = "cf13126c4938401daf4e9e6dbefe887e";
const CLIENT_SECRET = "4f28abe2fa6b4d2cb274afb4c650d38c";

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL = "http://localhost:3000/search";
const SPACE_DELIMITER = "%20";
const SCOPES = ["user-library-read"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);



const handleLogin = () => {
    window.location = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true` as any;
};
  
    

//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const handleUsernameChange = (event) => {
//       setUsername(event.target.value);
//       console.log(username);
//     };

//     const handlePasswordChange = (event) => {
//         setPassword(event.target.value);
//         console.log(password);
//     };

//     const handleSubmit = (event) => {
//       //event.preventDefault(); // not sure if this is necessary
//       console.log(username);
//       console.log(password);

//     };
    return(
        <button onClick={handleLogin}>login to spotify</button>
//         <div>
//       <form
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//         onSubmit={handleSubmit}
//       >
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Username
//         </label>
//         <input
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           id="username"
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={handleUsernameChange}
//         />

//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Password
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="password"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={handlePasswordChange}
//           />
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             type="submit"
//           >
//             Sign In
//           </button>
//         </div>
//       </form>
//     </div>
    );
}

export default LoginPage;