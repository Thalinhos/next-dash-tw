import { getClientCollection } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const col = await getClientCollection();
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const query = searchParams.get('q')?.toLowerCase() || '';


        const skip = (page - 1) * limit;

         const searchFilter = query
      ? {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { phone: { $regex: query, $options: 'i' } }
          ]
        }
      : {};

        const total = await col.countDocuments();

        const list = await col
                              .find(searchFilter)
                              .sort({ createdAt: -1 })
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
    try {
        const data = await req.json();
        const col = await getClientCollection();
        const client = await col.findOne({ email: data.email });
        if (client) return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
        const result = await col.insertOne( {...data, active: true }) ;
        return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ errorMessage: "erro ao inserir no db" }, { status: 500 })
    }

}
