import sqlite3
import requests
import json
import pandas as pd

URL_OFFICIAL_HERO_LIST = 'https://www.dota2.com/datafeed/herolist?language=koreana'
URL_OPENDOTA_HERO_LIST = 'https://api.opendota.com/api/heroStats'


def open_db():
    return sqlite3.connect('od.db')


def create_hero_table():
    conn = open_db()

    query = "CREATE TABLE if not exists Hero (" \
            "id INT not null," \
            "name VARCHAR(40)," \
            "localized_name_eng VARCHAR(40)," \
            "localized_name_kor VARCHAR(20)," \
            "primary_attr VARCHAR(10)," \
            "primary_attr_kor VARCHAR(10)," \
            "attack_type VARCHAR(10)," \
            "attack_type_kor VARCHAR(10)," \
            "img TEXT," \
            "icon TEXT," \
            "created_timestamp TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP," \
            "updated_timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP," \
            "PRIMARY KEY (id)" \
            ");"

    conn.cursor().execute(query)
    conn.close()


def delete_hero_data():
    db = open_db()
    data = db.execute("select * from sqlite_master where name='Hero'").fetchone()
    if data is None:
        return

    db.execute('DELETE from Hero')
    db.commit()
    db.close()


def insert_hero_data(id_, name, localized_name_eng, localized_name_kor, primary_attr, primary_attr_kor, attack_type,
                     attack_type_kor, img, icon):
    conn = open_db()
    query = "insert into Hero(id, name, localized_name_eng, localized_name_kor, primary_attr," \
            "primary_attr_kor, attack_type, attack_type_kor, img, icon) " \
            "VALUES(:id, :name, :localized_name_eng, :localized_name_kor, :primary_attr," \
            ":primary_attr_kor, :attack_type, :attack_type_kor, :img, :icon)"

    conn.cursor().execute(query, {
        'id': id_, 'name': name, 'localized_name_eng': localized_name_eng, 'localized_name_kor': localized_name_kor,
        'primary_attr': primary_attr, 'primary_attr_kor': primary_attr_kor,
        'attack_type': attack_type, 'attack_type_kor': attack_type_kor, 'img': img, 'icon': icon
    })

    conn.commit()
    conn.close()


def get_local_heroes():
    db = open_db()
    d = db.execute('select * from Hero').fetchall()
    for a in d:
        print(a)

    db.close()
    return d


def get_official_heroes_list():
    response = requests.get(URL_OFFICIAL_HERO_LIST)
    return response.json()['result']['data']['heroes']


def get_opendota_heroes_list():
    response = requests.get(URL_OPENDOTA_HERO_LIST)
    return response.json()


if __name__ == '__main__':
    delete_hero_data()

    pd.set_option('display.max_rows', 100)
    pd.set_option('display.max_columns', 100)

    df = pd.DataFrame(get_official_heroes_list())
    df2 = pd.DataFrame(get_opendota_heroes_list())

    result = pd.merge(df, df2, on='name')

    for idx, item in result.iterrows():
        primary_attr = item['primary_attr_y']
        if 'str' == primary_attr:
            primary_attr = '힘'
        elif 'agi' == primary_attr:
            primary_attr = '민첩'
        else:
            primary_attr = '지능'

        attack_type = item['attack_type']
        if 'Melee' == attack_type:
            attack_type = '근접'
        else:
            attack_type = '원거리'

        insert_hero_data(item['hero_id'], item['name'], item['name_english_loc'],
                         item['name_loc'], item['primary_attr_y'], primary_attr,
                         item['attack_type'], attack_type, item['img'], item['icon'])

        print(get_local_heroes())
