const {
  parse_query,
  parse_query_with_WHERE,
  parse_query_with_multiple_WHERE,
} = require("./queryParser");
const readCSV = require("./csvReader");

async function execute_SELECT_query(query) {
  const { fields, table } = parse_query(query);
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

function evaluateCondition(row, clause) {
  const { field, operator, value } = clause;
  switch (operator) {
    case "=":
      return row[field] === value;
    case "!=":
      return row[field] !== value;
    case ">":
      return row[field] > value;
    case "<":
      return row[field] < value;
    case ">=":
      return row[field] >= value;
    case "<=":
      return row[field] <= value;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

async function execute_SELECT_query_with_WHERE(query) {
  const { fields, table, whereClause } = parse_query_with_WHERE(query);
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
  const { fields, table, whereClauses } =
    parse_query_with_multiple_WHERE(query);
  const data = await readCSV(`${table}.csv`);

  // Filtering based on WHERE clauses
  const filteredData = whereClauses.length > 0
        ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
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
