var jiveWrapper = {

    getCurrentPlaceContext : function () {
        var deferred = Q.defer();
        var JIVE_GROUP_IDENTIFIER = 700;
        var JIVE_SPACE_IDENTIFIER = 14;
        osapi.jive.core.container.getLaunchContext(function (selection) {
            var containerId = selection.jive.content.id;
            var containerType = selection.jive.content.type == "osapi.jive.core.Group" ? JIVE_GROUP_IDENTIFIER : JIVE_SPACE_IDENTIFIER;

            osapi.jive.corev3.places.get({entityDescriptor: [containerType, containerId]})
                .execute(function (osapiResponse) {
                    var placeData = {
                        "placeUrl":osapiResponse.list[0].resources.self.ref,
                        "placeBlogUrl":osapiResponse.list[0].resources.blog.ref
                    }
                    deferred.resolve(placeData);
                });
        });
        return deferred.promise;
    },

    getContent : function (placeUrl, contentTypesToDisplay, itemsPerPage, sortBy, paginationIndex) {
        var deferred = Q.defer();
        osapi.jive.corev3.contents.get({
            "place": placeUrl,
            "type": contentTypesToDisplay.join(","),
            "startIndex": paginationIndex,
            "count": itemsPerPage,
            "sort": sortBy
        }).execute(function (response) {
            if (response.error)
                deferred.reject(response);
            else
                deferred.resolve(response);
        })
        return deferred.promise;
    },

    updateContentParentPlace : function(contentId, targetPlaceUrl) {
        var deferred = Q.defer();
        var content_url = opensocial.getEnvironment()['jiveUrl'] + "/api/core/v3/contents/" + contentId
        osapi.jive.corev3.contents.get({"uri": content_url}).execute(function (content) {
            content.parent = targetPlaceUrl;
            content.categories = [];
            content.update({"minor": "true"}).execute(function (response) {
                if (response.error) {
                    if(response.error.code == "peopleNotActiveAccount"){
                        delete content.authors;
                        content.update({"minor": "true"}).execute(function (resp) {
                            if (resp.error)
                                deferred.reject(resp.error)
                            else
                                deferred.resolve();
                        })
                    } else {
                        deferred.reject(response.error)
                    }
                }
                else
                    deferred.resolve();
            })
        });
        return deferred.promise;
    },

    getContentTypesSupportedByCurrentPlace : function () {
        var deferred = Q.defer();
        var JIVE_GROUP_IDENTIFIER = 700;
        var JIVE_SPACE_IDENTIFIER = 14;
        osapi.jive.core.container.getLaunchContext(function (selection) {
            console.log(selection);
            var containerId = selection.jive.content.id;
            var containerType = selection.jive.content.type == "osapi.jive.core.Group" ? JIVE_GROUP_IDENTIFIER : JIVE_SPACE_IDENTIFIER;

            osapi.jive.corev3.places.get({entityDescriptor: [containerType, containerId]})
                .execute(function (osapiResponse) {
                    deferred.resolve(osapiResponse.list[0].contentTypes);
                });
        });
        return deferred.promise;
    }
}


