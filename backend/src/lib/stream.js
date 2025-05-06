import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
  throw new Error('STREAM_API_KEY and STREAM_API_SECRET must be set');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async(userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch(error) {
        console.error("Error upserting Stream user:", error);
    }
}

// This function generates a token for a user to connect to the Stream Chat service
export const generateStreamToken = (userId) => {
    try {
        // ensure the userId is a string
        const userIdString = userId.toString();
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
}