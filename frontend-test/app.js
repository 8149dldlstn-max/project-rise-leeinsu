const API_BASE = window.__API_BASE__ || 'http://localhost:3000';

const state = {
  token: localStorage.getItem('7ill_token') || null,
  user: null,
  currentBoard: 'ALL',
  tags: [],
  currentPost: null,
  currentMarks: [],
  replyToId: null,
  userDirectory: {}, // { [id]: { nickname, statusMessage } }
};

function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  $(id).classList.add('active');
}

// window.confirm()은 자동화 테스트 도구가 무시하고 지나가는 문제(+ 스타일 안 먹는 문제)가 있어
// 인라인 확인 UI로 대체
let _confirmCallback = null;
function showConfirm(message, onYes) {
  $('confirm-message').textContent = message;
  _confirmCallback = onYes;
  // 인라인 style="display:none"이 stylesheet의 .show 규칙보다 우선순위가 높아
  // 클래스 토글이 아니라 style.display를 직접 조작한다.
  $('confirm-modal').style.display = 'flex';
}
function confirmYes() {
  $('confirm-modal').style.display = 'none';
  const callback = _confirmCallback;
  _confirmCallback = null;
  if (callback) callback();
}
function confirmNo() {
  $('confirm-modal').style.display = 'none';
  _confirmCallback = null;
}

function toast(message, ok) {
  const el = $('toast');
  el.textContent = message;
  el.className = 'show ' + (ok ? 'ok' : 'err');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.className = ''), 3500);
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  const res = await fetch(API_BASE + path, { ...options, headers });
  let body = null;
  const text = await res.text();
  if (text) {
    try { body = JSON.parse(text); } catch (e) { body = text; }
  }
  if (!res.ok) {
    const msg = Array.isArray(body?.message) ? body.message.join(', ') : body?.message || res.statusText;
    const err = new Error(`[${res.status}] ${msg}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

function authorLabel(authorId) {
  const profile = state.userDirectory[authorId];
  return profile ? profile.nickname : `(id:${authorId})`;
}

function canManage(authorId) {
  return !!state.user && (state.user.id === authorId || state.user.role === 'ADMIN');
}

// ---------------- bootstrap ----------------
window.addEventListener('DOMContentLoaded', async () => {
  setTimeout(async () => {
    if (state.token) {
      try {
        state.user = await api('/me');
        await enterLounge();
        return;
      } catch (e) {
        state.token = null;
        localStorage.removeItem('7ill_token');
      }
    }
    showScreen('screen-auth-choice');
  }, 700);
});

// 라운지 화면에 있는 동안 채팅을 3초마다 자동 갱신 (기획 의도: 한 공간 안에서의 소통 — 실시간까지는 아니어도 액션 없이 새로고침)
setInterval(() => {
  if (state.token && $('screen-lounge').classList.contains('active')) {
    loadChat();
  }
}, 3000);

// ---------------- auth ----------------
async function doRegister() {
  try {
    await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: $('register-email').value,
        password: $('register-password').value,
        passwordConfirm: $('register-password-confirm').value,
        nickname: $('register-nickname').value,
      }),
    });
    toast('회원가입 성공! 로그인해주세요.', true);
    showScreen('screen-login');
  } catch (e) {
    toast('회원가입 실패: ' + e.message, false);
  }
}

async function doLogin() {
  try {
    const res = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: $('login-email').value, password: $('login-password').value }),
    });
    state.token = res.accessToken;
    localStorage.setItem('7ill_token', state.token);
    state.user = await api('/me');
    toast('로그인 성공', true);
    await enterLounge();
  } catch (e) {
    toast('로그인 실패: ' + e.message, false);
  }
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('7ill_token');
  showScreen('screen-auth-choice');
}

async function doResetRequest() {
  try {
    await api('/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email: $('reset-request-email').value }),
    });
    toast('재설정 요청 완료. 어드민이 코드를 발급할 때까지 기다려주세요.', true);
  } catch (e) {
    toast('요청 실패: ' + e.message, false);
  }
}

async function doResetConfirm() {
  try {
    await api('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify({
        email: $('reset-confirm-email').value,
        code: $('reset-confirm-code').value,
        newPassword: $('reset-confirm-password').value,
        newPasswordConfirm: $('reset-confirm-password-confirm').value,
      }),
    });
    toast('비밀번호가 재설정됐습니다. 로그인해주세요.', true);
    showScreen('screen-login');
  } catch (e) {
    toast('재설정 실패: ' + e.message, false);
  }
}

// ---------------- lounge ----------------
async function enterLounge() {
  $('lounge-nickname').textContent = state.user.nickname || '(닉네임 없음)';
  $('lounge-status').textContent = state.user.statusMessage ? `· ${state.user.statusMessage}` : '';
  $('lounge-role-badge').innerHTML = state.user.role === 'ADMIN' ? '<span class="role-badge">ADMIN</span>' : '';
  $('lounge-admin-btn').style.display = state.user.role === 'ADMIN' ? 'inline-block' : 'none';
  showScreen('screen-lounge');
  await loadUserDirectory();
  await loadTags();
  await loadFeed();
  await loadChat();
}

async function loadUserDirectory() {
  try {
    const users = await api('/users');
    state.userDirectory = {};
    users.forEach((u) => { state.userDirectory[u.id] = u; });
  } catch (e) {
    toast('팀원 목록 조회 실패: ' + e.message, false);
  }
}

function switchBoard(board) {
  state.currentBoard = board;
  $('tab-all').className = board === 'ALL' ? 'active-tab' : 'secondary';
  $('tab-work').className = board === 'WORK' ? 'active-tab' : 'secondary';
  $('tab-free').className = board === 'FREE' ? 'active-tab' : 'secondary';
  loadFeed();
}

async function loadTags() {
  try {
    state.tags = await api('/tags');
    const filterSel = $('tag-filter');
    filterSel.innerHTML = '<option value="">전체 태그</option>' +
      state.tags.map((t) => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
    const writeSel = $('write-tag');
    if (writeSel) {
      writeSel.innerHTML = '<option value="">선택 안 함</option>' +
        state.tags.map((t) => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
    }
  } catch (e) {
    toast('태그 목록 조회 실패: ' + e.message, false);
  }
}

async function loadFeed() {
  try {
    const tagId = $('tag-filter').value;
    const qs = new URLSearchParams();
    if (state.currentBoard !== 'ALL') qs.set('boardType', state.currentBoard);
    if (tagId) qs.set('tagId', tagId);
    const posts = await api('/posts' + (qs.toString() ? '?' + qs.toString() : ''));
    const feed = $('feed');
    if (posts.length === 0) {
      feed.innerHTML = '<p class="hint">게시물이 없습니다.</p>';
      return;
    }
    feed.innerHTML = posts.map((p) => {
      const tag = state.tags.find((t) => t.id === p.tagId);
      const boardBadge = state.currentBoard === 'ALL'
        ? `<span class="tag-chip" style="background:#dbeafe;color:#1e40af">${p.boardType}</span> `
        : '';
      const thumb = p.imageUrls?.[0]
        ? `<img src="${escapeHtml(p.imageUrls[0])}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:6px" />`
        : '';
      const mediaBadges = [
        p.videoUrl ? '🎬' : '',
        p.musicUrl ? '🎵' : '',
        p.imageUrls?.length ? `🖼️${p.imageUrls.length}` : '',
      ].filter(Boolean).join(' ');
      return `<div class="feed-card" onclick="openPostDetail(${p.id})">
        ${thumb}
        ${boardBadge}${tag ? `<span class="tag-chip">${escapeHtml(tag.name)}</span>` : ''}${mediaBadges ? ` <span class="hint">${mediaBadges}</span>` : ''}
        <h4>${escapeHtml(p.title)}</h4>
        <p class="hint">by ${escapeHtml(authorLabel(p.authorId))} · ${new Date(p.createdAt).toLocaleString()}</p>
        <p>${escapeHtml(p.content).slice(0, 40)}</p>
      </div>`;
    }).join('');
  } catch (e) {
    toast('게시물 목록 조회 실패: ' + e.message, false);
  }
}

async function loadChat() {
  try {
    const messages = await api('/chat/messages');
    const box = $('chat-messages');
    const wasAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 40;
    box.innerHTML = messages.map((m) =>
      `<div class="chat-msg"><b>${escapeHtml(m.nickname)}</b>: ${escapeHtml(m.content)}</div>`
    ).join('');
    if (wasAtBottom) box.scrollTop = box.scrollHeight;
  } catch (e) {
    // 폴링 중 조용히 실패(토스트로 3초마다 스팸하지 않음)
  }
}

async function sendChat() {
  const input = $('chat-input');
  if (!input.value.trim()) return;
  try {
    await api('/chat/messages', { method: 'POST', body: JSON.stringify({ content: input.value }) });
    input.value = '';
    await loadChat();
  } catch (e) {
    toast('채팅 전송 실패: ' + e.message, false);
  }
}

// ---------------- team roster ----------------
async function openTeam() {
  showScreen('screen-team');
  try {
    const users = await api('/users');
    state.userDirectory = {};
    users.forEach((u) => { state.userDirectory[u.id] = u; });
    $('team-list').innerHTML = users.map((u) => `
      <div class="section-box" style="margin-bottom:10px">
        <b>${escapeHtml(u.nickname || '(닉네임 없음)')}</b>
        ${u.id === state.user.id ? '<span class="hint">(나)</span>' : ''}
        <p class="hint">${u.statusMessage ? escapeHtml(u.statusMessage) : '상태메시지 없음'}</p>
      </div>
    `).join('');
  } catch (e) {
    toast('팀원 목록 조회 실패: ' + e.message, false);
  }
}

// ---------------- write ----------------
function openWrite() {
  $('write-title').value = '';
  $('write-content').value = '';
  $('write-images').value = '';
  $('write-music').value = '';
  $('write-video').value = '';
  const defaultBoard = state.currentBoard === 'FREE' ? 'FREE' : 'WORK';
  document.querySelector('input[name="write-board"][value="' + defaultBoard + '"]').checked = true;
  showScreen('screen-write');
}

function renderWriteFields() {}

function toggleTagRequestBox() {
  const box = $('tag-request-box');
  const showing = box.style.display === 'flex';
  box.style.display = showing ? 'none' : 'flex';
}

async function requestNewTag() {
  const name = $('tag-request-name').value.trim();
  if (!name) { toast('태그 이름을 입력해주세요.', false); return; }
  try {
    await api('/tag-requests', { method: 'POST', body: JSON.stringify({ name }) });
    toast('태그 요청이 접수됐습니다. 어드민 승인을 기다려주세요.', true);
    $('tag-request-name').value = '';
    $('tag-request-box').style.display = 'none';
  } catch (e) {
    toast('태그 요청 실패: ' + e.message, false);
  }
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const headers = {};
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  const res = await fetch(API_BASE + '/files/upload', { method: 'POST', headers, body: formData });
  const text = await res.text();
  let body = null;
  if (text) { try { body = JSON.parse(text); } catch (e) { body = text; } }
  if (!res.ok) {
    const msg = Array.isArray(body?.message) ? body.message.join(', ') : body?.message || res.statusText;
    throw new Error(msg);
  }
  return body.url;
}

async function submitWrite() {
  const boardType = document.querySelector('input[name="write-board"]:checked').value;
  const tagId = $('write-tag').value;
  const imageFiles = Array.from($('write-images').files);
  const musicFile = $('write-music').files[0];
  const videoFile = $('write-video').files[0];

  try {
    const imageUrls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      toast(`이미지 업로드 중... (${i + 1}/${imageFiles.length})`, true);
      imageUrls.push(await uploadFile(imageFiles[i]));
    }
    const musicUrl = musicFile ? await uploadFile(musicFile) : undefined;
    const videoUrl = videoFile ? await uploadFile(videoFile) : undefined;

    await api('/posts', {
      method: 'POST',
      body: JSON.stringify({
        boardType,
        tagId: tagId ? Number(tagId) : undefined,
        title: $('write-title').value,
        content: $('write-content').value,
        imageUrls: imageUrls.length ? imageUrls : undefined,
        musicUrl,
        videoUrl,
      }),
    });
    toast('게시물이 작성됐습니다.', true);
    switchBoard(boardType);
    showScreen('screen-lounge');
  } catch (e) {
    toast('게시물 작성 실패: ' + e.message, false);
  }
}

// ---------------- post detail ----------------
async function openPostDetail(id) {
  try {
    const post = await api('/posts/' + id);
    state.currentPost = post;
    $('detail-title').textContent = post.title;
    const tag = state.tags.find((t) => t.id === post.tagId);
    $('detail-tag-chip').textContent = tag ? `#${tag.name}` : '';
    $('detail-meta').textContent = `게시판: ${post.boardType} · 작성자: ${authorLabel(post.authorId)} · ${new Date(post.createdAt).toLocaleString()}`;
    $('detail-content').textContent = post.content;

    const mediaHtml = [];
    if (post.imageUrls?.length) {
      mediaHtml.push(`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${
        post.imageUrls.map((url) => `<img src="${escapeHtml(url)}" style="width:120px;height:120px;object-fit:cover;border-radius:8px" />`).join('')
      }</div>`);
    }
    if (post.videoUrl) {
      mediaHtml.push(`<video src="${escapeHtml(post.videoUrl)}" controls style="width:100%;border-radius:8px;margin-bottom:8px"></video>`);
    }
    if (post.musicUrl) {
      mediaHtml.push(`<audio src="${escapeHtml(post.musicUrl)}" controls style="width:100%;margin-bottom:8px"></audio>`);
    }
    $('detail-files').innerHTML = mediaHtml.join('');

    $('detail-owner-actions').style.display = canManage(post.authorId) ? 'flex' : 'none';
    $('detail-edit-box').style.display = 'none';

    $('detail-marks-box').style.display = post.boardType === 'WORK' ? 'block' : 'none';
    if (post.boardType === 'WORK') {
      renderMarkFields();
      await loadMarks(id);
    }

    cancelReply();
    await loadComments(id);
    showScreen('screen-post-detail');
  } catch (e) {
    toast('게시물 조회 실패: ' + e.message, false);
  }
}

function startEditPost() {
  $('edit-title').value = state.currentPost.title;
  $('edit-content').value = state.currentPost.content;
  $('detail-edit-box').style.display = 'block';
}

async function submitEditPost() {
  try {
    const updated = await api('/posts/' + state.currentPost.id, {
      method: 'PATCH',
      body: JSON.stringify({ title: $('edit-title').value, content: $('edit-content').value }),
    });
    toast('수정 완료', true);
    await openPostDetail(updated.id);
  } catch (e) {
    toast('수정 실패: ' + e.message, false);
  }
}

function deletePost() {
  showConfirm('정말 삭제할까요? 딸린 댓글·마크도 함께 삭제됩니다.', async () => {
    try {
      await api('/posts/' + state.currentPost.id, { method: 'DELETE' });
      toast('삭제 완료', true);
      showScreen('screen-lounge');
      await loadFeed();
    } catch (e) {
      toast('삭제 실패(본인 게시물만 가능): ' + e.message, false);
    }
  });
}

// ---------------- marks ----------------
function renderMarkFields() {
  const kind = document.querySelector('input[name="mark-kind"]:checked').value;
  const box = $('mark-field-box');
  if (kind === 'TAG') box.innerHTML = '<label>태그 텍스트</label><input id="mark-tag-value" />';
  else if (kind === 'EMOJI') box.innerHTML = '<label>이모지</label><input id="mark-tag-value" placeholder="🔥" />';
  else box.innerHTML = '<label>댓글 내용</label><input id="mark-tag-value" />';
}

function markValue(m) {
  return m.kind === 'TAG' ? m.tag : m.kind === 'EMOJI' ? m.emoji : m.content;
}

async function loadMarks(postId) {
  try {
    const marks = await api(`/posts/${postId}/marks`);
    state.currentMarks = marks; // onclick 문자열에 값을 직접 끼워넣지 않고 id로 조회하기 위해 보관
    $('marks-list').innerHTML = marks.map((m) => `
      <div class="mark-item" id="mark-row-${m.id}">
        <span class="mark-time">${m.timestampSec}s</span>
        <span>[${m.kind}] ${escapeHtml(markValue(m) || '')}</span>
        <span class="hint">by ${escapeHtml(authorLabel(m.authorId))}</span>
        ${canManage(m.authorId) ? `
          <button class="link-btn" style="font-size:11px" onclick="startEditMark(${m.id})">수정</button>
          <button class="link-btn" style="font-size:11px;color:#dc2626" onclick="deleteMark(${m.id})">삭제</button>
        ` : ''}
      </div>
      <div id="mark-edit-${m.id}" style="display:none;margin:4px 0 8px 58px">
        <input id="mark-edit-value-${m.id}" style="width:160px" />
        <button class="small" onclick="submitEditMark(${m.id})">저장</button>
        <button class="small secondary" onclick="document.getElementById('mark-edit-${m.id}').style.display='none'">취소</button>
      </div>
    `).join('') || '<p class="hint">마크가 없습니다.</p>';
  } catch (e) {
    toast('마크 조회 실패: ' + e.message, false);
  }
}

function startEditMark(markId) {
  const mark = state.currentMarks.find((m) => m.id === markId);
  if (!mark) return;
  const box = $(`mark-edit-${markId}`);
  $(`mark-edit-value-${markId}`).value = markValue(mark) || '';
  box.dataset.kind = mark.kind;
  box.style.display = 'block';
}

async function submitEditMark(markId) {
  const box = $(`mark-edit-${markId}`);
  const kind = box.dataset.kind;
  const value = $(`mark-edit-value-${markId}`).value;
  const body = { kind };
  if (kind === 'TAG') body.tag = value;
  else if (kind === 'EMOJI') body.emoji = value;
  else body.content = value;
  try {
    await api(`/posts/${state.currentPost.id}/marks/${markId}`, { method: 'PATCH', body: JSON.stringify(body) });
    toast('마크 수정됨', true);
    await loadMarks(state.currentPost.id);
  } catch (e) {
    toast('마크 수정 실패: ' + e.message, false);
  }
}

function deleteMark(markId) {
  showConfirm('마크를 삭제할까요?', async () => {
    try {
      await api(`/posts/${state.currentPost.id}/marks/${markId}`, { method: 'DELETE' });
      toast('마크 삭제됨', true);
      await loadMarks(state.currentPost.id);
    } catch (e) {
      toast('마크 삭제 실패: ' + e.message, false);
    }
  });
}

async function submitMark() {
  const kind = document.querySelector('input[name="mark-kind"]:checked').value;
  const value = $('mark-tag-value').value;
  const body = { timestampSec: Number($('mark-time').value || 0), kind };
  if (kind === 'TAG') body.tag = value;
  else if (kind === 'EMOJI') body.emoji = value;
  else body.content = value;
  try {
    await api(`/posts/${state.currentPost.id}/marks`, { method: 'POST', body: JSON.stringify(body) });
    toast('마크 추가됨', true);
    await loadMarks(state.currentPost.id);
  } catch (e) {
    toast('마크 추가 실패: ' + e.message, false);
  }
}

// ---------------- comments ----------------
async function loadComments(postId) {
  try {
    const comments = await api(`/posts/${postId}/comments`);
    $('comments-list').innerHTML = comments.map((c) => `
      <div class="comment-item ${c.parentId ? 'reply' : ''}">
        <div class="meta">#${c.id} · ${escapeHtml(authorLabel(c.authorId))} ${c.parentId ? '· 답글 → #' + c.parentId : ''}</div>
        <div id="comment-view-${c.id}">${escapeHtml(c.content)}</div>
        <div id="comment-edit-${c.id}" style="display:none">
          <textarea id="comment-edit-value-${c.id}" rows="2" style="width:100%">${escapeHtml(c.content)}</textarea>
          <button class="small" onclick="submitEditComment(${c.id})">저장</button>
          <button class="small secondary" onclick="document.getElementById('comment-edit-${c.id}').style.display='none';document.getElementById('comment-view-${c.id}').style.display='block'">취소</button>
        </div>
        <button class="link-btn" style="font-size:11px" onclick="replyTo(${c.id})">답글</button>
        ${canManage(c.authorId) ? `
          <button class="link-btn" style="font-size:11px" onclick="startEditComment(${c.id})">수정</button>
          <button class="link-btn" style="font-size:11px;color:#dc2626" onclick="deleteComment(${c.id})">삭제</button>
        ` : ''}
      </div>
    `).join('') || '<p class="hint">댓글이 없습니다.</p>';
  } catch (e) {
    toast('댓글 조회 실패: ' + e.message, false);
  }
}

function startEditComment(commentId) {
  $(`comment-view-${commentId}`).style.display = 'none';
  $(`comment-edit-${commentId}`).style.display = 'block';
}

async function submitEditComment(commentId) {
  const content = $(`comment-edit-value-${commentId}`).value;
  try {
    await api(`/posts/${state.currentPost.id}/comments/${commentId}`, { method: 'PATCH', body: JSON.stringify({ content }) });
    toast('댓글 수정됨', true);
    await loadComments(state.currentPost.id);
  } catch (e) {
    toast('댓글 수정 실패: ' + e.message, false);
  }
}

function deleteComment(commentId) {
  showConfirm('댓글을 삭제할까요? 딸린 답글도 함께 삭제됩니다.', async () => {
    try {
      await api(`/posts/${state.currentPost.id}/comments/${commentId}`, { method: 'DELETE' });
      toast('댓글 삭제됨', true);
      await loadComments(state.currentPost.id);
    } catch (e) {
      toast('댓글 삭제 실패: ' + e.message, false);
    }
  });
}

function replyTo(commentId) {
  state.replyToId = commentId;
  $('comment-reply-label').textContent = `#${commentId}에 답글 작성`;
  $('comment-cancel-reply').style.display = 'inline-block';
  $('comment-content').focus();
}

function cancelReply() {
  state.replyToId = null;
  $('comment-reply-label').textContent = '댓글 내용';
  $('comment-cancel-reply').style.display = 'none';
  $('comment-content').value = '';
}

async function submitComment() {
  const content = $('comment-content').value;
  if (!content.trim()) return;
  try {
    await api(`/posts/${state.currentPost.id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId: state.replyToId || undefined }),
    });
    toast('댓글 작성됨', true);
    cancelReply();
    await loadComments(state.currentPost.id);
  } catch (e) {
    toast('댓글 작성 실패: ' + e.message, false);
  }
}

// ---------------- mypage ----------------
async function openMyPage() {
  try {
    state.user = await api('/me');
    $('mypage-email').textContent = state.user.email;
    $('mypage-role').textContent = state.user.role;
    $('mypage-status').value = state.user.statusMessage || '';
    await renderMyPosts();
    showScreen('screen-mypage');
  } catch (e) {
    toast('마이페이지 조회 실패: ' + e.message, false);
  }
}

async function renderMyPosts() {
  const posts = await api('/me/posts');
  $('mypage-posts').innerHTML = posts.map((p) => `
    <div class="feed-card" style="min-width:auto;max-width:none;margin-bottom:8px" onclick="openPostDetail(${p.id})">
      <h4>[${p.boardType}] ${escapeHtml(p.title)}</h4>
      <p>${escapeHtml(p.content).slice(0, 60)}</p>
      <div class="post-owner-actions">
        <button class="small" onclick="event.stopPropagation(); startInlineEditMyPost(${p.id})">수정</button>
        <button class="small danger" onclick="event.stopPropagation(); deleteMyPost(${p.id})">삭제</button>
      </div>
      <div id="mypage-edit-${p.id}" style="display:none;margin-top:8px" onclick="event.stopPropagation()">
        <div class="field-row"><label>제목</label><input id="mypage-edit-title-${p.id}" maxlength="50" value="${escapeHtml(p.title)}" /></div>
        <div class="field-row"><label>내용</label><textarea id="mypage-edit-content-${p.id}" maxlength="500" rows="3">${escapeHtml(p.content)}</textarea></div>
        <button class="small" onclick="submitInlineEditMyPost(${p.id})">저장</button>
        <button class="small secondary" onclick="document.getElementById('mypage-edit-${p.id}').style.display='none'">취소</button>
      </div>
    </div>
  `).join('') || '<p class="hint">작성한 글이 없습니다.</p>';
}

function startInlineEditMyPost(postId) {
  const box = $(`mypage-edit-${postId}`);
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

async function submitInlineEditMyPost(postId) {
  try {
    await api('/posts/' + postId, {
      method: 'PATCH',
      body: JSON.stringify({
        title: $(`mypage-edit-title-${postId}`).value,
        content: $(`mypage-edit-content-${postId}`).value,
      }),
    });
    toast('수정 완료', true);
    await renderMyPosts();
  } catch (e) {
    toast('수정 실패: ' + e.message, false);
  }
}

function deleteMyPost(postId) {
  showConfirm('정말 삭제할까요? 딸린 댓글·마크도 함께 삭제됩니다.', async () => {
    try {
      await api('/posts/' + postId, { method: 'DELETE' });
      toast('삭제 완료', true);
      await renderMyPosts();
    } catch (e) {
      toast('삭제 실패: ' + e.message, false);
    }
  });
}

async function submitStatusMessage() {
  try {
    state.user = await api('/me/status', { method: 'PATCH', body: JSON.stringify({ statusMessage: $('mypage-status').value }) });
    toast('상태메시지 저장됨', true);
    $('lounge-status').textContent = state.user.statusMessage ? `· ${state.user.statusMessage}` : '';
  } catch (e) {
    toast('저장 실패: ' + e.message, false);
  }
}

// ---------------- admin ----------------
function switchAdminTab(tab) {
  $('admin-tab-tags').className = tab === 'tags' ? 'active-tab' : 'secondary';
  $('admin-tab-reset').className = tab === 'reset' ? 'active-tab' : 'secondary';
  $('admin-section-tags').classList.toggle('active', tab === 'tags');
  $('admin-section-reset').classList.toggle('active', tab === 'reset');
}

async function openAdmin() {
  showScreen('screen-admin');
  await loadAdminTagRequests();
  await loadAdminResetRequests();
}

async function loadAdminTagRequests() {
  try {
    const requests = await api('/admin/tag-requests');
    $('admin-tag-requests-body').innerHTML = requests.map((r) => `
      <tr>
        <td>${escapeHtml(r.name)}</td>
        <td>${r.requesterId}</td>
        <td><span class="status-pill status-${r.status}">${r.status}</span></td>
        <td>
          ${r.status === 'PENDING' ? `
            <button class="small" onclick="approveTagRequest(${r.id})">승인</button>
            <button class="small danger" onclick="rejectTagRequest(${r.id})">거절</button>
          ` : '-'}
        </td>
      </tr>
    `).join('') || '<tr><td colspan="4">요청 없음</td></tr>';
  } catch (e) {
    toast('태그 요청 목록 조회 실패(어드민 전용): ' + e.message, false);
  }
}

async function approveTagRequest(id) {
  try {
    await api(`/admin/tag-requests/${id}/approve`, { method: 'PATCH' });
    toast('승인 완료 — 고정 태그 목록에 반영됨', true);
    await loadAdminTagRequests();
    await loadTags();
  } catch (e) {
    toast('승인 실패: ' + e.message, false);
  }
}

async function rejectTagRequest(id) {
  try {
    await api(`/admin/tag-requests/${id}/reject`, { method: 'PATCH' });
    toast('거절 완료', true);
    await loadAdminTagRequests();
  } catch (e) {
    toast('거절 실패: ' + e.message, false);
  }
}

async function loadAdminResetRequests() {
  try {
    const requests = await api('/admin/password-reset-requests');
    $('admin-reset-requests-body').innerHTML = requests.map((r) => `
      <tr>
        <td>${escapeHtml(r.email)}</td>
        <td>${escapeHtml(r.nickname || '')}</td>
        <td><span class="status-pill status-${r.status}">${r.status}</span></td>
        <td>${r.code || '-'}</td>
        <td>${r.status === 'PENDING' ? `<button class="small" onclick="issueResetCode(${r.id})">코드 발급</button>` : '-'}</td>
      </tr>
    `).join('') || '<tr><td colspan="5">요청 없음</td></tr>';
  } catch (e) {
    toast('재설정 요청 목록 조회 실패(어드민 전용): ' + e.message, false);
  }
}

async function issueResetCode(id) {
  try {
    const updated = await api(`/admin/password-reset-requests/${id}/issue-code`, { method: 'PATCH' });
    toast(`코드 발급됨: ${updated.code} (사용자에게 직접 전달하세요)`, true);
    await loadAdminResetRequests();
  } catch (e) {
    toast('코드 발급 실패: ' + e.message, false);
  }
}

// ---------------- utils ----------------
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
