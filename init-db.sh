#!/bin/bash

#Starting the docker container
echo "Starting Docker taxEaseDB container..."
docker start taxEaseDB

# Wait for the container to be healthy
echo "Waiting for taxEaseDB container to be healthy..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' taxEaseDB)" == "healthy" ]; do
  echo "Still starting... waiting 10 seconds..."
  sleep 10
done

echo "Container is healthy!"

# Wait for Oracle DB to be ready
echo "Waiting for Oracle DB to be ready..."
until  docker exec -i taxEaseDB sh -c "echo exit | sqlplus -S sys/sys@localhost:1521/XE as sysdba"; do
  echo "Waiting for Oracle DB to accept connections..."
  sleep 5
done

echo "Opening PDB taxease_pdb..."
docker exec -i taxEaseDB sh -c "echo 'ALTER PLUGGABLE DATABASE taxease_pdb OPEN;' | sqlplus -S sys/sys@localhost:1521/XE as sysdba"

echo "PDB taxease_pdb is now open!"