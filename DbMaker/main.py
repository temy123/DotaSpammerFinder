import sqlite3
import requests
import json
import pandas as pd
import datetime

URL_OFFICIAL_HERO_LIST = 'https://www.dota2.com/datafeed/herolist?language=koreana'
URL_OPENDOTA_HERO_LIST = 'https://api.opendota.com/api/heroStats'


def get_db_file_name():
    return datetime.datetime.now().strftime('%y-%m-%d')


def open_db():
    return sqlite3.connect(f"{get_db_file_name()}.db")


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
            "pick_1 INT," \
            "win_1 INT," \
            "pick_2 INT," \
            "win_2 INT," \
            "pick_3 INT," \
            "win_3 INT," \
            "pick_4 INT," \
            "win_4 INT," \
            "pick_5 INT," \
            "win_5 INT," \
            "pick_6 INT," \
            "win_6 INT," \
            "pick_7 INT," \
            "win_7 INT," \
            "pick_8 INT," \
            "win_8 INT," \
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
                     attack_type_kor, img, icon, pick_array):
    conn = open_db()
    query = "insert into Hero(id, name, localized_name_eng, localized_name_kor, primary_attr," \
            "primary_attr_kor, attack_type, attack_type_kor, img, icon, " \
            "pick_1, win_1, " \
            "pick_2, win_2, " \
            "pick_3, win_3, " \
            "pick_4, win_4, " \
            "pick_5, win_5, " \
            "pick_6, win_6, " \
            "pick_7, win_7, " \
            "pick_8, win_8) " \
            "VALUES(:id, :name, :localized_name_eng, :localized_name_kor, :primary_attr," \
            ":primary_attr_kor, :attack_type, :attack_type_kor, :img, :icon, " \
            ":1_pick, :1_win, :2_pick, :2_win, :3_pick, :3_win, :4_pick, :4_win, :5_pick, :5_win, " \
            ":6_pick, :6_win, :7_pick, :7_win, :8_pick, :8_win)"

    conn.cursor().execute(query, {
        'id': id_, 'name': name, 'localized_name_eng': localized_name_eng, 'localized_name_kor': localized_name_kor,
        'primary_attr': primary_attr, 'primary_attr_kor': primary_attr_kor,
        'attack_type': attack_type, 'attack_type_kor': attack_type_kor, 'img': img, 'icon': icon,
        '1_pick': pick_array[0]['pick'], '1_win': pick_array[0]['win'],
        '2_pick': pick_array[1]['pick'], '2_win': pick_array[1]['win'],
        '3_pick': pick_array[2]['pick'], '3_win': pick_array[2]['win'],
        '4_pick': pick_array[3]['pick'], '4_win': pick_array[3]['win'],
        '5_pick': pick_array[4]['pick'], '5_win': pick_array[4]['win'],
        '6_pick': pick_array[5]['pick'], '6_win': pick_array[5]['win'],
        '7_pick': pick_array[6]['pick'], '7_win': pick_array[6]['win'],
        '8_pick': pick_array[7]['pick'], '8_win': pick_array[7]['win']
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


def get_hero_stats():
    df = pd.DataFrame(get_official_heroes_list())
    df2 = pd.DataFrame(get_opendota_heroes_list())

    result = pd.merge(df, df2, on='name')
    result.loc[result['primary_attr_y'] == 'str', 'primary_attr'] = '힘'
    result.loc[result['primary_attr_y'] == 'agi', 'primary_attr'] = '민첩'
    result.loc[result['primary_attr_y'] == 'int', 'primary_attr'] = '지능'

    result.loc[result['attack_type'] == 'Melee', 'attack_type_kor'] = '근접'
    result.loc[result['attack_type'] == 'Ranged', 'attack_type_kor'] = '원거리'

    result.rename(columns={
        'name_loc': 'localized_name_kor',
        'name_english_loc': 'localized_name_eng',
    }, inplace=True)

    result.drop('roles', axis='columns', inplace=True)

    result.sort_index()
    return result


def get_matches(_hero_stats):
    total_picks = 0
    _matches = pd.DataFrame([
        {'id': 0}
    ])
    for i in range(1, 9):
        pick = _hero_stats[[f"{i}_pick"]].sum()
        win = _hero_stats[[f"{i}_win"]].sum()

        _matches[[f"{i}_pick"]] = pick
        _matches[[f"{i}_win"]] = win

        total_picks += pick[0]

        # pd.merge(matches, pick)
        # pd.merge(matches, win)

    _matches[['total']] = total_picks
    return _matches


if __name__ == '__main__':
    delete_hero_data()
    # create_hero_table()

    pd.set_option('display.max_rows', 100)
    pd.set_option('display.max_columns', 100)

    conn = open_db()

    hero_stats = get_hero_stats()
    hero_stats.to_sql('Hero', conn, if_exists='replace')

    matches = get_matches(hero_stats)
    matches.to_sql('Matches', conn, if_exists='replace')

    # print(get_local_heroes())
