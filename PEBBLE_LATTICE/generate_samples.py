#!/usr/bin/env python3
"""
Sample Pebble Lattice Data Generator
Generates sample pebble IDs for demonstration
"""

import sys
import os
import json
import hashlib
from datetime import datetime, timezone

# Simple inline version of necessary VaultMesh functions
def generate_pebble_id(brand_name: str, brand_id: int) -> str:
    """Generate PEBBLE LATTICE™ ID"""
    hash_input = f"{brand_name}_{brand_id}_FROSTED_ROOTS"
    hash_value = hashlib.md5(hash_input.encode()).hexdigest()[:8].upper()
    return f"PBL-{hash_value}-{brand_id:05d}"

def gorilla_codex_hash(data: str) -> str:
    """Generate Gorilla Codex hash"""
    salt = "NEXUS_NAIR_FROSTED_ROOTS"
    combined = f"{salt}{data}9"
    return hashlib.sha256(combined.encode()).hexdigest()

def verify_brand(brand_name: str, brand_id: int) -> dict:
    """Verify a brand"""
    pebble_id = generate_pebble_id(brand_name, brand_id)
    codex_hash = gorilla_codex_hash(f"{brand_name}_{brand_id}")
    
    return {
        "brand_name": brand_name,
        "brand_id": brand_id,
        "verified": True,
        "pebble_id": pebble_id,
        "codex_hash": codex_hash,
        "status": "Below the Seed",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

def generate_sample_brands():
    """Generate sample brand data"""
    sample_brands = [
        {"id": 1, "name": "TechCorp Solutions", "category": "Technology"},
        {"id": 2, "name": "FashionForward Inc", "category": "Fashion"},
        {"id": 3, "name": "HealthFirst Medical", "category": "Healthcare"},
        {"id": 4, "name": "AutoDrive Motors", "category": "Automotive"},
        {"id": 5, "name": "FoodDelight Co", "category": "Food & Beverage"},
        {"id": 542, "name": "RetailPro Systems", "category": "Retail"},
        {"id": 1337, "name": "GameStudio Elite", "category": "Entertainment"},
        {"id": 2048, "name": "FinanceSecure Bank", "category": "Financial"},
        {"id": 4096, "name": "TravelExplore Agency", "category": "Travel"},
        {"id": 8192, "name": "IndustrialWorks Ltd", "category": "Industrial"},
    ]
    return sample_brands

def main():
    """Generate and display sample pebble lattice data"""
    print("=" * 60)
    print("PEBBLE LATTICE™ - SAMPLE DATA GENERATOR")
    print("=" * 60)
    print()
    
    sample_brands = generate_sample_brands()
    
    print(f"Generating Pebble IDs for {len(sample_brands)} sample brands...")
    print()
    
    verified_brands = []
    for brand in sample_brands:
        verification = verify_brand(brand['name'], brand['id'])
        verification['category'] = brand['category']
        verified_brands.append(verification)
        
        print(f"Brand #{brand['id']:05d}: {brand['name']}")
        print(f"  Pebble ID: {verification['pebble_id']}")
        print(f"  Category:  {brand['category']}")
        print(f"  Status:    {verification['status']}")
        print(f"  Verified:  {'✓' if verification['verified'] else '✗'}")
        print()
    
    # Save to JSON file
    output_file = os.path.join(os.path.dirname(__file__), 'sample_pebbles.json')
    with open(output_file, 'w') as f:
        json.dump({
            "total_brands": 13713,
            "sample_count": len(verified_brands),
            "achievement": "152.4%",
            "brands": verified_brands,
            "system": "PEBBLE LATTICE™",
            "status": "Below the Seed"
        }, f, indent=2)
    
    print("=" * 60)
    print(f"Sample data saved to: {output_file}")
    print("=" * 60)
    print()
    print("PEBBLE LATTICE™ STATUS: ACTIVE")
    print("Total Brands: 13,713 (152.4% Target Achievement)")
    print("Sample Generated: 10 brands")
    print()
    print("\"Below the Seed\"")
    print("=" * 60)

if __name__ == "__main__":
    main()
