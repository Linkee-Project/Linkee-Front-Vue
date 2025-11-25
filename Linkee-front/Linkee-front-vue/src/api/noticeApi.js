import api from "./axios.js"

/*공지사항 목록 조회
* GET /api/v1/board/notices?page=0&size=10
* param: page/ size*/

//async : 비동기 (Promise가 끝날때까지 기다림))
export async function fetchNoticeList({page = 0, size = 10} = {}) {

    //파라미터
    const params = {
        page: page,
        size: size
    };

    //axios Get 요청
    //{params} QueryString으로 자동변환
    const res = await api.get('/board/notices', {
        params,
    });

    //pageResponse반환
    /*
    * {data, totalElements, ...}*/
    return res.data;
}

//공지 상세 조회
export async function fetchNoticeDetail(noticeId) {
    // GET /api/v1/board/notices/{noticeId}
    const res = await api.get(`/board/notices/${noticeId}`, {});

    return res.data; //NoticeDetailResponseDto 반환
}

//공지사항 수정
export async function updateNotice(noticeId, payload) {
    const res = await api.put(`/admin/board/notices/${noticeId}/edit`,
        payload,
    );

    return res.data;
}

//공지 수정
export async function createNotice(payload) {
    const res = await api.post(
        "/admin/board/notices/new",
        payload
    );
    return res.data;
}