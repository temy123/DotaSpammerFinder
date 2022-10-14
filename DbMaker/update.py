import os
import shutil
import datetime
import main
import pandas as pd


def update():
    path = os.path.dirname(os.path.dirname(__file__))
    path = os.path.join(path, 'db')

    new_file_name = datetime.datetime.now().strftime("%y-%m-%d.db")

    origin_db_path = os.path.join(path, 'od.db')
    backup_db_path = os.path.join(path, new_file_name)
    new_db_path = os.path.join(os.path.dirname(__file__), new_file_name)

    if os.path.exists(os.path.join(path, 'od.db')):
        # 백업
        shutil.copy2(origin_db_path, backup_db_path)

    # 금일 DB 생성
    main.create_db()
    shutil.copy2(new_db_path, origin_db_path)

    # 이미지 다운로드
    df = pd.read_sql_query('select * from Hero', main.open_db())
    main.save_heroes_img(df)

    origin_img_path = os.path.join(os.path.dirname(__file__), 'img')
    new_img_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'img')

    if not os.path.exists(os.path.join(new_img_path, 'heroes')):
        os.mkdir(os.path.join(new_img_path, 'heroes'))

    for img in os.listdir(origin_img_path):
        op = os.path.join(origin_img_path, img)
        np = os.path.join(new_img_path, 'heroes', img)

        shutil.copy2(op, np)

    date_string = datetime.datetime.now().strftime("[%y-%m-%d %H:%M:%S]")
    with open('update.log', 'a') as f:
        f.write(f"{date_string} Created\n")

    os.system('git add --all')
    os.system(f"git commit -m \"{date_string} DB Updated\"")
    os.system(f"git push origin master")


if __name__ == "__main__":
    update()
