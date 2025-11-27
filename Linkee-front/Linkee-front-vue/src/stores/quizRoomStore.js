import { defineStore } from "pinia";
import { Client } from "@stomp/stompjs";

export const useQuizGameStore = defineStore("quizGame", {
    state: () => ({
        token: null,
        roomId: null,

        stompClient: null,
        connected: false,

        // 화면 상태
        phase: "question",          // "question" | "answer" | "result"

        // 서버에서 내려주는 데이터
        currentQuestion: null,      // QUESTION_STARTED data
        currentResult: null,        // QUESTION_RESULT data
        rankingData: null,          // QUIZ_FINISHED data

        // 기타: 제출 상태 / 플레이어 표시용
        answerSubmittedUsers: [],   // ANSWER_SUBMITTED 에서 누가 제출했는지

        // 대기실/게임 화면 공통으로 쓰는 실제 플레이어 목록
        players: [],

        // 타이머 관련 상태
        timeLeft: 0,     // 화면에 보여줄 남은 시간(초)
        timerId: null,   // setInterval 핸들

        // 내가 현재 문제에서 선택한 보기 번호
        myAnswerIndex: null,
    }),

    actions: {
        /* 1) 초기화 */
        init(token, roomId) {
            this.token = token;
            this.roomId = Number(roomId);
        },

        /* 2) WebSocket 연결 */
        connectSocket() {
            if (this.connected) {
                console.log("이미 연결된 상태입니다.");
                return;
            }

            if (!this.token || !this.roomId) {
                console.warn("토큰 또는 roomId가 없습니다.");
                return;
            }

            console.log("🔌 Quiz WebSocket 연결 준비...");

            // 접속한 호스트 기준으로 WebSocket URL
            const host = window.location.hostname;
            const wsUrl = `ws://${host}:8080/ws-stomp?token=${this.token}`;

            this.stompClient = new Client({
                brokerURL: wsUrl,
                reconnectDelay: 5000,
                debug: (msg) => console.log("[QUIZ STOMP]", msg),
            });

            this.stompClient.onConnect = () => {
                console.log("🟢 Quiz WebSocket 연결됨!");
                this.connected = true;

                // ✅ 퀴즈 방 구독 (백엔드: /sub/quiz-room/{roomId} 로 브로드캐스트)
                this.stompClient.subscribe(
                    `/sub/quiz-room/${this.roomId}`,
                    this.onSocketMessage.bind(this)
                );

                // 선택: JOIN 알림 보내기
                this.sendMessage("JOIN");
            };

            this.stompClient.onStompError = (frame) => {
                console.error("❌ QUIZ STOMP ERROR:", frame);
            };

            this.stompClient.activate();
        },

        /* 3) WebSocket 메시지 처리 */
        onSocketMessage(raw) {
            const msg = JSON.parse(raw.body);
            console.log("📩 QUIZ WS RECV:", msg);

            // msg = QuizWebSocketResponse
            // { type, success, message, data }

            switch (msg.type) {
                case "QUESTION_STARTED":      // startQuiz(), broadcastNextQuestion()
                    this.phase = "question";
                    this.currentQuestion = msg.data;    // QuizQuestionData
                    this.currentResult = null;
                    this.rankingData = null;
                    this.answerSubmittedUsers = [];

                    // 새 문제 시작할 때 내 선택 초기화
                    this.myAnswerIndex = null;

                    // 서버가 주는 timeLimit 사용 (없으면 20초)
                    this.startTimer(msg.data.timeLimit || 20);
                    break;

                case "ANSWER_SUBMITTED":      // notifyAnswerSubmitted()
                    // data: AnswerSubmittedData { userId, userName, submittedCount, totalParticipants }
                    if (!this.answerSubmittedUsers.find(u => u.userId === msg.data.userId)) {
                        this.answerSubmittedUsers.push(msg.data);
                    }
                    break;

                case "QUESTION_RESULT":       // broadcastQuestionResult()
                    this.phase = "answer";
                    this.currentResult = msg.data;      // QuizResultData

                    this.stopTimer();
                    break;

                case "QUIZ_FINISHED":         // broadcastQuizFinished()
                    this.phase = "result";
                    this.rankingData = msg.data;        // QuizRankingData

                    // 게임 끝 → 타이머 멈추기
                    this.stopTimer();
                    break;

                case "MEMBER_UPDATED": {
                    const members = msg.data?.members || []

                    this.players = members.map(m => ({
                        userId: m.memberId,
                        userName: m.memberNickname,
                        isReady: m.ready,
                        isLeader: m.owner,
                        roomMemberId: m.roomMemberId,
                    }));
                    console.log("👥 MEMBER_UPDATED, players:", this.players)
                    break;
                }


                case "ERROR":
                    alert(msg.message || "퀴즈 진행 중 오류가 발생했습니다.");
                    break;

                default:
                    console.log("Unhandled QUIZ WS message type:", msg.type);
            }
        },

        /* 4) 서버로 메시지 보내기 (START_QUIZ, SUBMIT_ANSWER 등) */
        sendMessage(type, extra = {}) {
            if (!this.stompClient || !this.connected) return;

            this.stompClient.publish({
                // 🔹 WebSocketConfig에서 applicationDestinationPrefixes가 "/app" 이라고 가정
                destination: `/app/quiz/rooms/${this.roomId}`,
                headers: {
                    // 컨트롤러에서 @Header("Authorization")로 JWT를 읽을 수도 있으니까 같이 넣어주자
                    Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify({
                    type,      // START_QUIZ, SUBMIT_ANSWER, READY_TOGGLE, JOIN, LEAVE
                    ...extra,  // answerIndex 등
                }),
            });
        },

        /* 4-1) 편의 함수들 */

        // 게임 시작 (방장만 호출)
        startQuiz() {
            this.sendMessage("START_QUIZ");
        },

        // 보기 선택 시 호출 (1,2,3,4 ...)
        submitAnswer(optionIndex) {
            this.sendMessage("SUBMIT_ANSWER", { answerIndex: optionIndex });

            // 내가 고른 보기 기억 → 화면에서 하이라이트에 사용
            this.myAnswerIndex = optionIndex;
        },

        // 준비 토글 (대기실용이라 퀴즈방보다는 waiting 화면에서 쓸 가능성이 크긴 함)
        toggleReady() {
            this.sendMessage("READY_TOGGLE");
        },

        // WebSocket 종료
        leaveRoom() {
            if (this.stompClient) {
                this.sendMessage("LEAVE");
                this.stompClient.deactivate();
            }
            this.connected = false;
            this.stopTimer();    // ⬅ 여기 추가
            console.log("🔻 Quiz WebSocket 종료");
        },


        // 타이머 시작
        startTimer(seconds) {
            // 이전 타이머 있으면 제거
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = null;
            }

            this.timeLeft = seconds;

            this.timerId = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                } else {
                    clearInterval(this.timerId);
                    this.timerId = null;
                }
            }, 1000);
        },

        // 타이머 정지
        stopTimer() {
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = null;
            }
            this.timeLeft = 0;
        },
    },
});
