// import { useState } from 'react';

// function LoginPage(){


    

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
//     return(
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
//     );
// }

// export default LoginPage;

