import os
import json
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

class PostgresPipeline:
    def __init__(self):
        # Construct DB URL from env
        db_user = os.getenv("POSTGRES_USER", "postgres")
        db_password = os.getenv("POSTGRES_PASSWORD", "postgres")
        db_host = os.getenv("POSTGRES_HOST", "localhost")
        db_port = os.getenv("POSTGRES_PORT", "5433") # Default to local docker port
        db_name = os.getenv("POSTGRES_DB", "ikigai")
        
        self.db_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        self.engine = create_engine(self.db_url)
        self.Session = sessionmaker(bind=self.engine)

    def process_item(self, item, spider):
        session = self.Session()
        try:
            # Simple upsert query
            sql = text("""
                INSERT INTO properties (
                    id, source, source_listing_id, address, listing_price, 
                    floor_plan, total_area_sqm, year_built, listing_url, 
                    images, features, created_at, updated_at
                ) VALUES (
                    gen_random_uuid(), :source, :source_listing_id, :address, :listing_price,
                    :floor_plan, :total_area_sqm, :year_built, :listing_url,
                    :images, :features, NOW(), NOW()
                )
                ON CONFLICT (source, source_listing_id) 
                DO UPDATE SET 
                    listing_price = EXCLUDED.listing_price,
                    updated_at = NOW();
            """)
            
            session.execute(sql, {
                "source": item.get("source"),
                "source_listing_id": item.get("source_listing_id"),
                "address": item.get("address"),
                "listing_price": item.get("listing_price"),
                "floor_plan": item.get("floor_plan"),
                "total_area_sqm": item.get("total_area_sqm"),
                "year_built": item.get("year_built"),
                "listing_url": item.get("listing_url"),
                "images": json.dumps(item.get("images", [])), 
                "features": json.dumps(item.get("features", []))
            })
            session.commit()
        except Exception as e:
            try:
                session.rollback()
            except Exception:
                pass
            spider.logger.error(f"Error saving item: {e}")
            # Don't re-raise, just log, so scraper continues
        finally:
            session.close()
        return item
