from datetime import datetime
from typing import Optional, List
from langchain_core.tools import tool
from src.utils.db import execute_query

@tool
def search_properties(
    location: str,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_area: Optional[int] = None,
    limit: int = 5
) -> str:
    """
    Search for properties in the database based on location, price range, and size.
    Returns a list of matching properties with their details.
    """
    query = """
        SELECT id, address, listing_price, total_area_sqm, floor_plan, source_listing_id
        FROM properties
        WHERE 1=1
    """
    params = {}
    
    if location:
        query += " AND address ILIKE :location"
        params["location"] = f"%{location}%"
    
    if min_price:
        query += " AND listing_price >= :min_price"
        params["min_price"] = min_price
        
    if max_price:
        query += " AND listing_price <= :max_price"
        params["max_price"] = max_price
        
    if min_area:
        query += " AND total_area_sqm >= :min_area"
        params["min_area"] = min_area
        
    query += " ORDER BY created_at DESC LIMIT :limit"
    params["limit"] = limit
    
    try:
        results = execute_query(query, params)
        if not results:
            return "No properties found matching your criteria."
            
        formatted_results = []
        for row in results:
            formatted_results.append(
                f"ID: {row[0]}, Address: {row[1]}, Price: {row[2]} JPY, Size: {row[3]}m2, Layout: {row[4]}"
            )
        return "\n".join(formatted_results)
    except Exception as e:
        return f"Error executing search: {str(e)}"
