import ipaddress
import sqlite3
import requests
import json
import pandas as pd
import datetime
import os
import shutil
import urllib
import time

URL_OFFICIAL_HERO_LIST = 'https://www.dota2.com/datafeed/herolist?language=koreana'
URL_OPENDOTA_HERO_LIST = 'https://api.opendota.com/api/heroStats'
URL_OPENDOTA_MATCH_UP = 'https://api.opendota.com/api/heroes/{hero_id}/matchups'
URL_OPENDOTA_HEROES_LANEROLES = 'https://api.opendota.com/api/scenarios/laneRoles'
URL_IMAGE_URL = 'https://api.opendota.com/apps/dota2/images/dota_react/heroes'


def request(url):
    HEADERS = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
    }

    response = requests.get(url, headers=HEADERS)
    return response


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


def to_png(path: str, url: str, name: str):
    response = request(f"https://api.opendota.com{url}")

    with open(f"{path}/{name}.png", 'wb') as f:
        f.write(response.content)


def delete_hero_data():
    db = open_db()
    data = db.execute(
        "select * from sqlite_master where name='Hero'").fetchone()
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


# URL_OPENDOTA_HEROES_LANEROLES 에 접속해서 laneRoles 정보를 가져온다.
def get_lane_roles(hero_id):
    print(f"URL: {URL_OPENDOTA_HEROES_LANEROLES}?hero_id={hero_id}")

    response = request(
        f"{URL_OPENDOTA_HEROES_LANEROLES}?hero_id={hero_id}")

    lane_roles = response.json()

    df = None
    try:
        df = pd.DataFrame(lane_roles)
    except Exception as e:
        print(f"Error 발생 : {lane_roles}")
        return None

        # games 헤더를 int 형으로 변경
    df['games'] = df['games'].astype(int)

    # games 헤더를 기준으로 정렬
    df.sort_values(by=['games'], ascending=False, inplace=True)

    # id_x 컬럼을 hero_id로 변경
    df.rename(columns={'id_x': 'hero_id'}, inplace=True)

    # games 컬럼에 상위 3개 추출
    df = df.head(3)

    # games 컬럼에 중복 제거
    df = df.drop_duplicates(subset=['games'])

    # df 에서 순서대로 변수에 저장, 없으면 None
    lane_role_1 = df.iloc[0]['lane_role'] if len(df) > 0 else None
    lane_role_2 = df.iloc[1]['lane_role'] if len(df) > 1 else None
    lane_role_3 = df.iloc[2]['lane_role'] if len(df) > 2 else None

    # lane_role_1, lane_role_2, lane_role_3 을 데이터프레임으로 변환
    df_lane_role = pd.DataFrame(
        {'lane_role_1': [lane_role_1], 'lane_role_2': [lane_role_2], 'lane_role_3': [lane_role_3]})
    df_lane_role = df_lane_role.fillna('')

    # hero_id 컬럼 추가
    df_lane_role['hero_id'] = hero_id

    return df_lane_role


def calculate_lane_roles(hero_df):
    # lane_role_1, lane_role_2, lane_role_3 컬럼 추가
    hero_df['lane_role_1'] = ''
    hero_df['lane_role_2'] = ''
    hero_df['lane_role_3'] = ''

    for i, hero_id in hero_df['id_x'].iteritems():
        lane_roles = get_lane_roles(hero_id)
        # lane_roles 가 None 이면 60초 후 다시 시도
        if lane_roles is None:
            print(f"lane_roles is None, hero_id: {hero_id} 60초 후 다시 시도")
            time.sleep(60)
            lane_roles = get_lane_roles(hero_id)

        # lane_roles 데이터프레임을 hero_df에 hero_id 기준으로 lane_role1, lane_role2, lane_role3 컬럼에 추가
        hero_df.loc[hero_df['id_x'] == hero_id, 'lane_role_1'] = lane_roles.iloc[0]['lane_role_1']
        hero_df.loc[hero_df['id_x'] == hero_id, 'lane_role_2'] = lane_roles.iloc[0]['lane_role_2']
        hero_df.loc[hero_df['id_x'] == hero_id, 'lane_role_3'] = lane_roles.iloc[0]['lane_role_3']

        time.sleep(0.5)

    return hero_df


def get_local_heroes():
    db = open_db()
    d = db.execute('select * from Hero').fetchall()
    for a in d:
        print(a)

    db.close()
    return d


def get_official_heroes_list():
    response = request(URL_OFFICIAL_HERO_LIST)
    return response.json()['result']['data']['heroes']


def get_opendota_heroes_list():
    response = request(URL_OPENDOTA_HERO_LIST)
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

    real_name_list = []
    for i, item in result['img'].iteritems():
        real_name = item.split('/')
        real_name = real_name[len(real_name) - 1]
        real_name_list.append(real_name.replace('.png?', ''))

    result = result.join(pd.DataFrame(real_name_list, columns=['real_name']))

    result.sort_index()
    result.set_index('hero_id', inplace=True)

    return result


def update_hero_tier_column(hero_df, matches_df):
    for i in range(1, 9):
        win_rate_df = (hero_df[f"{i}_win"] / hero_df[f"{i}_pick"]) * 100
        win_rate_df.sort_values(ascending=False, inplace=True)

        pick_rate_df = (hero_df[f"{i}_pick"] /
                        matches_df[f"{i}_pick"][0]) * 1000
        pick_rate_df.sort_values(ascending=False, inplace=True)

        # 그 외 5티어
        hero_df[f"{i}_tier"] = '5'

        # 4티어
        tier_4_hero_index = get_tier_index(win_rate_df, pick_rate_df, 40, 0)
        tier_3_hero_index = get_tier_index(win_rate_df, pick_rate_df, 43, 5)
        tier_2_hero_index = get_tier_index(win_rate_df, pick_rate_df, 46, 10)
        tier_1_hero_index = get_tier_index(win_rate_df, pick_rate_df, 49, 15)
        op_tier_hero_index = get_tier_index(win_rate_df, pick_rate_df, 52, 20)

        hero_df.loc[tier_4_hero_index, f"{i}_tier"] = '4'
        hero_df.loc[tier_3_hero_index, f"{i}_tier"] = '3'
        hero_df.loc[tier_2_hero_index, f"{i}_tier"] = '2'
        hero_df.loc[tier_1_hero_index, f"{i}_tier"] = '1'
        hero_df.loc[op_tier_hero_index, f"{i}_tier"] = '0'

    return hero_df


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


def get_tier_index(win_rate_df, pick_rate_df, win_rate, pick_rate):
    win_rate_index = win_rate_df[win_rate_df > win_rate].index
    pick_rate_index = pick_rate_df[pick_rate_df > pick_rate].index

    return win_rate_index.intersection(pick_rate_index)


def calculate_match_ups(hero_df):
    # hero_df.

    # for i, hero in hero_df.iteritems():
    #     print(hero.keys())
    #     id_ = hero['hero_id']
    #     url = URL_OPENDOTA_MATCH_UP.replace("{hero_id}", id_)
    #
    #     response = requests.get(url)
    #     match_up_data = response.json()
    #
    #     match_up_df = pd.DataFrame(match_up_data)
    #
    #     avgs = match_up_df['games_played'].mean()
    #
    #     print(f"hero_id : {id_}, avgs : {avgs}")

    return hero_df


def create_db():
    delete_hero_data()
    # create_hero_table()

    pd.set_option('display.max_rows', 100)
    pd.set_option('display.max_columns', 100)

    conn = open_db()

    hero_stats = get_hero_stats()

    matches = get_matches(hero_stats)

    hero_stats = update_hero_tier_column(hero_stats, matches)

    hero_stats = calculate_match_ups(hero_stats)

    hero_stats = calculate_lane_roles(hero_stats)

    matches.to_sql('Matches', conn, if_exists='replace')
    hero_stats.to_sql('Hero', conn, if_exists='replace')


def create_heroes_img_folder(path: str):
    if not os.path.exists(path):
        os.mkdir(path)


def save_heroes_img(hero_df):
    size = len(hero_df['localized_name_eng'])

    print(f"==== Save Images Started ====")
    print(f"==== Total Count : {size} ====")

    path = os.path.join(os.path.dirname(__file__), 'img')
    create_heroes_img_folder(path)

    for i, url in hero_df['img'].iteritems():
        real_name = hero_df['real_name'][i]
        # 파일이 없는 경우에만 다운로드
        if not os.path.exists(os.path.join(os.path.dirname(__file__), 'img', f"{real_name}.png")):
            print(f"== {i}: {real_name}")
            to_png(path, url, real_name)

    print(f"==== Save Images Ended ====")


if __name__ == '__main__':
    pd.set_option('display.max_rows', 100)
    pd.set_option('display.max_columns', 100)

    # 각종 DB 생성
    create_db()

    # df = pd.read_sql_query('select * from Hero', open_db())
    # print(df)

    # # 이미지 다운로드
    # df = pd.read_sql_query('select * from Hero', open_db())
    # save_heroes_img(df)

    # # 1티어
    # win_rate = win_rate[win_rate > 49]
    # pick_rate = pick_rate[pick_rate > 15]
    #
    # # 2티어
    # win_rate = win_rate[win_rate > 46]
    # pick_rate = pick_rate[pick_rate > 10]

    # print(win_rate_num)
    # print(pick_rate_num)
    #
    # print(win_rate)
    # print(pick_rate)
    #
    # df1 = pd.DataFrame(win_rate, columns=['win_rate'])
    # df2 = pd.DataFrame(pick_rate, columns=['pick_rate'])
    #
    # # hero_stats['win_rate'] = df1
    # # hero_stats['pick_rate'] = df2
    #
    # df = hero_stats[(hero_stats['win_rate'] > 0)]
    #
    # print(df)

    # df = pd.merge(, pd.DataFrame(pick_rate, columns=['pick_rate']))

    # df = pd.merge(hero_stats, win_rate)
    # df = pd.merge(df, pick_rate)

    # print(df)

    # print(get_local_heroes())
