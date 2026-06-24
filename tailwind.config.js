/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. 애니메이션의 구체적인 동작(동선) 정의
      keyframes: {
        breath: {
          '0%, 100%': { opacity: '0.4' },  // 처음과 끝은 다소 어둡게 (투명도 40%)
          '50%': { opacity: '0.8' },       // 중간(숨을 들이쉬었을 때)은 밝게 (투명도 80%)
        },
      },
      // 2. 위에서 만든 동작을 사용할 '클래스 이름' 정의
      animation: {
        'bg-breath': 'breath 5s ease-in-out infinite', // 5초 동안, 부드럽게, 무한 반복
      },
    },
  },
  plugins: [],
}
