import { defineConfig } from "drizzle-kit";
import { config } from "./src/config";


export default defineConfig({
    schema: './src/db/',
    out: "./src/db/migrations",
    dialect: 'postgresql',
    dbCredentials: {
        url: config.db.url,
    },
})