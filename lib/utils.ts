import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// async function fetchWithConfig(url: string, options = {}) {
//   const defaultOptions = {
//     credentials: 'include', // Equivalent to withCredentials: true
//     headers: {
//       'X-Requested-With': 'XMLHttpRequest',
//     },
//   };

//   const mergedOptions = { ...defaultOptions, ...options };

//   const response = await fetch(BASE_URL + url, mergedOptions);

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   const data = await response.json(); // Assuming JSON response
//   return data;
// }

// export default fetchWithConfig;
