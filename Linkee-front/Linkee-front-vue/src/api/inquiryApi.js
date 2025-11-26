import api from "./axios.js"

//문의 목록조회
export async function fetchInquiryList({page = 0, size = 10, answerStatus = null} = {}) {
    const params = {page, size};

    //answerStatus는 필터링 용으로 있을때만 파라미터 추가
    if (answerStatus) params.answerStatus = answerStatus;

    const res = await api.get("/board/inquiries", { params });
    return res.data;
}

//문의 답변
export async function submitInquiryAnswer(inquiryId, answerContent) {
    const res = await api.patch(`/admin/board/inquiries/${inquiryId}/reply`, {
        answerContent
    })

    return res.data;
}

//문의 상세조회
export async function fetchInquiryDetail(inquiryId) {
    const res = await api.get(`/board/inquiries/${inquiryId}`);
    return res.data;
}

//문의 등록
// 문의 등록
export async function createInquiry({ inquiryTitle, inquiryContent }) {
    const res = await api.post("/board/inquiries/new", {
        inquiryTitle,
        inquiryContent
    });

    return res.data;
}