export default interface DecodedJwt {
  iat: number,
  exp: number,
  username: string,
  id: string
}