#!/usr/bin/env python3
"""
Test script to verify marketplace functionality and image URLs
"""

import requests
import json
from backend.app.routes.marketplace import MOCK_PRODUCTS

def test_image_urls():
    """Test if all product image URLs are accessible"""
    print("🔍 Testing product image URLs...")
    
    failed_images = []
    for product in MOCK_PRODUCTS:
        try:
            response = requests.head(product['image'], timeout=5)
            if response.status_code != 200:
                failed_images.append({
                    'product': product['name'],
                    'url': product['image'],
                    'status': response.status_code
                })
                print(f"❌ {product['name']}: {response.status_code}")
            else:
                print(f"✅ {product['name']}: OK")
        except Exception as e:
            failed_images.append({
                'product': product['name'],
                'url': product['image'],
                'error': str(e)
            })
            print(f"❌ {product['name']}: {str(e)}")
    
    if failed_images:
        print(f"\n⚠️  {len(failed_images)} images failed to load:")
        for img in failed_images:
            print(f"   - {img['product']}: {img.get('status', img.get('error'))}")
    else:
        print(f"\n🎉 All {len(MOCK_PRODUCTS)} product images are accessible!")

def print_product_summary():
    """Print summary of products by category"""
    print("\n📊 Product Summary:")
    categories = {}
    
    for product in MOCK_PRODUCTS:
        category = product['category']
        if category not in categories:
            categories[category] = []
        categories[category].append(product)
    
    for category, products in categories.items():
        print(f"\n{category.upper()} ({len(products)} items):")
        for product in products:
            organic_badge = "🌿" if product['organic'] else ""
            print(f"  - {product['name']} - ₹{product['price']} {organic_badge}")

def print_sustainability_metrics():
    """Print overall sustainability metrics"""
    print("\n🌱 Sustainability Metrics:")
    
    total_products = len(MOCK_PRODUCTS)
    organic_products = sum(1 for p in MOCK_PRODUCTS if p['organic'])
    avg_sustainability = sum(p['sustainability_score'] for p in MOCK_PRODUCTS) / total_products
    avg_carbon = sum(p['carbon_footprint'] for p in MOCK_PRODUCTS) / total_products
    avg_distance = sum(p['distance_km'] for p in MOCK_PRODUCTS) / total_products
    
    print(f"  Total Products: {total_products}")
    print(f"  Organic Products: {organic_products} ({organic_products/total_products*100:.1f}%)")
    print(f"  Average Sustainability Score: {avg_sustainability:.1f}/100")
    print(f"  Average Carbon Footprint: {avg_carbon:.2f}kg")
    print(f"  Average Distance: {avg_distance:.1f}km")

if __name__ == "__main__":
    print("🌾 Krishi Marketplace Test")
    print("=" * 50)
    
    print_product_summary()
    print_sustainability_metrics()
    
    # Uncomment to test image URLs (requires internet)
    # test_image_urls()
    
    print("\n✅ Marketplace test completed!")