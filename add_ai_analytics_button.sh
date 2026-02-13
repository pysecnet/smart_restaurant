#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Path to Sidebar file
SIDEBAR_PATH="$HOME/Downloads/resturent/final year project/final year project/smart-restaurant/src/pages/admin/Sidebar.tsx"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}AI Analytics Button Installer${NC}"
echo -e "${BLUE}======================================${NC}"

# Check if Sidebar exists
if [ ! -f "$SIDEBAR_PATH" ]; then
    echo -e "${RED}❌ Sidebar.tsx not found at: $SIDEBAR_PATH${NC}"
    exit 1
fi

# Backup the original file
cp "$SIDEBAR_PATH" "$SIDEBAR_PATH.backup"
echo -e "${GREEN}✅ Backup created: Sidebar.tsx.backup${NC}"

# Check if AI Analytics already exists
if grep -q "AI Analytics" "$SIDEBAR_PATH"; then
    echo -e "${BLUE}ℹ️  AI Analytics button already exists!${NC}"
    exit 0
fi

# Define the AI Analytics menu item
AI_ANALYTICS_ITEM='        <Link
          to="/admin/ai-analytics"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
            location.pathname === '\''/admin/ai-analytics'\''
              ? '\''bg-blue-600 text-white'\''
              : '\''hover:bg-gray-100 text-gray-700'\''
          }`}
        >
          <span className="text-xl">🤖</span>
          <span className="font-medium">AI Analytics</span>
        </Link>'

# Try to find a good insertion point (after Dashboard or Reports)
if grep -q "Reports</span>" "$SIDEBAR_PATH"; then
    # Insert after Reports link closes
    awk '/Reports<\/span>/{flag=1} flag && /<\/Link>/{print; print ""; print "'"$AI_ANALYTICS_ITEM"'"; flag=0; next} 1' "$SIDEBAR_PATH" > "$SIDEBAR_PATH.tmp" && mv "$SIDEBAR_PATH.tmp" "$SIDEBAR_PATH"
    echo -e "${GREEN}✅ AI Analytics button added after Reports!${NC}"
elif grep -q "Dashboard</span>" "$SIDEBAR_PATH"; then
    # Insert after Dashboard link closes
    awk '/Dashboard<\/span>/{flag=1} flag && /<\/Link>/{print; print ""; print "'"$AI_ANALYTICS_ITEM"'"; flag=0; next} 1' "$SIDEBAR_PATH" > "$SIDEBAR_PATH.tmp" && mv "$SIDEBAR_PATH.tmp" "$SIDEBAR_PATH"
    echo -e "${GREEN}✅ AI Analytics button added after Dashboard!${NC}"
else
    echo -e "${RED}❌ Could not find insertion point. Showing Sidebar content...${NC}"
    cat "$SIDEBAR_PATH"
    exit 1
fi

echo -e "${BLUE}======================================${NC}"
echo -e "${GREEN}✅ Installation complete!${NC}"
echo -e "${BLUE}Refresh your browser to see the AI Analytics button.${NC}"
echo -e "${BLUE}======================================${NC}"
