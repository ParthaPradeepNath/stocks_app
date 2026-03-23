import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    // allowing mongoose cache to exist
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

// Need to cache the connection, because in NextJS hot reload mode, mongoose.connect is called on every request
let cached = global.mongooseCache

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null }
}

export const connectToDatabase = async () => {
    if (!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

    /** 
    and this function store the connection in a global cache, so that it doesn't keep opening duplicates if a connection already exists it returns the cached connection immediately
    if not it create a new one by calling mongoose.connect and the saves it in cache
    if connection fails it clears the cache so retries can happen properly, and pattern is necessary because NextJS re run the code in each change & you will get multiple duplicate connections
    */
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands: false })
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    console.log(`Connected to database ${process.env.NODE_ENV} -${MONGODB_URI}`)
}