import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://mixck:Mixck20@ua-database.jjnzt.mongodb.net/?retryWrites=true&w=majority&appName=UA-DATABASE', 
  DB_NAME: process.env.DB_NAME || 'uaclinic',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ALLOWED_EMAIL_DOMAIN: process.env.ALLOWED_EMAIL_DOMAIN || 'ua.edu.ph',
  APP_NAME: process.env.APP_NAME || 'UA Clinic System',
};
