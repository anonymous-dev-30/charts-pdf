"use server";
import { PineconeClient } from "@pinecone-database/pinecone";

import fs from "fs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
let pinecone: PineconeClient | null = null;

export const gePineconeClient = async () => {
  if (!pinecone) {
    pinecone = new PineconeClient();
    const pineconeApiKey = process.env.PINECONE_ENVIORMENT_KEY!;
    await pinecone.init({
      apiKey: pineconeApiKey,
      environment: "gcp-starter",
    });
  }
    return pinecone;
};
 
async function getFileFromBucket(file_key: string, serverFileName: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const file = await fetch(
        `${process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_STORAGE}/${file_key}?alt=media`
      );
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], {
        type: "application/pdf",
      }).toString();

      if (!fs.existsSync("./temp/pdf")) {
        fs.mkdirSync("./temp/pdf", {
          recursive: true,
        });
      }
      fs.writeFileSync(serverFileName, blob);
      return resolve({});
    } catch (error) {
      console.error("getFileFromBucket >> error", error);
      return reject(error);
    }
  });
}

export async function loadFileToPinecone(file_key: string, file_name: string) {
  return new Promise(async (resolve, reject) => {
    const fileName = `temp/pdf/${file_name}-${Date.now()}.pdf`;
    try {
      await getFileFromBucket(file_key, fileName);
    } catch (error) {
      // toast
      console.error("loadFileToPinecone >> error", error);
    }
    try {
      const loader = new PDFLoader(fileName);
        const pages: any = await loader.load();
        if (pages?.message === 'Invalid PDF structure') {
            return reject("PDF parsing failed!");
        }
      return resolve(pages);
    } catch (error) {
        console.error("loadFileToPinecone >> error", error);
        return reject(error);
    }
  });
}