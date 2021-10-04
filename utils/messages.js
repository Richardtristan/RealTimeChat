const moment = require('moment');

moment.locale('fr');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format(' h:mm a')
    };
    //}
}
function formatConversation(username, text, createdAt) {
    const d = moment(new Date(createdAt));
    const t = moment(new Date(createdAt));
    return {
        username,
        text,
        date: d.format('DD/MM/YYYY'),
        time: t.format(' h:mm a')
    };
}

module.exports = {
    formatMessage,
    formatConversation
};