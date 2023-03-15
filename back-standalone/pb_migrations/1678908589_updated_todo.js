migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4guwbse1fjsyh4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bnvs4hxr",
    "name": "user",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": [
        "username"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4guwbse1fjsyh4")

  // remove
  collection.schema.removeField("bnvs4hxr")

  return dao.saveCollection(collection)
})
