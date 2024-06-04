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

export const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: 'Veuillez rentrer une adresse email valide',
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: 'Le mot de passe doit détenir 6 caractères minimum',
    }),
});

export const accountFormSchema = z.object({
    firstName: z
        .string()
        .min(1, {
            message: 'Un prénom est requis',
        })
        .max(30, {
            message: 'Un prénom ne doit pas faire plus de 30 caractères',
        }),
    lastName: z
        .string()
        .min(1, {
            message: 'Un nom est requis',
        })
        .max(30, {
            message: 'Un nom ne doit pas faire plus de 30 caractères',
        }),
    email: z.string().email({
        message: 'Veuillez rentrer une adresse email valide',
    }),
    password: z
        .union([
            z
                .string()
                .min(6, { message: 'Password must be at least 6 characters.' }),
            z.literal(''),
        ])
        .optional(),
    image:
        typeof window === 'undefined'
            ? z.any()
            : z.instanceof(FileList).optional(),
});

// WINES
export const CreateWineSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    type: z.enum(['RED', 'WHITE', 'ROSE'], { message: 'Type is required' }),
    region: z.string().min(1, { message: 'Region is required' }),
    year: z.number().min(1900, { message: 'Year must be a valid year' }),
    price: z.number().min(0, { message: 'Price must be a positive number' }),
    stock: z.number().min(0, { message: 'Stock must be a positive number' }),
    stock_alert: z
        .number()
        .min(0, { message: 'Stock Alert must be a positive number' }),
});
export type CreateWineSchemaType = z.infer<typeof CreateWineSchema>;

export const DeleteWineSchema = z.object({
    id: z.string().min(1, { message: 'ID is required' }),
});
export type DeleteWineSchemaType = z.infer<typeof DeleteWineSchema>;

export const UpdateWineSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    type: z.enum(['RED', 'WHITE', 'ROSE'], { message: 'Type is required' }),
    region: z.string().min(1, { message: 'Region is required' }),
    year: z.number().min(1900, { message: 'Year must be a valid year' }),
    price: z.number().min(0, { message: 'Price must be a positive number' }),
    stock: z.number().min(0, { message: 'Stock must be a positive number' }),
    stock_alert: z
        .number()
        .min(0, { message: 'Stock Alert must be a positive number' }),
});
export type UpdateWineSchemaType = z.infer<typeof UpdateWineSchema>;
