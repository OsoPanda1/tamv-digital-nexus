#!/bin/bash

echo "=== Running TAMV Quality Checks ==="
echo "=================================="

# Check 1: ESLint
echo -e "\n1. Running ESLint..."
npm run lint

# Check 2: TypeScript
echo -e "\n2. Running TypeScript Check..."
npm run check

# Check 3: Unit Tests
echo -e "\n3. Running Unit Tests..."
npm run test

# Check 4: Architecture Check
echo -e "\n4. Running Architecture Check..."
npm run check:architecture

