import axios from '@/lib/axios'
import { RegisterProps, UseAuthProps } from '@/types'
import { useParams, useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect } from "react"
import useSWR from "swr"

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// export const useAuth = ({ middleware = 'guest', redirectIfAuthenticated = '/dashbord' } = {}) => {
//     const router = useRouter()
//     const params = useParams()

//     const {data: user,  error, mutate } = useSWR('api/user', () =>

//         fetch(BASE_URL + 'api/user')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Erreur HTTP ' + response.status);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data); 
//         })
//         .catch(error => {
//             if (error.response.status !== 409) throw error

//                 router.push('/verify-email')
//         })
//     )

//     const csrf = () => fetch(BASE_URL + '/sanctum/csrf-cookie')

//     // const register = async ({ ...props }) => {
//     //     await csrf()

//     //     // setErrors([])

//     //     // Données à envoyer dans le corps de la requête (peut être un objet JavaScript)
//     //     // const data = {
//     //     //     username: 'utilisateur',
//     //     //     password: 'motdepasse'
//     //     // };
        
//     //     // Options de la requête
//     //     // const options = {
//     //     //     method: 'POST',
//     //     //     credentials: 'include', // Equivalent to withCredentials: true
//     //     //     headers: {
//     //     //         'Content-Type': 'application/json',
//     //     //         'X-Requested-With': 'XMLHttpRequest',
//     //     //     },
//     //     //     body: JSON.stringify(props),
//     //     // };

//     //     const url = '/register';
        
//     //     // Envoi de la requête POST
//     //     fetch(BASE_URL + url, {
//     //         method: 'POST',
//     //         credentials: 'include', // Equivalent to withCredentials: true
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //             'X-Requested-With': 'XMLHttpRequest',
//     //         },
//     //         body: JSON.stringify(props),
//     //     })
//     //         .then(() => mutate)
//     //         .catch(error => {
//     //             if (error.response.status !== 422) throw error

//     //             // setErrors(error.response.data.errors)
//     //         });
  
//     // }
    
//     const register = async ({ setErrors, ...props }) => {
//         try {
//             // Appel à la fonction csrf pour obtenir le token CSRF
//             await csrf();
    
//             // Réinitialisation des erreurs
//             setErrors([]);
    
//             // Envoi de la requête POST avec Fetch
//             const response = await fetch(BASE_URL + '/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     // Ajoutez d'autres en-têtes si nécessaire, tels que le token CSRF
//                 },
//                 body: JSON.stringify(props), // Conversion des données en JSON
//             });
    
//             // Vérification de la réponse HTTP
//             if (!response.ok) {
//                 // Si le statut n'est pas 200 (OK), lancez une erreur
//                 throw new Error('Erreur HTTP ' + response.status);
//             }
    
//             // Mise à jour des données après l'enregistrement
//             mutate();
//         } catch (error) {
//             // Gestion des erreurs
//             if (error.response && error.response.status === 422) {
//                 // Si le statut est 422 (Unprocessable Entity), récupérez les erreurs et mettez-les à jour
//                 const responseData = await error.response.json();
//                 setErrors(responseData.errors);
//             } else {
//                 // Sinon, lancez l'erreur pour être traitée ailleurs
//                 throw error;
//             }
//         }
//     };
    

//     const logout = async () => {
//         if (!error) {
//             const options = {
//                 method: 'POST',
//             }
//             await fetch('/logout', options).then(() => mutate())
//         }
//     }

//     useEffect(() => {
//       if (middleware === 'guest' && redirectIfAuthenticated && user)
//         router.push(redirectIfAuthenticated)
//       if (
//         window.location.pathname === '/verify-email' 
//         // && 
//         // user?.email_verified_at
//       )
//         router.push(redirectIfAuthenticated)
//       if (middleware === 'auth' && error) logout()
//     }, [user, error])
    

//     return {
//         user,
//         register,
//         logout
//     }
// }

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthProps = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('api/user', () => 
        axios
            .get('api/user')
            .then(res => res.data)
            .catch(error => { 
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: RegisterProps) => {
        await csrf()
        setErrors({})

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error
                console.log(error.response.data.errors);
                setErrors(error.response.data.errors);
                
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at && 
            redirectIfAuthenticated
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }

}
