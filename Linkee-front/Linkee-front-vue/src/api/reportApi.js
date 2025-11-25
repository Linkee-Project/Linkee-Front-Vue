import api from './axios.js'

//목록조회
export async function fetchReportList({page = 0, size = 10, type = null, status = null} = {}) {
    const params = {page, size};

    if (type) params.type = type;
    if (status) params.status = status;

    const res = await api.get('/board/reports', {params});
    return res.data;
}

//상세 조회
export async function fetchReportDetail(reportId) {
    const res = await api.get(`/board/reports/${reportId}`);
    return res.data;
}

// 신고 처리 (관리자)
export async function submitReportProcess(reportId, processContent) {
    const res = await api.patch('/admin/board/reports/action', {
        reportId,
        reportAction: processContent
    });
    return res.data;
}