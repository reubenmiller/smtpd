var $table;
var $remove;
var $removeText;
var selections = [];

$(document).ready(function(){
    $table = $('#tablev2');
    $remove = $('#remove');
    $removeText = $('#removeButtonText');
});

function formatMailAddress(value, row, index) {
    return value.Mailbox + "@" + value.Domain;
}

function formatToMailAddress(value, row, index) {
    return value && value.length > 0 ? formatMailAddress(value[0], row, index) : '';
}

function formatTimestamp(value, row, index) {
    var currentDate = Date.parse(value);
    var emailDate = moment(currentDate);
    var today = moment();
    
    if (emailDate.year() > 1) {
		if ((emailDate.year() == today.year()) && (emailDate.month() == today.month()) && (emailDate.date() == today.date())) {
            return emailDate.format("kk:mm:ss");
        }
        return emailDate.format("dd DD MMM YYYY kk:mm:ss");
    }
    return '';
}

function detailFormatter(index, row, element) {
    var header = _.map(row.Content.Headers, function(value, prop) {
        if (typeof value === 'string' && value !== ",") {
            return null;
        }
        return [
            '<div>' + prop + ': ' + value + '</div>'
        ].join('');
    }).join('');

    return [
        '<div class="panel panel-primary">',
        '<div class="panel-heading">' + 'Body' + '</div>',
        '<div class="panel-body">' + row.Content.TextBody + '</div>',
        '</div>',
        '<div class="panel panel-info">',
        '<div class="panel-heading">' + 'Header' + '</div>',
        '<div class="panel-body">' + header + '</div>',
        '</div>',
    ].join('');
    return row.Content.TextBody;
}

function formatAttachment(value, row, index) {
    var attachmentSize = value && value.length > 0 ? ' ' + (value[0].Size / 1000).toFixed(0) + 'KB' : '';

    if (!attachmentSize) return '';

    var linkRef = "/mail/attachment/" + value[0].Id + "/" + value[0].FileName;

    return [
        '<a href="' + linkRef + '" target="_blank" title="Attachment ' + value[0].FileName + '">',
            '<i class="glyphicon glyphicon-paperclip"></i>',
            '<span>' + attachmentSize +  '</span>',
        '</a> ',
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

function markAsRead(id) {
    // TODO: Mark email as read
    console.log('TODO: Mark email as read', id);
    setTimeout(function() {
        $table.bootstrapTable('refresh', { silent: true });
    }, 500)
}

function formatDetails(value, row, index) {
        var iconName = value ? 'glyphicon-info-sign' : 'glyphicon-info-sign';

        var href="/mail/" + row.Id;
        return [
            '<a href="' + href + '" title="Info" onclick="markAsRead(\'' + row.Id + '\')">',
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

function deleteMessage(e) {
    console.log('Deleting messages', selections);

    var requests = [];
    for (var i = 0; i < selections.length; i++) {
        requests.push($.ajax({
            url: "/mail/delete/" + selections[i],
        }));
    }

    $.when.apply(undefined, requests).then(function() {
        console.log("Deleted messages");

        $table.bootstrapTable('refresh');
    });
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

/**
 * Add additional row attributes to the data rows (i.e. minimal parsing)
 * @param {*} row 
 * @param {*} index 
 */
function getRowAttributes(row, index) {
    var customRow = row;

    var fields = customRow.Subject.split(' ');

    if (fields.length !== 5) {
        // Unknown Email format
        return row;
    }

    // Get Unitname
    customRow.Unitname = fields[2];

    // Email Type (i.e. SERVICE, STATUS or ALARM)
    var type = fields[3];

    customRow.EmailType = /(status|service)/i.test(type) ? type : 'ALARM';
    
    try {
        customRow.EmailDate = row && row.Content.Headers && row.Content.Headers.Date ? (new Date(row.Content.Headers.Date[0])).toISOString() : '';
    } catch (err) {
        console.error('Error converting date', err);
    }
    
    return customRow;
}

function sortDate(item1, item2) {
    return Date(item1) > Date(item2);
}

function responseHandler(res) {
    $.each(res, function (i, row) {
        row.state = $.inArray(row.Id, selections) !== -1;
    });
    return res;
}

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.Id
    });
}



$(function() {
    $table.on('load-success.bs.table', function(e, data) {
        console.log('Data loaded successfully');
    });

    $table.on('check.bs.table uncheck.bs.table ' + 'check-all.bs.table uncheck-all.bs.table', function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
        // save your data, here just save the current page
        selections = getIdSelections();
        console.log("selections", selections);

        // push or splice the selections if you want to save all data selections

        if (selections.length > 1) {
            var deleteText = selections.length == 1 ? "message" : "messages";

            $removeText.html('Delete ' + selections.length + ' ' + deleteText);
        } else {
            $removeText.html('Delete');
        }
        
    });

    $table.on('click-row.bs.table', function(e, row, $element, field) {
        console.log('row', row, field);
    });
});