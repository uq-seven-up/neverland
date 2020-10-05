# /bin/bash
set -euo pipefail
docker-compose -f .\docker\local-mongo.yml up
