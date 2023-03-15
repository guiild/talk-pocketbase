migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4guwbse1fjsyh4")

  // remove
  collection.schema.removeField("enlhdbfs")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4guwbse1fjsyh4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "enlhdbfs",
    "name": "date",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
