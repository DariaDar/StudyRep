import scrapy
from scrapy.spiders import CrawlSpider, Rule

from news.items import NewsItem
from scrapy.linkextractors import LinkExtractor


class NewsSpider(CrawlSpider):
    name = "NewsSpider"
    allowed_domains = ["24tv.ua"]
    start_urls = {'https://24tv.ua/novini_tag1117/'}

    rules = (
        Rule(LinkExtractor(allow=('/newsfrom^[0-9]+$/',)), callback='parse'),
    )

    def parse(self, response):
        BASE_URL = "https://24tv.ua/"

        for inf in response.xpath("//article[@class='article']"):
            item = NewsItem()
            item['header'] = inf.xpath("//h1[@class='article_title']/text()").extract()
            item['text'] = inf.xpath("//div[@id='newsSummary']/p/text()").extract()
            # item['date'] = inf.xpath("//span[@class='date']/text()").extract_first()
            str = (inf.xpath("//time/@datetime").extract())[0].split(" ")
            item['date'] = str[0]
            item['time'] = str[1]
            # item['date'], item['time'] = str[0].split
            item['views'] = inf.xpath("//span[@class='views_icon']/text()").extract()
            item['tags'] = inf.xpath("//div[@class='tags']/a/text()").extract()
            yield item

        posts = response.xpath("//ul[@class='list']").xpath(".//li/a[@class='news_title']/@href").extract()
        for post in posts:
            link = BASE_URL + post
            # print(link)
            yield response.follow(link, callback=self.parse)
