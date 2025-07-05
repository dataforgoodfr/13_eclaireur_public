FROM python:3.13-bullseye

RUN apt-get update

RUN pip install --no-cache-dir poetry

COPY pyproject.toml poetry.lock /

RUN poetry config virtualenvs.create false 

RUN poetry install --no-interaction --no-root

COPY ./back/ /back/

ENV PYTHONPATH="."

WORKDIR /

ENTRYPOINT ["python","back/main.py"]