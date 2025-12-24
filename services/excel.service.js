import XLSX from "xlsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (rows.length === 0) {
    return { columns: [], validUsers: [], invalidUsers: [] };
  }

  const columns = Object.keys(rows[0]);

  const validUsers = [];
  const invalidUsers = [];

  for (const row of rows) {
    const email = String(row.email || "").trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      invalidUsers.push({ ...row, reason: "Invalid email" });
      continue;
    }

    validUsers.push(row);
  }

  return {
    columns,
    validUsers,
    invalidUsers
  };
};
