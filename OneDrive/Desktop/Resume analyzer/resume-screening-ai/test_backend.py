"""
Quick test to verify backend is accessible
"""
import requests

def test_backend():
    """Test backend connectivity"""
    base_url = "http://localhost:8000"
    
    print("Testing backend connectivity...")
    print(f"Base URL: {base_url}")
    print("-" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"✅ Root endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return
    
    # Test API health endpoint
    try:
        response = requests.get(f"{base_url}/api/v1/health", timeout=5)
        print(f"✅ API Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ API Health check failed: {e}")
    
    print("-" * 50)
    print("Backend test complete!")

if __name__ == "__main__":
    test_backend()
