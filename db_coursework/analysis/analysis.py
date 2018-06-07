import seaborn as sns
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import re


class Analysis:

    def create_set_popular_tags(self, db):
        tagList = db.posts.distinct("tags")
        dict = {"count": [], "tags": []}
        for tag in tagList:
            count = db.posts.find({"tags": tag}).count()
            dict["tags"].append(tag)
            dict["count"].append(count)

        df = pd.DataFrame(data=dict)

        sns.set(font_scale=0.2)
        g = sns.barplot(x="tags", y="count", data=df, palette="Greens_d")
        plt.xticks(rotation=-90)
        plt.savefig("plots/tags.png", dpi=400)

    def get_top_views(self, db):
        posts = db.posts.find({}, {"header": 1, "views": 1}).sort("views", 1).limit(5)
        dict = {"views": [], "header": []}
        for post in posts:
            dict["views"].append(int(post.get("views")))
            dict["header"].append(post.get("header"))

        df = pd.DataFrame(data=dict)

        g = sns.barplot(x="header", y="views", data=df, palette="Paired")
        plt.xticks(rotation=-90)
        plt.savefig("plots/top_views.png", dpi=400)

    def get_news_count_stat(self, db, searchword):
        regx = re.compile(".*%s.*" % searchword, re.IGNORECASE)
        dates = db.posts.distinct("date")
        dict = {"count": [], "date":[]}
        for date in dates:
            posts_count = db.posts.find({"tags": regx, "date": date}, {"date": 1, "tags": 1}).sort(date, 1).count()
            print(posts_count, date)
            dict["date"].append(date)
            dict["count"].append(posts_count)

        df = pd.DataFrame(data=dict)

        sns.set(font_scale=0.5)
        g = sns.barplot(x="date", y="count", data=df, palette="cubehelix").set_title("Кількість статей за пошуком \'%s\' у різні дні" % searchword)
        plt.xticks(rotation=-45)
        plt.savefig("plots/news_count_stat.png", dpi=400)

    def get_top_text_length(self, db):
        posts = db.posts.find({}, {"text": 1, "header": 1})
        text_lengths = {"length":[], "header": []}
        for p in posts:
            print(len(p.get("text")))
            text_lengths["length"].append(len(p.get("text")))
            text_lengths['header'].append(p.get("header"))

        df = pd.DataFrame(data=text_lengths, columns=["length","header"])
        df.style
        df.sort_values('length', ascending=False, inplace=True)
        df.to_csv("files/sorted_by_text_length.csv",  sep='\t', encoding='utf-8')

    def popular_indexes(self, db):
        indexes = db.articles.distinct("index")
        dict = {"count": [], "index": []}
        for ind in indexes:
            count = db.articles.find({"index": ind}).count()
            print(str(count) + " - " + ind)
            dict["count"].append(count)
            dict["index"].append(ind)

        df = pd.DataFrame(data=dict)
        g = sns.barplot(x="index", y="count", data=df, palette=sns.cubehelix_palette(8))
        plt.savefig("plots/popular_indexes.png", dpi=400)

    def words_in_articles_index(self, db, word):
        regx = re.compile(".*%s.*" % word, re.IGNORECASE)
        indexes = db.articles.distinct("index")
        dict = {"index":[], "header_cnt": []}
        for ind in indexes:
            header_count = db.articles.find({"index": ind, "header": regx}).count()
            dict["index"].append(ind)
            dict["header_cnt"].append(header_count)

        df = pd.DataFrame(data=dict)
        g = sns.barplot(x="index", y="header_cnt", data=df, palette="GnBu_d").set_title("Search word: " + word)
        plt.savefig("plots/count_word_in_index.png")

