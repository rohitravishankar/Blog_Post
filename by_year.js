function(doc) {
  if (doc.type == "quote") {
    emit(doc.work.year, doc);
  }
}
