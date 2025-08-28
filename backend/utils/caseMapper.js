const toCamelCase = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const toPascalCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const mapDbRowToCamelCase = (dbRow) => {
  if (!dbRow) return null;

  const mapped = {};
  for (const [key, value] of Object.entries(dbRow)) {
    const camelKey = toCamelCase(key);
    mapped[camelKey] = value;
  }
  return mapped;
};

const mapArrayToCamelCase = (dbRows) => {
  if (!Array.isArray(dbRows)) return [];
  return dbRows.map(mapDbRowToCamelCase);
};

const mapCamelCaseToDb = (camelObj) => {
  const mapped = {};
  for (const [key, value] of Object.entries(camelObj)) {
    const pascalKey = toPascalCase(key);
    mapped[pascalKey] = value;
  }
  return mapped;
};

module.exports = {
  mapDbRowToCamelCase,
  mapArrayToCamelCase,
  mapCamelCaseToDb,
  toCamelCase,
  toPascalCase,
};
