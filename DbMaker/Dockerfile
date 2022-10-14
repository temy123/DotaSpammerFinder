FROM python:3.9.7-slim-buster

COPY /../ /app

WORKDIR /app/DbMaker

RUN apt-get -yq update && \
    apt-get -yqq install ssh

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN mkdir -p /root/.ssh
ADD /DbMaker/ssh-key/id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

CMD ["python", "-u", "docker.py"]
