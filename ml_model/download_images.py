import requests
import os
import csv

# --- Configuration ---
# The base directory where data will be stored, relative to this script.
BASE_DATA_DIR = "data"
# The path for the metadata CSV file.
METADATA_FILE = "metadata.csv"
# The headers for the metadata CSV file.
METADATA_HEADERS = [
    'image_filename', 'observation_id', 'latitude', 'longitude', 
    'observed_on', 'taxon_id', 'taxon_name'
]
# The base URL for the iNaturalist API v1
INAT_API_BASE_URL = "https://api.inaturalist.org/v1"
# Number of images to download per class
IMAGES_PER_CLASS = 1000
# The taxa (classes) we want to download
TAXA_TO_DOWNLOAD = [
    "Ephemeroptera",  # Mayflies
    "Plecoptera",     # Stoneflies
    "Trichoptera",    # Caddisflies
    "Coleoptera",     # Beetles (as a negative class)
    "Araneae"         # Spiders (as another negative class)
]

def setup_environment():
    """Create the base data directory and initialize the metadata CSV if needed."""
    # Create data directory
    if not os.path.exists(BASE_DATA_DIR):
        os.makedirs(BASE_DATA_DIR)
        print(f"Created base directory: {BASE_DATA_DIR}")
    
    # Create metadata file with headers if it doesn't exist
    if not os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(METADATA_HEADERS)
        print(f"Created metadata file: {METADATA_FILE}")

def download_images_for_taxon(taxon_name, limit):
    """
    Downloads a specified number of images for a given taxon from iNaturalist
    and saves their metadata.
    """
    print(f"\n--- Starting download for taxon: {taxon_name} ---")

    # 1. Create a directory for the taxon
    taxon_dir = os.path.join(BASE_DATA_DIR, taxon_name)
    if not os.path.exists(taxon_dir):
        os.makedirs(taxon_dir)
        print(f"Created directory: {taxon_dir}")

    # 2. Set up API request parameters
    params = {
        "taxon_name": taxon_name,
        "per_page": 200, # Max allowed
        "media_type": "photo",
        "swlat": 0,
        "swlng": -155,
        "nelat": 60,
        "nelng": -40
    }

    # 3. Make the API request
    try:
        response = requests.get(f"{INAT_API_BASE_URL}/observations", params=params)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from iNaturalist API: {e}")
        return

    observations = response.json().get("results", [])
    print(f"Found {len(observations)} observations for {taxon_name}.")

    # 4. Download images and save metadata
    download_count = 0
    with open(METADATA_FILE, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        for obs in observations:
            if download_count >= limit:
                break

            if "photos" in obs and obs["photos"]:
                photo = obs["photos"][0]
                photo_url = photo.get("url")
                photo_id = photo.get("id")
                obs_id = obs.get("id")

                if not photo_url:
                    continue

                image_url = photo_url.replace("square", "large")
                image_filename = f"{taxon_name}/{taxon_name}_{obs_id}_{photo_id}.jpg"
                image_path = os.path.join(BASE_DATA_DIR, image_filename)

                if os.path.exists(image_path):
                    continue

                try:
                    # Download image
                    img_response = requests.get(image_url, stream=True)
                    img_response.raise_for_status()
                    with open(image_path, "wb") as img_f:
                        for chunk in img_response.iter_content(chunk_size=8192):
                            img_f.write(chunk)
                    
                    # Extract metadata
                    lat, lon = (None, None)
                    if obs.get("location"):
                        lat, lon = obs["location"].split(',')

                    metadata_row = [
                        image_filename,
                        obs_id,
                        lat,
                        lon,
                        obs.get("observed_on_string"),
                        obs.get("taxon", {}).get("id"),
                        obs.get("taxon", {}).get("name")
                    ]
                    
                    # Write metadata to CSV
                    writer.writerow(metadata_row)
                    
                    print(f"  ({download_count + 1}/{limit}) Downloaded {image_filename}")
                    download_count += 1

                except requests.exceptions.RequestException as e:
                    print(f"  Error downloading image {image_url}: {e}")

    print(f"--- Finished download for {taxon_name}. Total downloaded: {download_count} ---")


if __name__ == "__main__":
    print("=== Starting iNaturalist Image Downloader ===")
    setup_environment()
    for taxon in TAXA_TO_DOWNLOAD:
        download_images_for_taxon(taxon, IMAGES_PER_CLASS)
    print("\n=== All downloads complete. ===")
