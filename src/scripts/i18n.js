const i18nData = {
    'zh-CN': require('./i18n/zh-CN.json'),
    'en-US': require('./i18n/en-US.json')
};

var locale = navigator.language;
if (!i18nData[locale]) {
    locale = 'en-US';
}

$(document).ready(function() {
    // replace text with i18n data
    let elements = $('[i18n]');
    for (let element of elements) {
        let locale_text = i18nData[locale][$(element).attr('i18n')];
        if (locale_text) {
            $(element).text(locale_text);
        } else {
            // use pre-defined default text when locale text is not avaliable
            let default_text = $(element).attr('i18n-default');
            if (default_text) {
                $(element).text(default_text);
            } else {
                // fallback to key
                $(element).text($(element).attr('i18n'));
            }
        }
    }
    // show window
    setTimeout(function(){
        ipcRenderer.send('i18n-inited');
    },0);
});

function i18n(key) {
    if (i18nData[locale][key]) {
        return i18nData[locale][key];
    }
    return key;
}