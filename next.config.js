/** @type {import('next').NextConfig} */
require('dotenv').config();
const nextConfig = {}

module.exports = {
    nextConfig,
    env: {
        WORQHAT_API_KEY: process.env.WORQHAT_API_KEY,
        WORQHAT_ORG_KEY: process.env.WORQHAT_ORG_KEY,
    }
}
