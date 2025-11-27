# Linkee-api

---
# 🌟링키 Linkee
<div align="center">
<img width="600" height="600" alt="ChatGPT Image 2025년 10월 15일 오후 05_09_11 (1) (1)" src="https://github.com/user-attachments/assets/ab453c50-5f3a-4732-baf8-25057305de24" />
</div>


---
## 목차 (Table of Contents)

1. [👩‍👧‍👦 멤버 소개](#-1-멤버-소개)  
2. [⚒️ 서비스 소개](#️-2-서비스-소개)  
3. [🚀 기술 스택](#-3-기술-스택)  
4. [🗂️ 프로젝트 산출물](#️-4-프로젝트-산출물)
   - 4-1. 화면 설계서  
   - 4-2. 기능 명세서  
   - 4-3. 테스트 결과 보고서  
5. [⚠️ Trouble Shooting](#️-5-trouble-shooting)    


## 📂 프로젝트 파일 구조

```
Linkee-front-vue
│
├── .env                       # 환경 변수 설정 파일 (API URL, 모드 등)
├── .gitignore                 # Git에서 제외할 파일/폴더 정의
├── index.html                 # Vue 앱 진입점 HTML 파일
├── jsconfig.json              # VSCode용 JS 경로/자동완성 설정
├── package-lock.json          # 패키지 버전 잠금 파일
├── package.json               # 프로젝트 메타정보 및 의존성/스크립트
├── README.md                  # 프로젝트 설명 문서
├── vite.config.js             # Vite 개발/빌드 설정
│
├── .idea/                     # IntelliJ/WebStorm 환경 설정
├── .vscode/                   # VSCode 환경 설정 (권장 확장 포함)
│   └── extensions.json
│
├── dist/                      # 빌드 결과물(배포용)
├── node_modules/              # 패키지 의존성 폴더
├── public/                    # 정적 파일 폴더 (빌드 시 그대로 복사)
│   └── favicon.ico            # 파비콘
│
└── src/                       # Vue 앱의 모든 소스 코드
    ├── App.vue                # 최상위 루트 컴포넌트
    ├── main.js                # 앱 생성, 라우터/스토어 모듈 추가
    │
    ├── api/                   # 백엔드 API 호출 모음
    │   ├── alarmApi.js        # 알림 API
    │   ├── authApi.js         # 로그인/인증 API
    │   ├── axios.js           # Axios 인스턴스 및 인터셉터 설정
    │   ├── chatRoomApi.js     # 채팅방 관련 API
    │   ├── inquiryApi.js      # 문의 API
    │   ├── noticeApi.js       # 공지사항 API
    │   ├── problemApi.js      # 문제(게시판) API
    │   ├── relationApi.js     # 친구/팔로우 API
    │   └── reportApi.js       # 신고 API
    │
    ├── assets/                # 이미지/아이콘 등 정적 파일
    │   ├── bell.svg
    │   ├── bell_check.svg
    │   ├── logo.svg
    │   ├── profile_img.svg
    │   └── icon/
    │       ├── invite.png
    │       └── ...
    │
    ├── components/            # 재사용 컴포넌트
    │   ├── base/              # 기본 UI 컴포넌트(버튼, 폼, 모달 등)
    │   ├── common/            # 공용 모달 등 프로젝트 전역 컴포넌트
    │   ├── home/              # 홈 화면 카드/모달
    │   ├── layout/            # 레이아웃 관련(UI 틀 구조)
    │   │   ├── admin/navbar/
    │   │   │   └── AdminNavbar.vue
    │   │   └── user/
    │   │       ├── navbar/
    │   │       │   └── UserNavbar.vue
    │   │       └── sidebar/
    │   │           └── UserSidebar.vue
    │   ├── mypage/            # 마이페이지 관련 (북마크, 등급, 기록 등)
    │   ├── Problem/           # 문제 게시판 관련 UI
    │   └── quiz/              # 퀴즈/대기실 관련 UI
    │
    ├── router/                # Vue Router 설정 (페이지 라우팅)
    │   └── index.js
    │
    ├── stores/                # Pinia 스토어 (상태 관리)
    │   ├── authStore.js       # 인증/유저 상태
    │   ├── chatgameStore.js   # 채팅 및 게임 상태
    │   └── ...
    │
    └── utils/                 # 유틸 함수 모음 (필요 시)

```

---

## 👩‍👧‍👦 1. 멤버 소개


<div align="center">

| 유한세 | 김상재 | 김 진 |
|--------|--------|--------|
|<img width="150" height="150" alt="image (15)" src="https://github.com/user-attachments/assets/2c38376b-4b67-43fc-ba88-4fbf2c5d49e3" />| <img width="150" height="150" alt="image (16)" src="https://github.com/user-attachments/assets/0fc0dbfc-5954-4056-9fad-46b75c9224c8" /> | <img width="150" height="150" alt="IMG_7128" src="https://github.com/user-attachments/assets/2aef33c7-7883-4932-af31-dac933230542" />|

| 김명진 | 정동욱 |
|--------|--------|
|<img width="150" height="150" alt="image (17)" src="https://github.com/user-attachments/assets/bfe7f4bf-1f85-4cad-9354-525063a424de" /> | <img width="150" height="150" alt="KakaoTalk_20251105_144003874" src="https://github.com/user-attachments/assets/4e307545-a820-4551-9773-094f203fc07a" />|


</div>

---
## ⚒️ 2. 서비스 소개
Linkee는 사용자가 CS 관련 퀴즈에 참여하고 문제를 풀며 다른 사용자들과 소통할 수 있는 플랫폼입니다. 퀴즈방을 만들거나 참가하고, 문제를 등록하며 다양한 기능을 이용할 수 있습니다.

### 🔑 **회원가입 및 로그인**
- **회원가입**: 사용자는 이메일 인증을 통해 회원가입을 하거나 소셜 로그인("네이버")를 통해 쉽게 가입할 수 있습니다.
- **이메일 인증**: 회원가입 시 이메일 인증을 통해 계정을 활성화할 수 있습니다.
- **로그인**: 아이디와 비밀번호 또는 소셜 계정을 통해 로그인할 수 있습니다.
- **회원 정보 관리**: 자신의 프로필을 수정하거나 비밀번호를 변경할 수 있습니다.

### 📚 **문제 게시판**
- **문제 등록**: 사용자는 DB, 네트워크, 운영체제 등 다양한 카테고리의 CS 관련 문제를 등록할 수 있습니다.
- **문제 검증**: 관리자들이 인기 있는 문제를 검토하여 명확성, 정답 타당성 등을 확인합니다.
- **시스템 문제로 등록**: 검토가 완료된 문제는 퀴즈방 문제로 등록 되어집니다.

### 🎮 **퀴즈**
- **퀴즈방 만들기**: 주제, 모드(연습/다함께), 인원 수 등을 설정하여 퀴즈방을 만들 수 있습니다.
- **빠른 시작**: '빠른시작' 기능을 통해 모집 중인 공개 방에 자동으로 참여할 수 있습니다.
- **문제 출제**: 시스템이 주제에 맞는 문제를 자동으로 선택하여 출제합니다.
- **결과 확인**: 퀴즈가 종료된 후 점수와 순위를 확인할 수 있습니다.

### 🎲 **자율방 기능**
- **자율방 만들기**: 사용자는 친구들과 자율적으로 방을 생성할 수 있습니다. 방을 만들 때, 주제, 인원 수, 공개/비공개 여부 등을 설정할 수 있습니다.
- **그룹 채팅**: 자율방 내에서는 그룹원들 간에 자유롭게 채팅을 할 수 있습니다.
- **문제 등록**: 방의 참가자 중 한 명이 문제를 직접 등록할 수 있으며, 다른 참가자들은 해당 문제에 대한 답을 맞춰서 제출할 수 있습니다.
- **문제 목록**: 각자가 제출한 문제는 채팅방 옆에 문제 목록으로 등록됩니다. 이를 통해 시스템에서 출제된 문제들과는 중복되지 않으며, 자유롭게 다양한 문제를 경험할 수 있습니다.

### 👥 **소셜 기능**
- **친구 추가**: 닉네임으로 친구를 검색하고, 친구 요청을 보낼 수 있습니다.
- **채팅**: 친구와 1:1 또는 그룹 채팅을 통해 소통할 수 있습니다.
- **친구 프로필**: 친구의 프로필을 상세히 확인하고, 방에 초대할 수 있습니다.

### ⚖️ **신고 및 관리**
- **신고**: 부적절한 콘텐츠나 사용자를 신고할 수 있습니다.
- **관리자 관리**: 관리자는 신고 사항을 처리하고, 비활성화 또는 경고를 할 수 있습니다.

### 📢 **알림 기능**
- **알림 템플릿**: 관리자들은 알림 템플릿을 등록하고 수정할 수 있습니다.
- **알림 발송**: 시스템은 등록된 템플릿에 따라 알림을 사용자에게 발송합니다.
- **알림 조회**: 사용자는 발송된 알림 목록을 조회할 수 있습니다.

---

## 🚀 3. 기술 스택

### 🚀 Stacks
<p>
  <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring&logoColor=white"/>
  <img src="https://img.shields.io/badge/OAuth2-000000?style=for-the-badge&logo=oauth&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Thymeleaf-003300?style=for-the-badge&logo=thymeleaf&logoColor=white"/>
  <img src="https://img.shields.io/badge/MyBatis-9B1D20?style=for-the-badge&logo=mybatis&logoColor=white"/>
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> 
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white">  
  

    
</p>


### ⚒️ Tools
<p>
<img src="https://img.shields.io/badge/HeidiSQL-b0fb0c?style=for-the-badge&logo=heidisql&logoColor=white"/>
<img src="https://img.shields.io/badge/ERDCloud-72099f?style=for-the-badge&logo=erdcloud&logoColor=white"/>
<img src="https://img.shields.io/badge/Canva-00C4CC?style=for-the-badge&logo=canva&logoColor=white"/>
<img src="https://img.shields.io/badge/DBeaver-382923?style=for-the-badge&logo=dbeaver&logoColor=white"/>
<img src="https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white"/>
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/Figma-E34F26?style=for-the-badge&logo=figma&logoColor=white"> 
</p>

### 👥  Collaboration      

<p>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"/>
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"/>
</p>
---

## 🗂️ 4. 프로젝트 산출물

- ### 🕖 WBS **(Work Breakdown Structure)**

  WBS를 자세히 보려면 [여기](https://www.notion.so/28cedf2444d2802cb0e4dd3d5c2223a4?v=28cedf2444d28012915d000c570f6a05&source=copy_link)를 클릭하세요

  <details> <summary> WBS 이미지</summary>
  <img width="1310" height="785" alt="Image" src="https://github.com/user-attachments/assets/e5bde1ad-5158-4867-93b5-dc5919ff4b2e" />
  </details>
  



- ### 📚 요구사항 명세서

  요구사항 명세서를 자세히 보려면 [여기](https://docs.google.com/spreadsheets/d/1m9Jk_0A6LhK9aZ2RiVEwYnF6yCltFJS01lFYrovXV8I/edit?gid=680046902#gid=680046902)를 클릭하세요


  <details> 
  <summary> 요구사항 명세서 이미지</summary>
  <img width="1157" height="800" alt="Image" src="https://github.com/user-attachments/assets/68e3f008-a803-4412-9934-433ad9d06171" />
  <img width="1161" height="557" alt="Image" src="https://github.com/user-attachments/assets/a4fd564b-979a-492e-83a2-09e888a51592" />
  </details>

  
  
- ### 🖼️ DDD **(Domain Driven Design)**

  DDD을 자세히 보려면 [여기](https://miro.com/app/board/uXjVJ4xhIGY=/)를 클릭하세요

  <details> 
  <summary> DDD 이미지</summary>
  <img width="852" height="876" alt="Image" src="https://github.com/user-attachments/assets/4c1e3e07-882a-413a-b0ae-209e2ced15ab" />
  </details>




- ### 🗺️ ERD **(Entity Relationship Diagram)**

  ERD를 자세히 보려면 [여기](https://www.erdcloud.com/d/uT2o7h2jb9BhZ62L2)를 클릭하세요

  <details> 
  <summary> ERD 이미지</summary>
  <img width="4720" height="2032" alt="Image" src="https://github.com/user-attachments/assets/5eabab43-8f1d-4e2d-9bd9-8ca4bc9c34ef" />
  </details>

- ### 📋 API 명세서 

  <details> 
  <summary> API 명세서 이미지</summary>
  <img width="897" height="702" alt="Image" src="https://github.com/user-attachments/assets/d830db0b-158d-471a-86fe-fa28e1a9a009" />
  <img width="895" height="426" alt="Image" src="https://github.com/user-attachments/assets/5cbee805-7c38-4d6f-aae2-665f89b93496" />
  <img width="596" height="715" alt="Image" src="https://github.com/user-attachments/assets/5d3d8c48-14e4-4b8f-a7c1-e3571b8d30d8" />
  <img width="895" height="691" alt="Image" src="https://github.com/user-attachments/assets/6eb77749-d5f4-4334-a36f-5aeb25c794da" />
  <img width="892" height="881" alt="Image" src="https://github.com/user-attachments/assets/016d5b14-8fb4-4a8c-ab70-7816dd011258" />
  <img width="897" height="941" alt="Image" src="https://github.com/user-attachments/assets/ef71d0a8-814d-4043-b941-f3191bd1b9f9" />
  </details>

  
- ### 🔁 유닛테스트 시나리오 및 코드
  통합테스트 시나리오를 자세히 보려면 [여기](https://docs.google.com/spreadsheets/d/1m9Jk_0A6LhK9aZ2RiVEwYnF6yCltFJS01lFYrovXV8I/edit?gid=1206072661#gid=1206072661)를 클릭하세요  

  <details> 
  <summary> 테스트 시나리오 이미지</summary>
  <img width="977" height="657" alt="Image" src="https://github.com/user-attachments/assets/646c91fc-f880-4ef9-bad9-bb53b60709ce" />
  </details>

- ### 🎁 MSA 구조도

  <details> 
  <summary> msa 구조도 이미지</summary>
    <img width="977" height="657" alt="Image" src="https://github.com/user-attachments/assets/2cf6bd3d-a41f-431f-bccd-4a92907bed69" />
  </details>

- ### 🖼️ 화면 설계서
  화면 설계서를 자세히 보려면 [여기](https://www.figma.com/design/Y8SJQTt8x9Wa7lGVFchw6g/Linkee-UI?node-id=0-1&t=w3rsJaUxyKJZ04V4-1)를 클릭하세요  
    
- ### 💻 화면 기능 명세서
  화면 기능명세서를 자세히 보려면 [여기](https://docs.google.com/spreadsheets/d/1TNEo-AtHsYJsGsgus2CA8qv60TT7Qk2rOzpAlzFoUOs/edit?gid=0#gid=0)를 클릭하세요  

    <details> 
  <summary> 메인페이지</summary>
    <img width="977" height="657" alt="스크린샷 2025-11-27 124213" src="https://github.com/user-attachments/assets/982af6fe-cdaa-4b9f-8345-aeed0006199f" />
    <img width="977" height="657" alt="스크린샷 2025-11-27 124418" src="https://github.com/user-attachments/assets/e956caa9-8b5c-4a50-9095-ad7f8d499539" />
    <img width="977" height="657" alt="스크린샷 2025-11-27 124500" src="https://github.com/user-attachments/assets/47ab7967-67b3-4bb2-9df3-9f1671771437" />
    <img width="977" height="657" alt="스크린샷 2025-11-27 124536" src="https://github.com/user-attachments/assets/e82c8f0d-187d-4c5d-9ea5-e17a773e7aaf" />
    <img width="977" height="657" alt="스크린샷 2025-11-27 124551" src="https://github.com/user-attachments/assets/cdd757f8-f849-4ad8-b85e-edae6cfb29b7" />
    <img width="977" height="657" alt="스크린샷 2025-11-27 124601" src="https://github.com/user-attachments/assets/27460fec-8e25-4c82-9927-f2f32b934632" />
    <img width="977" height="657" alt="스크린샷 2025-11-27 124623" src="https://github.com/user-attachments/assets/3020cde3-3a65-4826-9ad6-37f165e4f97e" />

  </details>
  
- ### 🔁 화면 기능 단위 테스트
  화면 기능 단위 테스를 자세히 보려면 [여기](https://drive.google.com/drive/folders/1dFSrJe7ERnSbNdMgFND9wsYUytCJDg7_?usp=sharing)를 클릭하세요
 

