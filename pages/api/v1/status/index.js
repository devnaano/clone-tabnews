import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue =
    await databaseVersionResult.rows[0].server_version;

  const databaseName = process.env.POSTGRES_DB;
  const databaseUsedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseUsedConnectionsValue =
    await databaseUsedConnectionsResult.rows[0].count;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    await databaseMaxConnectionsResult.rows[0].max_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        opened_connections: databaseUsedConnectionsValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
      },
    },
  });
}

export default status;
