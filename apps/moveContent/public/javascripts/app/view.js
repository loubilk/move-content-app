viewHandler = {
    setupMoveContentView : function () {
        $("#spinner").show();
        $(".contentTypeButton").removeAttr("disabled");
        $("#moveContent").show().removeAttr("disabled");
        $("#refreshContent").hide();
        $("label.btn-primary").removeClass("disabled");
        $("#move-content-message").removeClass().html("");
        $("#selectAllContent").prop('checked', true);
    },

    setContentTypeButtonsWithHandlers : function (supportedContentTypes, eventHandler) {
        $("#content-types").html(Mustache.render($('#content-type-template').html(), {contentTypeList : supportedContentTypes}))
        $(".contentTypeButton").change(eventHandler);
    },

    showRefreshContentView : function () {
        $("#spinner").hide();
        $("#move-other-content-tab").removeClass("disabledLink");
        $("#move-blog-posts-tab").removeClass("disabledLink");
        $("#refreshContent").show().removeAttr("disabled");
    },
    disableAllButtonsWhileProcessingContent : function(){
        $("#spinner").show();
        $("#move-other-content-tab").addClass("disabledLink");
        $("#move-blog-posts-tab").addClass("disabledLink");
        $(".contentTypeButton").prop( "disabled", true );
        $("label.btn-primary").addClass("disabled");
        $("#moveContent").hide();
    },

    displayTargetPlaceName : function(placeName){
        $("#targetPlace").val(placeName);
        $("#targetPlace").prop("size",placeName.length);
    },

    setupPaginationLinks : function(paginationData){
        $("#pagination").html(Mustache.render($('#pagination-template').html(),paginationData));
    },


    selectAllContent : function () {
        $('#content-body input:checkbox').each(function () {
            this.checked = $("#selectAllContent:checked").val();
        });
    },

    displayContentSuccessRow : function(contentId) {
        $("#" + contentId).closest('tr').addClass("alert-success");
    },

    displayContentErrorRow : function(contentId, error) {
        var message = ""
        if(error.code == 500)
            message = "Error, please try moving item again or contact admin"
        if(error.code == 403)
            message = "You are not allowed to move item to the target place"
        else if(error.code == 400 && error.message == "api.core.v3.error.missing_event_access")
            message = "Missing event access, contact admin"
        else
            message = "Error, please try moving item again or contact admin"

        $("#" + contentId).closest('tr').find('.rowMessage').html(message);
        $("#" + contentId).closest('tr').addClass("alert-danger");
    },

    showContent : function(contentJson) {
        $("#content-body").html(Mustache.render($('#content-list-template').html(),contentJson));
        $(".contentCheck").change(this.areAllContentsSelected);
        $("#spinner").hide();
    },

    resetContentList : function(){
        $("#content-body").html("");
    },

    getSelectedContentIds : function(){
        idList = [];
        $(".content td input:checked").each(function(index){
            idList.push(this.id);
        });
        return idList;
    },

    areAllContentsSelected : function(){
        var idList = [];
        $(".content td input").each(function(index){
            idList.push(this.checked);
        });

        if(idList.indexOf(false) > -1){
            $("#selectAllContent").removeAttr('checked');
        } else {
            $("#selectAllContent").prop('checked', true);
        }
    },

    isContentTypeChecked : function(contentType){
        return $("#"+contentType).is(":checked")
    },

    itemsPerPage : function(){
        return $("#itemsPerPageOption").val();
    },

    sortByOption : function(){
        return $("#sortByOption").val();
    },

    disableBlogsView : function(){
        $("#nav-tabs").hide()
    }
}

