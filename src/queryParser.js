function parse_query(query) {
  const selectRegex = /SELECT (.+) FROM (.+)/i;
  const match = query.match(selectRegex);

  if (match) {
    const [, fields, table] = match;
    return {
      fields: fields.split(",").map((field) => field.trim()),
      table: table.trim(),
    };
  } else {
    throw new Error("Invalid query format");
  }
}

function parse_query_with_WHERE(query) {
  const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
  const match = query.match(selectRegex);

  if (match) {
    const [, fields, table, whereClause] = match;
    console.log("parse_query_with_WHERE", fields, table, whereClause);
    return {
      fields: fields.split(",").map((field) => field.trim()),
      table: table.trim(),
      whereClause: whereClause ? whereClause.trim() : null,
    };
  } else {
    throw new Error("Invalid query format");
  }
}

module.exports = {
  parseQuery: parse_query,
  parseQueryWithWHERE: parse_query_with_WHERE,
};
