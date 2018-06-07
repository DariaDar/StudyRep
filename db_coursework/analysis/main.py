import sys

from database import Mongo
from analysis import Analysis
import os

if __name__ == '__main__':
    mongo = Mongo()
    db = mongo.connect('cw_db2')
    analysis = Analysis()
    while 1:
        os.system('CLS')
        print("-------Аналіз новин--------")
        print(
            "Список функцій: \n1. Дістати новини з ХML.\n2. Дістати новини з CSV.\n3. Аналіз обраного слова за популярністю в кожній категорії\n"
            "4. Кількість випущених статей з певним тегом.\n5. Аналіз популярності тегів.\n6. Аналіз кількості індексів з усіх статей\n7. ТОП 5 статей за переглядами."
            "\n8. Відсортований список статей за об'ємом тексту.\n9. Вихід")

        num = input("\n Обрати функцію: ")

        if num is '1':
            os.system('CLS')
            print("Дістаю новини з news2.xml...")
            mongo.fromXMLtoDB(db, "news2.xml")
            print("Done.")
        elif num is '2':
            os.system('cls')
            print("Дістаю новини з train.csv")
            mongo.fromCSVtoDB(db, "train.csv")
        elif num is '3':
            os.system('cls')
            print("------Аналіз обраного слова за популярністю в кожній категорії-------")
            f = False
            while (f == False):
                word = input("\n Введіть слово, за яким бажаєте провести аналіз: ")
                if word.isdigit() == False:
                    f = True
                else:
                    print("Недопустимі символи у слові.")

            analysis.words_in_articles_index(db, word)
            print("Графік збережено у файл.")
        elif num is '4':
            os.system('cls')
            print("------Кількість випущених статей з певним тегом-------")
            f = False
            while (f == False):
                word = input("\n Введіть слово, за яким бажаєте провести аналіз: ")
                if word.isdigit() == False:
                    f = True
                else:
                    print("Недопустимі символи у слові.")
            analysis.get_news_count_stat(db, word)
            print("Графік збережено у файл.")
        elif num is '5':
            os.system('cls')
            print("------Аналіз популярності тегів-------")
            analysis.create_set_popular_tags(db)
            print("Графік збережено у файл.")
        elif num is '6':
            os.system('cls')
            print("------Аналіз кількості індексів з усіх статей-------")
            analysis.popular_indexes(db)
            print("Графік збережено у файл.")
        elif num is '7':
            os.system('cls')
            print("------ТОП 5 статей за переглядами-------")
            analysis.get_top_views(db)
            print("Графік збережено у файл.")
        elif num is '8':
            os.system('cls')
            print("------Відсортований список статей за об'ємом тексту-------")
            analysis.get_top_text_length(db)
            print("Список статей збережено у файл")
        elif num is '9':
            sys.exit()
