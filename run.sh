#!/bin/bash

# Function to stop all background processes on script exit
cleanup() {
    echo "Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to call cleanup function on script exit
trap cleanup EXIT

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please run ./install_dependencies.sh first."
    exit 1
fi

# Create and activate Python virtual environment
print_message "Setting up Python virtual environment..."
if [ ! -d "backend/venv" ]; then
    python3 -m venv backend/venv
fi
source backend/venv/bin/activate

# Install backend dependencies
print_message "Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_message "Creating .env file..."
    cat > .env << EOL
# Database Configuration
DATABASE_URL=postgresql://doadmin:AVNS_QUF0rKJ84xMFmQPRV8G@db-postgresql-nyc3-40182-do-user-18610351-0.f.db.ondigitalocean.com:25060/defaultdb?sslmode=require

# API Keys
OPENAI_API_KEY=sk-proj-66666666666666666666666666666666
GEMINI_API_KEY=AIzaSyA2EsqttdPkQQfbQx_n1pZl-b83yeG11Fc
ASSEMBLYAI_API_KEY=ca9031d75ccf4bccb3e7ec52cbe0d2df

# JWT Configuration
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
BACKEND_PORT=8000
FRONTEND_PORT=5173
EOL
    print_warning "Please update the .env file with your actual API keys and configuration"
fi

# Export environment variables
export $(cat .env | grep -v '^#' | xargs)

# Create logs directory
mkdir -p ../logs

# Start Backend with nohup
print_message "Starting FastAPI Backend on port $BACKEND_PORT..."
cd backend
nohup uvicorn api:app --reload --host 0.0.0.0 --port $BACKEND_PORT > ../logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Install frontend dependencies and start
print_message "Setting up frontend..."
cd ../frontend

# Clean install of frontend dependencies
print_message "Installing frontend dependencies..."
rm -rf node_modules package-lock.json
npm install

# Create frontend .env if it doesn't exist
if [ ! -f ".env" ]; then
    print_message "Creating frontend .env file..."
    cat > .env << EOL
VITE_API_URL=http://localhost:$BACKEND_PORT
VITE_PORT=$FRONTEND_PORT
EOL
fi

# Start frontend with nohup
print_message "Starting React Frontend on port $FRONTEND_PORT..."
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!

print_message "Application is starting up..."
print_message "Backend running on http://localhost:$BACKEND_PORT"
print_message "Frontend running on http://localhost:$FRONTEND_PORT"
print_message "Logs are available in the logs directory"
print_message "Press Ctrl+C to stop all services"

# Wait for all background processes
wait 