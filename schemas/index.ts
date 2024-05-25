import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Veuillez rentrer une adresse email valide',
    }),
    password: z.string().min(1, {
        message: 'Le mot de passe est requis',
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Veuillez rentrer une adresse email valide',
    }),
    password: z.string().min(6, {
        message: 'Le mot de passe doit détenir 6 caractères minimum',
    }),
    firstName: z.string().min(1, {
        message: 'Un prénom est requis',
    }),
    lastName: z.string().min(1, {
        message: 'Un nom est requis',
    }),
});
