import { getClientCollection, getContractCollection } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

interface Contract {
    clientId: String;
    description: String;
    product: String;
    product_description?: string
    startDate: Date;
    price: string;
    isSigned: boolean;
}

export async function GET(req: NextRequest) {
    try {
        const col = await getClientCollection();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const skip = (page - 1) * limit;

        const total = await col.countDocuments();

        const list = await col.find()
                              .skip(skip)
                              .limit(limit)
                              .toArray();

        if (list.length === 0) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        return NextResponse.json({
            data: list,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {

    interface Contract {
        clientId: String;
        description: String;
        product: String;
        product_description?: string
        startDate: Date;
        price: string;
        isSigned: boolean;
    }

    try {
        const data = await req.json();
        const col = await getContractCollection();

        
        const result = await col.insertOne(data);
        return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ errorMessage: "erro ao inserir no db" }, { status: 500 })
    }

}
