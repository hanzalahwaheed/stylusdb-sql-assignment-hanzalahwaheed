const {
  parseQuery,
  parseQueryWithWHERE,
  parseQueryWithMultipleWHERE,
} = require("./queryParser");
const readCSV = require("./csvReader");

async function execute_SELECT_query(query) {
  const { fields, table } = parseQuery(query);
  const data = await readCSV(`${table}.csv`);

  // Filter the fields based on the query
  return data.map((row) => {
    const filteredRow = {};
    fields.forEach((field) => {
      filteredRow[field] = row[field];
    });
    return filteredRow;
  });
}

async function execute_SELECT_query_with_WHERE(query) {
  const { fields, table, whereClause } = parseQueryWithWHERE(query);
  const data = await readCSV(`${table}.csv`);

  // Filtering based on WHERE clause
  const filteredData = whereClause
    ? data.filter((row) => {
        const [field, value] = whereClause.split("=").map((s) => s.trim());
        return row[field] === value;
      })
    : data;
  return filteredData.map((row) => {
    const selectedRow = {};
    fields.forEach((field) => {
      selectedRow[field] = row[field];
    });
    return selectedRow;
  });
}

async function execute_SELECT_query_with_multiple_WHERE(query) {
  const { fields, table, whereClauses } = parseQueryWithMultipleWHERE(query);
  const data = await readCSV(`${table}.csv`);

  // Filtering based on WHERE clauses
  const filteredData =
    whereClauses && whereClauses.length > 0
      ? data.filter((row) =>
          whereClauses.every((clause) => {
            // You can expand this to handle different operators
            return row[clause.field] === clause.value;
          })
        )
      : data;

  // Selecting specified fields
  return filteredData.map((row) => {
    const selectedRow = {};
    fields.forEach((field) => {
      selectedRow[field] = row[field];
    });
    return selectedRow;
  });
}

module.exports = {
  execute_SELECT_query,
  execute_SELECT_query_with_WHERE,
  execute_SELECT_query_with_multiple_WHERE,
};
