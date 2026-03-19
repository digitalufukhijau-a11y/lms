#!/bin/bash

echo "🔐 Generating Secure Secrets"
echo "============================="
echo ""

echo "JWT_SECRET:"
openssl rand -base64 32
echo ""

echo "JWT_REFRESH_SECRET:"
openssl rand -base64 32
echo ""

echo "NEXTAUTH_SECRET:"
openssl rand -base64 32
echo ""

echo "Copy these values to your .env files"
