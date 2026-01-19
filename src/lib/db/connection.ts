import postgres from 'postgres'

const sql = postgres({
    host: process.env.POSTGRES_HOST as string,
    port: 5433,
    database: process.env.POSTGRES_DATABASE as string,
    username: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string
});

export default sql;
