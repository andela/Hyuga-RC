FROM reactioncommerce/base:latest

# Default environment variables
ENV ROOT_URL "http://localhost"
ENV MONGO_URL "mongodb://127.0.0.1:27017/reaction"
# Insert JUSIBE public key and API Token.
ENV JUSIBE_PUBLIC_KEY "0c20d915e92b2718e50be245d350db64"
ENV JUSIBE_TOKEN "112e8722137c75496b93b7ce80713a68"
