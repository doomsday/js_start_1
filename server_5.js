'use strict'
// server_address_model = model.playerModel.getModelWithId('commercial_server_address')

function validateURL (textval) {
  var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

function stripHTML (dirtyString) {
  var container = document.createElement('div')
  var text = document.createTextNode(dirtyString)
  container.appendChild(text)
  return container.innerHTML // innerHTML will be a xss safe string
}

model.on(AS.FORMS.EVENT_TYPE.valueChange, function () {
  let value = model.getValue().toString()
  if (validateURL(value)) {
    jQuery.get(value, function (data, status) {
      var about_field = model.playerModel.getModelWithId('server_version')
      var result = stripHTML(data)
      about_field.setValue(result)
    })
  } else return
})

// jQuery.get()
