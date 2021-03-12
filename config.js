const env = process.env;

const config = {
    db:{
        host: env.DB_HOST ||'hgloo-test.c2qff8pcwcn9.us-east-1.rds.amazonaws.com',
        user: env.DB_USER || 'admin',
        password: env.DB_PASSWORD || 'qQQyIIBJK5oMYQmGCAmX',
        database: env.DB_DATABASE || 'HglooApp'
    },
    //listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;