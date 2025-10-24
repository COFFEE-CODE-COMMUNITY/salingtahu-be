import { rm } from "fs/promises"
import { GLOBAL_CONFIG_PATH } from './jest.global-setup';

export default async function() {
  console.log('🧹 Cleaning up test containers...')
  
  if (globalThis.__CONTAINERS__ && globalThis.__CONTAINERS__.length > 0) {
    await Promise.all(
      globalThis.__CONTAINERS__.map(async (container) => {
        try {
          console.log(`🛑 Stopping container ${container.getId().substring(0, 12)}...`)
          await container.stop()
        } catch (error) {
          console.error(`Failed to stop container ${container.getId()}:`, error)
        }
      })
    )
  }

  await rm(GLOBAL_CONFIG_PATH)
  console.log('✅ Cleanup complete!')
}
