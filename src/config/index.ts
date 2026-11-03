function requireEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
}

export const config = {
    port: Number(process.env.PORT) || 3000,
    databaseUrl: requireEnv("DATABASE_URL"),
    jwtSecret: requireEnv("JWT_SECRET"),
    jwtExpiresInSeconds: 7 * 24 * 60 * 60, // 7 days, in seconds
};
