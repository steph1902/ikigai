import scrapy

class PropertyItem(scrapy.Item):
    source = scrapy.Field()
    source_listing_id = scrapy.Field()
    address = scrapy.Field()
    prefecture = scrapy.Field()
    municipality = scrapy.Field()
    district = scrapy.Field()
    building_type = scrapy.Field()
    listing_price = scrapy.Field()
    floor_plan = scrapy.Field()
    total_area_sqm = scrapy.Field()
    year_built = scrapy.Field()
    nearest_station_name = scrapy.Field()
    nearest_station_walk_minutes = scrapy.Field()
    listing_url = scrapy.Field()
    images = scrapy.Field()
    features = scrapy.Field()
