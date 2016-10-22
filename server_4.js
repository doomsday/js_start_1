'use strict'
console.log('show form_')

/*
value - обычно это текстовое значение компонента
key - обычно это значение компонента
valueID - дополнительный идентификатор
username - имя пользователя
userID - идентификатор пользователя
values - массив строк
key - массив строк.

Предположим, нужно хранить в качестве значения компонента 3 поля:
olf_identifier - идентификатор выбранного значения
olf_name - наименование
olf_info - дополнительная информация.
*/
model.setAsfData = function (asfData) {
  // works when opening form
  if (!asfData || !asfData.value) {
    return
  }
  /* читаем данные из объекта из файла по форме: дополнительная информация была сохранена в поле valueID и теперь читаем из него */
  // {"id":"cmp-sm2bui","type":"custom","value":"name: 0.4174074846821918","key":"1","valueID":"additional info"}
  var value = {olf_identifier: asfData.id, olf_name: asfData.value, olf_info: asfData.valueID}
  model.setValue(value)
}

model.getAsfData = function (blockNumber) {
  // works on pressing Save
  if (model.getValue()) {
    /* следующий метод сформирует правильную запись для сохранения в файле по форме 
       при этом:
       model.getValue().title — запишется в поле value
       model.getValue().value — запишется в поле key */
    // {"id":"cmp-sm2bui","type":"custom","value":"name_ 0.4174074846821918","key":"1","valueID":"additional info"}
    var result = AS.FORMS.ASFDataUtils.getBaseAsfData(model.asfProperty, blockNumber, model.getValue().olf_name, model.getValue().olf_identifier)
    /* дописываем необходимую дополнительную информацию в поле valueID*/
    result.valueID = model.getValue().info
    return result
  } else {
    return AS.FORMS.ASFDataUtils.getBaseAsfData(model.asfProperty, blockNumber)
  }
}

model.getSpecialErrors = function () {
  if (model.getValue()) {
    if (model.getValue().identifier == '0') {
      return {id: model.asfProperty.id, errorCode: AS.FORMS.INPUT_ERROR_TYPE.wrongValue}
    }
  }
}

if (!editable) {
  /* Для режима просмотра достаточно иметь div, куда будет вставлено тестовое описание поля, и реализовать метод updateValueFromModel. */
  var textView = jQuery('<div>', {class: 'asf-label'})
  view.container.append(textView)

  view.updateValueFromModel = function () {
    console.log("not editable mode, executing 'model.getValue().name' : " + model.getValue().olf_name)
    var value = model.getValue()
    if (value) {
      textView.html(value.olf_name)
    }
  }
  model.on(AS.FORMS.EVENT_TYPE.dataLoad, function () {
    view.updateValueFromModel()
  })
  console.log('view.updateValueFromModel()')
  view.updateValueFromModel()
} else {
  /**
   * инициализируем внешний вид компонента, div и кнопку
   */
  var inputView = jQuery('<div>', {class: 'asf-label', style: 'width:calc(100% - 30px)'})
  var button = jQuery('<button>', {class: 'asf-browseButton'})
  view.container.append(inputView)
  view.container.append(button)
  /**
   * обновляем значение отображения в зависимости от значения модели
   */
  view.updateValueFromModel = function () {
    inputView.html(model.getValue().olf_name)
  }
  /**
   * метод помечает поле как неправильно заполненное
   */
  view.markInvalid = function () {
    button.css('background-color', '#ff33cc')
  }
  /**
   * метод убирает пометку неправильно заполненного поля
   */
  view.unmarkInvalid = function () {
    button.css('background-color', '')
  }
  /**
   * вызываем какой-нибудь диалог выбора пользователя
   */
  button.click(function () {
    // {"id":"cmp-sm2bui","type":"custom","value":"name: 0.4174074846821918","key":"1","valueID":"additional info"}
    var value = {olf_identifier: '1', olf_name: 'name_ ' + Math.random(), olf_info: 'additional info'} // тут прописывается какая-нибудь логика получения этого значения
    model.setValue(value)
  })

  model.on(AS.FORMS.EVENT_TYPE.dataLoad, function () {
    view.updateValueFromModel()
  })
  view.updateValueFromModel()
}
