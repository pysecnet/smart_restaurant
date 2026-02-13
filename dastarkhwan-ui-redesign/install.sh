#!/bin/bash
# ============================================
# Dastarkhwan UI Redesign - Installation Script
# ============================================
# This script copies all redesigned/new files
# to your frontend/src/ directory.
#
# Usage:
#   1. Place this script in your project root
#   2. Place the 'src' folder next to it
#   3. Run: bash install.sh
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Detect frontend directory
if [ -d "./frontend/src" ]; then
    FRONTEND="./frontend"
elif [ -d "./src" ]; then
    FRONTEND="."
else
    echo -e "${RED}Error: Cannot find frontend/src directory.${NC}"
    echo "Run this script from your project root or frontend directory."
    exit 1
fi

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW} Dastarkhwan UI Redesign Installer${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo -e "Target: ${GREEN}${FRONTEND}/src/${NC}"
echo ""

# Backup
BACKUP_DIR="./backup_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"

# List of files to install
declare -a FILES=(
    "src/services/authService.ts"
    "src/context/AuthContext.tsx"
    "src/pages/Reservation.tsx"
    "src/pages/Register.tsx"
    "src/pages/Login.tsx"
    "src/pages/Profile.tsx"
    "src/pages/EditProfile.tsx"
    "src/pages/Home.tsx"
    "src/pages/Reviews.tsx"
    "src/pages/Contact.tsx"
    "src/pages/OrdersManagement.tsx"
    "src/pages/About.tsx"
    "src/components/Footer.tsx"
)

# Backup existing files
for file in "${FILES[@]}"; do
    target="${FRONTEND}/${file}"
    if [ -f "$target" ]; then
        backup_path="${BACKUP_DIR}/${file}"
        mkdir -p "$(dirname "$backup_path")"
        cp "$target" "$backup_path"
    fi
done
echo -e "${GREEN}Backup saved to: ${BACKUP_DIR}${NC}"
echo ""

# Ensure directories exist
mkdir -p "${FRONTEND}/src/services"
mkdir -p "${FRONTEND}/src/context"
mkdir -p "${FRONTEND}/src/pages"
mkdir -p "${FRONTEND}/src/components"

# Copy files
echo -e "${YELLOW}Installing files...${NC}"
for file in "${FILES[@]}"; do
    # Source is relative to where this script's companion 'src' folder is
    source_file="./${file}"
    target_file="${FRONTEND}/${file}"
    
    if [ -f "$source_file" ]; then
        cp "$source_file" "$target_file"
        echo -e "  ${GREEN}✓${NC} ${file}"
    else
        echo -e "  ${RED}✗${NC} ${file} (source not found)"
    fi
done

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Files installed:${NC} ${#FILES[@]} files"
echo -e "${YELLOW}Backup location:${NC} ${BACKUP_DIR}"
echo ""
echo -e "${YELLOW}Summary of changes:${NC}"
echo "  • authService.ts - Added address field to User type"
echo "  • AuthContext.tsx - Updated register to pass phone/address"
echo "  • Reservation.tsx - Fixed input deselection bug"
echo "  • Register.tsx - Phone mandatory, address field added"
echo "  • Login.tsx - Enhanced with feature highlights"
echo "  • Profile.tsx - Shows address field"
echo "  • EditProfile.tsx - Address editing added"
echo "  • Home.tsx - New landing page with hero, menu, stats"
echo "  • Reviews.tsx - Complete redesign with ratings, filters"
echo "  • Contact.tsx - New page with form, info cards, map"
echo "  • OrdersManagement.tsx - Shows customer details"
echo "  • About.tsx - Complete redesign with story, team, gallery"
echo "  • Footer.tsx - New footer component"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Import Footer in your App.tsx layout"
echo "  2. Remove /dashboard route (redirect to /menu or /admin)"
echo "  3. Remove 'Dashboard' link from Navbar"
echo "  4. Run: npm start"
echo ""
