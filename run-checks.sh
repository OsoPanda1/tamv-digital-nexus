#!/bin/bash

echo "=== Running TAMV Quality Checks ==="
echo "=================================="

# Check 1: Constitutional Linting
echo -e "\n1. Running Constitutional Linting..."
npm run lint:constitution

# Check 2: Semantic Scanning
echo -e "\n2. Running Semantic Scanner..."
npm run scan:semantics

# Check 3: ESLint
echo -e "\n3. Running ESLint..."
npm run lint

# Check 4: TypeScript
echo -e "\n4. Running TypeScript Check..."
npm run check

# Check 5: Unit Tests
echo -e "\n5. Running Unit Tests..."
npm run test

# Check 6: Architecture Check
echo -e "\n6. Running Architecture Check..."
npm run check:architecture

