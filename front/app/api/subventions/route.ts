import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { dsvFormat } from "d3-dsv";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "db", "subventions.csv");
    const fileContent = await fs.readFile(filePath, "utf8");
    const parser = dsvFormat(","); 
    const parsedData = parser.parse(fileContent);

    return NextResponse.json({ success: true, data: parsedData }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
