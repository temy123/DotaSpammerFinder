import os
import shutil
import datetime
import main
import pandas as pd
import requests


def get_str_today():
    return datetime.datetime.now().strftime("[%y-%m-%d %H:%M:%S]")


# 아카이브 전용 레포에 등록
def upload_to_archive_repo(db_path):
    # GitHub personal access token 설정
    GITHUB_TOKEN = 'SHA256:tJtenSS7kj82bDFYA/5ApjdldoxQS7WzS2Fq6iS2VCk'

    # 업로드할 리포지토리 정보 설정
    repository_owner = 'temy123'
    repository_name = 'Dota-GG-DB'
    branch_name = 'main'  # 또는 다른 브랜치 이름

    # 파일을 업로드할 리포지토리 API URL 생성
    url_template = f'https://api.github.com/repos/{repository_owner}/{repository_name}/contents/'

    # 모든 파일을 업로드
    with open(db_path, 'rb') as file:
        file_content = file.read()

    # 업로드할 파일의 경로 및 커밋 메시지 설정
    file_path = f'{db_path}'
    commit_message = f'[{get_str_today()}] Upload {db_path}'

    # GitHub API를 사용하여 파일 업로드
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Content-Type': 'application/json',
    }
    data = {
        'message': commit_message,
        'content': file_content,
        'branch': branch_name,
    }
    response = requests.put(url_template + file_path, headers=headers, json=data)

    if response.status_code == 201:
        print(f'{db_path} 업로드 성공')
    else:
        print(f'{db_path} 업로드 실패:', response.status_code)
        print(response.text)


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

    upload_to_archive_repo(origin_db_path)


if __name__ == "__main__":
    update()
