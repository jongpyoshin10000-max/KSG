export const EXPERIENCE_TYPES = [
  '방문형체험',
  '제공형체험',
  '페이백형체험',
  '구매평체험',
  '페이백+구매평체험',
  '방문형+페이백체험'
];

export const EXPERIENCE_STATUSES = [
  '신청',
  '선정',
  '일정확정',
  '체험완료',
  '리뷰작성완료',
  'URL제출완료',
  '승인완료',
  '페이백대기',
  '페이백완료',
  '취소'
];

export const SITE_OPTIONS = ['레뷰', '강남맛집체험단', '리뷰노트', '링블'];

export const BASE_FIELDS = {
  id: '',
  site: '',
  title: '',
  region: '',
  type: EXPERIENCE_TYPES[0],
  status: EXPERIENCE_STATUSES[0],
  shippingRequired: false,
  shippingDate: '',
  visitReservationDate: '',
  reviewDeadlineDate: '',
  reviewRegistered: false,
  blogUrl: '',
  purchaseSiteUrl: '',
  submitUrl: '',
  providedAmount: 0,
  extraAmount: 0,
  paybackAmount: 0,
  refundAmount: 0,
  paybackRequired: false,
  paybackCompleted: false,
  memo: '',
  extraFields: {}
};
