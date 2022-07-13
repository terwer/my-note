var url = require("url");
const xmlrpc = require("xmlrpc");
const fieldMap = require("./field-compatible").default;

// http://codex.wordpress.org/XML-RPC_Support
// http://codex.wordpress.org/XML-RPC_WordPress_API

function extend(a: any, b: any) {
    for (var p in b) {
        a[p] = b[p];
    }

    return a;
}

function parseArguments(args: any) {
    return [].slice.call(args, 1)

        // Remove null arguments
        // Null values only exist for optional fields. As of WordPress 4.4,
        // null is no longer treated the same as omitting the value. To
        // compensate for this, we just drop the argument before calling
        // into WordPress. See #25.
        .filter(function (value: any) {
            return value !== null;
        });
}

const Client = function (this: any, settings: any) {
    ["url", "username", "password"].forEach(function (prop) {
        if (!settings[prop]) {
            throw new Error("Missing required setting: " + prop);
        }
    });

    var parsedUrl = Client.parseUrl(settings.url);
    this.rpc = xmlrpc[parsedUrl.secure ? "createSecureClient" : "createClient"]({
        host: settings.host || parsedUrl.host,
        port: parsedUrl.port,
        path: parsedUrl.path,
        rejectUnauthorized: settings.rejectUnauthorized !== undefined ? settings.rejectUnauthorized : true,

        // Always set Host header in case we're pointing to a different server
        // via settings.host
        headers: {
            Host: parsedUrl.host
        },
        basic_auth: !settings.basicAuth ? null : {
            user: settings.basicAuth.username,
            pass: settings.basicAuth.password
        }
    });
    this.blogId = settings.blogId || 0;
    this.username = settings.username;
    this.password = settings.password;
};

Client.parseUrl = function (wpUrl: any) {
    var urlParts, secure;

    // allow URLs without a protocol
    if (!(/\w+:\/\//.test(wpUrl))) {
        wpUrl = "http://" + wpUrl;
    }
    urlParts = url.parse(wpUrl);
    secure = urlParts.protocol === "https:";

    return {
        host: urlParts.hostname,
        port: urlParts.port || (secure ? 443 : 80),
        // path: urlParts.path.replace(/\/+$/, "") + "/xmlrpc.php",
        path: urlParts.path,
        secure: secure
    };
};

extend(Client.prototype, {
    call: function (method: any) {
        var args = parseArguments(arguments),
            fn = args.pop();

        if (typeof fn !== "function") {
            args.push(fn);
            fn = null;
        }

        this.rpc.methodCall(method, args, function (error: any, data: any) {
            if (!error) {
                return fn(null, data);
            }

            if (error.code === "ENOTFOUND" && error.syscall === "getaddrinfo") {
                error.message = "Unable to connect to WordPress.";
            } else if (error.message === "Unknown XML-RPC tag 'TITLE'") {
                var additional = error.res.statusCode;
                if (error.res.statusMessage) {
                    additional += "; " + error.res.statusMessage;
                }

                error.message = "(" + additional + ") " + error.message;
            }

            fn(error);
        });
    },

    authenticatedCall: function () {
        var args = [].slice.call(arguments);
        args.splice(1, 0, this.blogId, this.username, this.password);
        this.call.apply(this, args);
    },

    listMethods: function (fn: any) {
        this.call("system.listMethods", fn);
    }
});

extend(Client.prototype, {
    getPost: function (id: any, fields: any, fn: any) {
        if (typeof fields === "function") {
            fn = fields;
            fields = null;
        }

        if (fields) {
            fields = fieldMap.array(fields, "post");
        }

        this.authenticatedCall("wp.getPost", id, fields, function (error: any, post: any) {
            if (error) {
                return fn(error);
            }

            fn(null, fieldMap.from(post, "post"));
        });
    },

    getPosts: function (filter: any, fields: any, fn: any) {
        if (typeof filter === "function") {
            fn = filter;
            fields = null;
            filter = {};
        }

        if (typeof fields === "function") {
            fn = fields;
            fields = null;
        }

        if (filter.type) {
            filter.post_type = filter.type;
            delete filter.type;
        }

        if (filter.status) {
            filter.post_status = filter.status;
            delete filter.status;
        }

        if (filter.orderby) {
            filter.orderby = fieldMap.array([filter.orderby], "post")[0];
        }

        if (fields) {
            fields = fieldMap.array(fields, "post");
        }

        this.authenticatedCall("wp.getPosts", filter, fields, function (error: any, posts: any) {
            if (error) {
                return fn(error);
            }

            fn(null, posts.map(function (post: any) {
                return fieldMap.from(post, "post");
            }));
        });
    },

    newPost: function (data: any, fn: any) {
        this.authenticatedCall("wp.newPost", fieldMap.to(data, "post"), fn);
    },

    // to remove a term, just set the terms and leave out the id that you want to remove
    // to remove a custom field, pass the id with no key or value
    editPost: function (id: any, data: any, fn: any) {
        this.authenticatedCall("wp.editPost", id, fieldMap.to(data, "post"), fn);
    },

    deletePost: function (id: any, fn: any) {
        this.authenticatedCall("wp.deletePost", id, fn);
    },

    getPostType: function (name: any, fields: any, fn: any) {
        if (typeof fields === "function") {
            fn = fields;
            fields = null;
        }

        if (fields) {
            fields = fieldMap.array(fields, "postType");
        }

        this.authenticatedCall("wp.getPostType", name, fields, function (error: any, postType: any) {
            if (error) {
                return fn(error);
            }

            fn(null, fieldMap.from(postType, "postType"));
        });
    },

    getPostTypes: function (filter: any, fields: any, fn: any) {
        if (typeof filter === "function") {
            fn = filter;
            fields = null;
            filter = {};
        }

        if (typeof fields === "function") {
            fn = fields;
            fields = null;
        }

        if (Array.isArray(filter)) {
            fields = filter;
            filter = {};
        }

        if (fields) {
            fields = fieldMap.array(fields, "postType");
        }

        this.authenticatedCall("wp.getPostTypes", filter, fields, function (error: any, postTypes: any) {
            if (error) {
                return fn(error);
            }

            Object.keys(postTypes).forEach(function (postType) {
                postTypes[postType] = fieldMap.from(postTypes[postType], "postType");
            });
            fn(null, postTypes);
        });
    }
});

extend(Client.prototype, {
    getTaxonomy: function (name: any, fn: any) {
        this.authenticatedCall("wp.getTaxonomy", name, function (error: any, taxonomy: any) {
            if (error) {
                return fn(error);
            }

            fn(null, fieldMap.from(taxonomy, "taxonomy"));
        });
    },

    getTaxonomies: function (fn: any) {
        this.authenticatedCall("wp.getTaxonomies", function (error: any, taxonomies: any) {
            if (error) {
                return fn(error);
            }

            fn(null, taxonomies.map(function (taxonomy: any) {
                return fieldMap.from(taxonomy, "taxonomy");
            }));
        });
    },

    getTerm: function (taxonomy: any, id: any, fn: any) {
        this.authenticatedCall("wp.getTerm", taxonomy, id, function (error: any, term: any) {
            if (error) {
                return fn(error);
            }

            fn(null, fieldMap.from(term, "term"));
        });
    },

    getTerms: function (taxonomy: any, filter: any, fn: any) {
        if (typeof filter === "function") {
            fn = filter;
            filter = {};
        }

        if (filter.hideEmpty) {
            filter.hide_empty = filter.hideEmpty;
            delete filter.hideEmpty;
        }

        if (filter.orderby) {
            filter.orderby = fieldMap.array([filter.orderby], "term")[0];
        }

        this.authenticatedCall("wp.getTerms", taxonomy, filter, function (error: any, terms: any) {
            if (error) {
                return fn(error);
            }

            fn(null, terms.map(function (term: any) {
                return fieldMap.from(term, "term");
            }));
        });
    },

    newTerm: function (data: any, fn: any) {
        this.authenticatedCall("wp.newTerm", fieldMap.to(data, "term"), fn);
    },

    editTerm: function (id: any, data: any, fn: any) {
        this.authenticatedCall("wp.editTerm", id, fieldMap.to(data, "term"), fn);
    },

    deleteTerm: function (taxonomy: any, id: any, fn: any) {
        this.authenticatedCall("wp.deleteTerm", taxonomy, id, fn);
    }
});

extend(Client.prototype, {
    getMediaItem: function (id: any, fn: any) {
        this.authenticatedCall("wp.getMediaItem", id, function (error: any, media: any) {
            if (error) {
                return fn(error);
            }

            fn(null, fieldMap.from(media, "media"));
        });
    },

    getMediaLibrary: function (filter: any, fn: any) {
        if (typeof filter === "function") {
            fn = filter;
            filter = {};
        }

        this.authenticatedCall("wp.getMediaLibrary", filter, function (error: any, media: any) {
            if (error) {
                return fn(error);
            }

            fn(null, media.map(function (item: any) {
                return fieldMap.from(item, "media");
            }));
        });
    },

    uploadFile: function (data: any, fn: any) {
        this.authenticatedCall("wp.uploadFile", fieldMap.to(data, "file"), fn);
    }
});

const wordpressClient = {
    Client: Client,
    createClient: function (settings: any) {
        return new (Client as any)(settings);
    },
    fieldMap: fieldMap
};

export default wordpressClient;