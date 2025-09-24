export const  generateRoomId=(): string =>{
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const chunk = (length: number) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  return `${chunk(3)}-${chunk(3)}-${chunk(3)}`; // e.g., "qwe-erf-uyt"
}


