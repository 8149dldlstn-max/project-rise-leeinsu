export enum ENV_KEYS {
  NODE_ENV = 'NODE_ENV',
  APP_PORT = 'APP_PORT',
  DATABASE_HOST = 'DATABASE_HOST',
  DATABASE_PORT = 'DATABASE_PORT',
  DATABASE_NAME = 'DATABASE_NAME',
  DATABASE_USERNAME = 'DATABASE_USERNAME',
  DATABASE_PASSWORD = 'DATABASE_PASSWORD',
  DATABASE_SYNCHRONIZE = 'DATABASE_SYNCHRONIZE',
  DATABASE_SSL = 'DATABASE_SSL',
  JWT_SECRET = 'JWT_SECRET',
  JWT_ACCESS_EXPIRATION_SECONDS = 'JWT_ACCESS_EXPIRATION_SECONDS',
  SUPABASE_URL = 'SUPABASE_URL',
  SUPABASE_SERVICE_ROLE_KEY = 'SUPABASE_SERVICE_ROLE_KEY',
}

export enum ERROR_MESSAGE {
  EMAIL_ALREADY_EXIST = '이미 가입된 이메일입니다.',
  PASSWORD_CONFIRM_NOT_MATCH = '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
  NICKNAME_INVALID_CHARACTERS = '닉네임에 사용할 수 없는 문자(< >)가 포함되어 있습니다.',
  EMAIL_PASSWORD_NOT_MATCH = '이메일 또는 비밀번호가 올바르지 않습니다.',
  UNAUTHORIZED = '로그인이 필요합니다.',
  TOKEN_INVALID = '유효하지 않은 토큰입니다.',
  FORBIDDEN_ROLE = '접근 권한이 없습니다.',
  USER_NOT_FOUND = '사용자를 찾을 수 없습니다.',
  TAG_NOT_FOUND = '존재하지 않는 태그입니다.',
  POST_NOT_FOUND = '게시물을 찾을 수 없습니다.',
  POST_FORBIDDEN = '본인의 게시물만 수정·삭제할 수 있습니다.',
  MARK_BOARD_TYPE_INVALID = '시분초 마크는 작업물공간(WORK) 게시물에서만 남길 수 있습니다.',
  COMMENT_PARENT_NOT_FOUND = '부모 댓글을 찾을 수 없습니다.',
  COMMENT_NOT_FOUND = '댓글을 찾을 수 없습니다.',
  COMMENT_FORBIDDEN = '본인의 댓글만 수정·삭제할 수 있습니다.',
  MARK_NOT_FOUND = '마크를 찾을 수 없습니다.',
  MARK_FORBIDDEN = '본인의 마크만 수정·삭제할 수 있습니다.',
  TAG_REQUEST_NOT_FOUND = '태그 요청을 찾을 수 없습니다.',
  ALREADY_PROCESSED = '이미 처리된 요청입니다.',
  PASSWORD_RESET_REQUEST_NOT_FOUND = '비밀번호 재설정 요청을 찾을 수 없습니다.',
  PASSWORD_RESET_CODE_INVALID = '유효하지 않은 코드입니다.',
  FILE_REQUIRED = '업로드할 파일이 없습니다.',
  FILE_TYPE_INVALID = '이미지·영상·음성 파일만 업로드할 수 있습니다.',
  FILE_UPLOAD_FAILED = '파일 업로드에 실패했습니다.',
}

export const NICKNAME_MIN_LENGTH = 1;
export const NICKNAME_MAX_LENGTH = 20;

export const STATUS_MESSAGE_MAX_LENGTH = 100;

export const PASSWORD_HASH_ROUNDS = 10;

export const POST_TITLE_MAX_LENGTH = 50;
export const POST_CONTENT_MAX_LENGTH = 500;
export const POST_IMAGE_MAX_COUNT = 10;

export const TAG_NAME_MAX_LENGTH = 20;

export const PASSWORD_RESET_CODE_LENGTH = 6;

export const BEARER_TOKEN_PREFIX = 'Bearer ';

export const ROLES_METADATA_KEY = 'roles';

export const SUPABASE_STORAGE_BUCKET = 'TEam7';
export const FILE_SIZE_MAX_BYTES = 50 * 1024 * 1024;
export const FILE_ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/'];
