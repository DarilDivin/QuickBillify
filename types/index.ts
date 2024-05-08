import { Dispatch, SetStateAction } from "react";

export interface InputErrorProps {
    messages?: string[];
    className?: string;
}

export interface RegisterErrorType {
    email?: string[]; // Un tableau de messages d'erreur pour l'email
    name?: string[];
    password?: string[];
};


export interface RegisterProps {
    setErrors: Dispatch<SetStateAction<RegisterErrorType>>;
    // props: {
    //     [x: string]: any;
    // }
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface UseAuthProps {
    middleware?: string;
    redirectIfAuthenticated?: string;
}