// DB 전환 시 이 인터페이스를 구현하는 저장소로 교체
export class BaseRepository {
  async findAll() {
    throw new Error('findAll not implemented');
  }
  async saveAll(_) {
    throw new Error('saveAll not implemented');
  }
}
