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

// CUSTOMERS
export const CreateCustomerSchema = z.object({
    first_name: z.string().min(1, { message: 'Un prénom est requis' }),
    last_name: z.string().min(1, { message: 'Un nom est requis' }),
    email: z.string().email({
        message: 'Veuillez rentrer une adresse email valide',
    }),
    phone: z.string().min(1, { message: 'Un numéro de téléphone est requis' }),
    adresse: z.string().min(1, { message: 'Une adresse est requise' }),
    company: z.string().optional(),
});

export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;

export const DeleteCustomerSchema = z.object({
    id: z.string().cuid(),
});
export type DeleteCustomerSchemaType = z.infer<typeof DeleteCustomerSchema>;

export const UpdateCustomerSchema = z.object({
    id: z.string().cuid(),
    first_name: z.string().min(1, { message: 'Un prénom est requis' }),
    last_name: z.string().min(1, { message: 'Un nom est requis' }),
    email: z
        .string()
        .email({ message: 'Veuillez rentrer une adresse email valide' }),
    phone: z.string().min(1, { message: 'Un numéro de téléphone est requis' }),
    adresse: z.string().min(1, { message: 'Une adresse est requise' }),
    company: z.string().optional().nullable(),
});
export type UpdateCustomerSchemaType = z.infer<typeof UpdateCustomerSchema>;

// ORDERS
export const OrderStatusSchema = z.enum([
    'PENDING',
    'CONFIRMED',
    'FULFILLED',
    'INVOICED',
    'CANCELLED',
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderLineSchema = z.object({
    id: z.string().cuid(),
    quantity: z.number().int(),
    unit_price: z.number(),
    total: z.number(),
    discount: z.number().optional().nullable(),
    order_id: z.string().cuid(),
    wine_id: z.string().cuid(),
});

export const OrderSchema = z.object({
    id: z.string().cuid(),
    created_at: z.string(),
    updated_at: z.string(),
    status: OrderStatusSchema,
    author_id: z.string().cuid(),
    client_id: z.string().cuid(),
    lines: z.array(OrderLineSchema),
    client: z.object({
        id: z.string().cuid(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        adresse: z.string(),
        company: z.string().optional().nullable(),
    }),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderLine = z.infer<typeof OrderLineSchema>;

export const CreateOrderSchema = z.object({
    client_id: z.string().cuid().min(1, 'Le client est requis'),
    lines: z
        .array(
            z.object({
                wine_id: z.string().cuid().min(1, 'Le vin est requis'),
                quantity: z
                    .number()
                    .min(1, 'La quantité doit être au moins de 1'),
                unit_price: z
                    .number()
                    .min(0, 'Le prix unitaire doit être positif'),
                discount: z.number().min(0).optional(),
            })
        )
        .min(1, 'Au moins une ligne de commande est requise'),
});

export type CreateOrderSchemaType = z.infer<typeof CreateOrderSchema>;
