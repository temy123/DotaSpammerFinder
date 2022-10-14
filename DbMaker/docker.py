import threading
import datetime
import time
import sys, os

from update import update

today = datetime.datetime.now()


# 깃허브에서 업데이트 받아오기
def pull_from_github():
    print('===== 깃허브 업데이트 시작 =====')
    os.system('git pull origin master')


def check_next_day():
    global today
    while True:
        if today.day != datetime.datetime.now().day:
            today = datetime.datetime.now()
            print('===== 업데이트 시작 =====')
            update()
        else:
            print('===== 업데이트 대기중 =====')

        # 기본적으로 30초 마다 시간바뀌는 것을 체크하고, 10분마다 깃허브에서 업데이트 받아옴
        time.sleep(30)
        if today.minute % 10 == 0:
            pull_from_github()


if __name__ == "__main__":
    check_next_day()
