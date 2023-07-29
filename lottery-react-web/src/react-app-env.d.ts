/// <reference types="react-scripts" />

// global.d.ts

// 참고로, 이러한 글로벌 타입 확장은 필요한 경우에만 수행해야 합니다.

// Window & typeof globalThis 인터페이스를 확장합니다.
declare global {
    interface Window {
        ethereum: any;
    }
}

// 아래 내용을 추가하면, export 문이 있어야 한다는 오류를 방지할 수 있습니다.
export {};
