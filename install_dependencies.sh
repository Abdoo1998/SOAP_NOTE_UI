#!/bin/bash

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

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    print_message "Detected Linux OS"
    
    # Detect package manager
    if command -v apt-get &> /dev/null; then
        # Debian/Ubuntu
        print_message "Installing Node.js using apt..."
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command -v dnf &> /dev/null; then
        # Fedora
        print_message "Installing Node.js using dnf..."
        sudo dnf install -y nodejs
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        print_message "Installing Node.js using yum..."
        curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
        sudo yum install -y nodejs
    elif command -v pacman &> /dev/null; then
        # Arch Linux
        print_message "Installing Node.js using pacman..."
        sudo pacman -S nodejs npm
    else
        print_error "Unsupported Linux distribution. Please install Node.js manually."
        exit 1
    fi

elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    print_message "Detected macOS"
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        print_message "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH
        if [[ $(uname -m) == "arm64" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
            eval "$(/opt/homebrew/bin/brew shellenv)"
        else
            echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
            eval "$(/usr/local/bin/brew shellenv)"
        fi
    else
        print_message "Homebrew is already installed"
        print_message "Updating Homebrew..."
        brew update
    fi

    # Install Node.js using Homebrew
    print_message "Installing Node.js..."
    brew install node

elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    print_message "Detected Windows OS"
    print_message "Please download and install Node.js from https://nodejs.org/"
    print_message "Or if you have chocolatey installed, run: choco install nodejs"
    print_message "After installation, please restart your terminal and run this script again"
    exit 1
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Verify installations
print_message "Verifying installations..."
if command -v node &> /dev/null; then
    print_message "Node.js installation successful!"
    print_message "Node.js version: $(node --version)"
    print_message "npm version: $(npm --version)"
else
    print_error "Node.js installation failed. Please try installing manually."
    exit 1
fi

print_message "Installation complete! You can now run ./run.sh to start the application" 