interface PostgresDataSourceConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  ssl: boolean;
}

export const createPostgresDataSourceOptions = (
  config: PostgresDataSourceConfig,
) => ({
  type: 'postgres' as const,
  host: config.host,
  port: Number(config.port),
  username: config.username,
  password: config.password,
  database: config.database,
  // 로컬 개발 전용 스위치 — 운영은 false + 마이그레이션 사용
  synchronize: config.synchronize ?? false,
  // Supabase 등 관리형 Postgres는 SSL 필요, 로컬은 false
  ssl: config.ssl ? { rejectUnauthorized: false } : false,
});
