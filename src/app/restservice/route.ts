import http from '@/service/http';

export async function POST(request: Request) {
    const result = await http.Inbound(request.headers.get("Authorization") ?? "", JSON.stringify(request.body));
    const result2 = await result.json();
    return Response.json(result2);
}