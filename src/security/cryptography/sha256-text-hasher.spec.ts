import { Test } from "@nestjs/testing"
import { Sha256TextHasher } from "./sha256-text-hasher"

describe("Sha256TextHasher", () => {
  let textHasher: Sha256TextHasher

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [Sha256TextHasher]
    }).compile()

    textHasher = module.get(Sha256TextHasher)
  })

  describe("hash", () => {
    it("should hash text", () => {
      const hashResult = textHasher.hash("test")
      expect(hashResult).toEqual(expect.any(String))
    })
  })

  describe("compare", () => {
    it("should return true for equal hashed text", () => {
      const hash = textHasher.hash("test1")
      const isHashEqual = textHasher.compare("test1", hash)
      expect(isHashEqual).toBe(true)
    })

    it("should return false for not equal hashed text", () => {
      const isHashEqual = textHasher.compare("test1", textHasher.hash("test2"))
      expect(isHashEqual).toBe(false)
    })
  })
})
