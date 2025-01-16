FROM python:3.12

WORKDIR /backend

COPY /backend .

# Добавьте ключ для репозитория Google Cloud SDK с использованием apt-key
RUN curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | tee /etc/apt/trusted.gpg.d/google-cloud-sdk.asc

# Добавьте репозиторий Google Cloud SDK
RUN echo "deb [signed-by=/etc/apt/trusted.gpg.d/google-cloud-sdk.asc] https://packages.cloud.google.com/apt cloud-sdk main" | tee /etc/apt/sources.list.d/google-cloud-sdk.list

# Обновите индексы пакетов и установите google-cloud-sdk
RUN apt-get update && apt-get install -y google-cloud-sdk

# Установите зависимости Python
RUN cd /backend && SETUPTOOLS_SCM_PRETEND_VERSION="0.1.0" pip install -e .
