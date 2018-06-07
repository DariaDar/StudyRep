from pymongo import MongoClient
import xml.etree.ElementTree as ET
from analysis import Analysis
import time
import csv

class Mongo:

    def connect(self, dbname):
        client = MongoClient('mongodb://localhost:27017/')
        return client[dbname]

    def create_doc(self, db, header, text, date, time, views, tags):
        post = {
            "header": header,
            "text": text,
            "date": date,
            "time": time,
            "views": views,
            "tags": tags
        }
        posts = db.posts
        posts.insert_one(post)

    def create_article(self, db, index, header, description):
        article = {
            "index": index,
            "header": header,
            "description": description
        }

        articles = db.articles
        articles.insert_one(article)

    def fromXMLtoDB(self, db, filename):
        tree = ET.parse(filename)
        root = tree.getroot()
        text_fin = ""
        tags_fin = []
        for doc in root.findall('item'):
            header = doc.find('header').find('value').text
            text = doc.find('text').findall('value')
            for t in text:
                text_fin += t.text

            date = doc.find('date').text
            time = doc.find('time').text
            views = doc.find('views').find('value').text
            tags = doc.find('tags').findall('value')
            for t in tags:
                #print(t.text)
                tags_fin.append(t.text)

            self.create_doc(db, header, text_fin, date, time, views, tags_fin)
            text_fin = ""
            tags_fin.clear()

    def fromCSVtoDB(self, db, filename):
        cnt = 0
        with open(filename) as f:
            reader = csv.reader(f)
            print("Started...\n")
            startTime = time.time()
            for row in reader:
                self.create_article(db, row[0], row[1], row[2])
                print(cnt + 1)

            endTime = time.time()
            print("Passed " + str(endTime - startTime) + " seconds.")



# if __name__ == '__main__':
#     mongo = Mongo()
#     db = mongo.connect('cw_db2')
#     # mongo.fromXMLtoDB(db, "news2.xml")
#     # mongo.fromCSVtoDB(db, "train.csv")
#     # Analysis().create_set_popular_tags(db)
#     # Analysis().get_top_views(db)
#     Analysis().get_news_count_stat(db, "Украї")
#     # Analysis().get_top_text_length(db)
#     # Analysis().popular_indexes(db)
#     # Analysis().words_in_articles_index(db, "oil")
