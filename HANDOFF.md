# 7ill (art-collab) — 진행 상황 핸드오프 (2026-08-22)

> 새 대화창에서 이걸 먼저 읽고 이어가면 됩니다. "HANDOFF.md 읽고 이어가줘"라고 말하면 됩니다.

## 한 줄 요약
NestJS 백엔드 전체 도메인 구현·테스트 완료 + 테스트용 프론트엔드(`frontend-test/`)까지 실제 브라우저로 끝까지 검증 완료. 지금은 막힌 것 없이 "다음에 뭘 할지" 정하는 단계.

## 지금 상태
- **백엔드**: `docs/스펙.md`의 In 목록 전부 구현 + 그 이후 추가 요청(팀원목록, 댓글/마크 수정삭제, CASCADE 정책)까지 반영. 25개+ 엔드포인트 Swagger 문서화 완료.
- **프론트엔드**: `frontend-test/`에 화면 흐름 그대로 만든 바닐라 JS 테스트 앱. 회원가입~로그인~라운지~글쓰기~게시물상세~마이페이지~어드민~팀원목록까지 전부 실제 클릭으로 검증됨.
- **미정리 항목**: 없음. 기획 스프레드시트(`7ill_기획문서.xlsx`)의 17개 항목 전부 "확정" 상태.

## 파일 위치
- `CLAUDE.md` — 항상 지켜야 하는 프로젝트 규칙 (건드리지 않음)
- `docs/규칙서.md` — 코드 작성 공통 규칙 (n-tier, 클래스토큰 DI, DTO, 상수관리, Swagger, §13 체크리스트)
- `docs/스펙.md` — **실시간으로 계속 갱신해온 최신 기술 스펙**. 엔티티/관계/API/핵심규칙/In-Out 전부 여기 있음. 다음 세션에서 뭘 확인하고 싶으면 이 파일부터 볼 것
- `src/` — NestJS 백엔드. `modules/{users,auth,tags,tag-requests,posts,timeline-marks,comments,chat,password-resets}` 도메인별 폴더 + `common/`(constants, types, guards, decorators, utils/token)
- `frontend-test/` — 테스트용 프론트(`index.html`, `app.js`, `style.css`, `serve.js`). 백엔드 API를 검증하기 위한 용도, 실제 배포용 아님
- `.env` — Supabase 연결 정보 이미 채워져 있음 (실제 프로젝트 접속 정보, 커밋 안 됨)
- `.claude/launch.json` — `art-collab-backend`(포트 3000), `7ill-test-frontend`(포트 5173) 두 개 프리뷰 설정 등록됨
- **`7ill_기획문서.xlsx`**: 세션 스크래치패드에 있었고 사용자에게 전달만 했음 — **다음 세션은 이 파일을 다시 못 읽습니다.** 필요하면 사용자에게 다시 요청할 것. (내용: 화면흐름도/화면별상세명세/글쓰기플로우상세/미정리확인항목17개(전부확정)/구현현황)

## 실행 방법 (새 세션에서 서버 다시 켜야 함 — 이전 세션 프로세스는 안 살아있음)
```bash
npm run start:dev            # 백엔드, http://localhost:3000/api-docs
node frontend-test/serve.js  # 테스트 프론트, http://localhost:5173
```

## 테스트 계정
| 이메일 | 비밀번호 | role | 비고 |
|---|---|---|---|
| frontend-test@example.com | newpass456 | USER | 비밀번호 재설정 테스트로 여러 번 바뀜 |
| test2@example.com | password123 | **ADMIN** | 어드민 기능 테스트용으로 수동 승격함 |

DB에 이 외에도 curl로 만든 테스트 계정/게시물/댓글이 다수 있음 — 한글 내용이 깨져 보이는 건 실제 버그가 아니라 Windows curl 명령행 인코딩 문제였음(브라우저로 만든 데이터는 정상).

## 구현된 도메인 (전부 완료)
User(role) · Auth(회원가입/로그인) · 비밀번호 재설정(어드민 코드 발급) · 마이페이지(`/me`,`/me/status`,`/me/posts`) · 팀원목록(`GET /users`) · Tag(조회+생성) · TagRequest(요청+어드민 승인/거절) · Post(CRUD, 소유권검증) · TimelineMark(CRUD, WORK 게시물 전용) · Comment(CRUD, 대댓글, CASCADE) · ChatMessage(전체채팅)

## 핵심 결정 사항 (다시 묻지 않아도 됨)
- 인증: 이메일+비밀번호, JWT. role은 DB에서 수동 지정(셀프 승격 없음)
- 게시판 CASCADE: 게시물 삭제 → 딸린 댓글·마크 함께 삭제. 댓글 삭제 → 대댓글도 재귀적으로 함께 삭제
- 태그 승인/비밀번호 재설정: 세부 로직(대기배지, 중복방지, 거절사유) 없이 단순 승인/거절만
- 파일 업로드: 백엔드는 URL 문자열만 저장(Supabase Storage 실제 업로드 연동은 안 함, In 스코프 아님)
- 채팅: 전체 공개 채팅방 1개, 실시간(WebSocket) 아니고 REST+3초 폴링

## 다음에 할 만한 것 (정해진 건 없음, 후보만)
- `docs/스펙.md`의 Out(v2) 목록: 신고/모더레이션, 알림, 버전관리, 파형시각화, A/B플레이어, QR/기기바인딩, 채팅 실시간화
- 실제 파일 업로드(Supabase Storage 연동) — 지금은 URL 문자열만 받음
- **git 저장소가 아직 없음** — 작업량이 상당한데 버전 관리가 전혀 안 되고 있어서, 다음 세션 시작할 때 `git init` + 최초 커밋부터 하는 걸 권장함

## 이 세션에서 배운 것 (반복하지 않기 위해)
- API가 curl로 통과해도 실제 브라우저에서 별개의 버그가 나옴(`prompt()`/`confirm()` 자동화 무시, `onclick` 문자열에 값 직접 삽입 시 마크업 깨짐, 정적서버 캐시로 수정사항 미반영) — 프론트 다룰 때는 실제 클릭 테스트 필수
- Windows git-bash + curl로 한글 넣으면 인코딩 깨짐 — 실제 앱 동작과 무관, 테스트 데이터에서만 발생
