import { ref } from 'vue';
import { MESSAGE_TYPE } from '/src/store/data-types/message-type.js'

export const logMessages = ref([])
let id = 0

export function addLogMessage(message) {
  message.id = ++id
  message.user = 'username'
  message.date = new Date().toLocaleString("ru")

  logMessages.value.unshift(message)
}

export function formDoneLogMessage(urlPrefix, res, data) {
  let message = {}
  message.type = MESSAGE_TYPE.message

  switch (urlPrefix) {
    case 'companies':
      if (res.config.method == 'post')
        message.text = `Данные компании отредактированы, чтобы увидеть изменения необходимо обновить страницу`
      return message

    case 'countries':
      if (res.config.method == 'post')
        message.text = `Страна "${data.title}" добавлена`
      else if (res.config.method == 'patch')
        message.text = `Страна "${data.oldTitle}" изменена на "${data.title}"`
      else if (res.config.method == 'delete')
        message.text = `Страна "${data.title}" удалена`
      return message

    case 'cities':
      if (res.config.method == 'post')
        message.text = `Город "${data.title}" добавлен`
      else if (res.config.method == 'patch')
        message.text = `Город "${data.title} - ${data.countryTitle}" отредактирован`
      else if (res.config.method == 'delete')
        message.text = `Город "${data.title}" удален`
      return message

    case 'restaurants':
      if (res.config.method == 'post')
        message.text = `Ресторан "${data.title}" добавлен`
      else if (res.config.method == 'patch')
        message.text = `Ресторан "${data.title}" отредактирован`
      else if (res.config.method == 'delete')
        message.text = `Ресторан "${data.title}" удален`
      return message

    case 'categories':
      if (res.config.method == 'post')
        message.text = `Категория "${data.title}" добавлена`
      else if (res.config.method == 'patch') {
        if (data.number_in_list) message.text = `Изменен порядок категории "${data.title}"`
        else message.text = `Категория "${data.oldTitle}" изменена на "${data.title}"`
      }
      else if (res.config.method == 'delete')
        message.text = `Категория "${data.title}" удалена`
      return message

    case 'products':
      if (res.config.method == 'post') {
        message.text = `Товар "${res.data.data.title}" добавлен`
        if (data.get('_method')) message.text = `Товар "${res.data.data.title}" отредактирован`
      }
      else if (res.config.method == 'delete')
        message.text = `Товар "${data.title}" удален`
      return message

    case 'employees':
      if (res.config.method == 'post')
        message.text = `Сотрудник "${data.last_name} ${data.first_name} ${data.surname}" добавлен`
      else if (res.config.method == 'patch')
        message.text = `Сотрудник "${data.last_name} ${data.first_name} ${data.surname}" отредактирован`
      else if (res.config.method == 'delete')
        message.text = `Сотрудник "${data.last_name} ${data.first_name} ${data.surname}" удален`
      return message

    default:
      message.text = `Запрос выполнен`
      return message

  }
}

export function formErrorLogMessage(err) {
  let message = {}
  console.log(err);
  switch (err.code) {
    case 'ERR_NETWORK':
      message.text = 'Нет доступа к серверу'
      message.type = MESSAGE_TYPE.error
      return message

    case 'ERR_BAD_REQUEST':
      if (err.response.status == 401 || err.response.status == 419) message.text = 'Необходимо войти в систему'
      else if (err.response.status == 403) message.text = 'Недостаточно прав пользователя'
      else if (err.response.status == 405) message.text = err.response.data //текст с бэка, сначала удалите дочерние объекты
      else if (err.response.status == 404) message.text = 'Нет данных на сервере'
      else if (err.response.status == 422) message.text = 'Неверно введенные данные'
      else message.text = err.message

      message.type = MESSAGE_TYPE.warning
      return message

    default:
      message.text = err.message
      message.type = MESSAGE_TYPE.error
      return message
  }
}