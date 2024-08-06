# Бот для автоматизированного постинга мемов в предложку

## Что и как умеет

- Реагировать на реакции только в нужной группе и топике
- Реагировать на реакции только в нужном топике
- Считать реакции только от разных людей
- Реагировать на реакции только в конкретном топике группы
- Реагировать только на картинки и видео

## Тест кейсы

- Добавить реакцию (должен добавить айди пользователя в бд, если его там еще нет)
- Удалить реакцию (айди пользователя должен быть удален из бд)
- Добавить 4 реакции, а потом поменять 4 реакцию на другую (не должен постить)
- Добавить 5 реакций (должен запостить в группу к админам и выставить для поста has_been_posted, чтобы больше никогда не реагировать на изменения в реакциях этого поста)

## FAQ

- Как найти идентификатор топика для заполнения переменной **TOPIC_ID_TO_SUBSCRIBE_TO_REACTIONS_FROM** https://stackoverflow.com/questions/74773675/how-to-get-topic-id-for-telegram-group-chat
