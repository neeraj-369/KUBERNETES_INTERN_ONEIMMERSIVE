# Use the current Long Term Support (LTS) version of Node.js
FROM node:lts

# Copy the signalling server source code from the build context
COPY . /opt/Matchmaker

# Install the dependencies for the signalling server
WORKDIR /opt/Matchmaker
RUN npm install .

# Expose TCP ports 80 and 443 for player WebSocket connections and web server HTTP(S) access
EXPOSE 80
EXPOSE 443


EXPOSE 9999

# Set the signalling server as the container's entrypoint
ENTRYPOINT ["/usr/local/bin/node", "/opt/Matchmaker/matchmaker.js"]

# CMD ["url" , "user" , "password"]
