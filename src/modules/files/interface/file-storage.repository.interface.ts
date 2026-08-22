// 계약 = 토큰 — 실제 저장소(Supabase Storage 등) 구현을 감춘다
export abstract class IFileStorageRepository {
  abstract upload(
    objectPath: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string>;
}
