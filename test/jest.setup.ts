import { setupTestContainers, teardownTestContainers } from "./create-test-app"

beforeAll(async () => {
  await setupTestContainers()
}, 300_000)

afterAll(async () => {
  await teardownTestContainers()
}, 300_000)
