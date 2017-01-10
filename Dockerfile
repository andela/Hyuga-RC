FROM reactioncommerce/base:latest

# Default environment variables
ENV ROOT_URL "http://localhost"
ENV MONGO_URL "mongodb://127.0.0.1:27017/reaction"
# Insert JUSIBE public key and API Token.
ENV JUSIBE_PUBLIC_KEY "ABCDEF12345"
ENV JUSIBE_TOKEN "ABCDEF12345"
