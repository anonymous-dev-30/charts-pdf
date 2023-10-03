"use server";

import { loadFileToPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
      const pages = await loadFileToPinecone(file_key, file_name);
      return NextResponse.json({
          status: 'success',
          pages
      })
  } catch (error) {
      console.error(error);
    NextResponse.json({
      error: `Internal Server error ${error}`,
      status: 500,
    });
  }
}
