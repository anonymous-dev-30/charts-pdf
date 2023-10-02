"use server";

import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
      const { file_key, file_name } = body;
      
  } catch (error) {
    console.error(error);
    NextResponse.json({
      error: `Internal Server error ${error}`,
      status: 500,
    });
  }
}
