var maps = {};

function extend(a: any, b: any) {
    for (var p in b) {
        a[p] = b[p];
    }

    return a;
}

function createFieldMaps(renames: any, toFns: any, fromFns: any) {
    var to = extend({}, renames),
        from = {};

    Object.keys(renames).forEach(function (key) {
        // @ts-ignore
        from[renames[key]] = key;
    });

    return {
        renames: renames,
        to: extend(to, toFns),
        from: extend(from, fromFns)
    };
}

function mapFields(data: any, map: any) {
    var field, value, mappedField,
        ret = {};

    for (field in data) {
        value = data[field];
        mappedField = map[field];

        // no map -> delete
        if (!mappedField) {
            continue;
            // string -> change field name
        } else if (typeof mappedField === "string") {
            ret[mappedField as keyof Object] = value;
            // function -> merge result
        } else {
            extend(ret, mappedField(value));
        }
    }

    return ret;
}

// @ts-ignore
maps.labels = createFieldMaps({
    addNewItem: "add_new_item",
    addOrRemoveItems: "add_or_remove_items",
    allItems: "all_items",
    chooseFromMostUsed: "choose_from_most_used",
    editItem: "edit_item",
    menuName: "menu_name",
    name: "name",
    nameAdminBar: "name_admin_bar",
    newItemName: "new_item_name",
    parentItem: "parent_item",
    parentItemColon: "parent_item_colon",
    popularItems: "popular_items",
    searchItems: "search_items",
    separateItemsWithCommas: "separate_items_with_commas",
    singularName: "singular_name",
    updateItem: "update_item",
    viewItem: "view_item"
});

// @ts-ignore
maps.post = createFieldMaps({
    author: /* int */ "post_author",
    commentStatus: /* string */ "comment_status",
    content: /* string */ "post_content",
    customFields: /* array */ "custom_fields",
    date: /* datetime */ "post_date",
    excerpt: /* string */ "post_excerpt",
    format: /* string */"post_format",
    id: /* string */ "post_id", /* readonly */
    link: /* string */ "link" /* readonly */,
    modified: /* datetime */ "post_modified",
    menuOrder: /* int */ "menu_order",
    name: /* string */ "post_name",
    pageTemplate: /* string */ "page_template",
    parent: /* int */ "post_parent",
    password: /* string */ "post_password",
    pingStatus: /* string */ "ping_status",
    status: /* string */ "post_status",
    sticky: /* bool */ "sticky",
    terms: /* struct */ "terms" /* array */,
    termNames: /* struct */ "terms_names",
    thumbnail: /* int */ "post_thumbnail",
    title: /* string */ "post_title",
    type: /* string */ "post_type"
}, {}, {
    post_date_gmt: /* datetime */ function (date: any) {
        return {
            date: new Date(date)
        };
    },
    post_modified_gmt: /* datetime */ function (date: any) {
        return {
            modified: new Date(date)
        };
    }
});

// @ts-ignore
maps.postType = createFieldMaps({
    _builtin: /* bool */ "_builtin",
    cap: /* struct */ "cap",
    capabilityType: /* string */ "capability_type",
    description: /* string */ "description",
    _editLink: /* string */ "_edit_link",
    excludeFromSearch: /* bool */ "exclude_from_search",
    hasArchive: /* bool */ "has_archive",
    hierarchical: /* bool */ "hierarchical",
    label: /* string */ "label",
    labels: /* struct */ "labels",
    mapMetaCap: /* bool */ "map_meta_cap",
    menuIcon: /* string */ "menu_icon",
    menuPosition: /* int */ "menu_position",
    name: /* string */ "name",
    "public": /* bool */ "public",
    publiclyQuerably: /* bool */ "publicly_queryable",
    queryVar: /* mixed */ "query_var",
    rewrite: /* mixed */ "rewrite",
    showInAdminBar: /* bool */ "show_in_admin_bar",
    showInMenu: /* bool */ "show_in_menu",
    showInNavMenus: /* bool */ "show_in_nav_menus",
    showUi: /* bool */ "show_ui",
    supports: /* array */ "supports",
    taxonomies: /* array */ "taxonomies"
}, {}, {
    cap: function (cap: any) {
        // @ts-ignore
        return {cap: mapFields(cap, maps.postTypeCap.from)};
    },
    labels: function (labels: any) {
        // @ts-ignore
        return {labels: mapFields(labels, maps.labels.from)};
    }
});

// @ts-ignore
maps.postTypeCap = createFieldMaps({
    deleteOthersPosts: /* string */ "delete_others_posts",
    deletePost: /* string */ "delete_post",
    deletePosts: /* string */ "delete_posts",
    deletePrivatePosts: /* string */ "delete_private_posts",
    deletePublishedPosts: /* string */ "delete_published_posts",
    editOthersPosts: /* string */ "edit_others_posts",
    editPost: /* string */ "edit_post",
    editPosts: /* string */ "edit_posts",
    editPrivatePosts: /* string */ "edit_private_posts",
    editPublishedPosts: /* string */ "edit_published_posts",
    publishPosts: /* string */ "publish_posts",
    read: /* string */ "read",
    readPost: /* sring */ "read_post",
    readPrivatePosts: /* string */ "read_private_posts"
});

// @ts-ignore
maps.taxonomy = createFieldMaps({
    cap: /* struct */ "cap",
    hierarchical: /* bool */ "hierarchical",
    name: /* string */ "name",
    label: /* string */ "label",
    labels: /* struct */ "labels",
    objectType: /* array */ "object_type",
    "public": /* bool */ "public",
    queryVar: /* string */ "query_var",
    rewrite: /* struct */ "rewrite",
    showInNavMenus: /* bool */ "show_in_nav_menus",
    showTagCloud: /* bool */ "show_tagcloud",
    showUi: /* bool */ "show_ui"
}, {}, {
    cap: function (cap: any) {
        // @ts-ignore
        return {cap: mapFields(cap, maps.taxonomyCap.from)};
    },
    labels: function (labels: any) {
        // @ts-ignore
        return {labels: mapFields(labels, maps.labels.from)};
    }
});

// @ts-ignore
maps.taxonomyCap = createFieldMaps({
    assignTerms: /* string */ "assign_terms",
    deleteTerms: /* string */ "delete_terms",
    editTerms: /* string */ "edit_terms",
    manageTerms: /* string */ "manage_terms"
});

// @ts-ignore
maps.term = createFieldMaps({
    count: /* int */ "count", /* readonly */
    description: /* string */ "description",
    name: /* string */ "name",
    parent: /* string */ "parent",
    slug: /* string */ "slug",
    taxonomy: /* string */ "taxonomy",
    termId: /* string */ "term_id", /* readonly */
    termTaxonomyId: /* string */ "term_taxonomy_id" /* readonly */
});

// @ts-ignore
maps.file = createFieldMaps({
    name: /* string */ "name",
    type: /* string */ "type",
    bits: /* string */ "bits",
    overwrite: /* boolean */ "overwrite",
    postId: /* int */ "post_id"
});

// @ts-ignore
maps.media = createFieldMaps({
    attachmentId: /* string */ "attachment_id", /* readonly */
    caption: /* string */ "caption",
    description: /* string */ "description",
    link: /* string */ "link",
    parent: /* int */ "parent",
    thumbnail: /* string */ "thumbnail",
    title: /* string */ "title",
    type: /* string */ "type"
}, {}, {
    date_created_gmt: /* datetime */ function (date: any) {
        return {
            date: new Date(date)
        };
    },

    metadata: /* struct */ function (data: any) {
        return {
            // @ts-ignore
            metadata: mapFields(data, maps.mediaItemMetadata.from)
        };
    }
});

// @ts-ignore
maps.mediaItemMetadata = createFieldMaps({
    file: /* string */ "file",
    height: /* int */ "height",
    sizes: /* struct */ "sizes",
    width: /* int */ "width"
}, {}, {
    sizes: /* struct */ function (size: any) {
        var keys = Object.keys(size),
            results = {};

        // Loop through the available sizes and map the fields
        keys.forEach(function (key, i) {
            // @ts-ignore
            results[keys[i]] = mapFields(size[keys[i]], maps.mediaItemSize.from);
        });

        return {
            sizes: results
        };
    },

    image_meta: /* struct */ function (data: any) {
        return {
            // @ts-ignore
            imageMeta: mapFields(data, maps.postThumbnailImageMeta.from)
        };
    }
});

// @ts-ignore
maps.mediaItemSize = createFieldMaps({
    file: /* string */ "file",
    height: /* string */ "height",
    mimeType: /* string */ "mime-type",
    width: /* string */ "width"
});

// @ts-ignore
maps.postThumbnailImageMeta = createFieldMaps({
    aperture: /* int */ "aperture",
    camera: /* string */ "camera",
    caption: /* string */ "caption",
    copyright: /* string */ "copyright",
    createdTimestamp: /* int */ "created_timestamp",
    credit: /* string */ "credit",
    focalLength: /* int */ "focal_length",
    iso: /* int */ "iso",
    keywords: /* array */ "keywords",
    orientation: /* string */ "orientation",
    shutterSpeed: /* int */ "shutter_speed",
    title: /* string */ "title"
});

const fieldCompatible = {
    to: function (data: any, type: any) {
        // @ts-ignore
        return mapFields(data, maps[type].to);
    },
    from: function (data: any, type: any) {
        // @ts-ignore
        return mapFields(data, maps[type as keyof typeof maps].from);
    },
    array: function (data: any, type: any) {
        // @ts-ignore
        var map = maps[type].renames;
        return data.map(function (field: any) {
            return map[field];
        });
    }
};

export default fieldCompatible;