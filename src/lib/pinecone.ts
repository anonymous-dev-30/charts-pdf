import { PineconeClient } from "@pinecone-database/pinecone";

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
 

export async function loadFileToPinecone(file_key: string) {
    
}