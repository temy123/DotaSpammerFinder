import os
import shutil
import datetime
import main

if __name__ == "__main__":
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

    with open('update.log', 'a') as f:
        f.write(datetime.datetime.now().strftime("[%y-%m-%d %H:%M:%S] Created\n"))
