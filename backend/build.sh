#!/usr/bin/env bash
# Exit immediately if any command fails
set -e

echo "=== FD Saathi Backend Build ==="
echo "Python version: $(python --version)"
echo "Pip version: $(pip --version)"

# Upgrade pip first
pip install --upgrade pip

# Install with --only-binary=:all: for pydantic-core to avoid Rust compilation.
# This forces pip to use pre-built wheels instead of compiling from source.
pip install --only-binary=pydantic-core pydantic==2.5.3

# Install the rest of the requirements normally
pip install fastapi==0.110.3
pip install uvicorn==0.29.0
pip install python-dotenv==1.0.1
pip install google-generativeai==0.7.2
pip install langdetect==1.0.9
pip install httpx==0.26.0
pip install python-multipart==0.0.9
pip install anyio==4.3.0

echo "=== Build complete ==="
