#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide an address"
    echo "Usage: ./fetch-raw-data.sh <address> [page]"
    exit 1
fi

ADDRESS=$1
PAGE=${2:-1}  # Default to page 1 if not provided
OUTPUT_DIR="data/raw"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $OUTPUT_DIR

# Fetch and save raw trading history
echo "Fetching trading history..."
curl -s "https://api.prod.flash.trade/trading-history/find-all-by-user-v2/$ADDRESS" | \
jq '.' > "$OUTPUT_DIR/trading_history_raw_v2_$TIMESTAMP.json"

# Fetch and save raw trading history for v3
echo "Fetching trading history v3..."
curl -s "https://api.prod.flash.trade/trading-history/find-all-by-user-v3/$ADDRESS?page=$PAGE" | \
jq '.' > "$OUTPUT_DIR/trading_history_raw_v3_$TIMESTAMP.json"

# Fetch and save raw PnL info
echo "Fetching PnL info..."
curl -s "https://api.prod.flash.trade/pnl-info/by-owner/$ADDRESS" | \
jq '.' > "$OUTPUT_DIR/pnl_info_raw_$TIMESTAMP.json"

echo "Raw data saved in $OUTPUT_DIR directory:"
echo "- trading_history_raw_v2_$TIMESTAMP.json"
echo "- trading_history_raw_v3_$TIMESTAMP.json"
echo "- pnl_info_raw_$TIMESTAMP.json"