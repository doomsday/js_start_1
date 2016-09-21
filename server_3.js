'use strict'
console.log('problemmm')

let ticket_type_model = model.playerModel.getModelWithId('ticket_type')
let ticket_status_model = model.playerModel.getModelWithId('ticket_status')
let ticket_solution_model = model.playerModel.getModelWithId('solution')

function checkType() {
  // true to show, false to hide
  let type_value = ticket_type_model.getValue().toString()
  return type_value !== '99' ? true : false
}

function checkStatus() {
  let status_value = ticket_status_model.getValue().toString()
  return ['2', '3', '5'].indexOf(status_value) !== -1 ? true : false
}

function checkSolution() {
  return ticket_solution_model.isEmpty() ? false : true
}

function checkAllConditions() {
  if (checkSolution()) { return true }
  return checkType() && checkStatus() ? true : false
}

view.setVisible(false)
ticket_type_model.on(AS.FORMS.EVENT_TYPE.valueChange, function () {
  checkAllConditions() ? view.setVisible(true) : view.setVisible(false)
})
ticket_status_model.on(AS.FORMS.EVENT_TYPE.valueChange, function () {
  checkAllConditions() ? view.setVisible(true) : view.setVisible(false)
})

/** ==== */
'use strict'

let tips = {
  // Консультация
  1: 'Не забудте описать условия, так или иначе влияющие на ваш вопрос. Используйте терминологию Synergy',
  // Программная ошибка
  2: 'Укажите в заявке:<br>* Последовательность действий/событий, приводящая к ошибке<br> *Время, в которое возникала ошибка (точность +/- 15 минут)<br>* Логи сервера: server.log или jboss-console.log за соответствующий день<br>* Указать какие последние действия выполнялись перед возникновением ошибки<br>* Дата последнего обновления<br>* Импорт конфигурации тех объектов, которые затрагиваются в сообщении об ошибке<br> *Удалённый доступ (желательно SSH) высылается на security_ctkdrt@arta.pro',
  // Отказ системы
  3: 'Укажите в заявке:<br>* Последовательность действий/событий, приводящая к ошибке<br>* Время, в которое возникала ошибка (точность +/- 15 минут)<br>* Логи сервера: server.log или jboss-console.log за соответствующий день<br>* Удалённый доступ (желательно SSH) высылается на security_ctkdrt@arta.pro<br>* Удалённый доступ к тестовому стенду пишется в теле заявки<br>* Указать какие последние действия выполнялись перед отказом системы<br>* Дата последнего обновления',
  // Невоспроизводимая ошибка
  4: 'Укажите в заявке:<br>* Последовательность действий/событий, приводящая к ошибке<br> *Время, в которое возникала ошибка (точность +/- 15 минут)<br>* Логи сервера: server.log или jboss-console.log за соответствующий день<br>* Указать какие последние действия выполнялись перед возникновением ошибки<br>* Дата последнего обновления<br>* Импорт конфигурации тех объектов, которые затрагиваются в сообщении об ошибке<br> *Удалённый доступ (желательно SSH) высылается на security_ctkdrt@arta.pro',
  // Оценка
  5: 'В заявке должно быть:<br>* Описание проблемы<br>* Описание своего взгляда на решение этой проблемы<br>* Вариант использования доработки (ВИ)',
  // Вопросы по документации
  6: 'В заявке должно быть:<br>* Ссылка на документ или указание на его отсутствие<br>Замечания, предложения',
  // Генерация ключей
  7: 'В заявке должно быть:<br>* Название для лицензии в "кавычках"<br>* Наименование проекта, для которого предназначена лицензия<br>* Количество пользователей лицензии<br>* Срок действия лицензии',
  // Сертификация
  8: 'В заявке должно быть:<br>* Перечисление областей знаний требуемых для обучения<br>* Список сотрудников с полными Ф.И.О.',
  // Производительность
  9: 'В заявке должно быть:<br>* Модель CPU(s)<br>* Вывод "free -m"<br>* Вывод "htop" скриншоты с интервалом 2-3 минуты, 5 шт.<br>* Вывод команды "dd bs=1G count=10 if=/dev/zero of=test"<br>* Лог "jstat"<br>* Выполнить "ps aux | grep java" для определения PID JVM<br>* Выполнить "jstat -gcutil PID_ID 250ms 10000", где PID_ID из предыдущей команды<br>* mysql-slow.log',
  // Доработка API
  10: 'В заявке должно быть:<br>* Номер оценённого запроса из реестра "Feature Requests"',
  // Организация ОЕМ стенда
  11: 'В заявке должно быть:<br>* Полное наименование организации-клиента, название проекта<br>* Логотипы, фоновые изображения и другие элементы оформления<br>* Желательное доменное имя стенда',
  // Конфигурирование ОЕМ стенда
  12: 'В заявке должно быть:<br>* Типовой бизнес-анализ<br>* Адрес сервера, на котором будет отрабатываться разрабатываемое решение',
  // Разработка (ЦА)
  13: 'В заявке должно быть:<br>* Описание проблемы<br>* Описание своего взгляда на решение этой проблемы<br>* Вариант использования доработки (ВИ)'
}

ticket_type_model = model.playerModel.getModelWithId('ticket_type')
view.setVisible(false)

ticket_type_model.on(AS.FORMS.EVENT_TYPE.valueChange, function () {
  let value = ticket_type_model.getValue().toString()
  console.log(value)

  if (value && value !== '99') {
    view.setVisible(true)
    // model.setValue(tips[value])

    var textView = jQuery('<div>', { class: 'asf-label' })
    textView.css('padding', '20px')
    textView.css('background-color', '#ccffcc')
    textView.css('color', 'black')
    textView.css('margin-bottom', '15px')
    textView.css('border-radius', '3')
    textView.hover(function () {
      $(this).css('background-color', '#e6ffe6')
    }, function () {
      $(this).css('background-color', '#ccffcc')
    })

    view.container.empty()
    view.container.append(textView)

    view.updateValueFromModel = function () {
      textView.html(tips[value])
    }
    view.updateValueFromModel()
  } else {
    view.setVisible(false)
  }
})