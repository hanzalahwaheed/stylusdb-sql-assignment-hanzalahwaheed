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
    console.log(whereClause);
    return {
      fields: fields.split(",").map((field) => field.trim()),
      table: table.trim(),
      whereClause: whereClause ? whereClause.trim() : null,
    };
  } else {
    throw new Error("Invalid query format");
  }
}

function parseWhereClause(whereString) {
  const conditionRegex = /(.*?)(=|!=|>|<|>=|<=)(.*)/;
  return whereString.split(/ AND | OR /i).map((conditionString) => {
    const match = conditionString.match(conditionRegex);
    if (match) {
      const [, field, operator, value] = match;
      return { field: field.trim(), operator, value: value.trim() };
    }
    throw new Error("Invalid WHERE clause format");
  });
}

function parse_query_with_multiple_WHERE(query) {
  const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
  const match = query.match(selectRegex);

  if (match) {
    const [, fields, table, whereString] = match;
    const whereClauses = whereString ? parseWhereClause(whereString) : [];
    return {
      fields: fields.split(",").map((field) => field.trim()),
      table: table.trim(),
      whereClauses,
    };
  } else {
    throw new Error("Invalid query format");
  }
}

module.exports = {
  parse_query,
  parse_query_with_WHERE,
  parse_query_with_multiple_WHERE,
};
