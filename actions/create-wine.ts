'use server';

import { CreateWineSchemaType } from '@/schemas';

export const CreateWine = async (data: CreateWineSchemaType) => {
    console.log('CREATE WINE', data);
    // return prisma.wine.create({
    //     data: {
    //         name: data.name,
    //         type: data.type,
    //         region: data.region,
    //         year: data.year,
    //         price: data.price,
    //         stock: data.stock,
    //         stock_alert: data.stock_alert,
    //     },
    // });
};
