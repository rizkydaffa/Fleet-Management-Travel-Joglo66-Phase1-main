#!/bin/bash
# Railway startup script
# Railway sets the PORT environment variable automatically

# Use Railway's PORT or default to 8001
export PORT=${PORT:-8001}

echo "Starting uvicorn on port $PORT"
uvicorn server:app --host 0.0.0.0 --port $PORT
