function formatMailAddress(value, row, index) {
    return value.Mailbox + "@" + value.Domain;
}

function formatToMailAddress(value, row, index) {
    return value && value.length > 0 ? formatMailAddress(value[0], row, index) : '';
}

function formatTimestamp(value, row, index) {
    var currentDate = Date.parse(value);

    
    return currentDate > 1000 ? moment(value).fromNow() : ''; 
}

function formatAttachment(value, row, index) {
    var attachmentSize = value && value.length > 0 ? ' ' + (value[0].Size / 1000).toFixed(0) + 'KB' : '';

    if (!attachmentSize) return '';

    return [
        '<a class="like" href="javascript:void(0)" title="Attachment">',
            '<i class="glyphicon glyphicon-paperclip"></i>',
            '<span>' + attachmentSize +  '</span>',
        '</a> ',
        /* '<a class="danger remove" href="javascript:void(0)" data-visitorserial="'+row.visitor_id+'" data-visitornames="'+row.visitor_names+'" data-visitorid="'+row.visitor_number+'" data-toggle="modal" data-target="#VisitorDelete" title="Remove">',
            '<i class="glyphicon glyphicon-trash"></i>',
        '</a>' */
    ].join('');
    
    return 
}

function formatStarred(value, row, index) {

    var iconName = value ? 'glyphicon-star' : 'glyphicon-star-empty';

    return [
        '<a href="javascript:void(0)" title="Starred">',
            '<i class="glyphicon ' + iconName + '"></i>',
        '</a> ',
    ].join('');
}

function cellStyleAttachment(value, row, index, field) {
    return {
        classes: value && value.length > 0 ? 'glyphicon glyphicon-paperclip' : '',
        // css: {"color": "blue", "font-size": "12px"}
    };
}

function rowStyle(row, index) {
    var rowClass = row.Unread ? 'mail-unread' : 'mail-read';
    return {
        classes: rowClass,
    };
}

function sortByAttachmentSize(sortName, sortOrder) {
    //Sort logic here.
    //You must use `this.data` array in order to sort the data. NO use `this.options.data`.
    this.data
}

function queryParams(params) {
    console.log('params', params);
    return params;
}
